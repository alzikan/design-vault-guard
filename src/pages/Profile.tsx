import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Edit3, User, Phone, Mail, Lock, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UserProfile {
  full_name: string;
  email: string;
  phone?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || user?.email || "",
          phone: "" // We'll add phone support later
        });
      } else {
        // Create initial profile if doesn't exist
        setProfile({
          full_name: "",
          email: user?.email || "",
          phone: ""
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          full_name: profile.full_name,
          email: profile.email
        });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header with curved background */}
      <div className="relative h-64 bg-gradient-to-br from-warm-gold/20 via-warm-bronze/30 to-muted/40 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        
        {/* Header Content */}
        <div className="relative z-10 flex items-center justify-between p-4 pt-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-foreground hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditing(!editing)}
            className="text-foreground hover:bg-white/20 rounded-full"
          >
            <Edit3 className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Avatar - Positioned to overlap */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-background shadow-2xl">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback className="bg-warm-gold text-white text-2xl font-bold">
                {profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 pt-20">
        {/* User Name */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {profile.full_name || 'Set your name'}
          </h2>
        </div>

        {/* Profile Form */}
        <div className="space-y-4 max-w-md mx-auto">
          {/* Name Field */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border/20 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/30">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Name</Label>
                {editing ? (
                  <Input
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="border-none bg-transparent p-0 focus-visible:ring-0 text-foreground"
                  />
                ) : (
                  <p className="text-foreground">
                    {profile.full_name || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Mobile Number Field */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border/20 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/30">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Mobile Number</Label>
                {editing ? (
                  <Input
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Enter your mobile number"
                    className="border-none bg-transparent p-0 focus-visible:ring-0 text-foreground"
                  />
                ) : (
                  <p className="text-foreground">
                    {profile.phone || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Email Field */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border/20 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/30">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Email</Label>
                {editing ? (
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email"
                    type="email"
                    className="border-none bg-transparent p-0 focus-visible:ring-0 text-foreground"
                  />
                ) : (
                  <p className="text-foreground">
                    {profile.email || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border/20 p-4 cursor-pointer hover:bg-card/70 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/30">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Change Password</Label>
              </div>
              <div className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
            </div>
          </Card>

          {/* Save Changes Button */}
          {editing && (
            <Button 
              onClick={handleSave}
              className="w-full bg-warm-gold hover:bg-warm-gold/90 text-background font-medium h-12"
            >
              Save Changes
            </Button>
          )}

          {/* Sign Out */}
          <Card 
            className="bg-card/50 backdrop-blur-sm border border-border/20 p-4 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            onClick={handleSignOut}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <Label className="text-red-600 dark:text-red-400 cursor-pointer">Sign out</Label>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}