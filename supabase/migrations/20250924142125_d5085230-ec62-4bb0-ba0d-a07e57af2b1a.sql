-- Update some artworks to be featured
UPDATE artworks 
SET is_featured = true 
WHERE id IN (
  SELECT id 
  FROM artworks 
  LIMIT 6
);