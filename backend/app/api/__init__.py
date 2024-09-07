from fastapi import APIRouter

from .routes import auth, task

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"], prefix="/auth")
api_router.include_router(task.router, tags=["task"], prefix="/task")
