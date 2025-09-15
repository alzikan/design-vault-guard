import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
}

export function AuthLayout({ children, backgroundImage }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage 
            ? `url(${backgroundImage})`
            : `linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--accent)) 100%)`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-card/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-border/20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}