import os
from fastapi import HTTPException
from sqlmodel import Session, create_engine
from sqlalchemy.exc import SQLAlchemyError

DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_DB = os.getenv("DATABASE_DB")

DATABASE_URL = (
    f"postgresql+psycopg2://{DATABASE_USER}:{DATABASE_PASSWORD}@postgres/{DATABASE_DB}"
)

engine = create_engine(DATABASE_URL)


def get_session():
    with Session(engine) as session:
        yield session


def commit_and_handle_exception(session: Session):
    try:
        session.commit()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error + " + str(e))


def refresh_and_handle_exception(session: Session, *objects):
    try:
        for obj in objects:
            session.refresh(obj)
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error")
