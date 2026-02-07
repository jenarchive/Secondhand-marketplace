from flask import Blueprint, request, jsonify, current_app
import os
import psycopg2
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

@upload_bp.route('/items', methods=['POST'])
def create_item():
    conn = None
    try:
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

        if 'images' in request.files:
            files = request.files.getlist('images')
            image_folder = current_app.config['IMAGE_FOLDER']

            for file in files:
                if file.filename == '':
                    continue

                filename = secure_filename(file.filename)
                unique_filename = f"{new_item_id}_{filename}"
                
                file_path = os.path.join(image_folder, unique_filename)
                file.save(file_path)

                image_url = f"static/images/{unique_filename}"

                insert_image_query = """
                    INSERT INTO product_images (product_id, image_url)
                    VALUES (%s, %s);
                """

                cur.execute(insert_image_query, (new_item_id, image_url))

        conn.commit()
        cur.close()

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
