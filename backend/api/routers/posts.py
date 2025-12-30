from fastapi import APIRouter, HTTPException, Depends, status
from models.social import Post, PostCreate, PostUpdate, Comment, CommentCreate
from routers.auth import get_current_user_dependency
from database import get_supabase
from datetime import datetime
from typing import List
import uuid

router = APIRouter()

@router.get("/", summary="Get feed posts")
async def get_feed_posts(
    current_user: dict = Depends(get_current_user_dependency),
    limit: int = 20,
    offset: int = 0
):
    """
    Get posts for user's feed (friends' posts + own posts)
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
    
    # Include current user's posts
    friend_ids.append(current_user['id'])
    
    # Get posts from friends and self
    posts_result = supabase.table('posts').select(
        '*, users(first_name, last_name, username, avatar_url)'
    ).in_('user_id', friend_ids).order('created_at', desc=True).range(offset, offset + limit - 1).execute()

    if not posts_result.data:
        return []

    # Check which posts current user has liked
    post_ids = [post['id'] for post in posts_result.data]
    likes_result = supabase.table('post_likes').select('post_id').eq(
        'user_id', current_user['id']
    ).in_('post_id', post_ids).execute()

    liked_post_ids = {like['post_id'] for like in likes_result.data}

    # Add is_liked field to each post
    posts = []
    for post in posts_result.data:
        user_info = post.get('users', {})
        posts.append({
            'id': post['id'],
            'user_id': post['user_id'],
            'content': post['content'],
            'image_url': post.get('image_url'),
            'location': post.get('location'),
            'created_at': post['created_at'],
            'updated_at': post['updated_at'],
            'likes_count': post.get('likes_count', 0),
            'comments_count': post.get('comments_count', 0),
            'is_liked': post['id'] in liked_post_ids,
            'user_first_name': user_info.get('first_name', ''),
            'user_last_name': user_info.get('last_name', ''),
            'user_username': user_info.get('username'),
            'user_avatar_url': user_info.get('avatar_url'),
        })

    return posts

@router.post("/", response_model=Post, summary="Create new post")
async def create_post(
    post_data: PostCreate,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Create a new post
    """
    supabase = get_supabase()
    
    post = {
        "id": str(uuid.uuid4()),
        "user_id": current_user['id'],
        "content": post_data.content,
        "image_url": post_data.image_url,
        "location": post_data.location,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table('posts').insert(post).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create post"
        )
    
    return result.data[0]

@router.get("/{post_id}", summary="Get post by ID")
async def get_post(
    post_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Get a specific post by ID
    """
    supabase = get_supabase()
    
    result = supabase.table('posts').select(
        '*, users(first_name, last_name, username, avatar_url)'
    ).eq('id', post_id).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    return result.data[0]

@router.delete("/{post_id}", summary="Delete post")
async def delete_post(
    post_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Delete a post (only by the post owner)
    """
    supabase = get_supabase()
    
    # Check if post exists and belongs to current user
    post_result = supabase.table('posts').select('user_id').eq('id', post_id).execute()
    
    if not post_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    if post_result.data[0]['user_id'] != current_user['id']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own posts"
        )
    
    # Delete the post
    result = supabase.table('posts').delete().eq('id', post_id).execute()

    return {"message": "Post deleted successfully"}

# ============ LIKES ENDPOINTS ============

@router.post("/{post_id}/like", summary="Like a post")
async def like_post(
    post_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Like a post
    """
    supabase = get_supabase()

    # Check if post exists
    post_result = supabase.table('posts').select('id').eq('id', post_id).execute()
    if not post_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check if already liked
    existing_like = supabase.table('post_likes').select('id').eq(
        'post_id', post_id
    ).eq('user_id', current_user['id']).execute()

    if existing_like.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post already liked"
        )

    # Insert like
    like = {
        "id": str(uuid.uuid4()),
        "post_id": post_id,
        "user_id": current_user['id'],
        "created_at": datetime.utcnow().isoformat()
    }
    supabase.table('post_likes').insert(like).execute()

    return {"message": "Post liked"}

@router.delete("/{post_id}/like", summary="Unlike a post")
async def unlike_post(
    post_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Unlike a post
    """
    supabase = get_supabase()

    # Delete the like
    result = supabase.table('post_likes').delete().eq(
        'post_id', post_id
    ).eq('user_id', current_user['id']).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )

    return {"message": "Post unliked"}

