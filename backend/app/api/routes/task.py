from fastapi import APIRouter, Depends, HTTPException
from fastapi import status, Request
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies import DBDependency, CurrentUser

from app import schemas

from app.database import crud

from pydantic import BaseModel

from typing import Optional


router = APIRouter()


@router.post("/", response_model=schemas.Task)
async def create_task(task: schemas.TaskCreate, db: DBDependency, user: CurrentUser):
    return await crud.create_task(db, content=task.content, user_id=user.id)


@router.get("/", response_model=list[schemas.Task])
async def read_tasks(db: DBDependency, user: CurrentUser, skip: int = 0, limit: int = 100):
    tasks = await crud.get_tasks_by_user_id(db, user_id=user.id, skip=skip, limit=limit)
    return tasks


@router.get("/{task_id}/", response_model=schemas.Task)
async def read_task(task_id: int, db: DBDependency, user: CurrentUser):
    db_task = await crud.get_task_by_id(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if user.id != db_task.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return db_task


class UpdateTaskRequest(BaseModel):
    content: Optional[str] = None
    status: Optional[schemas.TaskStatus] = None


@router.put("/{task_id}/", response_model=schemas.Task)
async def update_task(task_id: int, update_request: UpdateTaskRequest, db: DBDependency,
                      user: CurrentUser):
    db_task = await crud.update_task_of_user(
        db, task_id=task_id, user_id=user.id, content=update_request.content, status=update_request.status)
    if db_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return db_task


@router.delete("/{task_id}/", response_model=schemas.Task)
async def delete_task(task_id: int, db: DBDependency, user: CurrentUser):
    db_task = await crud.delete_task_of_user(db, task_id=task_id, user_id=user.id)
    if db_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return db_task
