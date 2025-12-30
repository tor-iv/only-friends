from supabase import create_client, Client
from config import settings

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Service role client for admin operations
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

def get_supabase() -> Client:
    """Get Supabase client instance"""
    return supabase

def get_supabase_admin() -> Client:
    """Get Supabase admin client instance"""
    return supabase_admin

async def test_connection():
    """Test database connection"""
    try:
        result = supabase.table('users').select("count").execute()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
