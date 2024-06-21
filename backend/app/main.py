import os
from fastapi.middleware.cors import CORSMiddleware
from db.db_init import init_db
from fastapi import FastAPI
from routers import users, auth

app = FastAPI()
app.include_router(auth.router)
app.include_router(users.router)

CORS_ALLOWED_ORIGIN = os.getenv("CORS_ALLOWED_ORIGIN", "*")
CORS_ALLOWED_METHODS = os.getenv(
    "CORS_ALLOWED_METHODS", "GET, POST, PUT, DELETE, PATCH"
)
CORS_ALLOWED_HEADERS = os.getenv("CORS_ALLOWED_HEADERS", "*")
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true") == "true"
CORS_MAX_AGE = int(os.getenv("CORS_MAX_AGE", "600"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGIN,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOWED_METHODS,
    allow_headers=CORS_ALLOWED_HEADERS,
    max_age=CORS_MAX_AGE,
)

init_db()
