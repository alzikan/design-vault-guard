import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye } from "lucide-react";

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

const VideoCard = ({ video, onPlay }: { video: any; onPlay: (video: any) => void }) => (
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

  const playVideo = (video: any) => {
    setCurrentVideo(video);
  };

  const closeVideo = () => {
    setCurrentVideo(null);
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
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <p className="text-muted-foreground">Video player would be integrated here</p>
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