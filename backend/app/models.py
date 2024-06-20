from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import BIGINT, Column, String, ForeignKey, Boolean


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    username: str = Field(sa_column=Column(String, unique=True))
    email: str = Field(sa_column=Column(String, unique=True))
    password_hash: str = Field(sa_column=Column(String))
    first_name: str
    last_name: str
    profile_picture_url: Optional[str]

    workspaces: List["Workspace"] = Relationship(back_populates="owner")
    workspace_users: List["WorkspaceUser"] = Relationship(back_populates="user")
    sent_invitations: List["Invitation"] = Relationship(back_populates="sender")
    received_invitations: List["Invitation"] = Relationship(back_populates="recipient")


class Workspace(SQLModel, table=True):
    __tablename__ = "workspaces"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str = Field(sa_column=Column(String))
    owner_id: int = Field(sa_column=Column(BIGINT, ForeignKey("users.id")))

    owner: "User" = Relationship(back_populates="workspaces")
    workspace_users: List["WorkspaceUser"] = Relationship(back_populates="workspace")
    cards: List["Card"] = Relationship(back_populates="workspace")


class WorkspaceUser(SQLModel, table=True):
    __tablename__ = "workspace_users"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    workspace_id: int = Field(sa_column=Column(BIGINT, ForeignKey("workspaces.id")))
    user_id: int = Field(sa_column=Column(BIGINT, ForeignKey("users.id")))
    role: str = Field(sa_column=Column(String))

    workspace: "Workspace" = Relationship(back_populates="workspace_users")
    user: "User" = Relationship(back_populates="workspace_users")


class Card(SQLModel, table=True):
    __tablename__ = "cards"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str = Field(sa_column=Column(String))
    workspace_id: int = Field(sa_column=Column(BIGINT, ForeignKey("workspaces.id")))
    due_date: Optional[str]
    priority: Optional[str]
    labels: Optional[str]

    workspace: "Workspace" = Relationship(back_populates="cards")
    tasks: List["Task"] = Relationship(back_populates="card")


class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    name: str = Field(sa_column=Column(String))
    description: Optional[str]
    deadline: Optional[str]
    start_date: Optional[str]
    completion_status: Optional[bool]
    priority: Optional[str]
    card_id: int = Field(sa_column=Column(BIGINT, ForeignKey("cards.id")))

    card: "Card" = Relationship(back_populates="tasks")


class Invitation(SQLModel, table=True):
    __tablename__ = "invitations"
    id: int = Field(sa_column=Column(BIGINT, primary_key=True, autoincrement=True))
    sender_id: int = Field(sa_column=Column(BIGINT, ForeignKey("users.id")))
    recipient_id: int = Field(sa_column=Column(BIGINT, ForeignKey("users.id")))
    status: str = Field(sa_column=Column(String))

    sender: "User" = Relationship(back_populates="sent_invitations")
    recipient: "User" = Relationship(back_populates="received_invitations")
