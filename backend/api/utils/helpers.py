import re
import random
import string
from typing import Optional

def format_phone_number(phone_number: str) -> str:
    """
    Format phone number to E.164 format
    
    Args:
        phone_number: Raw phone number string
        
    Returns:
        str: Phone number in E.164 format (+1234567890)
    """
    # Remove all non-digit characters
    digits = re.sub(r'\D', '', phone_number)
    
    # If it starts with 1 and has 11 digits, assume US number
    if len(digits) == 11 and digits.startswith('1'):
        return f"+{digits}"
    
    # If it has 10 digits, assume US number without country code
    elif len(digits) == 10:
        return f"+1{digits}"
    
    # If it already starts with +, return as is
    elif phone_number.startswith('+'):
        return phone_number
    
    # Otherwise, assume it needs + prefix
    else:
        return f"+{digits}"

def validate_phone_number(phone_number: str) -> bool:
    """
    Validate phone number format
    
    Args:
        phone_number: Phone number to validate
        
    Returns:
        bool: True if valid E.164 format
    """
    # E.164 format: + followed by up to 15 digits
    pattern = r'^\+[1-9]\d{1,14}$'
    return bool(re.match(pattern, phone_number))

def generate_username(first_name: str, last_name: str) -> str:
    """
    Generate a username from first and last name
    
    Args:
        first_name: User's first name
        last_name: User's last name
        
    Returns:
        str: Generated username
    """
    # Clean names - remove special characters and convert to lowercase
    first_clean = re.sub(r'[^a-zA-Z0-9]', '', first_name.lower())
    last_clean = re.sub(r'[^a-zA-Z0-9]', '', last_name.lower())
    
    # Generate base username
    base_username = f"{first_clean}{last_clean}"
    
    # If too short, add random numbers
    if len(base_username) < 3:
        base_username += ''.join(random.choices(string.digits, k=3))
    
    # If too long, truncate
    if len(base_username) > 25:
        base_username = base_username[:25]
    
    # Add random suffix to make it unique
    suffix = ''.join(random.choices(string.digits, k=3))
    username = f"{base_username}{suffix}"
    
    return username

def sanitize_content(content: str) -> str:
    """
    Sanitize user-generated content
    
    Args:
        content: Raw content string
        
    Returns:
        str: Sanitized content
    """
    # Remove potential HTML/script tags
    content = re.sub(r'<[^>]*>', '', content)
    
    # Remove excessive whitespace
    content = re.sub(r'\s+', ' ', content).strip()
    
    return content

def generate_verification_code(length: int = 6) -> str:
    """
    Generate a random verification code
    
    Args:
        length: Length of the code
        
    Returns:
        str: Random verification code
    """
    return ''.join(random.choices(string.digits, k=length))

def mask_phone_number(phone_number: str) -> str:
    """
    Mask phone number for display purposes
    
    Args:
        phone_number: Phone number to mask
        
    Returns:
        str: Masked phone number (e.g., +1***-***-1234)
    """
    if not phone_number or len(phone_number) < 4:
        return phone_number
    
    # Show first 2 characters and last 4 characters
    if len(phone_number) > 6:
        return f"{phone_number[:2]}***-***-{phone_number[-4:]}"
    else:
        return f"{phone_number[:2]}***{phone_number[-2:]}"

def extract_mentions(content: str) -> list:
    """
    Extract @mentions from content
    
    Args:
        content: Content to search for mentions
        
    Returns:
        list: List of mentioned usernames (without @)
    """
    pattern = r'@([a-zA-Z0-9_]+)'
    mentions = re.findall(pattern, content)
    return mentions

def extract_hashtags(content: str) -> list:
    """
    Extract #hashtags from content
    
    Args:
        content: Content to search for hashtags
        
    Returns:
        list: List of hashtags (without #)
    """
    pattern = r'#([a-zA-Z0-9_]+)'
    hashtags = re.findall(pattern, content)
    return hashtags

def calculate_age(birth_date) -> Optional[int]:
    """
    Calculate age from birth date
    
    Args:
        birth_date: Birth date
        
    Returns:
        int: Age in years
    """
    if not birth_date:
        return None
    
    from datetime import date
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
