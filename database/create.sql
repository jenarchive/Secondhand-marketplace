-- create table
CREATE TABLE users (
    user_id INT PRIMARY KEY, 
    username VARCHAR(255) NOT NULL, 
    email_address VARCHAR(255) NOT NULL
) ; 

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY, 
    user_id INT REFERENCES users(user_id), 
    item_name VARCHAR(80) NOT NULL, 
    item_description VARCHAR(300) NULL,
    price MONEY NOT NULL
) ; 

