-- Add category column to artworks table
ALTER TABLE public.artworks ADD COLUMN category TEXT;

-- Create categories table for managing available categories
CREATE TABLE public.artwork_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on categories table
ALTER TABLE public.artwork_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Anyone can view categories" 
ON public.artwork_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage categories" 
ON public.artwork_categories 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates on categories
CREATE TRIGGER update_artwork_categories_updated_at
BEFORE UPDATE ON public.artwork_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default categories
INSERT INTO public.artwork_categories (name, description) VALUES 
('Paintings', 'Traditional and contemporary paintings'),
('Sculptures', 'Three-dimensional artworks'),
('Digital Art', 'Computer-generated and digital artworks'),
('Photography', 'Photographic works'),
('Mixed Media', 'Artworks combining multiple mediums');