import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Palette, BookOpen, Video, Eye } from 'lucide-react';
import artisticBackground from '@/assets/artistic-background.jpg';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${artisticBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Arabic Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-2" style={{ fontFamily: 'serif' }}>
            البجعة الرشيقة
          </h1>
          <p className="text-xl text-muted-foreground mb-4">الفنان التشكيلي</p>
        </div>
        
        {/* English Title */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-serif italic text-secondary mb-2">
            Artist
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif italic text-accent">
            Ibrahim al Zikan
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed">
          Welcome to the artistic world of Ibrahim al Zikan. Explore a collection of masterful paintings, 
          learn through comprehensive lessons, and discover the beauty of traditional and contemporary art.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button asChild size="lg" className="text-lg px-8 py-4">
            <Link to="/gallery">
              <Eye className="mr-2 h-5 w-5" />
              View Gallery
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
            <Link to="/lessons">
              <BookOpen className="mr-2 h-5 w-5" />
              Art Lessons
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="text-lg px-8 py-4">
            <Link to="/videos">
              <Video className="mr-2 h-5 w-5" />
              Watch Videos
            </Link>
          </Button>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <Palette className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Master Gallery</h4>
            <p className="text-muted-foreground">Explore a curated collection of exquisite paintings and artistic masterpieces.</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Art Education</h4>
            <p className="text-muted-foreground">Learn painting techniques through comprehensive lessons and tutorials.</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <Video className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Video Content</h4>
            <p className="text-muted-foreground">Watch detailed painting demonstrations and artistic processes.</p>
          </div>
        </div>
        
        {/* Bottom Arabic Text */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <p className="text-2xl font-semibold text-foreground mb-2" style={{ fontFamily: 'serif' }}>
            الفنان التشكيلي
          </p>
          <p className="text-xl text-muted-foreground" style={{ fontFamily: 'serif' }}>
            إبراهيم بن موسى الزيكان
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;