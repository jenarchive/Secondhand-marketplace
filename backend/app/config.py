import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev")

    # database config
    DB_HOST = os.getenv('DB_HOST')
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASS = os.getenv('DB_PASS')

    # S3 config
    S3_BUCKET = os.getenv('S3_BUCKET_NAME')
    S3_KEY = os.getenv('AWS_ACCESS_KEY_ID')
    S3_SECRET = os.getenv('AWS_SECRET_ACCESS_KEY')
    S3_REGION = os.getenv('AWS_REGION')
