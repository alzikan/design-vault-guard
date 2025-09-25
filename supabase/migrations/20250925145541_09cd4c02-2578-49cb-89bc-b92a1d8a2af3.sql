-- Add admin role to ahmed@alzikan.com user
INSERT INTO public.user_roles (user_id, role)
VALUES (
  '0e2f4a0f-c97a-4377-9ef8-684c9ead4fd5',
  'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;