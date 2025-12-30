from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class VerificationRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number in E.164 format (+1234567890)")

class VerificationCheck(BaseModel):
    phone_number: str = Field(..., description="Phone number in E.164 format (+1234567890)")
    code: str = Field(..., min_length=4, max_length=8, description="Verification code")

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    user_id: Optional[str] = None
    phone_number: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class LoginRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number in E.164 format")
    password: str = Field(..., min_length=1)

class RegisterRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number in E.164 format")
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: Optional[str] = None
    username: Optional[str] = Field(None, min_length=3, max_length=30)

class PasswordResetRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number in E.164 format")

class PasswordResetConfirm(BaseModel):
    phone_number: str = Field(..., description="Phone number in E.164 format")
    code: str = Field(..., min_length=4, max_length=8)
    new_password: str = Field(..., min_length=8)

class AuthResponse(BaseModel):
    user_id: str
    phone_number: str
    is_verified: bool
    is_new_user: bool = False
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
