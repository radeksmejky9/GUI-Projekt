import re
from typing import Union
from pydantic import BaseModel, ConfigDict, Field, field_validator, EmailStr
from email_validator import validate_email, EmailNotValidError
from pydantic_core.core_schema import FieldValidationInfo


class UserModel(BaseModel):
   model_config=ConfigDict(from_attributes=True)

   id: int
   username: str
   email: EmailStr
   password_hash: str
   first_name: str
   last_name: str
   profile_picture_url: Union[str, None]


   @property
   def name(self):
      return f"{self.first_name} {self.last_name}"
