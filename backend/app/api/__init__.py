from fastapi import APIRouter

from .routes import auth, task

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(task.router, tags=["task"])
