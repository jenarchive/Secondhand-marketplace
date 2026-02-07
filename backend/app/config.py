import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev")

    IMAGE_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads')

    DB_HOST = "localhost"
    DB_NAME = "name"
    DB_USER = "username"
    DB_PASS = "passowrd"
