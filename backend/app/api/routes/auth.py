from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm


from pydantic import BaseModel, EmailStr


from app.dependencies import DBDependency, TokenDependency, CurrentUser

from app import schemas
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.database.crud import get_user_by_email, get_user_by_username, create_user

from email_validator import validate_email, EmailNotValidError


router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login/access-token", response_model=schemas.Token)
async def login_access_token(
    db: DBDependency, login_request: LoginRequest
):

    db_user = await get_user_by_username(db, login_request.username)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")

    if not security.verify_password(login_request.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return schemas.Token(
        access_token=security.create_access_token(
            db_user.username, expires_delta=access_token_expires
        )
    )


@router.post("/login/test-token", response_model=schemas.User)
async def test_token(current_user: CurrentUser):
    return current_user


class RegisterRequest(BaseModel):
    username: str
    full_name: str
    email: EmailStr
    password: str


@router.post("/register", response_model=schemas.User)
async def register(register_request: RegisterRequest, db: DBDependency):
    try:
        valid = validate_email(register_request.email)
        register_request.email = valid.normalized  # Normalize the email
    except EmailNotValidError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid email: {str(e)}"
        )
    hashed_password = get_password_hash(register_request.password)

    user = await create_user(db=db, username=register_request.username,
                             full_name=register_request.full_name,
                             email=register_request.email,
                             hashed_password=hashed_password)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )

    return user
