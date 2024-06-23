from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.schemas import Workspace, WorkspaceUser
from typing import Annotated, List
from models.token import Token
from db.database import (
    get_session,
)

router = APIRouter(tags=["special_workspaces"])
db_dependency = Annotated[Session, Depends(get_session)]


@router.get("/workspaces/ownedworkspaces", response_model=List[Workspace])
async def get_owned_workspaces(token: str, session: Session = Depends(get_session)):
    user_id = Token.decode_access_token(token)["user_id"]
    result = session.exec(select(Workspace).where(Workspace.owner_id == user_id)).all()
    return result


@router.get("/workspaces/memberworkspaces", response_model=List[Workspace])
async def get_member_workspaces(token: str, session: Session = Depends(get_session)):
    user_id = Token.decode_access_token(token)["user_id"]
    result = session.exec(
        select(Workspace)
        .join(WorkspaceUser, Workspace.id == WorkspaceUser.workspace_id)
        .where(WorkspaceUser.user_id == user_id)
    ).all()
    return result
