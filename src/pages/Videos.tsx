import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VideoCard = ({ video, onPlay, isFavorite, onToggleFavorite }: { 
  video: any; 
  onPlay: (video: any) => void;
  isFavorite: boolean;
  onToggleFavorite: (videoId: string) => void;
}) => (
  <Card className="bg-muted/30 border-border/20 overflow-hidden">
    <div className="relative">
      <img 
        src={video.thumbnail_url || "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"} 
        alt={video.title}
        className="w-full h-32 object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <Button
        onClick={() => onPlay(video)}
        className="absolute inset-0 w-full h-full bg-black/50 hover:bg-black/30 transition-colors"
        variant="ghost"
      >
        <Play className="w-8 h-8 text-white" />
      </Button>
      <Button
        onClick={() => onToggleFavorite(video.id)}
        className="absolute top-2 left-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
        variant="ghost"
        size="sm"
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : 'text-white'}`} />
      </Button>
      <Badge className="absolute top-2 right-2 bg-warm-gold text-background text-xs">
        {video.category || 'General'}
      </Badge>
    </div>
    <div className="p-3">
      <h3 className="font-semibold text-card-foreground text-sm mb-1 line-clamp-2">
        {video.title}
      </h3>
      <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
        {video.description}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration_minutes ? `${video.duration_minutes}:00` : 'N/A'}
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {video.view_count || 0} views
        </div>
      </div>
    </div>
  </Card>
);

export default function Videos() {
  const { t } = useTranslation();
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch videos from Supabase
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('videoFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (videoId: string) => {
    const newFavorites = favorites.includes(videoId)
      ? favorites.filter(id => id !== videoId)
      : [...favorites, videoId];
    
    setFavorites(newFavorites);
    localStorage.setItem('videoFavorites', JSON.stringify(newFavorites));
  };

  const playVideo = (video: any) => {
    setCurrentVideo(video);
    setVideoError(null);
  };

  const closeVideo = () => {
    setCurrentVideo(null);
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={t('nav.videos')} />
      
      <div className="px-4">
        {/* Video Player Modal */}
        {currentVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-card-foreground">
                  {currentVideo.title}
                </h2>
                <Button variant="ghost" onClick={closeVideo}>
                  ✕
                </Button>
              </div>
              <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden">
                {videoError ? (
                  <div className="w-full h-full flex items-center justify-center bg-amber-50 dark:bg-amber-900/20">
                    <div className="text-center p-4 max-w-md">
                      <div className="text-amber-600 dark:text-amber-400 mb-3 font-semibold">
                        {t('videos.videoError')}
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        External video cannot be accessed due to server restrictions.
                      </div>
                      <div className="flex gap-2 justify-center flex-wrap">
                        <Button 
                          onClick={() => {
                            window.open(currentVideo.video_url, '_blank');
                          }} 
                          variant="default" 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          View Video Externally
                        </Button>
                        <Button 
                          onClick={() => {
                            setVideoError(null);
                            if (videoRef.current) {
                              videoRef.current.load();
                            }
                          }} 
                          variant="outline" 
                          size="sm"
                        >
                          {t('videos.tryAgain')}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        💡 For better playback, consider uploading videos to secure storage
                      </p>
                    </div>
                  </div>
                ) : currentVideo.video_url ? (
                  // Check if URL is an image or video
                  /\.(jpg|jpeg|png|gif|webp)$/i.test(currentVideo.video_url) ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <img 
                        src={currentVideo.video_url}
                        alt={currentVideo.title}
                        className="max-w-full max-h-full object-contain"
                      />
                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                        {t('videos.notVideo')}
                      </div>
                    </div>
                  ) : (
                    <video 
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      src={currentVideo.video_url}
                      controls
                      preload="metadata"
                      onLoadStart={() => {
                        console.log('Video loading started...');
                        setVideoError(null);
                      }}
                      onCanPlay={() => {
                        console.log('Video can play - attempting auto-play...');
                        videoRef.current?.play().catch((error) => {
                          console.log('Auto-play prevented by browser:', error);
                        });
                      }}
                      onError={(e) => {
                        console.error('Video failed to load:', currentVideo.video_url);
                        setVideoError('Cannot load video from external source');
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-warm-gold/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play className="w-8 h-8 text-warm-gold" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {t('videos.noVideoUrl')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                {currentVideo.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentVideo.duration_minutes ? `${currentVideo.duration_minutes}:00` : 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {currentVideo.view_count || 0} {t('videos.views')}
                </span>
                <Badge variant="secondary">{currentVideo.category || 'General'}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Video Gallery */}
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('videos.loading')}</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('videos.noVideos')}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-card-foreground mb-4">
                {t('videos.gallery')}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={playVideo}
                    isFavorite={favorites.includes(video.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}