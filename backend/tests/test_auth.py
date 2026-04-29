import pytest
import psycopg2
from flask import Flask
from flask_jwt_extended import create_access_token
from unittest.mock import patch, MagicMock

from app.routes.auth import auth_bp
from app.extensions import jwt

# dummy Flask application and client for testing
@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(auth_bp)

    app.config.update({
        'DB_HOST': 'localhost',
        'DB_NAME': 'test_db',
        'DB_USER': 'test_user',
        'DB_PASS': 'test_pass',
        'JWT_SECRET_KEY': 'test-secret-key-that-is-long-enough-for-hmac'
    })

    jwt.init_app(app)

    with app.test_client() as client:
        with app.app_context():
            yield client

# helper to generate a valid JWT token inside the app context
@pytest.fixture
def auth_header(client):
    with client.application.app_context():
        token = create_access_token(identity="1")
    return {"Authorization": f"Bearer {token}"}


# POST /register

# test successful registration returns 201 with user_id
@patch('app.routes.auth.connect_db')
@patch('app.routes.auth.bcrypt.hashpw')
def test_register_success(mock_hashpw, mock_connect_db, client):
    mock_hashpw.return_value = b'hashed_password'

    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [10]

    response = client.post('/register', json={
        'email': 'user@example.com',
        'username': 'user1',
        'password': 'password123'
    })

    assert response.status_code == 201
    assert response.get_json() == {"message": "User registered successfully", "user_id": 10}
    mock_conn.commit.assert_called_once()

# test register fails when email is missing
@patch('app.routes.auth.connect_db')
def test_register_missing_email(mock_connect_db, client):
    response = client.post('/register', json={
        'username': 'user1',
        'password': 'password123'
    })

    assert response.status_code == 400
    assert response.get_json() == {"error": "Email, username, and password are required"}
    mock_connect_db.assert_not_called()

# test register fails when username is missing
@patch('app.routes.auth.connect_db')
def test_register_missing_username(mock_connect_db, client):
    response = client.post('/register', json={
        'email': 'user@example.com',
        'password': 'password123'
    })

    assert response.status_code == 400
    assert response.get_json() == {"error": "Email, username, and password are required"}
    mock_connect_db.assert_not_called()

# test register fails when password is missing
@patch('app.routes.auth.connect_db')
def test_register_missing_password(mock_connect_db, client):
    response = client.post('/register', json={
        'email': 'user@example.com',
        'username': 'user1'
    })

    assert response.status_code == 400
    assert response.get_json() == {"error": "Email, username, and password are required"}
    mock_connect_db.assert_not_called()

# test register fails when all fields are missing
@patch('app.routes.auth.connect_db')
def test_register_missing_all_fields(mock_connect_db, client):
    response = client.post('/register', json={})

    assert response.status_code == 400
    assert response.get_json() == {"error": "Email, username, and password are required"}
    mock_connect_db.assert_not_called()

# test register fails with 409 when email or username already exists
@patch('app.routes.auth.connect_db')
@patch('app.routes.auth.bcrypt.hashpw')
def test_register_duplicate_user(mock_hashpw, mock_connect_db, client):
    mock_hashpw.return_value = b'hashed_password'

    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.execute.side_effect = psycopg2.errors.UniqueViolation("duplicate key value")

    response = client.post('/register', json={
        'email': 'existing@example.com',
        'username': 'existing_user',
        'password': 'password123'
    })

    assert response.status_code == 409
    assert response.get_json() == {"error": "Email or username already exists"}
    mock_conn.rollback.assert_called_once()
    mock_conn.commit.assert_not_called()

# test register db error results in rollback and 500
@patch('app.routes.auth.connect_db')
@patch('app.routes.auth.bcrypt.hashpw')
def test_register_db_error(mock_hashpw, mock_connect_db, client):
    mock_hashpw.return_value = b'hashed_password'

    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.execute.side_effect = Exception("Database error")

    response = client.post('/register', json={
        'email': 'user@example.com',
        'username': 'user1',
        'password': 'password123'
    })

    assert response.status_code == 500
    assert "error" in response.get_json()
    mock_conn.rollback.assert_called_once()
    mock_conn.commit.assert_not_called()

# test register closes db connection on success
@patch('app.routes.auth.connect_db')
@patch('app.routes.auth.bcrypt.hashpw')
def test_register_closes_db_on_success(mock_hashpw, mock_connect_db, client):
    mock_hashpw.return_value = b'hashed_password'

    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [10]

    client.post('/register', json={
        'email': 'user@example.com',
        'username': 'user1',
        'password': 'password123'
    })

    mock_conn.close.assert_called_once()

