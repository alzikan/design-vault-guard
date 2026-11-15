DO $$
BEGIN
  IF (SELECT count(*) FROM auth.users WHERE id IN ('244da292-c0f6-46f7-a3fb-10804e42ad85'::uuid, '48934948-98b8-4446-be8c-3fc29d2e22da'::uuid, '0e2f4a0f-c97a-4377-9ef8-684c9ead4fd5'::uuid, '29bb6ea5-16dd-44fa-85a4-bdee37236b9c'::uuid)) <> 4 THEN
    RAISE EXCEPTION 'One or more requested accounts are missing';
  END IF;
END;
$$;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role FROM auth.users u
WHERE u.id IN ('244da292-c0f6-46f7-a3fb-10804e42ad85'::uuid, '48934948-98b8-4446-be8c-3fc29d2e22da'::uuid, '0e2f4a0f-c97a-4377-9ef8-684c9ead4fd5'::uuid, '29bb6ea5-16dd-44fa-85a4-bdee37236b9c'::uuid)
AND NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin');

CREATE OR REPLACE FUNCTION public.protect_permanent_admin_assignment()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF OLD.user_id = '244da292-c0f6-46f7-a3fb-10804e42ad85'::uuid AND OLD.role = 'admin'::public.app_role THEN
    IF TG_OP = 'DELETE' THEN
      IF EXISTS (SELECT 1 FROM auth.users WHERE id = OLD.user_id) THEN
        RAISE EXCEPTION 'This account has permanent Admin access and cannot be demoted.' USING ERRCODE = '42501';
      END IF;
    ELSIF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'This account has permanent Admin access and cannot be demoted.' USING ERRCODE = '42501';
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_permanent_admin_assignment
BEFORE DELETE OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.protect_permanent_admin_assignment();

DO $$
DECLARE account_id uuid;
BEGIN
  FOREACH account_id IN ARRAY ARRAY['244da292-c0f6-46f7-a3fb-10804e42ad85'::uuid, '48934948-98b8-4446-be8c-3fc29d2e22da'::uuid, '0e2f4a0f-c97a-4377-9ef8-684c9ead4fd5'::uuid, '29bb6ea5-16dd-44fa-85a4-bdee37236b9c'::uuid] LOOP
    IF NOT public.is_admin(account_id) THEN RAISE EXCEPTION 'Requested Admin assignment failed for %', account_id; END IF;
  END LOOP;
  BEGIN
    DELETE FROM public.user_roles WHERE user_id = '244da292-c0f6-46f7-a3fb-10804e42ad85'::uuid AND role = 'admin';
    RAISE EXCEPTION 'Permanent Admin removal was not blocked';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    UPDATE public.user_roles SET role = 'user' WHERE user_id = '244da292-c0f6-46f7-a3fb-10804e42ad85'::uuid AND role = 'admin';
    RAISE EXCEPTION 'Permanent Admin demotion was not blocked';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;