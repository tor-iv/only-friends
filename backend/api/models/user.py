from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid

class UserBase(BaseModel):
    phone_number: str = Field(..., description="User's phone number in E.164 format")
    email: Optional[EmailStr] = None
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    username: Optional[str] = Field(None, min_length=3, max_length=30)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = None
    is_private: bool = False
    location: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="User password")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    username: Optional[str] = Field(None, min_length=3, max_length=30)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = None
    is_private: Optional[bool] = None
    location: Optional[str] = None

class User(UserBase):
    id: uuid.UUID
    is_verified: bool = False
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    friend_count: int = 0
    post_count: int = 0

    class Config:
        from_attributes = True

class UserProfile(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    username: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    is_private: bool
    friend_count: int
    post_count: int
    is_friend: bool = False
    is_friend_request_sent: bool = False

class UserSearch(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    username: Optional[str]
    avatar_url: Optional[str]
    is_friend: bool = False
