from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from db.database import commit_and_handle_exception, get_session, refresh_and_handle_exception
from db.schemas import User
from models.user_model import UserModel
from models.token import Token, JWT_ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

db_dependency = Annotated[Session, Depends(get_session)]

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserModel, session: db_dependency):
    new_user = User(
        username=user.username.strip(),
        email=user.email,
        password_hash=bcrypt_context.hash(user.password),
        first_name=user.first_name,
        last_name=user.last_name,
        profile_picture_url=user.profile_picture_url,
    )

    session.add(new_user)
    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, new_user)
    return new_user



@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: db_dependency
):
    user = authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = Token.create_access_token(
        user.username, user.id, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


def authenticate_user(username: str, password: str, session: db_dependency):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.password_hash):
        return False
    return user
