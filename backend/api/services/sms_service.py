from twilio.rest import Client
from twilio.base.exceptions import TwilioException
from config import settings
import logging

logger = logging.getLogger(__name__)

class SMSService:
    def __init__(self):
        self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        self.verify_service_sid = settings.TWILIO_VERIFY_SERVICE_SID

    async def send_verification_code(self, phone_number: str, channel: str = "sms") -> dict:
        """
        Send verification code using Twilio Verify service
        
        Args:
            phone_number: Phone number in E.164 format
            channel: Verification channel (sms, call, email)
            
        Returns:
            dict: Response with status and verification SID
        """
        try:
            verification = self.client.verify.v2.services(self.verify_service_sid) \
                .verifications \
                .create(to=phone_number, channel=channel)
            
            logger.info(f"Verification sent to {phone_number}, SID: {verification.sid}")
            
            return {
                "success": True,
                "status": verification.status,
                "sid": verification.sid,
                "to": verification.to,
                "channel": verification.channel
            }
            
        except TwilioException as e:
            logger.error(f"Twilio error sending verification to {phone_number}: {e}")
            return {
                "success": False,
                "error": str(e),
                "error_code": getattr(e, 'code', None)
            }
        except Exception as e:
            logger.error(f"Unexpected error sending verification to {phone_number}: {e}")
            return {
                "success": False,
                "error": "Internal server error"
            }

    async def verify_code(self, phone_number: str, code: str) -> dict:
        """
        Verify the code using Twilio Verify service
        
        Args:
            phone_number: Phone number in E.164 format
            code: Verification code entered by user
            
        Returns:
            dict: Response with verification status
        """
        try:
            verification_check = self.client.verify.v2.services(self.verify_service_sid) \
                .verification_checks \
                .create(to=phone_number, code=code)
            
            logger.info(f"Verification check for {phone_number}: {verification_check.status}")
            
            return {
                "success": True,
                "valid": verification_check.valid,
                "status": verification_check.status,
                "to": verification_check.to
            }
            
        except TwilioException as e:
            logger.error(f"Twilio error verifying code for {phone_number}: {e}")
            return {
                "success": False,
                "valid": False,
                "error": str(e),
                "error_code": getattr(e, 'code', None)
            }
        except Exception as e:
            logger.error(f"Unexpected error verifying code for {phone_number}: {e}")
            return {
                "success": False,
                "valid": False,
                "error": "Internal server error"
            }

    async def get_verification_status(self, phone_number: str) -> dict:
        """
        Get the status of pending verifications for a phone number
        
        Args:
            phone_number: Phone number in E.164 format
            
        Returns:
            dict: Current verification status
        """
        try:
            verifications = self.client.verify.v2.services(self.verify_service_sid) \
                .verifications \
                .list(to=phone_number, limit=1)
            
            if verifications:
                verification = verifications[0]
                return {
                    "success": True,
                    "status": verification.status,
                    "sid": verification.sid,
                    "to": verification.to,
                    "channel": verification.channel,
                    "date_created": verification.date_created.isoformat() if verification.date_created else None
                }
            else:
                return {
                    "success": True,
                    "status": "no_pending_verification"
                }
                
        except TwilioException as e:
            logger.error(f"Twilio error getting verification status for {phone_number}: {e}")
            return {
                "success": False,
                "error": str(e),
                "error_code": getattr(e, 'code', None)
            }
        except Exception as e:
            logger.error(f"Unexpected error getting verification status for {phone_number}: {e}")
            return {
                "success": False,
                "error": "Internal server error"
            }

# Create singleton instance
sms_service = SMSService()
