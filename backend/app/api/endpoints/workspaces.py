from fastapi import APIRouter, HTTPException
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate
from app.models.workspace import Workspace
from app.services.workspace_service import WorkspaceService

router = APIRouter()


@router.post("/", response_model=Workspace)
async def create_workspace(workspace: WorkspaceCreate):
    return await WorkspaceService.create_workspace(workspace)


@router.get("/{workspace_id}", response_model=Workspace)
async def read_workspace(workspace_id: int):
    workspace = await WorkspaceService.get_workspace(workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.put("/{workspace_id}", response_model=Workspace)
async def update_workspace(workspace_id: int, workspace: WorkspaceUpdate):
    return await WorkspaceService.update_workspace(workspace_id, workspace)


@router.delete("/{workspace_id}", response_model=Workspace)
async def delete_workspace(workspace_id: int):
    return await WorkspaceService.delete_workspace(workspace_id)
