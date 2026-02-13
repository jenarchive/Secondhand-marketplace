-- commands to use in psql 

-- to get ave ratings for this seller 
SELECT AVG(ratings)
FROM reviews
WHERE seller_id = '' ; 

-- to modify the array for cart for 1 d
SELECT array_prepend(1, ARRAY[2,3]); -- = {1,2,3}

