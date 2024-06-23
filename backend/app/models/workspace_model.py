from datetime import datetime
from typing import Union
from pydantic import BaseModel


class WorkspaceModel(BaseModel):
    name: Union[str, None]


class TaskModel(BaseModel):
    name: Union[str, None]
    description: Union[str, None]
    start_date: Union[datetime, None]
    completion_date: Union[datetime, None]
    deadline: Union[datetime, None]
    card_name: Union[str, None]
    order: Union[int, None]
    workspace_id: Union[int, None]


class TaskUpdateModel(BaseModel):
    name: Union[str, None]
    description: Union[str, None]
    start_date: Union[str, None]
    completion_date: Union[datetime, None]
    deadline: Union[datetime, None]
    card_name: Union[str, None]
    order: Union[int, None]
