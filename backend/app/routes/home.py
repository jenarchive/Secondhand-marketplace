from flask import Blueprint, request

home_bp = Blueprint("home", __name__)

@home_bp.get("/")
def home():
    return "Second Hand Marketplace home page"