from flask import Blueprint, request, jsonify, current_app
import os
import psycopg2
import boto3
from werkzeug.utils import secure_filename

upload_bp = Blueprint('upload_item', __name__)

def connect_db():
    conn = psycopg2.connect(
        host=current_app.config['DB_HOST'],
        database=current_app.config['DB_NAME'],
        user=current_app.config['DB_USER'],
        password=current_app.config['DB_PASS']
    )
    return conn

def upload_file_to_s3(file, filename):
    s3_client = boto3.client(
        's3',
        aws_access_key_id = current_app.config['S3_KEY'],
        aws_secret_access_key=current_app.config['S3_SECRET'],
        region_name=current_app.config['S3_REGION']
    )

    try:
        s3_client.upload_fileobj(
            file,
            current_app.config['S3_BUCKET'],
            filename,
            ExtraArgs={'ContentType': file.content_type}
        )

        url = f"https://{current_app.config['S3_BUCKET']}.s3.{current_app.config['S3_REGION']}.amazonaws.com/{filename}"
        return url

    except Exception as e:
        print(f"S3 upload error: {e}")
        return None

# handle POST request to sell items
@upload_bp.route('/items', methods=['POST'])
def create_item():
    conn = None
    try:
        # insert item to db
        item_name = request.form.get('title')
        item_description = request.form.get('description')
        price = request.form.get('price')
        category = request.form.get('category')

        # change later when we add authentication
        seller_id = 1

        conn = connect_db()
        cur = conn.cursor()

        insert_product_query = """
            INSERT INTO products
            (product_name, product_description, price, category_id, seller_id)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING product_id;
        """

        cur.execute(insert_product_query, (
            item_name,
            item_description,
            price,
            category,
            seller_id
        ))

        new_item_id = cur.fetchone()[0]

        # insert images to db
        if 'images' in request.files:
            files = request.files.getlist('images')

            for file in files:
                if file.filename == '':
                    continue

                filename = secure_filename(file.filename)
                unique_filename = f"{new_item_id}_{filename}"
                
                image_url = upload_file_to_s3(file, unique_filename)

                if image_url:
                    insert_image_query = """
                        INSERT INTO product_images (product_id, image_url)
                        VALUES (%s, %s);
                    """

                    cur.execute(insert_image_query, (new_item_id, image_url))

        conn.commit()
        cur.close()
        
        # POST response
        return jsonify({
            "message": "product uploaded successfully",
            "item_id": new_item_id
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()
        print("error:", e)
        return jsonify({"error": str(e)}), 500
    
    finally:
        if conn:
            conn.close()
