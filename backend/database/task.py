from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from datetime import datetime

import schemas

from .base import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    last_modified = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship("User", back_populates="tasks")


def get_task(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[Task]:
    return db.query(Task).filter(Task.user_id == user_id).offset(skip).limit(limit).all()


def create_task(db: Session, task: schemas.TaskCreate, user_id: int) -> Task:
    kwargs = task.dict()
    kwargs['user_id'] = user_id
    db_task = Task(**kwargs)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def try_update_task(db: Session, task_id: int, task: schemas.TaskCreate, user_id: int) -> Task | None:
    db_task = get_task(db, task_id)
    if user_id != db_task.user_id:
        return None
    if db_task:
        update_data = task.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task


def try_delete_task(db: Session, task_id: int, user_id: int) -> Task | None:
    db_task = get_task(db, task_id)
    if user_id != db_task.user_id:
        return None
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task
