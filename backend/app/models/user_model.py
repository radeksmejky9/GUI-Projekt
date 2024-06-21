import re
from typing import Union
from pydantic import BaseModel, ConfigDict, Field, field_validator, EmailStr
from email_validator import validate_email, EmailNotValidError
from pydantic_core.core_schema import FieldValidationInfo


class UserModel(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    profile_picture_url: Union[str, None]
