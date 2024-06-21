from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.schemas import User
from typing import Annotated, List
from db.database import commit_and_handle_exception, get_session, refresh_and_handle_exception

router = APIRouter(tags=["users"])
db_dependency = Annotated[Session, Depends(get_session)]

@router.post("/addUser", response_model=User)
def create_user(session: db_dependency):

    new_user = User(
        username="user_create.name.strip(),",
        email="asdasd",
        password_hash="asdasd",
        first_name="asdasd",
        last_name="asdasd",
        profile_picture_url="asdasd",
    )

    session.add(new_user)
    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, new_user)
    return new_user

@router.get("/getUsers", response_model=List[User])
async def get_users(session: db_dependency):
    users = session.exec(select(User)).all()
    return users

@router.get("/getUser/{user_id}", response_model=User)
def read_user(user_id: int, session: db_dependency):
    return session.get(User, user_id)