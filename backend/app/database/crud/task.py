from ..models.task import Task, TaskStatus


from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select
from sqlalchemy.exc import IntegrityError

from typing import Optional


async def create_task(db: AsyncSession, content: str, user_id: int, status: TaskStatus = TaskStatus.IN_PROGRESS):
    try:
        db_task = Task(content=content,
                       status=status, user_id=user_id)
        db.add(db_task)
        await db.commit()
        await db.refresh(db_task)
        return db_task
    except IntegrityError:
        await db.rollback()
        return None


async def get_tasks(db: AsyncSession, skip: int = 0, limit: int = 100):
    stmt = select(Task).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_task_by_id(db: AsyncSession, task_id: int):
    stmt = select(Task).filter(Task.id == task_id)
    result = await db.execute(stmt)
    return result.scalars().first()


async def get_tasks_by_user_id(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    stmt = select(Task).filter(Task.user_id ==
                               user_id).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


async def update_task(db: AsyncSession, task_id: int, content: Optional[str], status: Optional[TaskStatus]):
    stmt = select(Task).filter(Task.id == task_id)
    result = await db.execute(stmt)
    db_task = result.scalars().first()
    if db_task is None:
        return None
    if content is not None:
        db_task.content = content
    if status is not None:
        db_task.status = status
    await db.commit()
    await db.refresh(db_task)
    return db_task


async def update_task_of_user(db: AsyncSession, task_id: int, user_id: int, content: Optional[str], status: Optional[TaskStatus]):
    stmt = select(Task).filter(Task.id == task_id, Task.user_id == user_id)
    result = await db.execute(stmt)
    db_task = result.scalars().first()
    if db_task is None:
        return None
    if content is not None:
        db_task.content = content
    if status is not None:
        db_task.status = status
    await db.commit()
    await db.refresh(db_task)
    return db_task


async def delete_task(db: AsyncSession, task_id: int):
    stmt = select(Task).filter(Task.id == task_id)
    result = await db.execute(stmt)
    db_task = result.scalars().first()
    if db_task:  # Ensure task exists
        await db.delete(db_task)
        await db.commit()
    return db_task


async def delete_task_of_user(db: AsyncSession, task_id: int, user_id: int):
    stmt = select(Task).filter(Task.id == task_id, Task.user_id == user_id)
    result = await db.execute(stmt)
    db_task = result.scalars().first()

    if db_task:  # Ensure task exists
        await db.delete(db_task)
        await db.commit()

    return db_task
