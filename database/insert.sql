-- insert query to add data - sample data
INSERT INTO users (user_id, username, email_address) VALUES
(1, 'alice01', 'alice@example.com'),
(2, 'bob_seller', 'bob@example.com'),
(3, 'charlie88', 'charlie@example.com'),
(4, 'diana_shop', 'diana@example.com'),
(5, 'eric_trader', 'eric@example.com'),
(6, 'fiona_market', 'fiona@example.com'),
(7, 'george_vendor', 'george@example.com'),
(8, 'hannah_store', 'hannah@example.com'),
(9, 'ian_goods', 'ian@example.com'),
(10, 'julia_seller', 'julia@example.com');


INSERT INTO products (product_name, product_description, seller_id, price, quantity, category_id) VALUES
('Wireless Mouse', 'Ergonomic 2.4GHz wireless mouse', 1, 19.99, 25, 1),
('Bluetooth Speaker', 'Portable mini Bluetooth speaker', 2, 29.99, 15, 1),
('Running Shoes', 'Lightweight running shoes for sports', 3, 59.99, 10, 2),
('Ceramic Vase', 'Hand-painted decorative vase', 4, 24.50, 8, 3),
('Camping Tent', 'Waterproof 2-person camping tent', 5, 89.00, 12, 2),
('Yoga Mat', 'Non-slip thick yoga mat', 6, 18.49, 20, 2),
('Desk Lamp', 'LED adjustable desk lamp', 7, 22.95, 14, 3),
('Smartwatch', 'GPS tracking and heart-rate monitor', 8, 129.99, 7, 1),
('Electric Kettle', '1.8L stainless steel electric kettle', 9, 34.99, 16, 3),
('Leather Wallet', 'Genuine leather mens wallet', 10, 32.00, 11, 3),
('Scented Candles', 'Pack of 3 lavender-scented candles', 1, 15.99, 30, 3),
('Gaming Keyboard', 'RGB mechanical gaming keyboard', 2, 79.99, 9, 1),
('Water Bottle', 'Insulated stainless steel bottle', 4, 14.75, 18, 2),
('Tennis Racket', 'Lightweight carbon fiber racket', 6, 79.50, 6, 2),
('Graphic T-Shirt', '100% cotton printed t-shirt', 9, 12.99, 22, 3);


INSERT INTO reviews (seller_id, buyer_id, product_id, rating, comment) VALUES
(1, 2, 1, 5, 'Great quality and fast shipping'),
(2, 3, 2, 4, 'Good sound, battery could be better'),
(3, 1, 3, 5, 'Very comfortable shoes'),
(4, 5, 4, 5, 'Beautiful craftsmanship'),
(5, 6, 5, 4, 'Tent is sturdy and reliable'),
(6, 7, 6, 5, 'Perfect yoga mat, love it'),
(7, 8, 7, 4, 'Good lamp but smaller than expected'),
(8, 9, 8, 5, 'Amazing smartwatch features'),
(9, 10, 9, 4, 'Kettle heats quickly'),
(10, 1, 10, 3, 'Wallet is okay, stitching could improve'),
(1, 4, 11, 5, 'Smells wonderful, very relaxing'),
(2, 5, 12, 5, 'Keyboard is fantastic for gaming'),
(4, 3, 13, 4, 'Good bottle, keeps drinks cold');


INSERT INTO cart (buyer_id, list_of_product_id, quantity) VALUES
(1,  ARRAY[1, 11], 2),
(2,  ARRAY[3], 1),
(3,  ARRAY[2, 12, 8], 3),
(4,  ARRAY[4, 13], 2),
(5,  ARRAY[5], 1),
(6,  ARRAY[6, 14], 2),
(7,  ARRAY[7], 1),
(8,  ARRAY[8, 1], 2),
(9,  ARRAY[9], 1),
(10, ARRAY[10, 15], 2);


INSERT INTO category (category_name) VALUES -- serial auto fills
('Electronics'),        -- id = 1
('Sports & Outdoors'),  -- id = 2
('Home & Lifestyle');   -- id = 3
