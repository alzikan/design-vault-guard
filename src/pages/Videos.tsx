import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Play, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Videos() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

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

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-warm-gold/20">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-warm-gold text-white">
              U
            </AvatarFallback>
          </Avatar>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground">Videos</h1>
        
        {/* Language Toggle */}
        <Button 
          variant="outline" 
          size="sm"
          className="bg-card/50 border-border/20 hover:bg-card/70 text-foreground"
        >
          عربي
        </Button>
      </div>

      <div className="px-4 space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-gold mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : (
          <>
            {/* Video List */}
            <div className="space-y-4">
              {videos.map((video) => (
                <Card 
                  key={video.id} 
                  className="bg-card/50 border-border/20 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative">
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-muted/30 to-muted/60">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=225&fit=crop";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-warm-gold/20 to-warm-bronze/30 flex items-center justify-center">
                          <Play className="w-16 h-16 text-warm-gold/60" />
                        </div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      
                      {/* Duration Badge */}
                      {video.duration_minutes && (
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="secondary" className="bg-black/70 text-white border-none text-xs">
                            {video.duration_minutes}min
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-card-foreground text-lg mb-2">
                        {video.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                        {video.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {video.category && (
                            <Badge variant="outline" className="text-xs">
                              {video.category}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {video.view_count || 0} views
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {videos.length === 0 && (
              <div className="text-center py-12">
                <Play className="w-16 h-16 text-muted-foreground/40 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                <p className="text-muted-foreground">Check back later for new video content.</p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />

      {/* Video Player Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black z-50"
          onClick={closeVideoModal}
        >
          <div className="relative h-full flex flex-col">
            {/* Close Button */}
            <div className="absolute top-4 left-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white"
                onClick={closeVideoModal}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>

            {/* Video Player Area */}
            <div className="flex-1 flex items-center justify-center p-4">
              {selectedVideo.video_url ? (
                <video 
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  poster={selectedVideo.thumbnail_url}
                >
                  <source src={selectedVideo.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center">
                  <Play className="w-24 h-24 text-white/60 mx-auto mb-4" />
                  <p className="text-white/80">Video not available</p>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="bg-card/95 backdrop-blur-sm p-6">
              <h2 className="text-xl font-bold text-card-foreground mb-2">
                {selectedVideo.title || 'Video title'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {selectedVideo.description || 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {selectedVideo.category && (
                  <Badge variant="outline">
                    {selectedVideo.category}
                  </Badge>
                )}
                <span>{selectedVideo.view_count || 0} views</span>
                {selectedVideo.duration_minutes && (
                  <span>{selectedVideo.duration_minutes}min</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}