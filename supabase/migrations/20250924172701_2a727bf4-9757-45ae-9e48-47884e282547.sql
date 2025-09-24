-- Add phone column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone text;

-- Add a comment to describe the column
COMMENT ON COLUMN public.profiles.phone IS 'User mobile/phone number';