@router.get("/{post_id}/likes", summary="Get users who liked a post")
async def get_post_likes(
    post_id: str,
    current_user: dict = Depends(get_current_user_dependency),
    limit: int = 50,
    offset: int = 0
):
    """
    Get list of users who liked a post
    """
    supabase = get_supabase()

    # Check if post exists
    post_result = supabase.table('posts').select('id').eq('id', post_id).execute()
    if not post_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Get likes with user info
    likes_result = supabase.table('post_likes').select(
        'user_id, created_at, users(id, first_name, last_name, username, avatar_url)'
    ).eq('post_id', post_id).order('created_at', desc=True).range(offset, offset + limit - 1).execute()

    users = []
    for like in likes_result.data:
        user_info = like.get('users', {})
        users.append({
            'id': user_info.get('id'),
            'first_name': user_info.get('first_name'),
            'last_name': user_info.get('last_name'),
            'username': user_info.get('username'),
            'avatar_url': user_info.get('avatar_url'),
            'liked_at': like.get('created_at')
        })

    return users

# ============ COMMENTS ENDPOINTS ============

@router.get("/{post_id}/comments", summary="Get comments on a post")
async def get_post_comments(
    post_id: str,
    current_user: dict = Depends(get_current_user_dependency),
    limit: int = 50,
    offset: int = 0
):
    """
    Get comments on a post with pagination
    """
    supabase = get_supabase()

    # Check if post exists
    post_result = supabase.table('posts').select('id').eq('id', post_id).execute()
    if not post_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Get comments with user info
    comments_result = supabase.table('post_comments').select(
        '*, users(first_name, last_name, avatar_url)'
    ).eq('post_id', post_id).order('created_at', desc=False).range(offset, offset + limit - 1).execute()

    comments = []
    for comment in comments_result.data:
        user_info = comment.get('users', {})
        comments.append({
            'id': comment['id'],
            'post_id': comment['post_id'],
            'user_id': comment['user_id'],
            'content': comment['content'],
            'created_at': comment['created_at'],
            'user_first_name': user_info.get('first_name', ''),
            'user_last_name': user_info.get('last_name', ''),
            'user_avatar_url': user_info.get('avatar_url'),
        })

    return comments

@router.post("/{post_id}/comments", summary="Add a comment to a post")
async def add_comment(
    post_id: str,
    comment_data: CommentCreate,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Add a comment to a post
    """
    supabase = get_supabase()

    # Check if post exists
    post_result = supabase.table('posts').select('id').eq('id', post_id).execute()
    if not post_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Insert comment
    comment = {
        "id": str(uuid.uuid4()),
        "post_id": post_id,
        "user_id": current_user['id'],
        "content": comment_data.content,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    result = supabase.table('post_comments').insert(comment).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create comment"
        )

    # Get user info for response
    user_result = supabase.table('users').select(
        'first_name, last_name, avatar_url'
    ).eq('id', current_user['id']).execute()

    user_info = user_result.data[0] if user_result.data else {}

    return {
        **result.data[0],
        'user_first_name': user_info.get('first_name', ''),
        'user_last_name': user_info.get('last_name', ''),
        'user_avatar_url': user_info.get('avatar_url'),
    }

@router.delete("/{post_id}/comments/{comment_id}", summary="Delete a comment")
async def delete_comment(
    post_id: str,
    comment_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Delete a comment (by comment author or post owner)
    """
    supabase = get_supabase()

    # Get comment and post info
    comment_result = supabase.table('post_comments').select('user_id, post_id').eq('id', comment_id).execute()

    if not comment_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    comment = comment_result.data[0]

    # Get post owner
    post_result = supabase.table('posts').select('user_id').eq('id', post_id).execute()
    post_owner_id = post_result.data[0]['user_id'] if post_result.data else None

    # Check permission: comment author or post owner
    if comment['user_id'] != current_user['id'] and post_owner_id != current_user['id']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own comments or comments on your posts"
        )

    # Delete the comment
    supabase.table('post_comments').delete().eq('id', comment_id).execute()

    return {"message": "Comment deleted successfully"}
