from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

import database

DBDependency = Annotated[Session, Depends(database.get_db)]