# test register closes db connection on unique violation
@patch('app.routes.auth.connect_db')
@patch('app.routes.auth.bcrypt.hashpw')
def test_register_closes_db_on_unique_violation(mock_hashpw, mock_connect_db, client):
    mock_hashpw.return_value = b'hashed_password'

    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.execute.side_effect = psycopg2.errors.UniqueViolation("duplicate key value")

    client.post('/register', json={
        'email': 'existing@example.com',
        'username': 'existing_user',
        'password': 'password123'
    })

    mock_conn.close.assert_called_once()


# POST /login

# test successful login returns 200 with access token
@patch('app.routes.auth.connect_db')
@patch('app.routes.auth.bcrypt.checkpw')
def test_login_success(mock_checkpw, mock_connect_db, client):
    mock_checkpw.return_value = True

    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [1, 'hashed_password']

    response = client.post('/login', json={
        'email': 'user@example.com',
        'password': 'password123'
    })

    assert response.status_code == 200
    assert "access_token" in response.get_json()

# test login fails when email is missing
@patch('app.routes.auth.connect_db')
def test_login_missing_email(mock_connect_db, client):
    response = client.post('/login', json={
        'password': 'password123'
    })

    assert response.status_code == 400
    assert response.get_json() == {"error": "Email and password are required"}
    mock_connect_db.assert_not_called()

# test login fails when password is missing
@patch('app.routes.auth.connect_db')
def test_login_missing_password(mock_connect_db, client):
    response = client.post('/login', json={
        'email': 'user@example.com'
    })

    assert response.status_code == 400
    assert response.get_json() == {"error": "Email and password are required"}
    mock_connect_db.assert_not_called()

# test login fails with 401 when user is not found
@patch('app.routes.auth.connect_db')
def test_login_user_not_found(mock_connect_db, client):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = None

    response = client.post('/login', json={
        'email': 'nobody@example.com',
        'password': 'password123'
    })

    assert response.status_code == 401
    assert response.get_json() == {"error": "Invalid credentials"}

# test login fails with 401 when password is wrong
@patch('app.routes.auth.connect_db')
@patch('app.routes.auth.bcrypt.checkpw')
def test_login_wrong_password(mock_checkpw, mock_connect_db, client):
    mock_checkpw.return_value = False

    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [1, 'hashed_password']

    response = client.post('/login', json={
        'email': 'user@example.com',
        'password': 'wrongpassword'
    })

    assert response.status_code == 401
    assert response.get_json() == {"error": "Invalid credentials"}

# test login db error returns 500
@patch('app.routes.auth.connect_db')
def test_login_db_error(mock_connect_db, client):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.execute.side_effect = Exception("Database error")

    response = client.post('/login', json={
        'email': 'user@example.com',
        'password': 'password123'
    })

    assert response.status_code == 500
    assert "error" in response.get_json()

# test login closes db connection on success
@patch('app.routes.auth.connect_db')
@patch('app.routes.auth.bcrypt.checkpw')
def test_login_closes_db_on_success(mock_checkpw, mock_connect_db, client):
    mock_checkpw.return_value = True

    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [1, 'hashed_password']

    client.post('/login', json={
        'email': 'user@example.com',
        'password': 'password123'
    })

    mock_conn.close.assert_called_once()


# GET /me

# test me returns 200 with username and email when user is found
@patch('app.routes.auth.connect_db')
def test_me_success(mock_connect_db, client, auth_header):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = ('user1', 'user@example.com')

    response = client.get('/me', headers=auth_header)

    assert response.status_code == 200
    assert response.get_json() == {"username": "user1", "email": "user@example.com"}

# test me returns 404 when user is not found in db
@patch('app.routes.auth.connect_db')
def test_me_user_not_found(mock_connect_db, client, auth_header):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = None

    response = client.get('/me', headers=auth_header)

    assert response.status_code == 404
    assert response.get_json() == {"error": "User not found"}

# test me db error returns 500
@patch('app.routes.auth.connect_db')
def test_me_db_error(mock_connect_db, client, auth_header):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.execute.side_effect = Exception("Database error")

    response = client.get('/me', headers=auth_header)

    assert response.status_code == 500
    assert "error" in response.get_json()

# test me returns 401 when no jwt token is provided
def test_me_no_token(client):
    response = client.get('/me')

    assert response.status_code == 401

# test me closes db connection on success
@patch('app.routes.auth.connect_db')
def test_me_closes_db_on_success(mock_connect_db, client, auth_header):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = ('user1', 'user@example.com')

    client.get('/me', headers=auth_header)

    mock_conn.close.assert_called_once()
