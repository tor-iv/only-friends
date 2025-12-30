from database import get_supabase
from utils.security import verify_password, get_password_hash, generate_token_pair
from utils.helpers import format_phone_number, validate_phone_number
from services.sms_service import sms_service
from typing import Optional, Dict
import uuid
from datetime import datetime

class AuthService:
    def __init__(self):
        self.supabase = get_supabase()

    async def send_verification_code(self, phone_number: str) -> Dict:
        """Send verification code to phone number"""
        formatted_phone = format_phone_number(phone_number)
        
        if not validate_phone_number(formatted_phone):
            return {
                "success": False,
                "error": "Invalid phone number format"
            }
        
        result = await sms_service.send_verification_code(formatted_phone)
        return result

    async def verify_phone_number(self, phone_number: str, code: str) -> Dict:
        """Verify phone number with code"""
        formatted_phone = format_phone_number(phone_number)
        
        if not validate_phone_number(formatted_phone):
            return {
                "success": False,
                "error": "Invalid phone number format"
            }
        
        # Verify code with Twilio
        verification_result = await sms_service.verify_code(formatted_phone, code)
        
        if not verification_result["success"] or not verification_result["valid"]:
            return {
                "success": False,
                "error": "Invalid verification code"
            }
        
        # Check if user exists
        user_result = self.supabase.table('users').select('*').eq('phone_number', formatted_phone).execute()
        
        return {
            "success": True,
            "phone_number": formatted_phone,
            "user_exists": len(user_result.data) > 0,
            "user_data": user_result.data[0] if user_result.data else None
        }

    async def register_user(self, user_data: Dict) -> Dict:
        """Register a new user"""
        try:
            # Hash password
            hashed_password = get_password_hash(user_data["password"])
            
            # Create user record
            new_user = {
                "id": str(uuid.uuid4()),
                "phone_number": user_data["phone_number"],
                "email": user_data.get("email"),
                "first_name": user_data["first_name"],
                "last_name": user_data["last_name"],
                "username": user_data.get("username"),
                "password_hash": hashed_password,
                "is_verified": True,
                "is_active": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            result = self.supabase.table('users').insert(new_user).execute()
            
            if not result.data:
                return {
                    "success": False,
                    "error": "Failed to create user"
                }
            
            created_user = result.data[0]
            
            # Generate tokens
            tokens = generate_token_pair(created_user['id'], user_data["phone_number"])
            
            return {
                "success": True,
                "user": created_user,
                "tokens": tokens
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def login_user(self, phone_number: str, password: str) -> Dict:
        """Login user with phone and password"""
        formatted_phone = format_phone_number(phone_number)
        
        if not validate_phone_number(formatted_phone):
            return {
                "success": False,
                "error": "Invalid phone number format"
            }
        
        # Get user by phone number
        user_result = self.supabase.table('users').select('*').eq('phone_number', formatted_phone).execute()
        
        if not user_result.data:
            return {
                "success": False,
                "error": "Invalid credentials"
            }
        
        user = user_result.data[0]
        
        # Verify password
        if not verify_password(password, user['password_hash']):
            return {
                "success": False,
                "error": "Invalid credentials"
            }
        
        # Check if user is active
        if not user['is_active']:
            return {
                "success": False,
                "error": "Account is deactivated"
            }
        
        # Generate tokens
        tokens = generate_token_pair(user['id'], formatted_phone)
        
        return {
            "success": True,
            "user": user,
            "tokens": tokens
        }

    async def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        result = self.supabase.table('users').select('*').eq('id', user_id).execute()
        
        if result.data:
            user = result.data[0]
            user.pop('password_hash', None)  # Remove sensitive data
            return user
        
        return None

    async def update_user(self, user_id: str, update_data: Dict) -> Dict:
        """Update user information"""
        try:
            update_data["updated_at"] = datetime.utcnow().isoformat()
            
            result = self.supabase.table('users').update(update_data).eq('id', user_id).execute()
            
            if not result.data:
                return {
                    "success": False,
                    "error": "Failed to update user"
                }
            
            updated_user = result.data[0]
            updated_user.pop('password_hash', None)
            
            return {
                "success": True,
                "user": updated_user
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def check_username_availability(self, username: str, exclude_user_id: Optional[str] = None) -> bool:
        """Check if username is available"""
        query = self.supabase.table('users').select('id').eq('username', username)
        
        if exclude_user_id:
            query = query.neq('id', exclude_user_id)
        
        result = query.execute()
        return len(result.data) == 0

# Create singleton instance
auth_service = AuthService()
