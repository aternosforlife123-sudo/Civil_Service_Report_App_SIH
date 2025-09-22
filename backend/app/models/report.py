from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId
import geojson

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class ReportCategory(str, Enum):
    POTHOLE = "pothole"
    STREET_LIGHT = "street_light"
    WATER_ISSUE = "water_issue"
    WASTE_MANAGEMENT = "waste_management"
    ROAD_DAMAGE = "road_damage"
    TRAFFIC_SIGNAL = "traffic_signal"
    DRAINAGE = "drainage"
    OTHER = "other"

class ReportStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"

class ReportPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Location(BaseModel):
    type: str = "Point"
    coordinates: List[float] = Field(..., min_items=2, max_items=2)
    
    @validator('coordinates')
    def validate_coordinates(cls, v):
        if len(v) != 2:
            raise ValueError('Coordinates must contain exactly 2 values [longitude, latitude]')
        longitude, latitude = v
        if not -180 <= longitude <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        if not -90 <= latitude <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v

class ReportBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    category: ReportCategory
    location: Location
    address: str = Field(..., min_length=5, max_length=500)
    priority: ReportPriority = ReportPriority.MEDIUM

class ReportCreate(ReportBase):
    images: Optional[List[str]] = []

class ReportUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=2000)
    category: Optional[ReportCategory] = None
    priority: Optional[ReportPriority] = None
    status: Optional[ReportStatus] = None

class ReportInDB(ReportBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    status: ReportStatus = ReportStatus.PENDING
    images: List[str] = []
    upvotes: int = 0
    downvotes: int = 0
    comments_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    assigned_to: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Report(ReportBase):
    id: str = Field(alias="_id")
    user_id: str
    status: ReportStatus
    images: List[str]
    upvotes: int
    downvotes: int
    comments_count: int
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]
    assigned_to: Optional[str]
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class ReportWithUser(Report):
    user: Dict[str, Any]

class Comment(BaseModel):
    id: str = Field(alias="_id")
    report_id: str
    user_id: str
    content: str = Field(..., min_length=1, max_length=1000)
    created_at: datetime
    user: Optional[Dict[str, Any]] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

class Vote(BaseModel):
    report_id: str
    user_id: str
    vote_type: str  # "upvote" or "downvote"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ReportsFilter(BaseModel):
    category: Optional[ReportCategory] = None
    status: Optional[ReportStatus] = None
    priority: Optional[ReportPriority] = None
    user_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius: Optional[float] = Field(None, gt=0)  # in kilometers
    
class ReportsResponse(BaseModel):
    reports: List[ReportWithUser]
    total: int
    page: int
    per_page: int
    total_pages: int