from typing import Annotated, List, Union
from fastapi.middleware.cors import CORSMiddleware
from db_init import init_db
from fastapi import FastAPI, Depends, HTTPException
import os
from sqlmodel import Session, select
from models import User
from db import (
    get_session,
    engine,
    commit_and_handle_exception,
    refresh_and_handle_exception,
)

app = FastAPI()


ALLOWED_ORIGIN: list = (
    os.getenv("CORS_ALLOWED_ORIGIN", "http://localhost:8000")
    .replace(" ", "")
    .split(",")
)
ALLOWED_METHODS: list = (
    os.getenv("CORS_ALLOWED_METHODS", "GET, POST, PUT, DELETE, PATCH")
    .replace(" ", "")
    .split(",")
)
ALLOWED_HEADERS: list = (
    os.getenv("CORS_ALLOWED_HEADERS", "*").replace(" ", "").split(",")
)
ALLOW_CREDENTIALS: bool = os.getenv("CORS_ALLOW_CREDENTIALS", "TRUE") == "TRUE"
MAX_AGE: int = int(os.getenv("CORS_MAX_AGE", 600))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGIN,
    allow_credentials=ALLOW_CREDENTIALS,
    allow_methods=ALLOWED_METHODS,
    allow_headers=ALLOWED_HEADERS,
    max_age=MAX_AGE,
)

db_dependency = Annotated[Session, Depends(get_session)]

@app.post("/addUser", response_model=User)
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

@app.get("/getUsers", response_model=List[User])
def get_users(session: db_dependency):
    users = session.exec(select(User)).all()
    return users

@app.get("/")
def root():
    return {"message": "Hello World"}

init_db()
