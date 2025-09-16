import { useAuth } from './useAuth';

const ALLOWED_ADMIN_DOMAINS = ['alzikan.com', 'alzakan.net'];

export const useAdminAccess = () => {
  const { user } = useAuth();

  const hasAdminAccess = () => {
    if (!user?.email) return false;
    
    const emailDomain = user.email.split('@')[1];
    return ALLOWED_ADMIN_DOMAINS.includes(emailDomain);
  };

  return {
    hasAdminAccess: hasAdminAccess(),
    user
  };
};