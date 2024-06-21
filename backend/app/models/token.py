import os
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from pydantic import BaseModel
from jose import jwt, JWTError

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
)
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)
JWT_REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "30"))


class Token(BaseModel):
    access_token: str
    token_type: str
    
    @staticmethod
    def create_access_token(username: str, user_id: int, expires_delta: timedelta):
        encode = {"sub": username, "id": user_id}
        expire = datetime.now(timezone.utc) + expires_delta
        encode.update({"exp": expire})
        return jwt.encode(encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

    @staticmethod
    def decode_access_token(token: str):
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            username: str = payload.get("sub")
            user_id: int = payload.get("id")
            if username is None or user_id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
            return {"username": username, "user_id": user_id}
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")