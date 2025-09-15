import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Play, Clock } from "lucide-react";

const videoData = [
  {
    id: 1,
    title: "Watercolor Techniques",
    description: "Learn advanced watercolor techniques from Ibrahim alZikan",
    duration: "15:32",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Oil Painting Fundamentals", 
    description: "Master the basics of oil painting with step-by-step guidance",
    duration: "22:45",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Sketching Arabic Landscapes",
    description: "Capture the beauty of Middle Eastern landscapes in your sketches",
    duration: "18:20",
    thumbnail: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Color Theory in Practice",
    description: "Understanding how colors work together in traditional art",
    duration: "12:15",
    thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
  }
];

export default function Videos() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Videos" />
      
      <div className="px-4">
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          <div className="space-y-4">
            {videoData.map((video) => (
              <Card 
                key={video.id}
                className="bg-muted/30 border-border/20 p-4 cursor-pointer hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex gap-4">
                  {/* Video Thumbnail */}
                  <div className="relative w-24 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-warm-gold/20 to-accent/20">
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground text-sm line-clamp-2 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-1 text-warm-gold">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{video.duration}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Empty State Message */}
          <div className="text-center py-8 mt-6">
            <p className="text-muted-foreground text-sm">
              More videos coming soon...
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}