import pytest
import botocore.exceptions
from flask import Flask
from io import BytesIO
from unittest.mock import patch, MagicMock

from app.routes.upload_item import upload_bp, upload_file_to_s3

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

# test successful upload closes db connection
@patch('app.routes.upload_item.connect_db')
@patch('app.routes.upload_item.upload_file_to_s3')
def test_upload_item_closes_db_on_success(mock_upload_s3, mock_connect_db, client):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [1]

    mock_upload_s3.return_value = "https://fake_bucket.s3.amazonaws.com/1_test.jpg"

    fake_image = (BytesIO(b"fake image binary data"), 'test.jpg')

    response = client.post('/items', data={
        'title': 'Hat',
        'description': 'A hat',
        'price': '5.00',
        'category': 'Accessories',
        'images': fake_image
    }, content_type='multipart/form-data')

    assert response.status_code == 201
    mock_conn.close.assert_called_once()

# test upload with multiple images inserts an image row for each
@patch('app.routes.upload_item.connect_db')
@patch('app.routes.upload_item.upload_file_to_s3')
def test_upload_item_multiple_images(mock_upload_s3, mock_connect_db, client):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [42]

    mock_upload_s3.side_effect = [
        "https://fake_bucket.s3.amazonaws.com/42_photo1.jpg",
        "https://fake_bucket.s3.amazonaws.com/42_photo2.jpg",
    ]

    fake_image_1 = (BytesIO(b"image data one"), 'photo1.jpg')
    fake_image_2 = (BytesIO(b"image data two"), 'photo2.jpg')

    response = client.post('/items', data={
        'title': 'Jacket',
        'description': 'A jacket',
        'price': '50.00',
        'category': 'Clothing',
        'images': [fake_image_1, fake_image_2]
    }, content_type='multipart/form-data')

    assert response.status_code == 201
    assert response.get_json() == {"message": "product uploaded successfully", "item_id": 42}

    assert mock_upload_s3.call_count == 2
    # 1 product insert + 2 image inserts
    assert mock_cur.execute.call_count == 3
    mock_conn.commit.assert_called_once()

# test that images with empty filenames are skipped
@patch('app.routes.upload_item.connect_db')
@patch('app.routes.upload_item.upload_file_to_s3')
def test_upload_item_skips_empty_filename(mock_upload_s3, mock_connect_db, client):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [7]

    mock_upload_s3.return_value = "https://fake_bucket.s3.amazonaws.com/7_real.jpg"

    real_image = (BytesIO(b"real image data"), 'real.jpg')
    empty_image = (BytesIO(b""), '')

    response = client.post('/items', data={
        'title': 'Scarf',
        'description': 'A scarf',
        'price': '12.00',
        'category': 'Accessories',
        'images': [real_image, empty_image]
    }, content_type='multipart/form-data')

    assert response.status_code == 201
    # only the real image should have triggered an s3 upload and image insert
    assert mock_upload_s3.call_count == 1
    # 1 product insert + 1 image insert (empty filename skipped)
    assert mock_cur.execute.call_count == 2

# test upload with missing required form fields still hits the db (no validation guard)
@patch('app.routes.upload_item.connect_db')
@patch('app.routes.upload_item.upload_file_to_s3')
def test_upload_item_missing_fields_no_validation(mock_upload_s3, mock_connect_db, client):
    mock_conn = mock_connect_db.return_value
    mock_cur = mock_conn.cursor.return_value
    mock_cur.fetchone.return_value = [55]

    mock_upload_s3.return_value = "https://fake_bucket.s3.amazonaws.com/55_test.jpg"

    fake_image = (BytesIO(b"fake image binary data"), 'test.jpg')

    # omit title, description, and category — only price provided
    response = client.post('/items', data={
        'price': '20.00',
        'images': fake_image
    }, content_type='multipart/form-data')

    # no input validation exists, so the route passes None values straight to the db
    # the mock db accepts them and returns 201 — this documents the missing validation
    assert response.status_code == 201
    insert_call_args = mock_cur.execute.call_args_list[0][0]
    inserted_values = insert_call_args[1]
    assert inserted_values[0] is None  # title is None
    assert inserted_values[1] is None  # description is None
    assert inserted_values[3] is None  # category is None


# upload_file_to_s3

# test successful s3 upload returns correctly formatted url
@patch('app.routes.upload_item.boto3.client')
def test_upload_file_to_s3_success(mock_boto_client, client):
    mock_s3 = mock_boto_client.return_value

    fake_file = MagicMock()
    fake_file.content_type = 'image/jpeg'

    url = upload_file_to_s3(fake_file, 'test.jpg')

    assert url == "https://fake_bucket.s3.us-east-1.amazonaws.com/test.jpg"
    mock_s3.upload_fileobj.assert_called_once_with(
        fake_file,
        'fake_bucket',
        'test.jpg',
        ExtraArgs={'ContentType': 'image/jpeg'}
    )

# test s3 upload returns none on BotoCoreError
@patch('app.routes.upload_item.boto3.client')
def test_upload_file_to_s3_botocore_error(mock_boto_client, client):
    mock_s3 = mock_boto_client.return_value
    mock_s3.upload_fileobj.side_effect = botocore.exceptions.BotoCoreError()

    fake_file = MagicMock()
    fake_file.content_type = 'image/jpeg'

    url = upload_file_to_s3(fake_file, 'test.jpg')

    assert url is None

# test s3 upload returns none on ClientError
@patch('app.routes.upload_item.boto3.client')
def test_upload_file_to_s3_client_error(mock_boto_client, client):
    mock_s3 = mock_boto_client.return_value
    mock_s3.upload_fileobj.side_effect = botocore.exceptions.ClientError(
        {'Error': {'Code': 'NoSuchBucket', 'Message': 'The bucket does not exist'}},
        'upload_fileobj'
    )

    fake_file = MagicMock()
    fake_file.content_type = 'image/jpeg'

    url = upload_file_to_s3(fake_file, 'test.jpg')

    assert url is None
