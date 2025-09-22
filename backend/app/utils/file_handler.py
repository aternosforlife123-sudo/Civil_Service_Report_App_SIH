import os
import uuid
from typing import List
from fastapi import UploadFile, HTTPException
from PIL import Image
from app.config import settings

def validate_file(file: UploadFile) -> bool:
    """Validate uploaded file"""
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in settings.allowed_file_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not allowed. Allowed types: {settings.allowed_file_types}"
        )
    
    return True

async def save_uploaded_file(file: UploadFile, subfolder: str = "reports") -> str:
    """Save uploaded file and return the file path"""
    validate_file(file)
    
    # Create unique filename
    file_ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    
    # Create directory path
    upload_path = os.path.join(settings.upload_directory, subfolder)
    os.makedirs(upload_path, exist_ok=True)
    
    # Full file path
    file_path = os.path.join(upload_path, unique_filename)
    
    # Save file
    contents = await file.read()
    
    # Check file size
    if len(contents) > settings.max_file_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {settings.max_file_size / (1024*1024):.1f}MB"
        )
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Optimize image if it's an image file
    if file_ext in [".jpg", ".jpeg", ".png"]:
        optimize_image(file_path)
    
    # Return relative path for storage in database
    return f"/static/{subfolder}/{unique_filename}"

def optimize_image(file_path: str, max_width: int = 1200, quality: int = 85):
    """Optimize image by resizing and compressing"""
    try:
        with Image.open(file_path) as img:
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save with optimization
            img.save(file_path, optimize=True, quality=quality)
    except Exception as e:
        # If optimization fails, keep original file
        print(f"Image optimization failed for {file_path}: {e}")

async def save_multiple_files(files: List[UploadFile], subfolder: str = "reports") -> List[str]:
    """Save multiple uploaded files"""
    file_paths = []
    for file in files:
        if file.filename:  # Skip empty files
            file_path = await save_uploaded_file(file, subfolder)
            file_paths.append(file_path)
    return file_paths

def delete_file(file_path: str) -> bool:
    """Delete a file from the filesystem"""
    try:
        # Convert relative path to absolute path
        if file_path.startswith("/static/"):
            absolute_path = os.path.join("static", file_path[8:])
        else:
            absolute_path = file_path
        
        if os.path.exists(absolute_path):
            os.remove(absolute_path)
            return True
        return False
    except Exception as e:
        print(f"Error deleting file {file_path}: {e}")
        return False