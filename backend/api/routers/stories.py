from fastapi import APIRouter, HTTPException, Depends, status
from models.social import Story, StoryCreate, StoryGroup
from routers.auth import get_current_user_dependency
from database import get_supabase
from datetime import datetime, timedelta
from typing import List
import uuid

router = APIRouter()

@router.get("/", summary="Get friends' active stories")
async def get_friends_stories(
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Get active stories from friends, grouped by user
    """
    supabase = get_supabase()

    # Get user's friends
    friends_result = supabase.table('friendships').select('user1_id, user2_id').or_(
        f"user1_id.eq.{current_user['id']}",
        f"user2_id.eq.{current_user['id']}"
    ).execute()

    friend_ids = []
    for friendship in friends_result.data:
        if friendship['user1_id'] == current_user['id']:
            friend_ids.append(friendship['user2_id'])
        else:
            friend_ids.append(friendship['user1_id'])

    # Include current user's own stories
    friend_ids.append(current_user['id'])

    # Get active stories (not expired)
    now = datetime.utcnow().isoformat()
    stories_result = supabase.table('stories').select(
        '*, users(first_name, last_name, avatar_url)'
    ).in_('user_id', friend_ids).gt('expires_at', now).order('created_at', desc=True).execute()

    if not stories_result.data:
        return []

    # Get story views for current user
    story_ids = [story['id'] for story in stories_result.data]
    views_result = supabase.table('story_views').select('story_id').eq(
        'viewer_id', current_user['id']
    ).in_('story_id', story_ids).execute()

    viewed_story_ids = {view['story_id'] for view in views_result.data}

    # Group stories by user
    user_stories = {}
    for story in stories_result.data:
        user_id = story['user_id']
        user_info = story.get('users', {})

        story_data = {
            'id': story['id'],
            'user_id': user_id,
            'content': story.get('content'),
            'image_url': story.get('image_url'),
            'background_color': story.get('background_color', '#000000'),
            'views_count': story.get('views_count', 0),
            'expires_at': story['expires_at'],
            'created_at': story['created_at'],
            'is_viewed': story['id'] in viewed_story_ids,
            'user_first_name': user_info.get('first_name', ''),
            'user_last_name': user_info.get('last_name', ''),
            'user_avatar_url': user_info.get('avatar_url'),
        }

        if user_id not in user_stories:
            user_stories[user_id] = {
                'user_id': user_id,
                'user_first_name': user_info.get('first_name', ''),
                'user_last_name': user_info.get('last_name', ''),
                'user_avatar_url': user_info.get('avatar_url'),
                'stories': [],
                'has_unviewed': False
            }

        user_stories[user_id]['stories'].append(story_data)
        if not story_data['is_viewed']:
            user_stories[user_id]['has_unviewed'] = True

    # Sort: current user first, then by has_unviewed, then by most recent story
    result = list(user_stories.values())
    result.sort(key=lambda x: (
        x['user_id'] != current_user['id'],  # Current user first
        not x['has_unviewed'],  # Unviewed stories first
        x['stories'][0]['created_at'] if x['stories'] else ''  # Most recent first
    ), reverse=False)

    return result

@router.post("/", response_model=Story, summary="Create a story")
async def create_story(
    story_data: StoryCreate,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Create a new story (expires in 24 hours)
    """
    supabase = get_supabase()

    now = datetime.utcnow()
    expires_at = now + timedelta(hours=24)

    story = {
        "id": str(uuid.uuid4()),
        "user_id": current_user['id'],
        "content": story_data.content,
        "image_url": story_data.image_url,
        "background_color": story_data.background_color,
        "expires_at": expires_at.isoformat(),
        "created_at": now.isoformat()
    }

    result = supabase.table('stories').insert(story).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create story"
        )

    # Get user info for response
    user_result = supabase.table('users').select(
        'first_name, last_name, avatar_url'
    ).eq('id', current_user['id']).execute()

    user_info = user_result.data[0] if user_result.data else {}

    return {
        **result.data[0],
        'is_viewed': False,
        'views_count': 0,
        'user_first_name': user_info.get('first_name', ''),
        'user_last_name': user_info.get('last_name', ''),
        'user_avatar_url': user_info.get('avatar_url'),
    }

@router.get("/{story_id}", summary="Get story by ID")
async def get_story(
    story_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Get a specific story by ID
    """
    supabase = get_supabase()

    result = supabase.table('stories').select(
        '*, users(first_name, last_name, avatar_url)'
    ).eq('id', story_id).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )

    story = result.data[0]

    # Check if expired
    if datetime.fromisoformat(story['expires_at'].replace('Z', '+00:00')) < datetime.utcnow().replace(tzinfo=None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story has expired"
        )

    # Check if viewed by current user
    view_result = supabase.table('story_views').select('id').eq(
        'story_id', story_id
    ).eq('viewer_id', current_user['id']).execute()

    user_info = story.get('users', {})

    return {
        'id': story['id'],
        'user_id': story['user_id'],
        'content': story.get('content'),
        'image_url': story.get('image_url'),
        'background_color': story.get('background_color', '#000000'),
        'views_count': story.get('views_count', 0),
        'expires_at': story['expires_at'],
        'created_at': story['created_at'],
        'is_viewed': len(view_result.data) > 0,
        'user_first_name': user_info.get('first_name', ''),
        'user_last_name': user_info.get('last_name', ''),
        'user_avatar_url': user_info.get('avatar_url'),
    }

@router.post("/{story_id}/view", summary="Mark story as viewed")
async def view_story(
    story_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Mark a story as viewed by the current user
    """
    supabase = get_supabase()

    # Check if story exists
    story_result = supabase.table('stories').select('id, user_id').eq('id', story_id).execute()

    if not story_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )

    # Don't record view if viewing own story
    if story_result.data[0]['user_id'] == current_user['id']:
        return {"message": "Own story, view not recorded"}

    # Insert view (unique constraint will prevent duplicates)
    try:
        view = {
            "id": str(uuid.uuid4()),
            "story_id": story_id,
            "viewer_id": current_user['id'],
            "viewed_at": datetime.utcnow().isoformat()
        }
        supabase.table('story_views').insert(view).execute()
    except Exception:
        # Already viewed, ignore duplicate
        pass

    return {"message": "Story viewed"}

@router.delete("/{story_id}", summary="Delete story")
async def delete_story(
    story_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Delete a story (only by the story owner)
    """
    supabase = get_supabase()

    # Check if story exists and belongs to current user
    story_result = supabase.table('stories').select('user_id').eq('id', story_id).execute()

    if not story_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )

    if story_result.data[0]['user_id'] != current_user['id']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own stories"
        )

    # Delete the story
    supabase.table('stories').delete().eq('id', story_id).execute()

    return {"message": "Story deleted successfully"}
