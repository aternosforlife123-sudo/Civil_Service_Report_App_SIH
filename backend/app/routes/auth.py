from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.database import get_database
from app.models.user import UserCreate, UserLogin, User, Token, UserInDB
from app.utils.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    create_refresh_token,
    verify_token
)
from datetime import datetime
from bson import ObjectId

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=User)
async def register_user(user: UserCreate, db = Depends(get_database)):
    """Register a new user"""
    
    # Check if user already exists
    existing_user = await db.users.find_one({
        "$or": [
            {"email": user.email},
            {"username": user.username}
        ]
    })
    
    if existing_user:
        if existing_user["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user document
    user_doc = UserInDB(
        **user.dict(exclude={"password"}),
        hashed_password=hashed_password
    )
    
    # Insert user
    result = await db.users.insert_one(user_doc.dict(by_alias=True))
    
    # Get created user
    created_user = await db.users.find_one({"_id": result.inserted_id})
    
    return User(**created_user)

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin, db = Depends(get_database)):
    """Authenticate user and return tokens"""
    
    # Find user by email
    user = await db.users.find_one({"email": user_credentials.email})
    
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user["_id"])})
    refresh_token = create_refresh_token(data={"sub": str(user["_id"])})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token
    )

@router.post("/refresh", response_model=Token)
async def refresh_token(token: str, db = Depends(get_database)):
    """Refresh access token using refresh token"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        from jose import jwt
        from app.config import settings
        
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "refresh":
            raise credentials_exception
            
    except Exception:
        raise credentials_exception
    
    # Verify user exists and is active
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user or not user.get("is_active", True):
        raise credentials_exception
    
    # Create new tokens
    access_token = create_access_token(data={"sub": user_id})
    new_refresh_token = create_refresh_token(data={"sub": user_id})
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token
    )

@router.get("/me", response_model=User)
async def get_current_user_info(db = Depends(get_database), current_user: UserInDB = Depends(verify_token)):
    """Get current user information"""
    user = await db.users.find_one({"_id": ObjectId(current_user.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user)