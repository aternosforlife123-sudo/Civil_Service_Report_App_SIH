from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.database import get_database
from app.models.user import User, UserUpdate, UserInDB
from app.utils.auth import get_current_active_user
from app.utils.file_handler import save_uploaded_file, delete_file
from datetime import datetime

router = APIRouter()

@router.get("/me", response_model=User)
async def get_current_user_profile(current_user: UserInDB = Depends(get_current_active_user)):
    """Get current user profile"""
    return User(**current_user.dict())

@router.put("/me", response_model=User)
async def update_current_user_profile(
    user_update: UserUpdate,
    db = Depends(get_database),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Update current user profile"""
    
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.users.update_one(
        {"_id": current_user.id},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": current_user.id})
    return User(**updated_user)

@router.post("/me/profile-picture", response_model=dict)
async def upload_profile_picture(
    file: UploadFile = File(...),
    db = Depends(get_database),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Upload and update user profile picture"""
    
    # Delete old profile picture if exists
    if current_user.profile_picture:
        delete_file(current_user.profile_picture)
    
    # Save new profile picture
    file_path = await save_uploaded_file(file, "profiles")
    
    # Update user in database
    await db.users.update_one(
        {"_id": current_user.id},
        {"$set": {"profile_picture": file_path, "updated_at": datetime.utcnow()}}
    )
    
    return {"profile_picture": file_path}

@router.delete("/me/profile-picture")
async def delete_profile_picture(
    db = Depends(get_database),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Delete user profile picture"""
    
    if current_user.profile_picture:
        delete_file(current_user.profile_picture)
        
        await db.users.update_one(
            {"_id": current_user.id},
            {"$unset": {"profile_picture": ""}, "$set": {"updated_at": datetime.utcnow()}}
        )
    
    return {"message": "Profile picture deleted successfully"}

@router.get("/{user_id}", response_model=User)
async def get_user_profile(user_id: str, db = Depends(get_database)):
    """Get public user profile by ID"""
    
    from bson import ObjectId
    
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user)