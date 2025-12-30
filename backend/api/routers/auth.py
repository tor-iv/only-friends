from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.auth import (
    VerificationRequest, VerificationCheck, AuthResponse, 
    LoginRequest, RegisterRequest, RefreshTokenRequest
)
from models.user import User, UserCreate
from services.sms_service import sms_service
from utils.security import generate_token_pair, verify_token, get_password_hash, verify_password
from utils.helpers import format_phone_number, validate_phone_number, generate_username
from database import get_supabase
import uuid
from datetime import datetime

router = APIRouter()
security = HTTPBearer()

@router.post("/send-verification", summary="Send verification code")
async def send_verification_code(request: VerificationRequest):
    """
    Send SMS verification code to phone number using Twilio Verify
    """
    # Format and validate phone number
    formatted_phone = format_phone_number(request.phone_number)
    if not validate_phone_number(formatted_phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid phone number format. Please use E.164 format (+1234567890)"
        )
    
    # Send verification code
    result = await sms_service.send_verification_code(formatted_phone)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to send verification code: {result.get('error', 'Unknown error')}"
        )
    
    return {
        "message": "Verification code sent successfully",
        "phone_number": formatted_phone,
        "status": result["status"]
    }

@router.post("/verify-phone", summary="Verify phone number with code")
async def verify_phone_number(request: VerificationCheck):
    """
    Verify phone number with the received code
    """
    # Format and validate phone number
    formatted_phone = format_phone_number(request.phone_number)
    if not validate_phone_number(formatted_phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid phone number format"
        )
    
    # Verify the code
    result = await sms_service.verify_code(formatted_phone, request.code)
    
    if not result["success"] or not result["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Check if user exists
    supabase = get_supabase()
    user_result = supabase.table('users').select('*').eq('phone_number', formatted_phone).execute()
    
    user_exists = len(user_result.data) > 0
    user_data = user_result.data[0] if user_exists else None
    
    if user_exists:
        # Existing user - generate tokens
        tokens = generate_token_pair(user_data['id'], formatted_phone)
        
        return AuthResponse(
            user_id=str(user_data['id']),
            phone_number=formatted_phone,
            is_verified=True,
            is_new_user=False,
            **tokens
        )
    else:
        # New user - return verification success but no tokens yet
        return {
            "message": "Phone number verified successfully",
            "phone_number": formatted_phone,
            "is_verified": True,
            "is_new_user": True,
            "next_step": "complete_registration"
        }

@router.post("/register", response_model=AuthResponse, summary="Complete user registration")
async def register_user(request: RegisterRequest):
    """
    Complete user registration after phone verification
    """
    # Format and validate phone number
    formatted_phone = format_phone_number(request.phone_number)
    if not validate_phone_number(formatted_phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid phone number format"
        )
    
    supabase = get_supabase()
    
    # Check if user already exists
    existing_user = supabase.table('users').select('*').eq('phone_number', formatted_phone).execute()
    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this phone number already exists"
        )
    
    # Generate username if not provided
    username = request.username
    if not username:
        username = generate_username(request.first_name, request.last_name)
    
    # Check username uniqueness
    username_check = supabase.table('users').select('id').eq('username', username).execute()
    if username_check.data:
        # Add random suffix if username exists
        username = f"{username}_{uuid.uuid4().hex[:6]}"
    
    # Hash password
    hashed_password = get_password_hash(request.password)
    
    # Create user
    user_data = {
        "id": str(uuid.uuid4()),
        "phone_number": formatted_phone,
        "email": request.email,
        "first_name": request.first_name,
        "last_name": request.last_name,
        "username": username,
        "password_hash": hashed_password,
        "is_verified": True,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table('users').insert(user_data).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    created_user = result.data[0]
    
    # Generate tokens
    tokens = generate_token_pair(created_user['id'], formatted_phone)
    
    return AuthResponse(
        user_id=str(created_user['id']),
        phone_number=formatted_phone,
        is_verified=True,
        is_new_user=True,
        **tokens
    )

@router.post("/login", response_model=AuthResponse, summary="Login with phone and password")
async def login_user(request: LoginRequest):
    """
    Login user with phone number and password
    """
    # Format and validate phone number
    formatted_phone = format_phone_number(request.phone_number)
    if not validate_phone_number(formatted_phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid phone number format"
        )
    
    supabase = get_supabase()
    
    # Get user by phone number
    user_result = supabase.table('users').select('*').eq('phone_number', formatted_phone).execute()
    
    if not user_result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password"
        )
    
    user = user_result.data[0]
    
    # Verify password
    if not verify_password(request.password, user['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password"
        )
    
    # Check if user is active
    if not user['is_active']:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Generate tokens
    tokens = generate_token_pair(user['id'], formatted_phone)
    
    return AuthResponse(
        user_id=str(user['id']),
        phone_number=formatted_phone,
        is_verified=user['is_verified'],
        is_new_user=False,
        **tokens
    )

@router.post("/refresh", summary="Refresh access token")
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh access token using refresh token
    """
    # Verify refresh token
    payload = verify_token(request.refresh_token, token_type="refresh")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("user_id")
    phone_number = payload.get("phone_number")
    
    if not user_id or not phone_number:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Verify user still exists and is active
    supabase = get_supabase()
    user_result = supabase.table('users').select('is_active').eq('id', user_id).execute()
    
    if not user_result.data or not user_result.data[0]['is_active']:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Generate new token pair
    tokens = generate_token_pair(user_id, phone_number)
    
    return tokens

@router.get("/me", summary="Get current user info")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get current authenticated user information
    """
    # Verify access token
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token"
        )
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get user from database
    supabase = get_supabase()
    user_result = supabase.table('users').select('*').eq('id', user_id).execute()
    
    if not user_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = user_result.data[0]
    
    # Remove sensitive data
    user.pop('password_hash', None)
    
    return user

# Dependency to get current user
async def get_current_user_dependency(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to get current authenticated user
    """
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token"
        )
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    supabase = get_supabase()
    user_result = supabase.table('users').select('*').eq('id', user_id).execute()
    
    if not user_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user_result.data[0]
