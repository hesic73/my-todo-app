from typing import Annotated, Optional, Dict

from fastapi import Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2,OAuth2PasswordBearer
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

# Define a new instance of OAuth2PasswordBearer for use in page requests
reusable_oauth2_optional = OAuth2PasswordBearer(
    tokenUrl="/api/login/access-token",
    auto_error=False
)

# Define a new TokenDependency using the new reusable_oauth2_optional
TokenDependencyOptional = Annotated[Optional[str], Depends(
    reusable_oauth2_optional)]


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


async def get_current_user_for_page(
        request: Request,
        token: TokenDependencyOptional,
        db: DBDependency
) -> Optional[schemas.User]:
    if not token:
        return None

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        return None

    user = await crud.get_user_by_username(db, token_data.sub)
    if not user:
        return None

    return user

CurrentUserForPage = Annotated[Optional[schemas.User], Depends(
    get_current_user_for_page)]


async def get_current_admin_user_for_page(
    request: Request,
    token: TokenDependencyOptional,
    db: DBDependency
) -> schemas.User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            detail="Redirecting to access denied",
            headers={"Location": request.url_for(
                "page:admin_access_denied").__str__()}
        )

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            detail="Redirecting to access denied",
            headers={"Location": request.url_for(
                "page:admin_access_denied").__str__()}
        )

    user = await crud.get_user_by_username(db, token_data.sub)
    if not user or user.user_type != UserType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            detail="Redirecting to access denied",
            headers={"Location": request.url_for(
                "page:admin_access_denied").__str__()}
        )

    return user

CurrentAdminUserForPage = Annotated[Optional[schemas.User], Depends(
    get_current_admin_user_for_page)]