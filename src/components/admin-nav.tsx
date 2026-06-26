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
    { to: '/admin/users', label: t('admin.users'), icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <nav className="bg-[#1A0F0A] border-b border-[#4A3728]/60 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top row: brand + sign out */}
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <Palette className="h-6 w-6 text-[#C5A059] shrink-0" />
            <span className="text-base sm:text-xl font-bold truncate text-[#FDF8F1]">{t('admin.title')}</span>
          </Link>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-sm font-semibold text-[#FDF8F1]/80 hover:text-[#FDF8F1] hover:bg-[#3D281E]"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            <span className="hidden xs:inline sm:inline">{t('nav.signOut')}</span>
          </Button>
        </div>

        {/* Scrollable action pills — visible on every screen, no hidden menu */}
        <div className="-mx-3 sm:-mx-6 lg:-mx-8 border-t border-[#4A3728]/60 bg-gradient-to-b from-[#241612] to-[#1A0F0A]">
          <div
            className="flex items-center gap-2 overflow-x-auto px-3 sm:px-6 lg:px-8 py-2.5 scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {items.map((item) => {
              const active = isActive(item.to);
              return (
                <Link key={item.to} to={item.to} className="shrink-0">
                  <Button
                    size="sm"
                    className={`h-10 px-4 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#C5A059] to-[#E2C792] text-[#1A0F0A] border-[#C5A059] shadow-[0_4px_16px_-4px_rgba(197,160,89,0.5)] hover:from-[#C5A059] hover:to-[#E2C792]'
                        : 'bg-[#2D1B14] text-[#FDF8F1] border-[#4A3728] hover:bg-[#3D281E] hover:border-[#C5A059]/40'
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