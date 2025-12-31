from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from routers.auth import get_current_user_dependency
from database import get_supabase_admin
import uuid

router = APIRouter()

ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/", summary="Upload image to storage")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Upload an image to Supabase Storage.
    Returns the public URL of the uploaded image.
    """
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_CONTENT_TYPES)}"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )

    # Generate unique filename in user's folder
    file_ext = file.filename.split('.')[-1] if file.filename else 'jpg'
    unique_filename = f"{current_user['id']}/{uuid.uuid4()}.{file_ext}"

    # Upload to Supabase Storage using admin client
    supabase = get_supabase_admin()

    try:
        result = supabase.storage.from_('uploads').upload(
            path=unique_filename,
            file=content,
            file_options={"content-type": file.content_type}
        )

        # Get public URL
        public_url = supabase.storage.from_('uploads').get_public_url(unique_filename)

        return {
            "success": True,
            "url": public_url,
            "filename": unique_filename
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )
