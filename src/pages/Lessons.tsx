import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, BookOpen, Star, Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const lessons = [
  {
    id: 1,
    title: "Introduction to Traditional Saudi Art",
    description: "Learn the foundations of traditional Saudi artistic expression and cultural significance.",
    duration: "45 min",
    difficulty: "Beginner",
    modules: [
      { id: 1, title: "History of Saudi Art", completed: true, duration: "15 min" },
      { id: 2, title: "Cultural Influences", completed: true, duration: "10 min" },
      { id: 3, title: "Traditional Materials", completed: false, duration: "20 min" },
    ],
    progress: 67
  },
  {
    id: 2,
    title: "Lesson 1: Vanishing Point",
    description: "Learn the fundamentals of perspective drawing and vanishing points in art.",
    duration: "2h 15min",
    difficulty: "Intermediate",
    modules: [
      { id: 1, title: "Perspective Basics", completed: false, duration: "30 min" },
      { id: 2, title: "Single Point Perspective", completed: false, duration: "45 min" },
      { id: 3, title: "Two Point Perspective", completed: false, duration: "40 min" },
      { id: 4, title: "Practical Exercises", completed: false, duration: "20 min" },
    ],
    progress: 0
  },
  {
    id: 3,
    title: "Lesson 2: Color Theory",
    description: "Understanding color relationships and how to use them effectively.",
    duration: "1h 30min",
    difficulty: "Advanced",
    modules: [
      { id: 1, title: "Color Wheel Fundamentals", completed: true, duration: "25 min" },
      { id: 2, title: "Complementary Colors", completed: true, duration: "35 min" },
      { id: 3, title: "Color Harmony", completed: true, duration: "30 min" },
    ],
    progress: 100
  },
  {
    id: 4,
    title: "Lesson 3: Light and Shadow",
    description: "Master the art of creating depth through light and shadow techniques.",
    duration: "1h 10min",
    difficulty: "Intermediate",
    modules: [
      { id: 1, title: "Understanding Light Sources", completed: false, duration: "20 min" },
      { id: 2, title: "Shadow Casting", completed: false, duration: "25 min" },
      { id: 3, title: "Practical Application", completed: false, duration: "25 min" },
    ],
    progress: 0
  },
];

const LessonCard = ({ lesson, onStart }: { lesson: any; onStart: (lesson: any) => void }) => {
  const completedModules = lesson.modules.filter((m: any) => m.completed).length;
  const totalModules = lesson.modules.length;

  return (
    <Card className="bg-muted/30 border-border/20 p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-card-foreground mb-2">
            {lesson.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            {lesson.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {totalModules} modules
            </span>
            <Badge variant={lesson.difficulty === "Beginner" ? "default" : lesson.difficulty === "Intermediate" ? "secondary" : "destructive"}>
              {lesson.difficulty}
            </Badge>
          </div>
        </div>
        {lesson.progress === 100 && (
          <div className="flex items-center text-warm-gold">
            <Star className="w-5 h-5 fill-current" />
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Progress: {completedModules}/{totalModules} modules
          </span>
          <span className="text-sm text-muted-foreground">
            {lesson.progress}%
          </span>
        </div>
        <Progress value={lesson.progress} className="h-2" />
      </div>

      <Button 
        onClick={() => onStart(lesson)}
        className="w-full"
        variant={lesson.progress > 0 ? "outline" : "default"}
      >
        {lesson.progress === 0 ? "Start Lesson" : lesson.progress === 100 ? "Review" : "Continue"}
      </Button>
    </Card>
  );
};

export default function Lessons() {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [lessonsProgress, setLessonsProgress] = useState<any>({});

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('lessonsProgress');
    if (savedProgress) {
      setLessonsProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Update lesson progress
  const updateProgress = (lessonId: number, moduleId: number, completed: boolean) => {
    const newProgress = {
      ...lessonsProgress,
      [`${lessonId}-${moduleId}`]: completed
    };
    setLessonsProgress(newProgress);
    localStorage.setItem('lessonsProgress', JSON.stringify(newProgress));
    
    if (completed) {
      toast({
        title: "Module Completed!",
        description: "Great job! Keep up the excellent progress.",
      });
    }
  };

  // Calculate dynamic progress for lessons
  const getLessonWithProgress = (lesson: any) => {
    const completedModules = lesson.modules.filter((module: any) => 
      lessonsProgress[`${lesson.id}-${module.id}`] === true
    ).length;
    const progress = Math.round((completedModules / lesson.modules.length) * 100);
    
    return {
      ...lesson,
      modules: lesson.modules.map((module: any) => ({
        ...module,
        completed: lessonsProgress[`${lesson.id}-${module.id}`] === true
      })),
      progress
    };
  };

  const startLesson = (lesson: any) => {
    setSelectedLesson(getLessonWithProgress(lesson));
  };

  const startModule = (lessonId: number, moduleId: number, currentlyCompleted: boolean) => {
    updateProgress(lessonId, moduleId, !currentlyCompleted);
    // Update the selected lesson to reflect the change
    if (selectedLesson && selectedLesson.id === lessonId) {
      setSelectedLesson(getLessonWithProgress(selectedLesson));
    }
  };

  const closeLesson = () => {
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Art Lessons" />
      
      <div className="px-4">
        {/* Lesson Detail Modal */}
        {selectedLesson && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-card-foreground">
                  {selectedLesson.title}
                </h2>
                <Button variant="ghost" onClick={closeLesson}>
                  ✕
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-6">
                {selectedLesson.description}
              </p>

              <div className="space-y-3">
                {selectedLesson.modules.map((module: any, index: number) => (
                  <div 
                    key={module.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/20"
                  >
                    <div className="flex items-center gap-3">
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-warm-gold" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted-foreground/30 flex items-center justify-center text-xs text-card-foreground">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-card-foreground">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Duration: {module.duration}
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      variant={module.completed ? "outline" : "default"}
                      disabled={!module.completed && index > 0 && !selectedLesson.modules[index - 1]?.completed}
                      onClick={() => startModule(selectedLesson.id, module.id, module.completed)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {module.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
          <h2 className="text-lg font-bold text-card-foreground mb-4">Your Learning Progress</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-warm-gold">1</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">1</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">2</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </Card>

        {/* Lessons Grid */}
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          <div className="space-y-4">
            {lessons.map((lesson) => {
              const lessonWithProgress = getLessonWithProgress(lesson);
              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lessonWithProgress}
                  onStart={startLesson}
                />
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}