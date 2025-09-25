-- Update artworks with English categories to Arabic equivalents
UPDATE public.artworks 
SET category = 'تصويد فوتوقرافي' 
WHERE category = 'Photography';

UPDATE public.artworks 
SET category = 'الفني الرقمي' 
WHERE category = 'Digital Art';

UPDATE public.artworks 
SET category = 'لوحات' 
WHERE category = 'Paintings';

UPDATE public.artworks 
SET category = 'وسائط مختلطه' 
WHERE category = 'Mixed Media';

-- Assign category to artwork with empty category
UPDATE public.artworks 
SET category = 'لوحات' 
WHERE category IS NULL OR category = '' OR category = ' ';