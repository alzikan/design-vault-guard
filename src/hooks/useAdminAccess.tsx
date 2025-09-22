import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAccess = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log('Checking admin access for user:', user?.id);
      
      if (!user?.id) {
        console.log('No user found, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Querying profiles table for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('Profile query result:', { profile, error });

        if (error) {
          console.error('Error checking admin access:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = profile?.is_admin || false;
          console.log('Setting admin status to:', adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user?.id]);

  return {
    hasAdminAccess: isAdmin,
    loading,
    user
  };
};