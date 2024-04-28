from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship

from sqlalchemy.exc import IntegrityError

from .base import Base

import enum


class UserRole(enum.Enum):
    ADMIN = "admin"
    COMMON = "common"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)

    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.COMMON)

    tasks = relationship("Task", back_populates="user")


def create_user(db: Session, username: str, email: str, hashed_password: str) -> User | None:
    try:
        db_user = User(username=username, hashed_password=hashed_password, email=email)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        return None


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()
