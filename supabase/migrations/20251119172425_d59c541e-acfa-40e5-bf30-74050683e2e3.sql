-- Create function to increment view count for videos
CREATE OR REPLACE FUNCTION public.increment_video_view_count(video_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE videos
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = video_id
  RETURNING view_count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- Create function to increment view count for artworks
CREATE OR REPLACE FUNCTION public.increment_artwork_view_count(artwork_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE artworks
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = artwork_id
  RETURNING view_count INTO new_count;
  
  RETURN new_count;
END;
$$;