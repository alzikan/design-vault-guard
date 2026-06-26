import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Palette, LogOut, Plus, User, Users, Image as ImageIcon, BookOpen, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.log('Local signout completed');
    }
    toast.success('Signed out successfully');
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const items: { to: string; label: string; icon: React.ReactNode }[] = [
    { to: '/admin/artworks', label: t('admin.addArtwork'), icon: <Plus className="h-4 w-4" /> },
    { to: '/admin/lessons', label: t('admin.addLesson'), icon: <Plus className="h-4 w-4" /> },
    { to: '/admin/videos', label: t('admin.addVideo'), icon: <Plus className="h-4 w-4" /> },
    { to: '/admin/profile', label: t('admin.artistProfile'), icon: <User className="h-4 w-4" /> },
    { to: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top row: brand + sign out */}
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <Palette className="h-6 w-6 text-primary shrink-0" />
            <span className="text-base sm:text-xl font-bold truncate">{t('admin.title')}</span>
          </Link>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-sm font-semibold"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            <span className="hidden xs:inline sm:inline">{t('nav.signOut')}</span>
          </Button>
        </div>

        {/* Scrollable action pills — visible on every screen, no hidden menu */}
        <div className="-mx-3 sm:-mx-6 lg:-mx-8 border-t border-border/60">
          <div
            className="flex items-center gap-2 overflow-x-auto px-3 sm:px-6 lg:px-8 py-2.5 scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {items.map((item) => {
              const active = isActive(item.to);
              return (
                <Link key={item.to} to={item.to} className="shrink-0">
                  <Button
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    className={`h-10 px-3.5 text-sm font-semibold whitespace-nowrap ${
                      active ? 'shadow-md' : ''
                    }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;