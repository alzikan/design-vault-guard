import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, Eye, Heart, Pause, Volume2, Maximize, SkipBack, SkipForward } from "lucide-react";
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
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(100); // Mock duration in seconds
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Mock video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentVideo) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentVideo, duration]);

  const toggleFavorite = (videoId: string) => {
    const newFavorites = favorites.includes(videoId)
      ? favorites.filter(id => id !== videoId)
      : [...favorites, videoId];
    
    setFavorites(newFavorites);
    localStorage.setItem('videoFavorites', JSON.stringify(newFavorites));
  };

  const playVideo = (video: any) => {
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const closeVideo = () => {
    setCurrentVideo(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Video Tutorials" />
      
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
                {currentVideo.video_url ? (
                  <video 
                    className="w-full h-full object-contain"
                    controls
                    autoPlay={isPlaying}
                    src={currentVideo.video_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-warm-gold/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-warm-gold" />
                        ) : (
                          <Play className="w-8 h-8 text-warm-gold" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        No video URL available
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={(currentTime / duration) * 100} className="flex-1 h-1" />
                    <span className="text-white text-xs">
                      {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 
                      {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:text-warm-gold"
                      onClick={() => skipTime(-10)}
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:text-warm-gold"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:text-warm-gold"
                      onClick={() => skipTime(10)}
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {currentVideo.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentVideo.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {currentVideo.views} views
                </span>
                <Badge variant="secondary">{currentVideo.level}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Video Gallery */}
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No videos available yet.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-card-foreground mb-4">
                Video Gallery
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