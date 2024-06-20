from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from db_init import init_db
from fastapi import FastAPI
import os

app = FastAPI()

ALLOWED_ORIGIN: list = (
    os.getenv("CORS_ALLOWED_ORIGIN", "http://localhost:8000")
    .replace(" ", "")
    .split(",")
)
ALLOWED_METHODS: list = (
    os.getenv("CORS_ALLOWED_METHODS", "GET, POST, PUT, DELETE, PATCH")
    .replace(" ", "")
    .split(",")
)
ALLOWED_HEADERS: list = (
    os.getenv("CORS_ALLOWED_HEADERS", "*").replace(" ", "").split(",")
)
ALLOW_CREDENTIALS: bool = os.getenv("CORS_ALLOW_CREDENTIALS", "TRUE") == "TRUE"
MAX_AGE: int = int(os.getenv("CORS_MAX_AGE", 600))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGIN,
    allow_credentials=ALLOW_CREDENTIALS,
    allow_methods=ALLOWED_METHODS,
    allow_headers=ALLOWED_HEADERS,
    max_age=MAX_AGE,
)

init_db()
