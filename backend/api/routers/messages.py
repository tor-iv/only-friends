from fastapi import APIRouter, HTTPException, Depends, status
from models.social import Message, MessageCreate, Conversation
from routers.auth import get_current_user_dependency
from database import get_supabase
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/", summary="Get conversations")
async def get_conversations(
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Get list of conversations for current user
    """
    supabase = get_supabase()
    
    # Get conversations with last message
    conversations_result = supabase.rpc('get_user_conversations', {
        'user_id': current_user['id']
    }).execute()
    
    return conversations_result.data

@router.get("/{user_id}", summary="Get conversation with specific user")
async def get_conversation(
    user_id: str,
    current_user: dict = Depends(get_current_user_dependency),
    limit: int = 50,
    offset: int = 0
):
    """
    Get messages in conversation with specific user
    """
    supabase = get_supabase()
    
    # Verify the other user exists
    user_check = supabase.table('users').select('id').eq('id', user_id).execute()
    if not user_check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get messages between current user and specified user
    messages_result = supabase.table('messages').select(
        '*, sender:users!sender_id(first_name, last_name, avatar_url)'
    ).or_(
        f"and(sender_id.eq.{current_user['id']},recipient_id.eq.{user_id})",
        f"and(sender_id.eq.{user_id},recipient_id.eq.{current_user['id']})"
    ).order('created_at', desc=True).range(offset, offset + limit - 1).execute()
    
    # Mark messages as read
    supabase.table('messages').update({
        'is_read': True
    }).eq('sender_id', user_id).eq('recipient_id', current_user['id']).eq('is_read', False).execute()
    
    return messages_result.data

@router.post("/", response_model=Message, summary="Send message")
async def send_message(
    message_data: MessageCreate,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Send a message to another user
    """
    supabase = get_supabase()
    
    # Verify recipient exists
    recipient_check = supabase.table('users').select('id').eq('id', message_data.recipient_id).execute()
    if not recipient_check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    # Check if users are friends (optional - you might want to allow messages between non-friends)
    friendship_check = supabase.table('friendships').select('id').or_(
        f"and(user1_id.eq.{current_user['id']},user2_id.eq.{message_data.recipient_id})",
        f"and(user1_id.eq.{message_data.recipient_id},user2_id.eq.{current_user['id']})"
    ).execute()
    
    if not friendship_check.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only send messages to friends"
        )
    
    message = {
        "id": str(uuid.uuid4()),
        "sender_id": current_user['id'],
        "recipient_id": str(message_data.recipient_id),
        "content": message_data.content,
        "message_type": message_data.message_type,
        "image_url": message_data.image_url,
        "created_at": datetime.utcnow().isoformat(),
        "is_read": False
    }
    
    result = supabase.table('messages').insert(message).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message"
        )
    
    return result.data[0]

@router.put("/{message_id}/read", summary="Mark message as read")
async def mark_message_read(
    message_id: str,
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Mark a message as read
    """
    supabase = get_supabase()
    
    # Verify message exists and current user is the recipient
    message_check = supabase.table('messages').select('recipient_id').eq('id', message_id).execute()
    
    if not message_check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message_check.data[0]['recipient_id'] != current_user['id']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only mark your own messages as read"
        )
    
    # Mark as read
    result = supabase.table('messages').update({
        'is_read': True
    }).eq('id', message_id).execute()
    
    return {"message": "Message marked as read"}

@router.get("/unread/count", summary="Get unread message count")
async def get_unread_count(
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Get count of unread messages for current user
    """
    supabase = get_supabase()
    
    result = supabase.table('messages').select('id', count='exact').eq(
        'recipient_id', current_user['id']
    ).eq('is_read', False).execute()
    
    return {"unread_count": result.count or 0}
