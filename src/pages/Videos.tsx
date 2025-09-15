import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, Eye, Heart, Pause, Volume2, Maximize, SkipBack, SkipForward } from "lucide-react";

const videoCategories = [
  {
    title: "Painting Techniques",
    videos: [
      {
        id: 1,
        title: "Watercolor Techniques",
        description: "Learn advanced watercolor techniques from Ibrahim alZikan",
        duration: "15:32",
        views: "2.4K",
        thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        level: "Advanced"
      },
      {
        id: 2,
        title: "Oil Painting Fundamentals", 
        description: "Master the basics of oil painting with step-by-step guidance",
        duration: "22:45",
        views: "1.8K",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        level: "Beginner"
      },
    ]
  },
  {
    title: "Cultural & Traditional Art",
    videos: [
      {
        id: 3,
        title: "Sketching Arabic Landscapes",
        description: "Capture the beauty of Middle Eastern landscapes in your sketches",
        duration: "18:20",
        views: "3.1K",
        thumbnail: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
        level: "Intermediate"
      },
      {
        id: 4,
        title: "Color Theory in Practice",
        description: "Understanding how colors work together in traditional art",
        duration: "12:15",
        views: "2.7K",
        thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
        level: "Intermediate"
      }
    ]
  },
];

const VideoCard = ({ video, onPlay, isFavorite, onToggleFavorite }: { 
  video: any; 
  onPlay: (video: any) => void;
  isFavorite: boolean;
  onToggleFavorite: (videoId: number) => void;
}) => (
  <Card className="bg-muted/30 border-border/20 overflow-hidden">
    <div className="relative">
      <img 
        src={video.thumbnail} 
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
        {video.level}
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
          {video.duration}
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {video.views} views
        </div>
      </div>
    </div>
  </Card>
);

export default function Videos() {
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(100); // Mock duration in seconds

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

  const toggleFavorite = (videoId: number) => {
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
                      {isPlaying ? "Playing..." : "Video player simulation"}
                    </p>
                  </div>
                </div>
                
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

        {/* Video Categories */}
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          {videoCategories.map((category) => (
            <div key={category.title} className="mb-8 last:mb-0">
              <h2 className="text-xl font-bold text-card-foreground mb-4">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {category.videos.map((video) => (
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
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}