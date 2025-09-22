from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from typing import List, Optional
from app.database import get_database
from app.models.report import (
    ReportCreate, Report, ReportUpdate, ReportsFilter, ReportsResponse,
    ReportWithUser, Comment, CommentCreate, ReportCategory, ReportStatus, ReportPriority
)
from app.models.user import UserInDB
from app.utils.auth import get_current_active_user
from app.utils.file_handler import save_multiple_files, delete_file
from bson import ObjectId
from datetime import datetime
import json
import socketio

router = APIRouter()

# Get Socket.IO instance (will be injected from main.py)
sio = None

def set_socketio(socketio_instance):
    global sio
    sio = socketio_instance

@router.post("/", response_model=Report)
async def create_report(
    title: str = Form(...),
    description: str = Form(...),
    category: ReportCategory = Form(...),
    location: str = Form(...),  # JSON string
    address: str = Form(...),
    priority: ReportPriority = Form(ReportPriority.MEDIUM),
    images: List[UploadFile] = File(default=[]),
    db = Depends(get_database),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Create a new report"""
    
    # Parse location JSON
    try:
        location_data = json.loads(location)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid location format")
    
    # Save uploaded images
    image_paths = []
    if images and images[0].filename:  # Check if files were actually uploaded
        image_paths = await save_multiple_files(images, "reports")
    
    # Create report document
    report_data = ReportCreate(
        title=title,
        description=description,
        category=category,
        location=location_data,
        address=address,
        priority=priority,
        images=image_paths
    )
    
    report_doc = {
        **report_data.dict(),
        "user_id": current_user.id,
        "status": ReportStatus.PENDING,
        "upvotes": 0,
        "downvotes": 0,
        "comments_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert report
    result = await db.reports.insert_one(report_doc)
    
    # Update user's reports count
    await db.users.update_one(
        {"_id": current_user.id},
        {"$inc": {"reports_count": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    # Get created report with user info
    created_report = await get_report_with_user(db, result.inserted_id)
    
    # Emit real-time update
    if sio:
        await sio.emit('new_report', created_report.dict(), room='reports')
    
    return created_report

@router.get("/", response_model=ReportsResponse)
async def get_reports(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[ReportCategory] = None,
    status: Optional[ReportStatus] = None,
    priority: Optional[ReportPriority] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius: Optional[float] = Query(None, gt=0),  # in kilometers
    db = Depends(get_database)
):
    """Get reports with filtering and pagination"""
    
    # Build query
    query = {}
    
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority
    
    # Geospatial query
    if latitude is not None and longitude is not None and radius is not None:
        query["location"] = {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "$maxDistance": radius * 1000  # Convert km to meters
            }
        }
    
    # Get total count
    total = await db.reports.count_documents(query)
    
    # Calculate pagination
    skip = (page - 1) * per_page
    total_pages = (total + per_page - 1) // per_page
    
    # Get reports with pagination
    cursor = db.reports.find(query).sort("created_at", -1).skip(skip).limit(per_page)
    reports = await cursor.to_list(length=per_page)
    
    # Get user info for each report
    reports_with_users = []
    for report in reports:
        user = await db.users.find_one({"_id": report["user_id"]})
        user_info = {
            "id": str(user["_id"]),
            "username": user["username"],
            "full_name": user["full_name"],
            "profile_picture": user.get("profile_picture")
        }
        
        report_with_user = ReportWithUser(**report, user=user_info)
        reports_with_users.append(report_with_user)
    
    return ReportsResponse(
        reports=reports_with_users,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )

@router.get("/{report_id}", response_model=ReportWithUser)
async def get_report(report_id: str, db = Depends(get_database)):
    """Get a specific report by ID"""
    
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID")
    
    report = await get_report_with_user(db, ObjectId(report_id))
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report

@router.put("/{report_id}", response_model=Report)
async def update_report(
    report_id: str,
    report_update: ReportUpdate,
    db = Depends(get_database),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Update a report (only by the creator)"""
    
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID")
    
    # Check if report exists and user owns it
    report = await db.reports.find_one({"_id": ObjectId(report_id)})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if report["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this report")
    
    # Update report
    update_data = {k: v for k, v in report_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if report_update.status == ReportStatus.RESOLVED:
        update_data["resolved_at"] = datetime.utcnow()
    
    await db.reports.update_one(
        {"_id": ObjectId(report_id)},
        {"$set": update_data}
    )
    
    # Get updated report
    updated_report = await get_report_with_user(db, ObjectId(report_id))
    
    # Emit real-time update
    if sio:
        await sio.emit('report_updated', updated_report.dict(), room='reports')
    
    return updated_report

@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    db = Depends(get_database),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Delete a report (only by the creator)"""
    
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID")
    
    # Check if report exists and user owns it
    report = await db.reports.find_one({"_id": ObjectId(report_id)})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if report["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this report")
    
    # Delete associated images
    for image_path in report.get("images", []):
        delete_file(image_path)
    
    # Delete report
    await db.reports.delete_one({"_id": ObjectId(report_id)})
    
    # Delete associated comments
    await db.comments.delete_many({"report_id": report_id})
    
    # Update user's reports count
    await db.users.update_one(
        {"_id": current_user.id},
        {"$inc": {"reports_count": -1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    # Emit real-time update
    if sio:
        await sio.emit('report_deleted', {"report_id": report_id}, room='reports')
    
    return {"message": "Report deleted successfully"}

async def get_report_with_user(db, report_id: ObjectId) -> Optional[ReportWithUser]:
    """Helper function to get report with user information"""
    
    pipeline = [
        {"$match": {"_id": report_id}},
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {"$unwind": "$user"},
        {
            "$project": {
                "_id": 1,
                "title": 1,
                "description": 1,
                "category": 1,
                "location": 1,
                "address": 1,
                "priority": 1,
                "status": 1,
                "images": 1,
                "upvotes": 1,
                "downvotes": 1,
                "comments_count": 1,
                "created_at": 1,
                "updated_at": 1,
                "resolved_at": 1,
                "assigned_to": 1,
                "user_id": 1,
                "user": {
                    "id": {"$toString": "$user._id"},
                    "username": "$user.username",
                    "full_name": "$user.full_name",
                    "profile_picture": "$user.profile_picture"
                }
            }
        }
    ]
    
    result = await db.reports.aggregate(pipeline).to_list(length=1)
    if result:
        return ReportWithUser(**result[0])
    return None