-- Create artist_profile table to store about me information
CREATE TABLE public.artist_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_name TEXT NOT NULL DEFAULT 'Ibrahim alZikan',
  bio TEXT,
  profile_image_url TEXT,
  about_content TEXT,
  achievements TEXT,
  education TEXT,
  exhibitions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.artist_profile ENABLE ROW LEVEL SECURITY;

-- Create policies for artist profile access
CREATE POLICY "Anyone can view artist profile" 
ON public.artist_profile 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage artist profile" 
ON public.artist_profile 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_artist_profile_updated_at
BEFORE UPDATE ON public.artist_profile
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default artist profile data
INSERT INTO public.artist_profile (artist_name, bio, about_content)
VALUES (
  'Ibrahim alZikan',
  'Contemporary artist specializing in traditional and modern art forms',
  'Welcome to my artistic journey. I am Ibrahim alZikan, a passionate artist dedicated to creating meaningful works that bridge traditional and contemporary art forms.'
);