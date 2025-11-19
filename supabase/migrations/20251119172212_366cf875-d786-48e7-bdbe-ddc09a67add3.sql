-- Add view_count column to artworks table
ALTER TABLE public.artworks 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Add index for better performance on view_count queries
CREATE INDEX IF NOT EXISTS idx_artworks_view_count ON public.artworks(view_count DESC);