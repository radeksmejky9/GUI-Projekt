from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import BIGINT, Column
from sqlalchemy.orm import relationship


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    username: str
    email: str
    password_hash: str
    first_name: str
    last_name: str
    profile_picture_url: Optional[str] = None

    workspace_users: List["WorkspaceUser"] = Relationship(back_populates="user")


class Workspace(SQLModel, table=True):
    __tablename__ = "workspaces"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    owner_id: int = Field(foreign_key="users.id")

    workspace_users: List["WorkspaceUser"] = Relationship(
        sa_relationship=relationship(
            "WorkspaceUser", cascade="all, delete", back_populates="workspace"
        )
    )
    tasks: List["Task"] = Relationship(
        sa_relationship=relationship(
            "Task", cascade="all, delete", back_populates="workspace"
        )
    )


class WorkspaceUser(SQLModel, table=True):
    __tablename__ = "workspace_users"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    workspace_id: int = Field(foreign_key="workspaces.id")
    user_id: int = Field(foreign_key="users.id")

    workspace: "Workspace" = Relationship(back_populates="workspace_users")
    user: "User" = Relationship(back_populates="workspace_users")


class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    order: Optional[int] = None
    card_name: str
    workspace_id: int = Field(foreign_key="workspaces.id")

    workspace: "Workspace" = Relationship(back_populates="tasks")
