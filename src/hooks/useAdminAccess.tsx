import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Admin access check, cached across route changes via React Query.
 * The cached `true` result lets `ProtectedAdminRoute` grant access
 * immediately on navigation, avoiding the redirect-to-home race.
 */
export const useAdminAccess = () => {
  const { user, loading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ['admin-access', user?.id ?? 'anon'],
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_current_user_admin_status');
      if (error) {
        console.error('Error checking admin access:', error);
        throw error;
      }
      return Boolean(data);
    },
  });

  // While auth is resolving, or while we have a signed-in user but no cached
  // answer yet, treat as loading so guards don't redirect prematurely.
  const loading =
    authLoading ||
    (!!user?.id && query.data === undefined && !query.isError);

  return {
    hasAdminAccess: Boolean(user?.id) && query.data === true,
    loading,
    user,
  };
};