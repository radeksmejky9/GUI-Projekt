from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User
from app.services.user_service import UserService

router = APIRouter()


@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    return await UserService.create_user(user)


@router.get("/{user_id}", response_model=User)
async def read_user(user_id: int):
    user = await UserService.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user: UserUpdate):
    return await UserService.update_user(user_id, user)


@router.delete("/{user_id}", response_model=User)
async def delete_user(user_id: int):
    return await UserService.delete_user(user_id)
