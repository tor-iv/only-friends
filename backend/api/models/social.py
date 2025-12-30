from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class PostBase(BaseModel):
    content: str = Field(..., max_length=2000)
    image_url: Optional[str] = None
    location: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    content: Optional[str] = Field(None, max_length=2000)
    location: Optional[str] = None

class Post(PostBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    like_count: int = 0
    comment_count: int = 0
    is_liked: bool = False
    
    # User info
    user_first_name: str
    user_last_name: str
    user_username: Optional[str]
    user_avatar_url: Optional[str]

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    content: str = Field(..., max_length=1000)
    message_type: str = Field(default="text", description="text, image, or system")
    image_url: Optional[str] = None

class MessageCreate(MessageBase):
    recipient_id: uuid.UUID

class Message(MessageBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    recipient_id: uuid.UUID
    created_at: datetime
    is_read: bool = False
    
    # Sender info
    sender_first_name: str
    sender_last_name: str
    sender_avatar_url: Optional[str]

    class Config:
        from_attributes = True

class Conversation(BaseModel):
    user_id: uuid.UUID
    user_first_name: str
    user_last_name: str
    user_avatar_url: Optional[str]
    last_message: Optional[str]
    last_message_time: Optional[datetime]
    unread_count: int = 0

class FriendRequestBase(BaseModel):
    pass

class FriendRequest(FriendRequestBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    recipient_id: uuid.UUID
    status: str = Field(default="pending", description="pending, accepted, or rejected")
    created_at: datetime
    
    # Sender info
    sender_first_name: str
    sender_last_name: str
    sender_username: Optional[str]
    sender_avatar_url: Optional[str]

    class Config:
        from_attributes = True

class FriendRequestCreate(BaseModel):
    recipient_id: uuid.UUID

class FriendRequestUpdate(BaseModel):
    status: str = Field(..., description="accepted or rejected")

class Friend(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    username: Optional[str]
    avatar_url: Optional[str]
    friendship_date: datetime

class LikeCreate(BaseModel):
    post_id: uuid.UUID

# Story models
class StoryBase(BaseModel):
    content: Optional[str] = None
    image_url: Optional[str] = None
    background_color: str = Field(default="#000000", max_length=7)

class StoryCreate(StoryBase):
    pass

class Story(StoryBase):
    id: uuid.UUID
    user_id: uuid.UUID
    expires_at: datetime
    views_count: int = 0
    created_at: datetime
    is_viewed: bool = False

    # User info
    user_first_name: str
    user_last_name: str
    user_avatar_url: Optional[str]

    class Config:
        from_attributes = True

class StoryGroup(BaseModel):
    user_id: uuid.UUID
    user_first_name: str
    user_last_name: str
    user_avatar_url: Optional[str]
    stories: List["Story"]
    has_unviewed: bool

class CommentBase(BaseModel):
    content: str = Field(..., max_length=500)

class CommentCreate(CommentBase):
    post_id: uuid.UUID

class Comment(CommentBase):
    id: uuid.UUID
    post_id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    
    # User info
    user_first_name: str
    user_last_name: str
    user_avatar_url: Optional[str]

    class Config:
        from_attributes = True
