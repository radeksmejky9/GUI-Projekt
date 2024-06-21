from typing import Optional
from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    profile_picture_url: Optional[str]
