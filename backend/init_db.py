import os
import psycop2
from app import create_app

HOST = "localhost"
NAME = "db"
USER = "username"
PASS = "password"

def init_db():
    conn = psycopg2.connect(
        host=HOST,
        database=NAME,
        user=USER,
        password=PASS
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
