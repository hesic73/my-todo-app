from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .base import Base

from .user import create_user, get_user_by_id, get_user_by_username
from .task import create_task, get_task, get_tasks, try_update_task, try_delete_task

SQLALCHEMY_DATABASE_URL = "sqlite:///./my-todo-app.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


Base.metadata.create_all(bind=engine)
