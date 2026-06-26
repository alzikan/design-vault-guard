import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Palette, LogOut, User, Users, Image as ImageIcon, BookOpen, Video } from 'lucide-react';
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
    { to: '/admin/artworks', label: t('admin.tab.art'), icon: <ImageIcon className="h-5 w-5" strokeWidth={2.25} /> },
    { to: '/admin/lessons', label: t('admin.tab.lesson'), icon: <BookOpen className="h-5 w-5" strokeWidth={2.25} /> },
    { to: '/admin/videos', label: t('admin.tab.video'), icon: <Video className="h-5 w-5" strokeWidth={2.25} /> },
    { to: '/admin/profile', label: t('admin.tab.artist'), icon: <User className="h-5 w-5" strokeWidth={2.25} /> },
    { to: '/admin/users', label: t('admin.tab.users'), icon: <Users className="h-5 w-5" strokeWidth={2.25} /> },
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

        {/* Icon-tile grid — fits 5 across on mobile, no horizontal scroll */}
        <div className="-mx-3 sm:-mx-6 lg:-mx-8 border-t border-[#4A3728]/60 bg-gradient-to-b from-[#241612] to-[#1A0F0A] px-3 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 max-w-2xl mx-auto">
            {items.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-2xl border transition-all ${
                    active
                      ? 'bg-gradient-to-b from-[#C5A059] to-[#A8823F] text-[#1A0F0A] border-[#E2C792] shadow-[0_6px_20px_-6px_rgba(197,160,89,0.55)]'
                      : 'bg-[#2D1B14] text-[#FDF8F1] border-[#4A3728] active:scale-95 hover:bg-[#3D281E] hover:border-[#C5A059]/40'
                  }`}
                >
                  <span
                    className={
                      active
                        ? 'text-[#1A0F0A]'
                        : 'text-[#C5A059] group-hover:text-[#E2C792]'
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold leading-tight">
                    {item.label}
                  </span>
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