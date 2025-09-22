from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import socketio
from app.routes import auth, reports, users, analytics
from app.database import connect_to_mongo, close_mongo_connection
from app.config import settings
import uvicorn

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["*"],
    logger=True,
    engineio_logger=True
)

# Create FastAPI app
app = FastAPI(
    title="Civic Reporter API",
    description="API for reporting and tracking civic infrastructure issues",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for image uploads
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])

# Socket.IO events
@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")
    await sio.emit('connected', {'data': 'Connected to Civic Reporter'}, room=sid)

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")

@sio.event
async def join_room(sid, data):
    room = data.get('room')
    if room:
        await sio.enter_room(sid, room)
        await sio.emit('joined_room', {'room': room}, room=sid)

@sio.event
async def leave_room(sid, data):
    room = data.get('room')
    if room:
        await sio.leave_room(sid, room)

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Civic Reporter API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Combine FastAPI and Socket.IO
socket_app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    uvicorn.run(
        "main:socket_app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )