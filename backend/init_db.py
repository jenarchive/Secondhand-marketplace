from app.config import Config
import os
import psycopg2

def init_db():
    conn = psycopg2.connect(
        host=Config.DB_HOST,
        database=Config.DB_NAME,
        user=Config.DB_USER,
        password=Config.DB_PASS
    )

    cur = conn.cursor()

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(backend_dir)
    create_path = os.path.join(project_root, 'database', 'create.sql')
    insert_script = os.path.join(project_root, 'database', 'insert.sql')

    try:
        with open(create_path, 'r') as f:
            cur.execute(f.read())

        conn.commit()
        print("database initialised successfully")

    except Exception as e:
        print(f"error: {e}")
        conn.rollback()

    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    init_db()
