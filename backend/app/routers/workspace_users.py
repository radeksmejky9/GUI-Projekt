from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.schemas import User, Workspace, WorkspaceUser
from typing import Annotated, List
from models.token import Token
from db.database import (
    commit_and_handle_exception,
    get_session,
)

router = APIRouter(tags=["workspace_users"])
db_dependency = Annotated[Session, Depends(get_session)]


@router.get("/workspaces/{workspace_id}/users", response_model=List[User])
async def get_workspaceUsers(workspace_id: int, session: db_dependency):
    users = session.exec(
        select(User).join(WorkspaceUser).where(WorkspaceUser.workspace_id == workspace_id)
    ).all()
    return users


@router.post("/workspaces/{workspace_id}/users", response_model=List[User])
async def create_workspaceUsers(
    workspace_id: int,
    Users: List[User],
    session: Session = Depends(get_session),
):
    for user in Users:
        workspaceUser = WorkspaceUser(workspace_id=workspace_id, user_id=user.id)
        session.add(workspaceUser)
    commit_and_handle_exception(session)
    return Users


@router.delete("/workspaces/{workspace_id}/users")
async def delete_workspaceUser(
    workspace_id: int, session: Session = Depends(get_session)
):
    workspace = session.get(Workspace, workspace_id)

    if workspace:
        workspace_users = session.exec(
            select(WorkspaceUser).where(WorkspaceUser.workspace_id == workspace_id)
        ).all()
        if workspace_users:
            for workspace_user in workspace_users:
                session.delete(workspace_user)
        session.commit()
        return {"detail": "Users deleted from workspace successfully"}

    raise HTTPException(status_code=404, detail="Workspace not found") @ router.post(
        "/workspaces", response_model=Workspace
    )
