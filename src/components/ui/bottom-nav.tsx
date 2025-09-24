import { Home, Image, BookOpen, Play, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className }: BottomNavProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  
  const navItems = [
    { icon: Home, labelKey: "nav.home", path: "/" },
    { icon: Play, labelKey: "nav.videos", path: "/videos" },
    { icon: Image, labelKey: "nav.gallery", path: "/gallery" },
    { icon: BookOpen, labelKey: "nav.lessons", path: "/lessons" },
    ...(user ? [{ icon: User, labelKey: "Profile", path: "/profile" }] : [{ icon: User, labelKey: "nav.login", path: "/auth" }]),
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border/20 mx-4 mb-4 rounded-2xl shadow-2xl">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
              "min-w-[64px] relative",
              isActive 
                ? "bg-warm-gold text-background shadow-lg" 
                : "text-card-foreground/80 hover:text-card-foreground hover:bg-muted/30"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-xs mt-1 font-medium transition-all duration-200",
                  isActive ? "opacity-100 font-semibold" : "opacity-80"
                )}>
                  {t(item.labelKey)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}