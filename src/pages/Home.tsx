import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, BookOpen, Palette, TrendingUp, Heart, Settings, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function Home() {
  const navigate = useNavigate();
  const { t, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const [lessonsProgress, setLessonsProgress] = useState<any>({});
  const [artFavorites, setArtFavorites] = useState<number[]>([]);
  const [videoFavorites, setVideoFavorites] = useState<number[]>([]);
  const [featuredArtworks, setFeaturedArtworks] = useState<any[]>([]);
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({ artworks: 0, videos: 0, lessons: 0 });

  useEffect(() => {
    // Load progress and favorites from localStorage
    const savedLessonsProgress = localStorage.getItem('lessonsProgress');
    const savedArtFavorites = localStorage.getItem('artFavorites');
    const savedVideoFavorites = localStorage.getItem('videoFavorites');
    
    if (savedLessonsProgress) {
      setLessonsProgress(JSON.parse(savedLessonsProgress));
    }
    if (savedArtFavorites) {
      setArtFavorites(JSON.parse(savedArtFavorites));
    }
    if (savedVideoFavorites) {
      setVideoFavorites(JSON.parse(savedVideoFavorites));
    }

    // Fetch data from database
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured artworks
      const { data: artworksData } = await supabase
        .from('artworks')
        .select('id, title, created_year, image_url')
        .eq('is_featured', true)
        .eq('is_available', true)
        .limit(4);

      if (artworksData) {
        setFeaturedArtworks(artworksData.map(artwork => ({
          ...artwork,
          year: artwork.created_year?.toString() || '',
          image: artwork.image_url
        })));
      }

      // Fetch categories with artwork counts and sample images
      const { data: categoriesData } = await supabase
        .from('artwork_categories')
        .select('*')
        .order('name');

      if (categoriesData) {
        // For each category, count the artworks and get a sample image
        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (category) => {
            // Count artworks in this category
            const { count } = await supabase
              .from('artworks')
              .select('id', { count: 'exact', head: true })
              .eq('category', category.name)
              .eq('is_available', true);
            
            // Get a sample artwork image for this category
            const { data: sampleArtwork } = await supabase
              .from('artworks')
              .select('image_url')
              .eq('category', category.name)
              .eq('is_available', true)
              .limit(1)
              .maybeSingle();
            
            return {
              ...category,
              artworkCount: count || 0,
              thumbnailUrl: sampleArtwork?.image_url || null
            };
          })
        );
        setCategories(categoriesWithCounts);
      }

      // Fetch recent lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('title, duration_minutes, difficulty_level')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (lessonsData) {
        setRecentLessons(lessonsData.map(lesson => ({
          title: lesson.title,
          progress: Math.floor(Math.random() * 100), // Random progress for demo
          duration: lesson.duration_minutes ? `${lesson.duration_minutes}min` : '45min',
          difficulty: lesson.difficulty_level || 'Beginner',
          totalModules: 3
        })));
      }

      // Fetch recent videos
      const { data: videosData } = await supabase
        .from('videos')
        .select('id, title, view_count, duration_minutes, category, video_url, thumbnail_url')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (videosData) {
        setRecentVideos(videosData.map(video => ({
          id: video.id,
          title: video.title,
          views: video.view_count || 0,
          duration: video.duration_minutes ? `${video.duration_minutes}min` : 'N/A',
          level: video.category || 'General',
          video_url: video.video_url,
          thumbnail_url: video.thumbnail_url
        })));
      }

      // Get counts for stats
      const [artworksCount, videosCount, lessonsCount] = await Promise.all([
        supabase.from('artworks').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('lessons').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        artworks: artworksCount.count || 0,
        videos: videosCount.count || 0,
        lessons: lessonsCount.count || 0
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Calculate overall progress
  const totalModules = recentLessons.reduce((acc, lesson) => acc + lesson.totalModules, 0);
  const completedModules = Object.values(lessonsProgress).filter(Boolean).length;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const quickStats = [
    { label: t('stats.artworks'), value: stats.artworks.toString(), icon: Palette, color: "text-warm-gold" },
    { label: t('stats.videos'), value: stats.videos.toString(), icon: Play, color: "text-blue-500" },
    { label: t('stats.lessons'), value: stats.lessons.toString(), icon: BookOpen, color: "text-green-500" },
    { label: t('stats.progress'), value: `${overallProgress}%`, icon: TrendingUp, color: "text-purple-500" },
  ];
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header with user profile */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-warm-gold/20">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-warm-gold text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('nav.home')}</h1>
          </div>
        </div>
        
        {/* Language Toggle */}
        <Button 
          variant="outline" 
          size="sm"
          className="bg-card/50 border-border/20 hover:bg-card/70 text-foreground"
          onClick={toggleLanguage}
        >
          {t('nav.language')}
        </Button>
      </div>
      
      <div className="px-4">
        {/* Featured Artworks Grid - Following reference design */}
        <div className="bg-card rounded-2xl p-6 shadow-xl mb-6">
          <div className="grid grid-cols-2 gap-4">
            {featuredArtworks.slice(0, 6).map((artwork, index) => (
              <div 
                key={artwork.id}
                className="relative group cursor-pointer"
                onClick={() => navigate('/gallery')}
              >
                <div className="relative overflow-hidden rounded-xl bg-card/30 border border-border/20">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Artwork Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-medium text-sm leading-tight">
                      {artwork.title}
                    </h3>
                    <p className="text-warm-gold text-xs mt-1">
                      {artwork.year}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories - Horizontal scroll like reference */}
        {categories.filter(category => category.artworkCount > 0).length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">{t('home.categories')}</h2>
              <Button variant="ghost" size="sm" className="text-warm-gold">
                {t('home.viewAll')}
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {categories.filter(category => category.artworkCount > 0).map((category) => (
                <Card 
                  key={category.id} 
                  className="min-w-[140px] bg-card border-border/20 cursor-pointer hover:shadow-lg transition-all duration-300" 
                  onClick={() => navigate('/gallery')}
                >
                  <div className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-warm-gold/10 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-warm-gold" />
                    </div>
                    <h3 className="font-bold text-card-foreground text-sm">{category.name}</h3>
                    <p className="text-warm-gold text-xs mt-1">{category.artworkCount}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-card border-border/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warm-gold/10 flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-card-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Favorites Summary */}
        {(artFavorites.length > 0 || videoFavorites.length > 0) && (
          <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-card-foreground">{t('home.favorites')}</h2>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Palette className="w-4 h-4 text-warm-gold" />
                <span className="text-muted-foreground">{artFavorites.length} {t('home.artworks')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Play className="w-4 h-4 text-blue-500" />
                <span className="text-muted-foreground">{videoFavorites.length} {t('nav.videos')}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Lessons Progress */}
        <div className="bg-card rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-card-foreground">{t('home.recentLessons')}</h2>
            <Button variant="ghost" size="sm" className="text-warm-gold hover:text-accent-foreground">
              {t('home.viewAll')}
            </Button>
          </div>
          <div className="space-y-3">
            {recentLessons.map((lesson, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-card-foreground text-sm">{lesson.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    <Badge variant="outline" className="text-xs">
                      {lesson.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-warm-gold">{lesson.progress}%</div>
                  <div className="w-16 bg-muted rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-warm-gold h-1.5 rounded-full transition-all" 
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Videos */}
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-card-foreground">{t('home.recentVideos')}</h2>
            <Button variant="ghost" size="sm" className="text-warm-gold hover:text-accent-foreground">
              {t('home.viewAll')}
            </Button>
          </div>
          <div className="space-y-3">
            {recentVideos.map((video, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="relative">
                  <img 
                    src={video.thumbnail_url || "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=80&h=60&fit=crop"} 
                    alt={video.title}
                    className="w-16 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=80&h=60&fit=crop";
                    }}
                  />
                  <Button
                    className="absolute inset-0 w-full h-full bg-black/50 hover:bg-black/30 transition-colors rounded"
                    variant="ghost"
                    onClick={() => navigate('/videos')}
                  >
                    <Play className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-card-foreground text-sm">{video.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{video.duration}</span>
                    <Badge variant="outline" className="text-xs text-muted-foreground border-muted">
                      {video.level === 'General' ? t('videos.general') : video.level}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {video.views} {t('home.views')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}