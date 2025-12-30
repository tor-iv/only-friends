from fastapi import APIRouter, HTTPException, Depends, status
from models.social import FriendRequest, FriendRequestCreate, FriendRequestUpdate, Friend
from routers.auth import get_current_user_dependency
from database import get_supabase
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/", summary="Get friends list")
async def get_friends(
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Get list of current user's friends
    """
    supabase = get_supabase()
    
    # Get friendships
    friendships_result = supabase.table('friendships').select(
        '*, user1:users!user1_id(id, first_name, last_name, username, avatar_url), user2:users!user2_id(id, first_name, last_name, username, avatar_url)'
    ).or_(
        f"user1_id.eq.{current_user['id']}",
        f"user2_id.eq.{current_user['id']}"
    ).execute()
    
    friends = []
    for friendship in friendships_result.data:
        if friendship['user1_id'] == current_user['id']:
            friend_data = friendship['user2']
        else:
            friend_data = friendship['user1']
        
        friends.append({
            "id": friend_data['id'],
            "first_name": friend_data['first_name'],
            "last_name": friend_data['last_name'],
            "username": friend_data['username'],
            "avatar_url": friend_data['avatar_url'],
            "friendship_date": friendship['created_at']
        })
    
    return friends

@router.post("/request", summary="Send friend request")
async def send_friend_request(
    request_data: FriendRequestCreate,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Send a friend request to another user
    """
    supabase = get_supabase()
    
    # Check if recipient exists
    recipient_check = supabase.table('users').select('id').eq('id', request_data.recipient_id).execute()
    if not recipient_check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if trying to send request to self
    if str(request_data.recipient_id) == current_user['id']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send friend request to yourself"
        )
    
    # Check if already friends
    friendship_check = supabase.table('friendships').select('id').or_(
        f"and(user1_id.eq.{current_user['id']},user2_id.eq.{request_data.recipient_id})",
        f"and(user1_id.eq.{request_data.recipient_id},user2_id.eq.{current_user['id']})"
    ).execute()
    
    if friendship_check.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already friends with this user"
        )
    
    # Check if request already exists
    existing_request = supabase.table('friend_requests').select('id, status').or_(
        f"and(sender_id.eq.{current_user['id']},recipient_id.eq.{request_data.recipient_id})",
        f"and(sender_id.eq.{request_data.recipient_id},recipient_id.eq.{current_user['id']})"
    ).execute()
    
    if existing_request.data:
        if existing_request.data[0]['status'] == 'pending':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Friend request already pending"
            )
    
    # Create friend request
    friend_request = {
        "id": str(uuid.uuid4()),
        "sender_id": current_user['id'],
        "recipient_id": str(request_data.recipient_id),
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table('friend_requests').insert(friend_request).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send friend request"
        )
    
    return {"message": "Friend request sent successfully"}

@router.get("/requests", summary="Get friend requests")
async def get_friend_requests(
    current_user: dict = Depends(get_current_user_dependency),
    type: str = "received"  # "received" or "sent"
):
    """
    Get friend requests (received or sent)
    """
    supabase = get_supabase()
    
    if type == "received":
        # Get requests received by current user
        requests_result = supabase.table('friend_requests').select(
            '*, sender:users!sender_id(first_name, last_name, username, avatar_url)'
        ).eq('recipient_id', current_user['id']).eq('status', 'pending').execute()
    else:
        # Get requests sent by current user
        requests_result = supabase.table('friend_requests').select(
            '*, recipient:users!recipient_id(first_name, last_name, username, avatar_url)'
        ).eq('sender_id', current_user['id']).eq('status', 'pending').execute()
    
    return requests_result.data

@router.put("/requests/{request_id}", summary="Respond to friend request")
async def respond_to_friend_request(
    request_id: str,
    response: FriendRequestUpdate,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Accept or reject a friend request
    """
    supabase = get_supabase()
    
    # Get the friend request
    request_result = supabase.table('friend_requests').select('*').eq('id', request_id).execute()
    
    if not request_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend request not found"
        )
    
    friend_request = request_result.data[0]
    
    # Check if current user is the recipient
    if friend_request['recipient_id'] != current_user['id']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only respond to requests sent to you"
        )
    
    # Check if request is still pending
    if friend_request['status'] != 'pending':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Friend request is no longer pending"
        )
    
    # Update request status
    update_result = supabase.table('friend_requests').update({
        'status': response.status
    }).eq('id', request_id).execute()
    
    # If accepted, create friendship
    if response.status == 'accepted':
        friendship = {
            "id": str(uuid.uuid4()),
            "user1_id": friend_request['sender_id'],
            "user2_id": friend_request['recipient_id'],
            "created_at": datetime.utcnow().isoformat()
        }
        
        friendship_result = supabase.table('friendships').insert(friendship).execute()
        
        if not friendship_result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create friendship"
            )
        
        return {"message": "Friend request accepted"}
    else:
        return {"message": "Friend request rejected"}

@router.delete("/{friend_id}", summary="Remove friend")
async def remove_friend(
    friend_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Remove a friend (delete friendship)
    """
    supabase = get_supabase()
    
    # Find and delete the friendship
    result = supabase.table('friendships').delete().or_(
        f"and(user1_id.eq.{current_user['id']},user2_id.eq.{friend_id})",
        f"and(user1_id.eq.{friend_id},user2_id.eq.{current_user['id']})"
    ).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friendship not found"
        )
    
    return {"message": "Friend removed successfully"}

@router.get("/suggestions", summary="Get friend suggestions")
async def get_friend_suggestions(
    current_user: dict = Depends(get_current_user_dependency),
    limit: int = 10
):
    """
    Get friend suggestions (users who are not friends yet)
    """
    supabase = get_supabase()
    
    # Get current friends
    friends_result = supabase.table('friendships').select('user1_id, user2_id').or_(
        f"user1_id.eq.{current_user['id']}",
        f"user2_id.eq.{current_user['id']}"
    ).execute()
    
    friend_ids = [current_user['id']]  # Include self to exclude from suggestions
    for friendship in friends_result.data:
        if friendship['user1_id'] == current_user['id']:
            friend_ids.append(friendship['user2_id'])
        else:
            friend_ids.append(friendship['user1_id'])
    
    # Get users who are not friends
    suggestions_result = supabase.table('users').select(
        'id, first_name, last_name, username, avatar_url'
    ).not_.in_('id', friend_ids).limit(limit).execute()
    
    return suggestions_result.data
