from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from database import user as user_crud
from dependencies import DBDependency
from schemas import Token, User

from passlib.context import CryptContext

from securities import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    return pwd_context.hash(password)


router = APIRouter(
    tags=["auth"])


@router.post("/token", response_model=Token)
async def login_for_access_token(db: DBDependency, form_data: OAuth2PasswordRequestForm = Depends()):
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
def register_user(username: str, password: str, db: DBDependency):
    hashed_password = get_password_hash(password)
    user = user_crud.create_user(db=db, username=username, hashed_password=hashed_password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    return user
