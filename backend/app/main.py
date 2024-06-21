from typing import Annotated, List, Union
from fastapi.middleware.cors import CORSMiddleware
from schemas import CreateUserRequest
from db_init import init_db
from fastapi import FastAPI, Depends, HTTPException
import os
from sqlmodel import Session, select
from models import User
from passlib.context import CryptContext
import auth

from db import (
    get_session,
    engine,
    commit_and_handle_exception,
    refresh_and_handle_exception,
)

app = FastAPI()
app.include_router(auth.router)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

CORS_ALLOWED_ORIGIN = os.getenv("CORS_ALLOWED_ORIGIN", "*")
CORS_ALLOWED_METHODS = os.getenv(
    "CORS_ALLOWED_METHODS", "GET, POST, PUT, DELETE, PATCH"
)
CORS_ALLOWED_HEADERS = os.getenv("CORS_ALLOWED_HEADERS", "*")
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true") == "true"
CORS_MAX_AGE = int(os.getenv("CORS_MAX_AGE", "600"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGIN,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOWED_METHODS,
    allow_headers=CORS_ALLOWED_HEADERS,
    max_age=CORS_MAX_AGE,
)

db_dependency = Annotated[Session, Depends(get_session)]


@app.get("/getUsers", response_model=List[User])
async def get_users(session: db_dependency):
    users = session.exec(select(User)).all()
    return users


@app.get("/")
async def root():
    return {"message": "Hello World"}


init_db()
