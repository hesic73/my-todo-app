from pydantic import BaseModel
from datetime import datetime


class TaskBase(BaseModel):
    title: str
    content: str



class TaskCreate(TaskBase):
    pass


class Task(TaskBase):
    last_modified: datetime | None = None
    id: int
