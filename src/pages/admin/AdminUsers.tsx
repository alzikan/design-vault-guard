import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import AdminNav from '@/components/admin-nav';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, User as UserIcon, Users as UsersIcon } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface UserWithRole extends Profile {
  is_admin: boolean;
}

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // First get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get user roles for each profile
      const profilesWithRoles: UserWithRole[] = [];
      
      for (const profile of profilesData || []) {
        const { data: roleData } = await supabase
          .rpc('is_admin', { _user_id: profile.user_id });
        
        profilesWithRoles.push({
          ...profile,
          is_admin: roleData || false
        });
      }

      setProfiles(profilesWithRoles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminAccess = async (userId: string, currentAdminStatus: boolean) => {
    try {
      if (currentAdminStatus) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (error) throw error;
      }

      // Update local state
      setProfiles(profiles.map(profile => 
        profile.user_id === userId 
          ? { ...profile, is_admin: !currentAdminStatus }
          : profile
      ));

      toast({
        title: t('admin.save'),
        description: !currentAdminStatus ? t('admin.grantedAccess') : t('admin.revokedAccess'),
      });
    } catch (error) {
      console.error('Error updating admin access:', error);
      toast({
        title: "Error",
        description: "Failed to update admin access",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A0F0A]">
        <AdminNav />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059]"></div>
        </div>
      </div>
    );
  }

  const totalUsers = profiles.length;
  const totalAdmins = profiles.filter((p) => p.is_admin).length;
  const getInitial = (p: UserWithRole) =>
    (p.full_name || p.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#1A0F0A]">
      <AdminNav />
      <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6">
        {/* Header */}
        <div className="rounded-3xl border border-[#4A3728] bg-gradient-to-b from-[#3D281E] to-[#2D1B14] p-6 sm:p-8 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#FDF8F1] leading-tight tracking-tight">
                {t('admin.userManagement')}
              </h1>
              <p className="text-[#C5A059] text-xs font-medium uppercase tracking-widest mt-1.5">
                {t('admin.userManagementSubtitle')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6 text-[#C5A059]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="rounded-2xl bg-[#1A0F0A]/50 border border-[#C5A059]/20 p-4">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <UsersIcon className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {t('admin.totalUsers')}
                </span>
              </div>
              <p className="text-[#FDF8F1] text-2xl font-bold mt-1">{totalUsers}</p>
            </div>
            <div className="rounded-2xl bg-[#1A0F0A]/50 border border-[#C5A059]/20 p-4">
              <div className="flex items-center gap-2 text-[#C5A059]">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {t('admin.totalAdmins')}
                </span>
              </div>
              <p className="text-[#FDF8F1] text-2xl font-bold mt-1">{totalAdmins}</p>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="space-y-3 mt-5">
          {profiles.map((profile) => {
            const displayName =
              profile.full_name ||
              profile.email?.split('@')[0] ||
              t('admin.roleUser');
            return (
              <div
                key={profile.id}
                className={`rounded-3xl p-4 sm:p-5 border transition-colors shadow-md ${
                  profile.is_admin
                    ? 'bg-[#3D281E] border-[#C5A059]/50 shadow-[0_8px_24px_-12px_rgba(197,160,89,0.3)]'
                    : 'bg-[#2D1B14] border-[#4A3728]/70 hover:border-[#C5A059]/30'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shrink-0 ${
                      profile.is_admin
                        ? 'bg-gradient-to-br from-[#C5A059] to-[#E2C792] text-[#1A0F0A] ring-2 ring-[#C5A059]/40'
                        : 'bg-[#1A0F0A] text-[#C5A059] border border-[#4A3728]'
                    }`}
                  >
                    {getInitial(profile)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[#FDF8F1] font-bold text-base sm:text-lg truncate">
                        {displayName}
                      </h3>
                      {profile.is_admin ? (
                        <span className="bg-[#C5A059] text-[#1A0F0A] px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide uppercase">
                          {t('admin.roleAdmin')}
                        </span>
                      ) : (
                        <span className="border border-[#C5A059]/40 text-[#C5A059] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                          {t('admin.roleUser')}
                        </span>
                      )}
                    </div>
                    <p className="text-[#C5A059]/90 text-xs sm:text-sm font-medium truncate mt-0.5">
                      {profile.email}
                    </p>
                    <p className="text-[#FDF8F1]/50 text-[11px] mt-1">
                      {t('admin.joined')}:{' '}
                      {new Date(profile.created_at).toLocaleDateString(
                        isRTL ? 'ar' : 'en-GB'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#4A3728]/60">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-[#C5A059]" />
                    <label
                      htmlFor={`admin-${profile.id}`}
                      className="text-[#FDF8F1] text-sm font-semibold cursor-pointer"
                    >
                      {t('admin.adminAccess')}
                    </label>
                  </div>
                  <Switch
                    id={`admin-${profile.id}`}
                    checked={profile.is_admin}
                    onCheckedChange={() =>
                      toggleAdminAccess(profile.user_id, profile.is_admin)
                    }
                    className="data-[state=checked]:bg-[#C5A059]"
                  />
                </div>
              </div>
            );
          })}

          {profiles.length === 0 && (
            <div className="rounded-3xl p-10 text-center bg-[#2D1B14] border border-[#4A3728]">
              <p className="text-[#FDF8F1]/70">{t('admin.noUsers')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}