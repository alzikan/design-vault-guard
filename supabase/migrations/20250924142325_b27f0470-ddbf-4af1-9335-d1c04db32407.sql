-- Assign categories to artworks so they appear in Gallery
UPDATE artworks SET category = 'Paintings' 
WHERE title IN ('ا لشلال', 'ا لنّخّال', 'ش موخ', 'ا لنفق', 'تويوتا قديم', 'ا لشاطئ');

UPDATE artworks SET category = 'Photography' 
WHERE title IN ('الشعيب', 'الغروب في الجنوب', 'آخر المطر');

UPDATE artworks SET category = 'Mixed Media' 
WHERE title IN ('والله متم نوره', 'الشجرة الطيبة', 'القرية');

UPDATE artworks SET category = 'Digital Art' 
WHERE title IN ('ا لجزيرة العربية مستقبلا', 'التلوث', 'أضواء المدينة');

UPDATE artworks SET category = 'Sculptures' 
WHERE title IN ('قوم هود', 'البرد', 'أهل الفجر');