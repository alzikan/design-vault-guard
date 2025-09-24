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
  is_admin: boolean;
  created_at: string;
}

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
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
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentAdminStatus })
        .eq('user_id', userId);

      if (error) throw error;

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
      <div className="container mx-auto p-6">
        <PageHeader title="User Management" subtitle="Manage user access and permissions" />
      
      <div className="grid gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{profile.full_name}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <p className="text-xs text-muted-foreground">
                  Joined: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant={profile.is_admin ? "default" : "secondary"}>
                  {profile.is_admin ? "Admin" : "User"}
                </Badge>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`admin-${profile.id}`} className="text-sm">
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