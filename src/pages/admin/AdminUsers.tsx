import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/page-header';
import AdminNav from '@/components/admin-nav';

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
        title: "Success",
        description: `Admin access ${!currentAdminStatus ? 'granted' : 'revoked'} successfully`,
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
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="container mx-auto p-6">
          <PageHeader title="User Management" subtitle="Manage user access and permissions" />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="container mx-auto px-4 py-6 sm:p-6">
        <PageHeader title="User Management" subtitle="Manage user access and permissions" />

      <div className="grid gap-3 sm:gap-4 mt-4">
        {profiles.map((profile) => (
          <Card key={profile.id} className="p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">
                  {profile.full_name || profile.email}
                </h3>
                <p className="text-sm text-foreground/80 break-all">{profile.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Joined: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4 shrink-0">
                <Badge
                  variant={profile.is_admin ? 'default' : 'secondary'}
                  className="text-xs px-2.5 py-1"
                >
                  {profile.is_admin ? 'Admin' : 'User'}
                </Badge>

                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`admin-${profile.id}`}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Admin Access
                  </Label>
                  <Switch
                    id={`admin-${profile.id}`}
                    checked={profile.is_admin}
                    onCheckedChange={() => toggleAdminAccess(profile.user_id, profile.is_admin)}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {profiles.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No users found</p>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
}