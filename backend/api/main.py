from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users, posts, messages, friends, stories, upload
from config import settings

app = FastAPI(
    title="Only Friends API",
    description="Backend API for Only Friends social app",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(posts.router, prefix="/posts", tags=["posts"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])
app.include_router(friends.router, prefix="/friends", tags=["friends"])
app.include_router(stories.router, prefix="/stories", tags=["stories"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])

@app.get("/")
async def root():
    return {"message": "Only Friends API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
