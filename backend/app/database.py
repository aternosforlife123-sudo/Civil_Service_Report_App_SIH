from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, GEOSPHERE
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def get_database():
    return db.db

async def connect_to_mongo():
    """Create database connection"""
    try:
        db.client = AsyncIOMotorClient(settings.mongodb_url)
        db.db = db.client[settings.database_name]
        
        # Test connection
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("Disconnected from MongoDB")

async def create_indexes():
    """Create database indexes for optimal performance"""
    try:
        # Users collection indexes
        users_collection = db.db.users
        await users_collection.create_indexes([
            IndexModel("email", unique=True),
            IndexModel("username", unique=True),
        ])
        
        # Reports collection indexes
        reports_collection = db.db.reports
        await reports_collection.create_indexes([
            IndexModel([("location", GEOSPHERE)]),  # For geospatial queries
            IndexModel("user_id"),
            IndexModel("status"),
            IndexModel("category"),
            IndexModel("created_at"),
            IndexModel([("status", 1), ("created_at", -1)]),
        ])
        
        # Comments collection indexes
        comments_collection = db.db.comments
        await comments_collection.create_indexes([
            IndexModel("report_id"),
            IndexModel("user_id"),
            IndexModel("created_at"),
        ])
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")