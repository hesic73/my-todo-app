from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, DateTime

from datetime import datetime

import schemas

from .base import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    content = Column(String, index=True)
    last_modified = Column(DateTime, default=datetime.utcnow, index=True)


def get_task(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> list[Task]:
    return db.query(Task).offset(skip).limit(limit).all()


def create_task(db: Session, task: schemas.TaskCreate) -> Task:
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task: schemas.TaskCreate) -> Task | None:
    db_task = get_task(db, task_id)
    if db_task:
        update_data = task.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> Task | None:
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task
