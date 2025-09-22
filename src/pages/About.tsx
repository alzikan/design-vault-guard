import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Award, GraduationCap, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ArtistProfile {
  id: string;
  artist_name: string;
  bio: string;
  profile_image_url: string;
  about_content: string;
  achievements: string;
  education: string;
  exhibitions: string;
}

import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_profile')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching artist profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <PageHeader title={t('nav.about')} />
        <div className="px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading artist profile...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <PageHeader title={t('nav.about')} />
        <div className="px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Artist profile not found.</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title={t('nav.about')} />
      
      <div className="px-4">
        {/* Artist Profile Header */}
        <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-warm-gold/30 mb-4">
              <img 
                src={profile.profile_image_url || "/placeholder.svg"} 
                alt={profile.artist_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              {profile.artist_name}
            </h1>
            <p className="text-warm-gold font-medium mb-4">
              {profile.bio}
            </p>
            <Badge variant="secondary" className="mb-4">
              <Palette className="w-4 h-4 mr-1" />
              Contemporary Artist
            </Badge>
          </div>
        </Card>

        {/* About Content */}
        <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
          <h2 className="text-xl font-bold text-card-foreground mb-4">About Me</h2>
          <p className="text-muted-foreground leading-relaxed">
            {profile.about_content}
          </p>
        </Card>

        {/* Education */}
        {profile.education && (
          <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-warm-gold" />
              <h2 className="text-xl font-bold text-card-foreground">Education</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {profile.education}
            </p>
          </Card>
        )}

        {/* Achievements */}
        {profile.achievements && (
          <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-warm-gold" />
              <h2 className="text-xl font-bold text-card-foreground">Achievements</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {profile.achievements}
            </p>
          </Card>
        )}

        {/* Exhibitions */}
        {profile.exhibitions && (
          <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-warm-gold" />
              <h2 className="text-xl font-bold text-card-foreground">Exhibitions</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {profile.exhibitions}
            </p>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}