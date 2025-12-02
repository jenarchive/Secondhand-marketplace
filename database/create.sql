-- create tables

CREATE TABLE users (
    user_id INT PRIMARY KEY, 
    username VARCHAR(80) NOT NULL, 
    email_address VARCHAR(100) NOT NULL
) ; 

-- quantity = number of items available 
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY, 
    product_name VARCHAR(80) NOT NULL, 
    product_description VARCHAR(300) NULL,
    seller_id INT REFERENCES users(user_id), 
    price MONEY NOT NULL, 
    quantity INT NOT NULL,
    category_id INT REFERENCES category(category_id)
) ; 

CREATE TABLE reviews (
    seller_id INT REFERENCES users(user_id), 
    buyer_id INT REFERENCES users(user_id),
    product_id INT REFERENCES products(product_id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(300) NULL
) ;

-- shopping cart that user can add products to before checkout
CREATE TABLE cart (
    buyer_id INT REFERENCES users(user_id), 
    list_of_product_id INT[], 
    quantity INT NOT NULL
) ;

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY, 
    category_name VARCHAR(30) NOT NULL, 
) ;

