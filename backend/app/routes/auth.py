from flask import Flask, Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import jwt, cors
import psycopg2
import bcrypt

def connect_db():
    conn = psycopg2.connect(
        host=current_app.config['DB_HOST'],
        database=current_app.config['DB_NAME'],
        user=current_app.config['DB_USER'],
        password=current_app.config['DB_PASS']
    )
    return conn

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    conn = None
    try:
        data = request.get_json()
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if not email or not username or not password:
            return jsonify({"error": "Email, username, and password are required"}), 400
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        conn = connect_db()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO users (email_address, hashed_password, username) VALUES (%s, %s, %s) RETURNING user_id;",
            (email, password_hash, username)
        )

        new_user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()

        return jsonify({"message": "User registered successfully", "user_id": new_user_id}), 201
    except psycopg2.errors.UniqueViolation:
        if conn:
            conn.rollback()
        return jsonify({"error": "Email or username already exists"}), 409
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"error: {e}")
        return jsonify({"error": str(e)}), 500
    
    finally:
        if conn:
            conn.close()

@auth_bp.post("/login")
def login():
    conn = None
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        conn = connect_db()
        cur = conn.cursor()

        cur.execute("SELECT id, password_hash FROM users WHERE email = %s;", (email,))
        user = cur.fetchone()
        cur.close()

        if not user or not bcrypt.checkpw(password.encode("utf-8"), user[1].encode("utf-8")):
            return jsonify({"error": "Invalid credentials"}), 401
        
        token = create_access_token(identity=str(user[0]))
        return jsonify({"access_token": token}), 200
    
    except Exception as e:
        print(f"error: {e}")
        return jsonify({"error": str(e)}), 500
    
    finally:
        if conn:
            conn.close()
