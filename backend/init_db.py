from app.config import Config
import os
import psycop2
from app import create_app

def init_db():
    conn = psycopg2.connect(
        host=Config.DB_HOST,
        database=Config.DB_NAME,
        user=Config.DB_USER,
        password=Config.DB_PASS
        )

    cur = conn.cusor()

    sql_file_path = os.path.join(os.path.dirname(__file__), 'database', 'create.sql')

    try:
        with open(sql_file_path, 'r') as f:
            schema = f.read()

        cur.execute(schema)
        conn.commit()
        print("database initialised successfully")

    except Exeption as e:
        print(f"error: {e}")
        conn.rollback()

    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    init_db()
