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
        console.log('No user found, clearing admin status');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log('Calling admin status function for user:', user.id);
        const { data: adminStatus, error } = await supabase
          .rpc('get_current_user_admin_status');

        console.log('Admin status query result:', { adminStatus, error });

        if (error) {
          console.error('Error checking admin access:', error);
          setIsAdmin(false);
        } else {
          const isAdminUser = adminStatus || false;
          console.log('Setting admin status to:', isAdminUser);
          setIsAdmin(isAdminUser);
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