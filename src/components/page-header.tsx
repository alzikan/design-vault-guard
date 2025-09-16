import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [profileImageUrl, setProfileImageUrl] = useState<string>(artistProfile);
  const [artistName, setArtistName] = useState<string>("Ibrahim alZikan");

  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('artist_profile')
          .select('profile_image_url, artist_name')
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          if (data.profile_image_url) {
            setProfileImageUrl(data.profile_image_url);
          }
          if (data.artist_name) {
            setArtistName(data.artist_name);
          }
        }
      } catch (error) {
        console.error('Error fetching artist profile:', error);
        // Keep using fallback values
      }
    };

    fetchArtistProfile();
  }, []);
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
          src={profileImageUrl} 
          alt={artistName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to static image if database image fails to load
            e.currentTarget.src = artistProfile;
          }}
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

      {/* Language Toggle */}
      {showLanguageToggle && (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-accent/20"
        >
          <span className="text-sm font-medium mr-1">عربي</span>
          <Globe className="w-4 h-4" />
        </Button>
      )}
    </header>
  );
}