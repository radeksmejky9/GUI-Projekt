from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db.schemas import Card, Task, User, Workspace
from typing import Annotated, List
from models.token import Token
from db.database import (
    commit_and_handle_exception,
    refresh_and_handle_exception,
    get_session,
)
from models.workspace_model import TaskUpdateModel, WorkspaceModel, CardModel, TaskModel

router = APIRouter(tags=["workspaces"])
db_dependency = Annotated[Session, Depends(get_session)]


@router.post("/workspaces/{token}", response_model=Workspace)
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


@router.get("/token/{token}/workspaces", response_model=List[Workspace])
async def get_workspaces(token: str, session: Session = Depends(get_session)):
    user_id = Token.decode_access_token(token)["user_id"]
    workspaces = session.query(Workspace).filter_by(owner_id=user_id).all()
    return workspaces


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


@router.get("/workspaces/{workspace_id}", response_model=Workspace)
async def get_workspace(workspace_id: int, session: Session = Depends(get_session)):
    workspace = session.get(Workspace, workspace_id)
    return workspace


@router.post("/workspaces/{workspace_id}/cards", response_model=Card)
async def create_card(
    card: CardModel, workspace_id: int, session: Session = Depends(get_session)
):
    card = Card(
        name=card.name,
        workspace_id=workspace_id,
        order=card.order,
    )
    session.add(card)
    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, card)
    return card


@router.get("/workspaces/{workspace_id}/cards", response_model=List[Card])
async def get_cards_in_workspace(
    workspace_id: int, session: Session = Depends(get_session)
):
    cards = session.exec(select(Card).where(Card.workspace_id == workspace_id)).all()
    return cards


@router.put("/cards/{card_id}", response_model=Card)
async def update_card(
    card_id: int, card_update: CardModel, session: Session = Depends(get_session)
):
    card = session.get(Card, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    if card_update.name is not None:
        card.name = card_update.name
    if card_update.order is not None:
        card.order = card_update.order

    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, card)
    return card


@router.post("/cards/{card_id}/tasks", response_model=Task)
async def create_task(
    card_id: int, task: TaskModel, session: Session = Depends(get_session)
):
    task = Task(
        name=task.name,
        description=task.description,
        deadline=task.deadline,
        start_date=task.start_date,
        completion_date=task.completion_date,
        order=task.order,
        card_id=card_id,
    )
    session.add(task)
    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, task)
    return task


@router.get("/cards/{card_id}/tasks", response_model=List[Task])
async def get_tasks_in_card(card_id: int, session: Session = Depends(get_session)):
    tasks = session.exec(select(Task).where(Task.card_id == card_id)).all()
    return tasks


@router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: int, task_update: TaskUpdateModel, session: Session = Depends(get_session)
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_update.name is not None:
        task.name = task_update.name
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.deadline is not None:
        task.deadline = task_update.deadline
    if task_update.start_date is not None:
        task.start_date = task_update.start_date
    if task_update.completion_date is None:
        task.completion_date = ""
    else:
        task.completion_date = task_update.completion_date
    if task_update.order is not None:
        task.order = task_update.order
    if task_update.card_id is not None:
        task.card_id = task_update.card_id

    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, task)
    return task


@router.get("/workspaces/{workspace_id}/tasks", response_model=List[Task])
async def get_tasks_in_workspace(
    workspace_id: int, session: Session = Depends(get_session)
):
    tasks = session.exec(
        select(Task).join(Card).where(Card.workspace_id == workspace_id)
    ).all()
    return tasks
