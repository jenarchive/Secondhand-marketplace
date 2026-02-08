import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev")

    # path to where images are stored
    IMAGE_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'images')
    
    # db info
    DB_HOST = "localhost"
    DB_NAME = "test_db"
    DB_USER = "alex"
    DB_PASS = "passowrd"
