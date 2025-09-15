import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Palette, TrendingUp, Heart } from "lucide-react";
import waterfallPainting from "@/assets/waterfall-painting.jpg";
import shellPainting from "@/assets/shell-painting.jpg";
import boatNightPainting from "@/assets/boat-night-painting.jpg";
import prideTreePainting from "@/assets/pride-tree-painting.jpg";

const featuredArtworks = [
  {
    id: 1,
    title: "The shell",
    year: "1440",
    image: shellPainting,
  },
  {
    id: 2,
    title: "The bout & the night",
    year: "1440", 
    image: boatNightPainting,
  },
  {
    id: 3,
    title: "Water falls",
    year: "1440",
    image: waterfallPainting,
  },
  {
    id: 4,
    title: "Pride",
    year: "1440",
    image: prideTreePainting,
  }
];

const recentLessons = [
  { title: "Traditional Saudi Art", progress: 67, duration: "45min", difficulty: "Beginner", totalModules: 3 },
  { title: "Color Theory", progress: 100, duration: "1h 30min", difficulty: "Advanced", totalModules: 3 },
  { title: "Vanishing Point", progress: 0, duration: "2h 15min", difficulty: "Intermediate", totalModules: 4 },
];

const recentVideos = [
  { title: "Watercolor Techniques", views: "2.4K", duration: "15:32", level: "Advanced" },
  { title: "Oil Painting Fundamentals", views: "1.8K", duration: "22:45", level: "Beginner" },
];

export default function Home() {
  const [lessonsProgress, setLessonsProgress] = useState<any>({});
  const [artFavorites, setArtFavorites] = useState<number[]>([]);
  const [videoFavorites, setVideoFavorites] = useState<number[]>([]);

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
  }, []);

  // Calculate overall progress
  const totalModules = recentLessons.reduce((acc, lesson) => acc + lesson.totalModules, 0);
  const completedModules = Object.values(lessonsProgress).filter(Boolean).length;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const quickStats = [
    { label: "Artworks", value: "8", icon: Palette, color: "text-warm-gold" },
    { label: "Videos", value: "4", icon: Play, color: "text-blue-500" },
    { label: "Lessons", value: "4", icon: BookOpen, color: "text-green-500" },
    { label: "Progress", value: `${overallProgress}%`, icon: TrendingUp, color: "text-purple-500" },
  ];
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Home" />
      
      <div className="px-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-card border-border/20 p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
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
              <h2 className="text-lg font-bold text-card-foreground">Your Favorites</h2>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Palette className="w-4 h-4 text-warm-gold" />
                <span className="text-muted-foreground">{artFavorites.length} artworks</span>
              </div>
              <div className="flex items-center gap-1">
                <Play className="w-4 h-4 text-blue-500" />
                <span className="text-muted-foreground">{videoFavorites.length} videos</span>
              </div>
            </div>
          </Card>
        )}

        {/* Featured Artworks */}
        <div className="bg-card rounded-2xl p-6 shadow-xl mb-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4">Featured Artworks</h2>
          <div className="grid grid-cols-2 gap-4">
            {featuredArtworks.map((artwork) => (
              <ArtGalleryCard
                key={artwork.id}
                title={artwork.title}
                year={artwork.year}
                image={artwork.image}
                onClick={() => console.log(`Viewing ${artwork.title}`)}
              />
            ))}
          </div>
        </div>

        {/* Recent Lessons Progress */}
        <div className="bg-card rounded-2xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-card-foreground">Recent Lessons</h2>
            <Button variant="ghost" size="sm" className="text-warm-gold hover:text-accent-foreground">
              View All
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
            <h2 className="text-xl font-bold text-card-foreground">Recent Videos</h2>
            <Button variant="ghost" size="sm" className="text-warm-gold hover:text-accent-foreground">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentVideos.map((video, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-8 bg-gradient-to-br from-warm-gold/20 to-accent/20 rounded flex items-center justify-center">
                    <Play className="w-4 h-4 text-warm-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground text-sm">{video.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{video.duration}</span>
                      <Badge variant="outline" className="text-xs">
                        {video.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {video.views} views
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