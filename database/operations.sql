-- commands to use in psql 

-- to get ave ratings for this seller 
SELECT AVG(ratings)
FROM reviews
WHERE seller_id = '' ; 

