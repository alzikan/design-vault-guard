-- Fix Content Management: Replace broad authentication with admin-only access

-- ARTWORKS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage artworks" ON public.artworks;

CREATE POLICY "Admins can manage artworks" 
ON public.artworks
FOR ALL
USING (public.is_admin(auth.uid()));

-- LESSONS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage lessons" ON public.lessons;

CREATE POLICY "Admins can manage lessons"
ON public.lessons
FOR ALL
USING (public.is_admin(auth.uid()));

-- VIDEOS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage videos" ON public.videos;

CREATE POLICY "Admins can manage videos"
ON public.videos
FOR ALL
USING (public.is_admin(auth.uid()));

-- ARTIST_PROFILE TABLE
DROP POLICY IF EXISTS "Authenticated users can manage artist profile" ON public.artist_profile;

CREATE POLICY "Admins can manage artist profile"
ON public.artist_profile
FOR ALL
USING (public.is_admin(auth.uid()));

-- ARTWORK_CATEGORIES TABLE
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.artwork_categories;

CREATE POLICY "Admins can manage categories"
ON public.artwork_categories
FOR ALL
USING (public.is_admin(auth.uid()));