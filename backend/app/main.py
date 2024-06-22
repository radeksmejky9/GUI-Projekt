import os
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from db.database import (
    commit_and_handle_exception,
    get_session,
    refresh_and_handle_exception,
)
from db.db_init import init_db
from db.schemas import Card, Task, Workspace
from fastapi import Depends, FastAPI
from routers import users, auth, workspace
from routers.auth import Token

app = FastAPI()
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(workspace.router)


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


init_db()
