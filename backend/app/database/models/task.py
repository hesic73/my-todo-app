from sqlalchemy import Unicode
from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from datetime import datetime, UTC

from ..base import Base

from app.enums import TaskStatus


class Task(Base):
    __tablename__ = 'tasks'
    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Unicode(255))
    status: Mapped[TaskStatus]
    last_modified: Mapped[datetime] = mapped_column(
        default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE')
    )
    user: Mapped['User'] = relationship(  # type: ignore
        back_populates='tasks')

    def __repr__(self):
        return f'<Task id={self.id} content={self.content} status={self.status}>'