from typing import List, Union
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import BIGINT, Column, String, ForeignKey, Boolean


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    username: str
    email: str
    password_hash: str
    first_name: str
    last_name: str
    profile_picture_url: Union[str, None]

    workspaces: List["Workspace"] = Relationship(back_populates="owner")
    workspace_users: List["WorkspaceUser"] = Relationship(back_populates="user")


class Workspace(SQLModel, table=True):
    __tablename__ = "workspaces"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    owner_id: int = Field(foreign_key="users.id")

    owner: "User" = Relationship(back_populates="workspaces")
    workspace_users: List["WorkspaceUser"] = Relationship(back_populates="workspace")
    cards: List["Card"] = Relationship(back_populates="workspace")


class WorkspaceUser(SQLModel, table=True):
    __tablename__ = "workspace_users"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    workspace_id: int = Field(foreign_key="workspaces.id")
    user_id: int = Field(foreign_key="users.id")
    role: str

    workspace: "Workspace" = Relationship(back_populates="workspace_users")
    user: "User" = Relationship(back_populates="workspace_users")


class Card(SQLModel, table=True):
    __tablename__ = "cards"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    workspace_id: int = Field(foreign_key="workspaces.id")
    due_date: Union[str, None]
    priority: Union[str, None]
    labels: Union[str, None]

    workspace: "Workspace" = Relationship(back_populates="cards")
    tasks: List["Task"] = Relationship(back_populates="card")


class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    description: Union[str, None]
    deadline: Union[str, None]
    start_date: Union[str, None]
    completion_status: Union[str, None]
    priority: Union[str, None]
    card_id: int = Field(foreign_key="cards.id")

    card: "Card" = Relationship(back_populates="tasks")

