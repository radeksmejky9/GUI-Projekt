import os
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from db.database import (
    get_session,
)
from db.db_init import init_db
from fastapi import Depends, FastAPI
from routers import special_workspaces, tasks, users, auth, workspace, workspace_users

app = FastAPI()
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(workspace.router)
app.include_router(tasks.router)
app.include_router(special_workspaces.router)
app.include_router(workspace_users.router)


# Split the environment variables into lists
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGIN", "*").split(",")
CORS_ALLOWED_METHODS = os.getenv(
    "CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,OPTIONS,PATCH"
).split(",")
CORS_ALLOWED_HEADERS = os.getenv("CORS_ALLOWED_HEADERS", "*").split(",")
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true") == "true"
CORS_MAX_AGE = int(os.getenv("CORS_MAX_AGE", "600"))

# Update the middleware setup to use the lists
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOWED_METHODS,
    allow_headers=CORS_ALLOWED_HEADERS,
    max_age=CORS_MAX_AGE,
)

db_dependency = Annotated[Session, Depends(get_session)]


init_db()
