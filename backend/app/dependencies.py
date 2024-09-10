from typing import Annotated, Optional, Dict

from fastapi import Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2, OAuth2PasswordBearer
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel

from sqlalchemy.ext.asyncio import AsyncSession

import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError


from app.database.session import AsyncSessionLocal
from app.database import crud
from app.core.config import settings
from app import schemas
from app.core import security
from app.enums import UserType


async def get_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()

DBDependency = Annotated[AsyncSession, Depends(get_db)]


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/login/access-token"
)

TokenDependency = Annotated[str, Depends(reusable_oauth2)]


async def get_current_user(db: DBDependency, token: TokenDependency) -> schemas.User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = await crud.get_user_by_username(db, token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user


CurrentUser = Annotated[schemas.User, Depends(get_current_user)]


async def get_current_admin_user(
    current_user: CurrentUser
) -> schemas.User:
    if current_user.user_type != UserType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user

CurrentAdminUser = Annotated[schemas.User, Depends(get_current_admin_user)]
