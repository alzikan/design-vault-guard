import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-8">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Main Logo/Branding */}
        <div className="relative">
          {/* Arabic Text - الفنان التشكيلي */}
          <div className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-arabic">
            الفنان التشكيلي
          </div>
          
          {/* Artist Name in Arabic Script Style */}
          <div className="relative">
            <div className="text-3xl md:text-5xl font-bold text-warm-gold mb-2 font-decorative">
              إبراهيم بن موسى الزيكان
            </div>
            
            {/* English Name */}
            <div className="text-2xl md:text-3xl font-bold text-warm-bronze italic">
              Ibrahim al Zikan
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-lg md:text-xl text-muted-foreground font-arabic">
          الفنان التشكيلي
        </div>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-warm-gold rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-warm-gold rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-warm-gold rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}