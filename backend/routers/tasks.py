from fastapi import APIRouter
from fastapi import HTTPException

from dependencies import DBDependency

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
async def read_tasks(db: DBDependency, skip: int = 0, limit: int = 100):
    tasks = database.get_tasks(db, skip=skip, limit=limit)
    return tasks


@router.get("/{task_id}", response_model=schemas.Task)
async def read_task(task_id: int, db: DBDependency):
    db_task = database.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.put("/{task_id}", response_model=schemas.Task)
async def update_task(task_id: int, task: schemas.TaskCreate, db: DBDependency):
    db_task = database.update_task(db, task_id, task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.delete("/{task_id}", response_model=schemas.Task)
def delete_task(task_id: int, db: DBDependency):
    db_task = database.delete_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task
