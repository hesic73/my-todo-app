from fastapi import APIRouter
from fastapi import HTTPException

from dependencies import DBDependency, CurrentUserDependency

import database
import schemas

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)


@router.post("/", response_model=schemas.Task)
async def create_task(task: schemas.TaskCreate, db: DBDependency):
    return database.create_task(db=db, task=task)


@router.get("/", response_model=list[schemas.Task])
async def read_tasks(db: DBDependency, current_username: CurrentUserDependency, skip: int = 0, limit: int = 100):
    user = database.get_user_by_username(db, current_username)
    tasks = database.get_tasks(db, user_id=user.id, skip=skip, limit=limit)
    return tasks


@router.get("/{task_id}", response_model=schemas.Task)
async def read_task(task_id: int, db: DBDependency, current_username: CurrentUserDependency):
    db_task = database.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    user = database.get_user_by_username(db, current_username)
    if user.id != db_task.user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.put("/{task_id}", response_model=schemas.Task)
async def update_task(task_id: int, task: schemas.TaskCreate, db: DBDependency,
                      current_username: CurrentUserDependency):
    user = database.get_user_by_username(db, current_username)
    db_task = database.try_update_task(db, task_id, task, user_id=user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.delete("/{task_id}", response_model=schemas.Task)
def delete_task(task_id: int, db: DBDependency, current_username: CurrentUserDependency):
    user = database.get_user_by_username(db, current_username)
    db_task = database.try_delete_task(db, task_id, user_id=user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task
