from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

from app.core.config import settings

from app.api import api_router

from app.database import init_db

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)


@app.get("/")
async def root():
    return RedirectResponse(url="/index.html")

app.mount("/", StaticFiles(directory="../frontend/out"))

app.include_router(api_router)
