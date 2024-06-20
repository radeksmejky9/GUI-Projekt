from fastapi import APIRouter, HTTPException
from app.schemas.task import TaskCreate, TaskUpdate
from app.models.task import Task
from app.services.task_service import TaskService

router = APIRouter()


@router.post("/", response_model=Task)
async def create_task(task: TaskCreate):
    return await TaskService.create_task(task)


@router.get("/{task_id}", response_model=Task)
async def read_task(task_id: int):
    task = await TaskService.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=Task)
async def update_task(task_id: int, task: TaskUpdate):
    return await TaskService.update_task(task_id, task)


@router.delete("/{task_id}", response_model=Task)
async def delete_task(task_id: int):
    return await TaskService.delete_task(task_id)
