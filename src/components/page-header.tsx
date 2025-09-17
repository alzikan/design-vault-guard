import { cn } from "@/lib/utils";
import { Globe, Settings, LogOut, Key, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import artistProfile from "@/assets/artist-profile.jpg";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  showLanguageToggle = true,
  className 
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { toggleLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const [profileImage, setProfileImage] = useState<string>(artistProfile);
  const [artistName, setArtistName] = useState<string>("Ibrahim alZikan");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('artist_profile')
          .select('profile_image_url, artist_name')
          .maybeSingle();

        if (error) {
          console.error('Error fetching artist profile:', error);
          return;
        }

        if (data) {
          if (data.profile_image_url) {
            setProfileImage(data.profile_image_url);
          }
          if (data.artist_name) {
            setArtistName(data.artist_name);
          }
        }
      } catch (error) {
        console.error('Error fetching artist profile:', error);
      }
    };

    fetchArtistProfile();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully');
        setIsChangePasswordOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <header className={cn(
      "flex items-center justify-between p-4 pt-12",
      className
    )}>
      {/* Profile Image */}
      <button 
        onClick={() => navigate('/about')}
        className="w-12 h-12 rounded-full overflow-hidden border-2 border-warm-gold/30 hover:border-warm-gold/60 transition-colors"
      >
        <img 
          src={profileImage} 
          alt={artistName}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Title */}
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-foreground hover:bg-accent/20"
                title="User Menu"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
              {hasAdminAccess && (
                <>
                  <DropdownMenuItem 
                    onClick={() => navigate("/admin")}
                    className="cursor-pointer"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your new password below.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsChangePasswordOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-foreground hover:bg-accent/20"
            title="Login"
            onClick={() => navigate("/auth")}
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}
        
        {/* Language Toggle */}
        {showLanguageToggle && (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-foreground hover:bg-accent/20"
            onClick={toggleLanguage}
          >
            <span className="text-sm font-medium mr-1">{t('nav.language')}</span>
            <Globe className="w-4 h-4" />
          </Button>
        )}
      </div>
    </header>
  );
}