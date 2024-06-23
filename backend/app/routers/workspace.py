from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.schemas import Task, User, Workspace, WorkspaceUser
from typing import Annotated, List
from models.token import Token
from db.database import (
    commit_and_handle_exception,
    refresh_and_handle_exception,
    get_session,
)
from models.workspace_model import (
    WorkspaceModel,
)

router = APIRouter(tags=["workspaces"])
db_dependency = Annotated[Session, Depends(get_session)]


@router.get("/workspaces/{workspace_id}", response_model=Workspace)
async def get_workspace(workspace_id: int, session: Session = Depends(get_session)):
    workspace = session.get(Workspace, workspace_id)
    return workspace


@router.get("/workspaces/{workspace_id}/tasks", response_model=List[Task])
async def get_tasks_in_workspace(
    workspace_id: int, session: Session = Depends(get_session)
):
    tasks = session.exec(select(Task).where(Task.workspace_id == workspace_id)).all()
    return tasks


@router.put("/workspaces/{workspace_id}", response_model=Workspace)
async def update_workspace(
    workspace_id: int,
    workspace_update: WorkspaceModel,
    session: Session = Depends(get_session),
):
    workspace = session.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    if workspace_update.name is not None:
        workspace.name = workspace_update.name

    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, workspace)
    return workspace


@router.delete("/workspaces/{workspace_id}")
async def delete_workspace(workspace_id: int, session: Session = Depends(get_session)):
    workspace = session.get(Workspace, workspace_id)

    if workspace:
        session.delete(workspace)
        commit_and_handle_exception(session)
        return {
            "detail": "Workspace and its related cards and tasks deleted successfully"
        }

    raise HTTPException(status_code=404, detail="Workspace not found")


async def create_workspace(
    workspace: WorkspaceModel, token: str, session: Session = Depends(get_session)
):
    workspace = Workspace(
        name=workspace.name,
        owner_id=Token.decode_access_token(token)["user_id"],
    )
    session.add(workspace)
    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, workspace)
    return workspace
