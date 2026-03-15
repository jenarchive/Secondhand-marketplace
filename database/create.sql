-- create tables

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, 
    username VARCHAR(80) UNIQUE NOT NULL, 
    email_address VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(60) NOT NULL
) ; 

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY, 
    category_name VARCHAR(30) NOT NULL
) ;

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY, 
    product_name VARCHAR(80) NOT NULL, 
    product_description VARCHAR(300) NULL,
    seller_id INT REFERENCES users(user_id), 
    price MONEY NOT NULL, 
    category_id INT REFERENCES category(category_id),
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ; 

CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL
);


CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
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

