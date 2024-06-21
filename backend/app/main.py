import os
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from db.database import commit_and_handle_exception, get_session, refresh_and_handle_exception
from db.db_init import init_db
from db.schemas import Card, Task, Workspace
from fastapi import Depends, FastAPI
from routers import users, auth
from routers.auth import Token

app = FastAPI()
app.include_router(auth.router)
app.include_router(users.router)



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


@app.post("/createWorkspace", response_model=Workspace)
async def createWorkspace(token: str, session: db_dependency):
    user_token = Token.decode_access_token(token)
    if user_token:
        workspace = Workspace(
            name="My Workspace", 
            owner_id=user_token["user_id"]
        )
        session.add(workspace)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, workspace)
        return workspace
    
@app.post("/createCard/{workspace_id}", response_model=Card)
async def createCard(workspace_id: int, token: str, session: db_dependency):
    user_token = Token.decode_access_token(token)
    if user_token:
        card = Card(
            name="My Card", 
            workspace_id=workspace_id
        )
        session.add(card)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, card)
        return card
    
@app.post("/createTask/{workspace_id}/{card_id}", response_model=Task)
async def createTask(workspace_id: int, card_id: int, token: str, session: db_dependency):
    user_token = Token.decode_access_token(token)
    if user_token:
        task = Task(
            name="My Task", 
            workspace_id=workspace_id, 
            card_id=card_id
        )
        session.add(task)
        commit_and_handle_exception(session)
        refresh_and_handle_exception(session, task)
        return task

init_db()
