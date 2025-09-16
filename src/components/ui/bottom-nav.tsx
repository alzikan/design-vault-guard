import { Home, Image, BookOpen, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavProps {
  className?: string;
}

const navItems = [
  { icon: Home, labelKey: "nav.home", path: "/" },
  { icon: Play, labelKey: "nav.videos", path: "/videos" },
  { icon: Image, labelKey: "nav.gallery", path: "/gallery" },
  { icon: BookOpen, labelKey: "nav.lessons", path: "/lessons" },
];

export function BottomNav({ className }: BottomNavProps) {
  const { t } = useLanguage();
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border",
      "mx-4 mb-4 rounded-2xl shadow-2xl",
      className
    )}>
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200",
              "min-w-[60px] relative",
              isActive 
                ? "bg-accent text-accent-foreground shadow-lg scale-105" 
                : "text-muted-foreground hover:text-card-foreground hover:bg-muted/50"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-xs mt-1 font-medium transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {t(item.labelKey)}
                </span>
                {isActive && (
                  <div className="absolute -top-1 w-8 h-1 bg-warm-gold rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}