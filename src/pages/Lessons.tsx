import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useState } from "react";

const lessonData = [
  {
    id: 1,
    title: "Lesson 1",
    subtitle: "Vanishing Point",
    description: "Learn the fundamentals of perspective drawing and vanishing points in art.",
  },
  {
    id: 2,
    title: "Lesson 2", 
    subtitle: "Color Theory",
    description: "Understanding color relationships and how to use them effectively.",
  },
  {
    id: 3,
    title: "Lesson 3",
    subtitle: "Light and Shadow",
    description: "Master the art of creating depth through light and shadow techniques.",
  },
  {
    id: 4,
    title: "Lesson 4",
    subtitle: "Composition",
    description: "Learn how to arrange elements to create compelling artworks.",
  },
  {
    id: 5,
    title: "Lesson 5",
    subtitle: "Texture Techniques",
    description: "Explore different methods to create realistic textures in your art.",
  },
  {
    id: 6,
    title: "Lesson 6",
    subtitle: "Advanced Blending",
    description: "Advanced techniques for smooth color transitions and blending.",
  }
];

export default function Lessons() {
  const [activeTab, setActiveTab] = useState<'designs' | 'lessons'>('lessons');

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Lessons and Designs" />
      
      <div className="px-4">
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={activeTab === 'designs' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('designs')}
                className={activeTab === 'designs' 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:text-card-foreground'
                }
              >
                Designs
              </Button>
              <Button
                variant={activeTab === 'lessons' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('lessons')}
                className={activeTab === 'lessons' 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:text-card-foreground'
                }
              >
                Lessons
              </Button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'lessons' && (
            <div className="grid grid-cols-2 gap-4">
              {lessonData.map((lesson) => (
                <Card 
                  key={lesson.id} 
                  className="bg-muted/50 border-border/20 p-4 cursor-pointer hover:bg-muted/70 transition-colors duration-200"
                >
                  <div className="aspect-square bg-gradient-to-br from-warm-gold/20 to-accent/20 rounded-lg flex items-center justify-center mb-3 relative group">
                    <Play className="w-8 h-8 text-warm-gold group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 bg-gradient-to-br from-warm-gold/10 to-transparent rounded-lg" />
                  </div>
                  
                  <h3 className="font-bold text-card-foreground text-center mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-warm-gold text-sm text-center font-medium">
                    {lesson.subtitle}
                  </p>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'designs' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Design Templates
              </h3>
              <p className="text-muted-foreground">
                Explore various design templates and inspiration for your artistic journey.
              </p>
              <Button className="mt-6 bg-accent hover:bg-accent/80 text-accent-foreground">
                Coming Soon
              </Button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}