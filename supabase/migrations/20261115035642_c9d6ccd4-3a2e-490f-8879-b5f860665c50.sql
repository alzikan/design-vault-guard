CREATE OR REPLACE FUNCTION public.prevent_self_role_changes()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE actor_id uuid := auth.uid();
BEGIN
  IF actor_id IS NOT NULL THEN
    IF TG_OP IN ('DELETE', 'UPDATE') THEN
      IF OLD.user_id = actor_id THEN
        RAISE EXCEPTION 'You cannot change your own access while signed in.' USING ERRCODE = '42501';
      END IF;
    END IF;
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
      IF NEW.user_id = actor_id THEN
        RAISE EXCEPTION 'You cannot change your own access while signed in.' USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER prevent_self_role_changes
BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_changes();

DO $$
DECLARE account_id uuid := '0e2f4a0f-c97a-4377-9ef8-684c9ead4fd5'::uuid;
previous_claims text := current_setting('request.jwt.claims', true);
previous_sub text := current_setting('request.jwt.claim.sub', true);
BEGIN
  PERFORM set_config('request.jwt.claim.sub', account_id::text, true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', account_id, 'role', 'authenticated')::text, true);
  IF auth.uid() IS DISTINCT FROM account_id THEN RAISE EXCEPTION 'Test session is invalid'; END IF;
  BEGIN
    DELETE FROM public.user_roles WHERE user_id = account_id AND role = 'admin';
    RAISE EXCEPTION 'Self-removal was not blocked';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    UPDATE public.user_roles SET role = 'user' WHERE user_id = account_id AND role = 'admin';
    RAISE EXCEPTION 'Self-demotion was not blocked';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.user_roles (user_id, role) VALUES (account_id, 'moderator');
    RAISE EXCEPTION 'Self-assignment was not blocked';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  UPDATE public.user_roles SET updated_at = updated_at WHERE user_id = '48934948-98b8-4446-be8c-3fc29d2e22da'::uuid AND role = 'admin';
  IF NOT FOUND THEN RAISE EXCEPTION 'Other-account test target missing'; END IF;
  IF NOT public.is_admin(account_id) THEN RAISE EXCEPTION 'Admin access was lost'; END IF;
  PERFORM set_config('request.jwt.claims', coalesce(previous_claims, ''), true);
  PERFORM set_config('request.jwt.claim.sub', coalesce(previous_sub, ''), true);
END;
$$;