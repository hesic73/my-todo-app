from pydantic import BaseModel
from datetime import datetime

from app.enums import TaskStatus


class TaskBase(BaseModel):
    content: str


class TaskCreate(TaskBase):
    pass


class Task(TaskBase):
    status: TaskStatus
    last_modified: datetime | None = None
    id: int
