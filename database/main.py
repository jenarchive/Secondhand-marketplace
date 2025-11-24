import psycopg2 
from config import config 

def connect(): #checking connection
    connection = None # plays the role of flag

    try: 
            params = config()
            print('Connecting to the postgreSQL database')
            connection = psycopg2.connect(**params)

            # create cursor 
            crsr = connection.cursor()
            print('PostgreSQL dabatse version : ')
            crsr.execute('SELECT version()')
            db_version = crsr.fetchone()
            print(db_version)
            # crsr.close()
    except(Exception, psycopg2.DatabaseError) as error: 
        print(error)
    finally: 
        if connection is not None: 
            connection.close()      
            print('Database connection terminated')

if __name__ == "__main__":
     connect()


