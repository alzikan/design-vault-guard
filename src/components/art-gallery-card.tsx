import { cn } from "@/lib/utils";

interface ArtGalleryCardProps {
  title: string;
  year?: string;
  image: string;
  className?: string;
  onClick?: () => void;
}

export function ArtGalleryCard({ 
  title, 
  year, 
  image, 
  className,
  onClick 
}: ArtGalleryCardProps) {
  return (
    <div 
      className={cn(
        "relative group cursor-pointer art-card",
        "bg-gradient-to-br from-gallery-frame to-warm-bronze",
        "p-3 rounded-lg",
        className
      )}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-md">
        <img 
          src={image} 
          alt={title}
          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="mt-2 text-center">
        <h3 className="text-card-foreground font-medium text-sm leading-tight">
          {title}
        </h3>
        {year && (
          <p className="text-warm-gold text-xs mt-1 font-light">
            {year}
          </p>
        )}
      </div>
    </div>
  );
}