-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('gallery-images', 'gallery-images', true),
  ('lesson-images', 'lesson-images', true),
  ('video-thumbnails', 'video-thumbnails', true),
  ('lesson-videos', 'lesson-videos', true);

-- Create artworks table for gallery
CREATE TABLE public.artworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  artist_name TEXT DEFAULT 'Ibrahim al Zikan',
  created_year INTEGER,
  medium TEXT,
  dimensions TEXT,
  price DECIMAL(10,2),
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for mobile app)
CREATE POLICY "Anyone can view published artworks" 
ON public.artworks FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view published lessons" 
ON public.lessons FOR SELECT 
USING (is_published = true);

CREATE POLICY "Anyone can view published videos" 
ON public.videos FOR SELECT 
USING (is_published = true);

-- Create admin policies (for authenticated admin users)
CREATE POLICY "Authenticated users can manage artworks" 
ON public.artworks FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage lessons" 
ON public.lessons FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage videos" 
ON public.videos FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON public.artworks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for gallery images
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated users can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update gallery images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

-- Storage policies for lesson images
CREATE POLICY "Public can view lesson images"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-images');

CREATE POLICY "Authenticated users can upload lesson images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update lesson images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lesson-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete lesson images"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-images' AND auth.uid() IS NOT NULL);

-- Storage policies for video thumbnails
CREATE POLICY "Public can view video thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Authenticated users can upload video thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'video-thumbnails' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update video thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'video-thumbnails' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete video thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'video-thumbnails' AND auth.uid() IS NOT NULL);

-- Storage policies for lesson videos
CREATE POLICY "Public can view lesson videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-videos');

CREATE POLICY "Authenticated users can upload lesson videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update lesson videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lesson-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete lesson videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-videos' AND auth.uid() IS NOT NULL);