from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
verify_service_sid = os.getenv('TWILIO_VERIFY_SERVICE_SID')

if not account_sid or not auth_token or not verify_service_sid:
    print("❌ Missing Twilio environment variables")
    print("Please check your .env file and ensure all Twilio variables are set:")
    print("- TWILIO_ACCOUNT_SID")
    print("- TWILIO_AUTH_TOKEN") 
    print("- TWILIO_VERIFY_SERVICE_SID")
    exit(1)

client = Client(account_sid, auth_token)

def test_send_verification(phone_number):
    """Test sending verification code"""
    try:
        verification = client.verify.v2.services(verify_service_sid) \
            .verifications \
            .create(to=phone_number, channel='sms')
        print(f"✅ Verification sent successfully!")
        print(f"   SID: {verification.sid}")
        print(f"   To: {verification.to}")
        print(f"   Channel: {verification.channel}")
        return verification.sid
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return None

def test_check_verification(phone_number, code):
    """Test checking verification code"""
    try:
        verification_check = client.verify.v2.services(verify_service_sid) \
            .verification_checks \
            .create(to=phone_number, code=code)
        print(f"✅ Verification check completed!")
        print(f"   Valid: {verification_check.valid}")
        print(f"   To: {verification_check.to}")
        return verification_check.valid
    except Exception as e:
        print(f"❌ Verification check failed: {e}")
        return False

def test_service_configuration():
    """Test Verify service configuration"""
    try:
        services = client.verify.v2.services.list()
        print(f"✅ Found {len(services)} Verify service(s):")
        service = client.verify.v2.services(verify_service_sid).fetch()
        print(f"✅ Verify service configuration:")
        print(f"   Service Name: {service.friendly_name}")
        print(f"   Service SID: {service.sid}")
        print(f"   Code Length: {service.code_length}")
        print(f"   Lookup Enabled: {service.lookup_enabled}")
        return True
    except Exception as e:
        print(f"❌ Failed to fetch service configuration: {e}")
        return False

if __name__ == "__main__":
    print("Testing Twilio Verify Service Configuration...")
    print("=" * 50)
    
    # Test service configuration
    if not test_service_configuration():
        print("\n❌ Service configuration test failed. Please check your Verify Service SID.")
        exit(1)
    
    print("\n" + "=" * 50)
    print("Ready to test verification!")
    print("=" * 50)
    
    # Test sending verification (replace with your phone number)
    test_phone = input("Enter your phone number (E.164 format, e.g., +1234567890): ").strip()
    
    if not test_phone.startswith('+'):
        print("❌ Phone number must be in E.164 format (start with +)")
        exit(1)
    
    print(f"\nTesting verification for {test_phone}...")
    verification_sid = test_send_verification(test_phone)
    
    if verification_sid:
        print(f"\n📱 Check your phone for the verification code")
        print("💡 To test verification check, enter the code you received:")
        
        code = input("Enter verification code: ").strip()
        if code:
            print(f"\nTesting verification check...")
            is_valid = test_check_verification(test_phone, code)
            if is_valid:
                print("🎉 Verification successful! Your Twilio Verify setup is working correctly.")
            else:
                print("❌ Verification failed. Please check the code and try again.")
        else:
            print("No code entered. Test completed.")
    else:
        print("❌ Could not send verification. Please check your configuration.")
