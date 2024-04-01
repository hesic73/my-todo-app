from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .base import Base
from .task import create_task, get_task, get_tasks, update_task, delete_task

SQLALCHEMY_DATABASE_URL = "sqlite:///./my-todo-app.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


Base.metadata.create_all(bind=engine)
