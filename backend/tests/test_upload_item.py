import pytest
from flask import Flask
from io import BytesIO
from unittest.mock import patch, MagicMock

from app.routes.upload_item import upload_bp

# dummy Flask application and client for testing
@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(upload_bp)

    app.config.update({
        'DB_HOST': 'localhost',
        'DB_NAME': 'test_db',
        'DB_USER': 'test_user',
        'DB_PASS': 'test_pass',
        'S3_KEY': 'fake_key',
        'S3_SECRET': 'fake_secret',
        'S3_REGION': 'us-east-1',
        'S3_BUCKET': 'fake_bucket'
    })

    with app.test_client() as client:
        with app.app_context():
            yield client

# test failed upload without images
@patch('app.routes.upload_item.connect_db')
def test_upload_item_fails_no_images(mock_connect_db, client):
    response = client.post('/items', data={
        'title': 'Jeans',
        'description': 'Blue jeans',
        'price': '30.00',
        'category': 'Clothing'
    })

    assert response.status_code == 400
    assert response.get_json() == {"error": "at least one image is required"}

    mock_connect_db.assert_not_called()

# test successful upload with images
@patch('app.routes.upload_item.connect_db')
@patch('app.routes.upload_item.upload_file_to_s3')
def test_upload_item_success_with_images(mock_upload_s3, mock_connect_db, client):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [99]
    
    mock_upload_s3.return_value = "https://fake_bucket.s3.amazonaws.com/99_test.jpg"

    fake_image = (BytesIO(b"fake image binary data"), 'test.jpg')

    response = client.post('/items', data={
        'title': 'Top',
        'description': 'A top',
        'price': '10.00',
        'category': 'Clothing',
        'images': fake_image
    }, content_type='multipart/form-data')

    assert response.status_code == 201
    assert response.get_json() == {"message": "product uploaded successfully", "item_id": 99}
    
    mock_upload_s3.assert_called_once()
    
    assert mock_cur.execute.call_count == 2
    mock_conn.commit.assert_called_once()

# test db crash resulting in rollback 
@patch('app.routes.upload_item.connect_db')
def test_create_item_db_error(mock_connect_db, client):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    
    mock_cur.execute.side_effect = Exception("Database connection lost!")

    fake_image = (BytesIO(b"fake image binary data"), 'test.jpg')

    response = client.post('/items', data={
        'title': 'Broken DB Test',
        'price': '5.00',
        'images': fake_image
    }, content_type='multipart/form-data')

    assert response.status_code == 500
    assert "error" in response.get_json()
    
    mock_conn.rollback.assert_called_once()
    mock_conn.commit.assert_not_called()
    
    mock_conn.close.assert_called_once()
