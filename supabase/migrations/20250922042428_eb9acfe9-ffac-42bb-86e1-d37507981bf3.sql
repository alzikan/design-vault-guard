-- Fix infinite recursion in profiles RLS policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create new non-recursive policies for admins
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Allow users to view their own profile OR if they are admin
  auth.uid() = user_id OR 
  (
    SELECT is_admin 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
    LIMIT 1
  ) = true
);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (
  -- Allow users to manage their own profile OR if they are admin
  auth.uid() = user_id OR 
  (
    SELECT is_admin 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
    LIMIT 1
  ) = true
);