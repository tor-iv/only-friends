from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("❌ Missing Supabase environment variables")
    print("Please check your .env file and ensure SUPABASE_URL and SUPABASE_KEY are set")
    exit(1)

try:
    supabase = create_client(url, key)
    result = supabase.table('users').select("count").execute()
    print("✅ Supabase connection successful!")
    print(f"   URL: {url}")
    print(f"   Tables accessible: ✓")
except Exception as e:
    print(f"❌ Supabase connection failed: {e}")
    print(f"   URL: {url}")
    print(f"   Key: {key[:20]}...")
