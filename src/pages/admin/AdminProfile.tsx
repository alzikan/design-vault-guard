import { useState, useEffect } from "react";
import AdminNav from "@/components/admin-nav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function AdminProfile() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [formData, setFormData] = useState({
    artist_name: '',
    bio: '',
    about_content: '',
    achievements: '',
    education: '',
    exhibitions: '',
    profile_image_url: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setFormData({
          artist_name: data.artist_name || '',
          bio: data.bio || '',
          about_content: data.about_content || '',
          achievements: data.achievements || '',
          education: data.education || '',
          exhibitions: data.exhibitions || '',
          profile_image_url: data.profile_image_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching artist profile:', error);
      toast.error('Failed to load artist profile');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = formData.profile_image_url;

      // Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const profileData = {
        ...formData,
        profile_image_url: imageUrl
      };

      if (profile?.id) {
        // Update existing profile
        const { error } = await supabase
          .from('artist_profile')
          .update(profileData)
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('artist_profile')
          .insert([profileData]);

        if (error) throw error;
      }

      toast.success('Artist profile updated successfully!');
      setSelectedFile(null);
      fetchProfile(); // Refresh the data
    } catch (error) {
      console.error('Error saving artist profile:', error);
      toast.error('Failed to save artist profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('admin.loadingProfile')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      
      <div className="p-6">
        <Card className="bg-card border-border/20 p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-card-foreground mb-6">{t('admin.manageProfile')}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="artist_name">{t('admin.artistName')}</Label>
                <Input
                  id="artist_name"
                  value={formData.artist_name}
                  onChange={(e) => handleInputChange('artist_name', e.target.value)}
                  placeholder="Enter artist name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bio">{t('admin.shortBio')}</Label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Brief description"
                />
              </div>
            </div>

            {/* Profile Image */}
            <div>
              <Label htmlFor="profile_image">{t('admin.profileImage')}</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="profile_image"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-card-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-warm-gold file:text-background hover:file:bg-warm-gold/80"
                />
                {formData.profile_image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.profile_image_url} 
                      alt="Current profile" 
                      className="w-20 h-20 object-cover rounded-full border-2 border-warm-gold/30"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* About Content */}
            <div>
              <Label htmlFor="about_content">{t('admin.aboutContent')}</Label>
              <Textarea
                id="about_content"
                value={formData.about_content}
                onChange={(e) => handleInputChange('about_content', e.target.value)}
                placeholder="Detailed about me content"
                rows={4}
              />
            </div>

            {/* Education */}
            <div>
              <Label htmlFor="education">{t('admin.education')}</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="Educational background"
                rows={3}
              />
            </div>

            {/* Achievements */}
            <div>
              <Label htmlFor="achievements">{t('admin.achievements')}</Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                placeholder="Awards and achievements"
                rows={3}
              />
            </div>

            {/* Exhibitions */}
            <div>
              <Label htmlFor="exhibitions">{t('admin.exhibitions')}</Label>
              <Textarea
                id="exhibitions"
                value={formData.exhibitions}
                onChange={(e) => handleInputChange('exhibitions', e.target.value)}
                placeholder="Exhibition history"
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving}
              className="w-full bg-warm-gold text-background hover:bg-warm-gold/90"
            >
              {saving ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  {t('admin.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('admin.saveProfile')}
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}