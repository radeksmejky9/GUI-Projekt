from typing import Union
from pydantic import BaseModel
class UserModel(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    profile_picture_url: Union[str, None]
