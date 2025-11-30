-- insert query to add data - sample data
INSERT INTO users (user_id, username, email_address, ave_ratings) VALUES
(1, 'alice01', 'alice@example.com'),
(2, 'bob_the_seller', 'bob@example.com'),
(3, 'charlie88', 'charlie@example.com'),
(4, 'diana_shop', 'diana@example.com'),
(5, 'eli_vendor', 'eli@example.com'),
(6, 'franklin', 'frank@example.com'),
(7, 'graceful_g', 'grace@example.com'),
(8, 'harry_trader', 'harry@example.com'),
(9, 'iris_market', 'iris@example.com'),
(10, 'jack23', 'jack@example.com'),
(11, 'karen_seller', 'karen@example.com'),
(12, 'leo_shop', 'leo@example.com'),
(13, 'mia_store', 'mia@example.com'),
(14, 'nate_buyer', 'nate@example.com'),
(15, 'olivia_m', 'olivia@example.com');



INSERT INTO items (user_id, item_name, item_description, price, category) VALUES
(1,  'Wireless Mouse', 'Ergonomic 2.4GHz mouse', 19.99, 'Electronics'),
(2,  'Bluetooth Speaker', 'Portable mini speaker', 29.99, 'Electronics'),
(3,  'Running Shoes', 'Lightweight running shoes', 59.99, 'Footwear'),
(4,  'Ceramic Vase', 'Hand-painted decorative vase', 24.50, 'Home Decor'),
(5,  'Camping Tent', '2-person waterproof tent', 89.00, 'Outdoors'),
(6,  'Yoga Mat', 'Non-slip thick mat', 18.49, 'Fitness'),
(7,  'Desk Lamp', 'LED adjustable lamp', 22.95, 'Home Decor'),
(8,  'Gaming Keyboard', 'RGB mechanical keyboard', 79.99, 'Electronics'),
(9,  'Coffee Grinder', 'Electric burr grinder', 44.99, 'Kitchen'),
(10, 'Leather Wallet', 'Genuine brown leather', 32.00, 'Accessories'),
(11, 'Scented Candles', 'Pack of 3 lavender candles', 15.99, 'Home Decor'),
(12, 'Smartwatch', 'Heart rate and GPS tracking', 129.99, 'Electronics'),
(13, 'Water Bottle', 'Insulated stainless steel', 14.75, 'Outdoors'),
(14, 'Tennis Racket', 'Lightweight carbon frame', 79.50, 'Sports'),
(15, 'Graphic T-Shirt', '100% cotton printed tee', 12.99, 'Clothing');

INSERT INTO reviews (merchant_id, buyer_id, rating, comments) VALUES
(2, 1, 5, 'Great seller! Fast shipping.'),
(3, 4, 4, 'Item as described.'),
(4, 5, 5, 'Excellent quality, very pleased.'),
(5, 2, 3, 'Shipping was slow.'),
(6, 7, 4, 'Good value for the price.'),
(7, 3, 5, 'Amazing service!'),
(8, 9, 4, 'Works well, no issues.'),
(9, 6, 5, 'Highly recommended seller.'),
(10, 8, 3, 'Product was okay, packaging damaged.'),
(11, 12, 5, 'Very friendly communication.'),
(12, 14, 4, 'Delivered on time.'),
(13, 10, 5, 'Exceeded expectations.'),
(14, 11, 4, 'Good quality but expensive.'),
(15, 13, 5, 'Perfect product, will buy again.'),
(1, 15, 4, 'Nice transaction overall.');


