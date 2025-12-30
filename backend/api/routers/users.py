from fastapi import APIRouter, HTTPException, Depends, status
from models.user import User, UserUpdate, UserProfile
from routers.auth import get_current_user_dependency
from database import get_supabase
from datetime import datetime

router = APIRouter()

@router.get("/me", response_model=User, summary="Get current usre profile")
async def get_my_profile(current_user: dict = Depends(get_current_user_dependency)):
    """
    Get current user's profile information
    """
    # Remove sensitive data
    user_data = current_user.copy()
    user_data.pop('password_hash', None)
    
    return user_data

@router.put("/me", response_model=User, summary="Update current user profile")
async def update_my_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Update current user's profile information
    """
    supabase = get_supabase()
    
    # Prepare update data
    update_data = {}
    if user_update.email is not None:
        update_data["email"] = user_update.email
    if user_update.first_name is not None:
        update_data["first_name"] = user_update.first_name
    if user_update.last_name is not None:
        update_data["last_name"] = user_update.last_name
    if user_update.username is not None:
        # Check username uniqueness
        username_check = supabase.table('users').select('id').eq('username', user_update.username).neq('id', current_user['id']).execute()
        if username_check.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        update_data["username"] = user_update.username
    if user_update.bio is not None:
        update_data["bio"] = user_update.bio
    if user_update.avatar_url is not None:
        update_data["avatar_url"] = user_update.avatar_url
    if user_update.is_private is not None:
        update_data["is_private"] = user_update.is_private
    if user_update.location is not None:
        update_data["location"] = user_update.location
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    # Update user
    result = supabase.table('users').update(update_data).eq('id', current_user['id']).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )
    
    updated_user = result.data[0]
    updated_user.pop('password_hash', None)
    
    return updated_user

@router.get("/{user_id}", response_model=UserProfile, summary="Get user profile by ID")
async def get_user_profile(
    user_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Get user profile by user ID
    """
    supabase = get_supabase()
    
    # Get user data
    user_result = supabase.table('users').select('*').eq('id', user_id).execute()
    
    if not user_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = user_result.data[0]
    
    # Check if user is private and not a friend
    if user['is_private'] and user['id'] != current_user['id']:
        # Check if they are friends
        friendship_check = supabase.table('friendships').select('id').or_(
            f"and(user1_id.eq.{current_user['id']},user2_id.eq.{user_id})",
            f"and(user1_id.eq.{user_id},user2_id.eq.{current_user['id']})"
        ).execute()
        
        if not friendship_check.data:
            # Return limited profile for private users
            return UserProfile(
                id=user['id'],
                first_name=user['first_name'],
                last_name=user['last_name'],
                username=user['username'],
                avatar_url=user['avatar_url'],
                bio=None,
                is_private=True,
                friend_count=0,
                post_count=0,
                is_friend=False,
                is_friend_request_sent=False
            )
    
    # Get friend status
    is_friend = False
    is_friend_request_sent = False
    
    if user['id'] != current_user['id']:
        # Check friendship
        friendship_check = supabase.table('friendships').select('id').or_(
            f"and(user1_id.eq.{current_user['id']},user2_id.eq.{user_id})",
            f"and(user1_id.eq.{user_id},user2_id.eq.{current_user['id']})"
        ).execute()
        is_friend = len(friendship_check.data) > 0
        
        # Check pending friend request
        if not is_friend:
            request_check = supabase.table('friend_requests').select('id').eq('sender_id', current_user['id']).eq('recipient_id', user_id).eq('status', 'pending').execute()
            is_friend_request_sent = len(request_check.data) > 0
    
    # Get counts
    friend_count_result = supabase.table('friendships').select('id', count='exact').or_(
        f"user1_id.eq.{user_id}",
        f"user2_id.eq.{user_id}"
    ).execute()
    friend_count = friend_count_result.count or 0
    
    post_count_result = supabase.table('posts').select('id', count='exact').eq('user_id', user_id).execute()
    post_count = post_count_result.count or 0
    
    return UserProfile(
        id=user['id'],
        first_name=user['first_name'],
        last_name=user['last_name'],
        username=user['username'],
        avatar_url=user['avatar_url'],
        bio=user['bio'],
        is_private=user['is_private'],
        friend_count=friend_count,
        post_count=post_count,
        is_friend=is_friend,
        is_friend_request_sent=is_friend_request_sent
    )

@router.get("/search/{query}", summary="Search users")
async def search_users(
    query: str,
    current_user: dict = Depends(get_current_user_dependency),
    limit: int = 20
):
    """
    Search users by name or username
    """
    supabase = get_supabase()
    
    # Search users
    result = supabase.table('users').select('id, first_name, last_name, username, avatar_url').or_(
        f"first_name.ilike.%{query}%",
        f"last_name.ilike.%{query}%",
        f"username.ilike.%{query}%"
    ).neq('id', current_user['id']).limit(limit).execute()
    
    users = result.data
    
    # Add friend status for each user
    for user in users:
        # Check if they are friends
        friendship_check = supabase.table('friendships').select('id').or_(
            f"and(user1_id.eq.{current_user['id']},user2_id.eq.{user['id']})",
            f"and(user1_id.eq.{user['id']},user2_id.eq.{current_user['id']})"
        ).execute()
        user['is_friend'] = len(friendship_check.data) > 0
    
    return users
