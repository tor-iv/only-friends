from database import get_supabase
from typing import Optional, Dict, List
from datetime import datetime

class UserService:
    def __init__(self):
        self.supabase = get_supabase()

    async def get_user_profile(self, user_id: str, current_user_id: str) -> Optional[Dict]:
        """Get user profile with privacy considerations"""
        # Get user data
        user_result = self.supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_result.data:
            return None
        
        user = user_result.data[0]
        user.pop('password_hash', None)  # Remove sensitive data
        
        # If it's the same user, return full profile
        if user_id == current_user_id:
            return user
        
        # Check if user is private and not a friend
        if user.get('is_private', False):
            # Check friendship
            friendship_check = self.supabase.table('friendships').select('id').or_(
                f"and(user1_id.eq.{current_user_id},user2_id.eq.{user_id})",
                f"and(user1_id.eq.{user_id},user2_id.eq.{current_user_id})"
            ).execute()
            
            if not friendship_check.data:
                # Return limited profile for private users
                return {
                    "id": user['id'],
                    "first_name": user['first_name'],
                    "last_name": user['last_name'],
                    "username": user['username'],
                    "avatar_url": user['avatar_url'],
                    "is_private": True,
                    "bio": None,
                    "location": None
                }
        
        return user

    async def search_users(self, query: str, current_user_id: str, limit: int = 20) -> List[Dict]:
        """Search users by name or username"""
        result = self.supabase.table('users').select(
            'id, first_name, last_name, username, avatar_url, is_private'
        ).or_(
            f"first_name.ilike.%{query}%",
            f"last_name.ilike.%{query}%",
            f"username.ilike.%{query}%"
        ).neq('id', current_user_id).limit(limit).execute()
        
        users = result.data
        
        # Add friend status for each user
        for user in users:
            # Check if they are friends
            friendship_check = self.supabase.table('friendships').select('id').or_(
                f"and(user1_id.eq.{current_user_id},user2_id.eq.{user['id']})",
                f"and(user1_id.eq.{user['id']},user2_id.eq.{current_user_id})"
            ).execute()
            user['is_friend'] = len(friendship_check.data) > 0
            
            # Check pending friend request
            if not user['is_friend']:
                request_check = self.supabase.table('friend_requests').select('id').eq(
                    'sender_id', current_user_id
                ).eq('recipient_id', user['id']).eq('status', 'pending').execute()
                user['is_friend_request_sent'] = len(request_check.data) > 0
            else:
                user['is_friend_request_sent'] = False
        
        return users

    async def get_user_stats(self, user_id: str) -> Dict:
        """Get user statistics (friend count, post count, etc.)"""
        # Get friend count
        friend_count_result = self.supabase.table('friendships').select('id', count='exact').or_(
            f"user1_id.eq.{user_id}",
            f"user2_id.eq.{user_id}"
        ).execute()
        friend_count = friend_count_result.count or 0
        
        # Get post count
        post_count_result = self.supabase.table('posts').select('id', count='exact').eq('user_id', user_id).execute()
        post_count = post_count_result.count or 0
        
        # Get follower count (if you implement following feature)
        # follower_count_result = self.supabase.table('follows').select('id', count='exact').eq('following_id', user_id).execute()
        # follower_count = follower_count_result.count or 0
        
        return {
            "friend_count": friend_count,
            "post_count": post_count,
            # "follower_count": follower_count,
            # "following_count": following_count
        }

    async def update_user_profile(self, user_id: str, update_data: Dict) -> Dict:
        """Update user profile"""
        try:
            # Remove None values
            filtered_data = {k: v for k, v in update_data.items() if v is not None}
            
            if not filtered_data:
                return {
                    "success": False,
                    "error": "No data to update"
                }
            
            filtered_data["updated_at"] = datetime.utcnow().isoformat()
            
            result = self.supabase.table('users').update(filtered_data).eq('id', user_id).execute()
            
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

    async def check_friendship_status(self, user1_id: str, user2_id: str) -> Dict:
        """Check friendship status between two users"""
        # Check if they are friends
        friendship_check = self.supabase.table('friendships').select('id, created_at').or_(
            f"and(user1_id.eq.{user1_id},user2_id.eq.{user2_id})",
            f"and(user1_id.eq.{user2_id},user2_id.eq.{user1_id})"
        ).execute()
        
        if friendship_check.data:
            return {
                "status": "friends",
                "friendship_date": friendship_check.data[0]['created_at']
            }
        
        # Check for pending friend requests
        request_check = self.supabase.table('friend_requests').select('id, sender_id, status').or_(
            f"and(sender_id.eq.{user1_id},recipient_id.eq.{user2_id})",
            f"and(sender_id.eq.{user2_id},recipient_id.eq.{user1_id})"
        ).eq('status', 'pending').execute()
        
        if request_check.data:
            request = request_check.data[0]
            if request['sender_id'] == user1_id:
                return {"status": "request_sent"}
            else:
                return {"status": "request_received"}
        
        return {"status": "none"}

    async def get_mutual_friends(self, user1_id: str, user2_id: str) -> List[Dict]:
        """Get mutual friends between two users"""
        # Get user1's friends
        user1_friends = self.supabase.table('friendships').select('user1_id, user2_id').or_(
            f"user1_id.eq.{user1_id}",
            f"user2_id.eq.{user1_id}"
        ).execute()
        
        user1_friend_ids = []
        for friendship in user1_friends.data:
            if friendship['user1_id'] == user1_id:
                user1_friend_ids.append(friendship['user2_id'])
            else:
                user1_friend_ids.append(friendship['user1_id'])
        
        # Get user2's friends
        user2_friends = self.supabase.table('friendships').select('user1_id, user2_id').or_(
            f"user1_id.eq.{user2_id}",
            f"user2_id.eq.{user2_id}"
        ).execute()
        
        user2_friend_ids = []
        for friendship in user2_friends.data:
            if friendship['user1_id'] == user2_id:
                user2_friend_ids.append(friendship['user2_id'])
            else:
                user2_friend_ids.append(friendship['user1_id'])
        
        # Find mutual friends
        mutual_friend_ids = list(set(user1_friend_ids) & set(user2_friend_ids))
        
        if not mutual_friend_ids:
            return []
        
        # Get mutual friends' details
        mutual_friends = self.supabase.table('users').select(
            'id, first_name, last_name, username, avatar_url'
        ).in_('id', mutual_friend_ids).execute()
        
        return mutual_friends.data

    async def deactivate_user(self, user_id: str) -> Dict:
        """Deactivate user account"""
        try:
            result = self.supabase.table('users').update({
                'is_active': False,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', user_id).execute()
            
            if not result.data:
                return {
                    "success": False,
                    "error": "Failed to deactivate user"
                }
            
            return {
                "success": True,
                "message": "User account deactivated"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Create singleton instance
user_service = UserService()
