from datetime import datetime
from typing import Union
from pydantic import BaseModel


class WorkspaceModel(BaseModel):
    name: Union[str, None]


class CardModel(BaseModel):
    name: Union[str, None]
    order: Union[int, None]


class TaskModel(BaseModel):
    name: Union[str, None]
    description: Union[str, None]
    deadline: Union[datetime, None]
    start_date: Union[datetime, None]
    completion_date: Union[datetime, None]
    order: Union[int, None]
    card_id: int
