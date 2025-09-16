import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import artistProfile from "@/assets/artist-profile.jpg";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  showLanguageToggle = true,
  className 
}: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className={cn(
      "flex items-center justify-between p-4 pt-12",
      className
    )}>
      {/* Profile Image */}
      <button 
        onClick={() => navigate('/about')}
        className="w-12 h-12 rounded-full overflow-hidden border-2 border-warm-gold/30 hover:border-warm-gold/60 transition-colors"
      >
        <img 
          src={artistProfile} 
          alt="Ibrahim alZikan"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Title */}
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Language Toggle */}
      {showLanguageToggle && (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-accent/20"
        >
          <span className="text-sm font-medium mr-1">عربي</span>
          <Globe className="w-4 h-4" />
        </Button>
      )}
    </header>
  );
}