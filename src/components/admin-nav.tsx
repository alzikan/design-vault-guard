import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Palette, Image, BookOpen, Video, LogOut, Plus, User } from 'lucide-react';

const AdminNav = () => {
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Art Admin</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/gallery">
                <Button 
                  variant={isActive('/gallery') ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Image className="h-4 w-4" />
                  <span>Gallery</span>
                </Button>
              </Link>
              
              <Link to="/lessons">
                <Button 
                  variant={isActive('/lessons') ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Lessons</span>
                </Button>
              </Link>
              
              <Link to="/videos">
                <Button 
                  variant={isActive('/videos') ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Videos</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/admin/artworks">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Artwork
              </Button>
            </Link>
            
            <Link to="/admin/lessons">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            </Link>
            
            <Link to="/admin/videos">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </Link>
            
            <Link to="/admin/profile">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Artist Profile
              </Button>
            </Link>
            
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Fixed export to ensure proper default export
export default AdminNav;