import { useAuth } from './useAuth';

const ALLOWED_ADMIN_DOMAINS = ['alzikan.com', 'alzakan.net'];

export const useAdminAccess = () => {
  const { user } = useAuth();

  const hasAdminAccess = () => {
    console.log('useAdminAccess - Checking admin access');
    console.log('useAdminAccess - user:', user);
    
    if (!user?.email) {
      console.log('useAdminAccess - No user email found');
      return false;
    }
    
    const emailDomain = user.email.split('@')[1];
    console.log('useAdminAccess - Email domain:', emailDomain);
    console.log('useAdminAccess - Allowed domains:', ALLOWED_ADMIN_DOMAINS);
    
    const hasAccess = ALLOWED_ADMIN_DOMAINS.includes(emailDomain);
    console.log('useAdminAccess - Has access:', hasAccess);
    
    return hasAccess;
  };

  return {
    hasAdminAccess: hasAdminAccess(),
    user
  };
};