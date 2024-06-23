from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.schemas import Task
from typing import Annotated, List
from db.database import (
    commit_and_handle_exception,
    refresh_and_handle_exception,
    get_session,
)
from models.workspace_model import (
    TaskUpdateModel,
    TaskModel,
)

router = APIRouter(tags=["tasks"])
db_dependency = Annotated[Session, Depends(get_session)]


@router.get("/workspaces/{workspace_id}/tasks", response_model=List[Task])
async def get_tasks_in_workspace(
    workspace_id: int, session: Session = Depends(get_session)
):
    tasks = session.exec(select(Task).where(Task.workspace_id == workspace_id)).all()
    for task in tasks:
        print(task.start_date)
    return tasks


@router.post("/tasks", response_model=Task)
async def create_task(task: TaskModel, session: Session = Depends(get_session)):
    task = Task(
        name=task.name,
        description=task.description,
        start_date=task.start_date,
        completion_date=task.completion_date,
        deadline=task.deadline,
        card_name=task.card_name,
        workspace_id=task.workspace_id,
        order=task.order,
    )
    session.add(task)
    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, task)
    return task


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

    if task_update.start_date is not None:
        task.start_date = task_update.start_date

    if task_update.completion_date is None:
        task.completion_date = ""
    else:
        task.completion_date = task_update.completion_date

    if task_update.deadline is not None:
        task.deadline = task_update.deadline

    if task_update.card_name is not None:
        task.card_name = task_update.card_name

    if task_update.order is not None:
        task.order = task_update.order

    commit_and_handle_exception(session)
    refresh_and_handle_exception(session, task)
    return task


@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if task:
        session.delete(task)
        commit_and_handle_exception(session)
        return {"detail": "Task deleted successfully"}
    return {"detail": "Task not found"}
