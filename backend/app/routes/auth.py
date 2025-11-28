from flask import Blueprint, request

auth_bp = Blueprint("auth", __name__)

@auth_bp.get("/signup")
def register():
    return "Sign up page"

@auth_bp.get("/login")
def login():
    return "Login page"