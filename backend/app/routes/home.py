from flask import Blueprint, request

home_bp = Blueprint("home", __name__)

a=1011

@home_bp.get("/")
def home():
    return "Second Hand Marketplace home page" 