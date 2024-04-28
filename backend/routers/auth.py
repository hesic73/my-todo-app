from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from database import user as user_crud
from dependencies import DBDependency
from schemas import Token, User

from passlib.context import CryptContext

from securities import create_access_token
from dependencies import CurrentUserDependency

from email_validator import validate_email, EmailNotValidError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


router = APIRouter(
    tags=["auth"])


@router.get("/verify-token", tags=["auth"], response_model=User)
async def verify_token(db: DBDependency, current_username: CurrentUserDependency):
    user = user_crud.get_user_by_username(db, username=current_username)
    return user


class LoginRequest(BaseModel):
    username: str  # This can be a username or an email
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: LoginRequest, db: DBDependency):
    # First, attempt to validate the input as an email
    try:
        validated_email = validate_email(form_data.username).email
        user = user_crud.get_user_by_email(db, email=validated_email)
    except EmailNotValidError:
        # If it's not a valid email, assume it's a username
        user = user_crud.get_user_by_username(db, username=form_data.username)

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=User)
async def register_user(form_data: RegisterRequest, db: DBDependency):
    try:
        valid = validate_email(form_data.email)
        form_data.email = valid.normalized  # Normalize the email
    except EmailNotValidError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid email: {str(e)}"
        )
    hashed_password = get_password_hash(form_data.password)
    user = user_crud.create_user(db=db, username=form_data.username, email=form_data.email,
                                 hashed_password=hashed_password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    return user
