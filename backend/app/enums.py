from enum import Enum


class UserType(Enum):
    COMMON = "common"
    ADMIN = "admin"


class TaskStatus(Enum):
    IN_PROGRESS = "in_progress"
    COMPLETE = "completed"
