from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

import database
import securities

DBDependency = Annotated[Session, Depends(database.get_db)]

CurrentUserDependency = Annotated[str, Depends(securities.get_current_user)]
