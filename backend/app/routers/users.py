from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select
from db.schemas import User
from typing import Annotated, List
from db.database import (
    commit_and_handle_exception,
    get_session,
    refresh_and_handle_exception,
)
from models.user_model import UserModel
from passlib.context import CryptContext

router = APIRouter(tags=["users"])
db_dependency = Annotated[Session, Depends(get_session)]
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/users", status_code=status.HTTP_201_CREATED)
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


@router.get("/users", response_model=List[User])
async def get_users(session: db_dependency):
    users = session.exec(select(User)).all()
    return users


@router.get("/users/{user_id}", response_model=User)
def get_user(user_id: int, session: db_dependency):
    return session.get(User, user_id)
