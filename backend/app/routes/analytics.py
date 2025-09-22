from fastapi import APIRouter, Depends, Query
from app.database import get_database
from app.models.report import ReportCategory, ReportStatus
from typing import Dict, List, Optional
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/overview")
async def get_analytics_overview(db = Depends(get_database)):
    """Get overall analytics overview"""
    
    # Total counts
    total_reports = await db.reports.count_documents({})
    total_users = await db.users.count_documents({})
    pending_reports = await db.reports.count_documents({"status": ReportStatus.PENDING})
    resolved_reports = await db.reports.count_documents({"status": ReportStatus.RESOLVED})
    
    # Reports by category
    category_pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    category_stats = await db.reports.aggregate(category_pipeline).to_list(length=None)
    
    # Reports by status
    status_pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    status_stats = await db.reports.aggregate(status_pipeline).to_list(length=None)
    
    # Recent activity (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_reports = await db.reports.count_documents({
        "created_at": {"$gte": thirty_days_ago}
    })
    
    return {
        "total_reports": total_reports,
        "total_users": total_users,
        "pending_reports": pending_reports,
        "resolved_reports": resolved_reports,
        "resolution_rate": round((resolved_reports / total_reports * 100) if total_reports > 0 else 0, 2),
        "recent_reports_30_days": recent_reports,
        "reports_by_category": category_stats,
        "reports_by_status": status_stats
    }

@router.get("/reports-timeline")
async def get_reports_timeline(
    days: int = Query(30, ge=1, le=365),
    db = Depends(get_database)
):
    """Get reports timeline for the last N days"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    pipeline = [
        {"$match": {"created_at": {"$gte": start_date}}},
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                    "day": {"$dayOfMonth": "$created_at"}
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    
    timeline_data = await db.reports.aggregate(pipeline).to_list(length=None)
    
    # Format the data
    formatted_data = []
    for item in timeline_data:
        date = datetime(item["_id"]["year"], item["_id"]["month"], item["_id"]["day"])
        formatted_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "count": item["count"]
        })
    
    return {"timeline": formatted_data}

@router.get("/top-locations")
async def get_top_locations(
    limit: int = Query(10, ge=1, le=50),
    db = Depends(get_database)
):
    """Get locations with most reports"""
    
    # Group by approximate location (rounded coordinates)
    pipeline = [
        {
            "$group": {
                "_id": {
                    "lat": {"$round": [{"$arrayElemAt": ["$location.coordinates", 1]}, 3]},
                    "lng": {"$round": [{"$arrayElemAt": ["$location.coordinates", 0]}, 3]}
                },
                "count": {"$sum": 1},
                "latest_address": {"$last": "$address"}
            }
        },
        {"$sort": {"count": -1}},
        {"$limit": limit}
    ]
    
    top_locations = await db.reports.aggregate(pipeline).to_list(length=limit)
    
    # Format the data
    formatted_locations = []
    for location in top_locations:
        formatted_locations.append({
            "latitude": location["_id"]["lat"],
            "longitude": location["_id"]["lng"],
            "reports_count": location["count"],
            "address": location["latest_address"]
        })
    
    return {"top_locations": formatted_locations}

@router.get("/user-stats/{user_id}")
async def get_user_statistics(user_id: str, db = Depends(get_database)):
    """Get statistics for a specific user"""
    
    from bson import ObjectId
    
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    user_id_obj = ObjectId(user_id)
    
    # User's reports count by status
    status_pipeline = [
        {"$match": {"user_id": user_id_obj}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_stats = await db.reports.aggregate(status_pipeline).to_list(length=None)
    
    # User's reports count by category
    category_pipeline = [
        {"$match": {"user_id": user_id_obj}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    category_stats = await db.reports.aggregate(category_pipeline).to_list(length=None)
    
    # Total reports
    total_reports = await db.reports.count_documents({"user_id": user_id_obj})
    
    # Recent activity
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_reports = await db.reports.count_documents({
        "user_id": user_id_obj,
        "created_at": {"$gte": thirty_days_ago}
    })
    
    return {
        "total_reports": total_reports,
        "recent_reports_30_days": recent_reports,
        "reports_by_status": status_stats,
        "reports_by_category": category_stats
    }