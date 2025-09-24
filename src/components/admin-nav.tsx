import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Palette, Image, BookOpen, Video, LogOut, Plus, User, MoreVertical, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    try {
      // Clear local session regardless of server response
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      // Ignore any errors - we just want to clear local session
      console.log('Local signout completed');
    }
    
    // Always show success message and redirect
    toast.success('Signed out successfully');
    // Force redirect to clear any cached state
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">{t('admin.title')}</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/gallery">
                <Button 
                  variant={isActive('/gallery') ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Image className="h-4 w-4" />
                  <span>{t('nav.gallery')}</span>
                </Button>
              </Link>
              
              <Link to="/lessons">
                <Button 
                  variant={isActive('/lessons') ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{t('nav.lessons')}</span>
                </Button>
              </Link>
              
              <Link to="/videos">
                <Button 
                  variant={isActive('/videos') ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>{t('nav.videos')}</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Desktop/Tablet view - show buttons on md screens and up */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/admin/artworks">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.addArtwork')}
                </Button>
              </Link>
              
              <Link to="/admin/lessons">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.addLesson')}
                </Button>
              </Link>
              
              <Link to="/admin/videos">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.addVideo')}
                </Button>
              </Link>
              
              <Link to="/admin/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {t('admin.artistProfile')}
                </Button>
              </Link>
              
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
              </Link>
              
              <Button
                onClick={handleSignOut}
                variant="ghost" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.signOut')}</span>
              </Button>
            </div>

            {/* Mobile dropdown menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border border-border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/admin/artworks" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('admin.addArtwork')}
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/lessons" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('admin.addLesson')}
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/videos" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('admin.addVideo')}
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {t('admin.artistProfile')}
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/users" className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;