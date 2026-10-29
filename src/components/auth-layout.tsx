import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import artwork from '@/assets/boat-night-painting.jpg';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { toggleLanguage } = useLanguage();
  return (
    <main className="auth-surface min-h-screen bg-auth-background text-auth-foreground">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Button asChild variant="ghost" className="h-11 text-auth-foreground"><Link to="/"><ArrowLeft className="rtl:rotate-180" />{t('nav.home')}</Link></Button>
        <Button variant="ghost" onClick={toggleLanguage} className="h-11 text-auth-foreground"><Languages />{t('nav.language')}</Button>
      </header>
      <div className="mx-auto w-full max-w-md px-5 pb-10 sm:px-6">
        <div className="relative mb-7 h-36 overflow-hidden rounded-lg border border-auth-border">
          <img src={artwork} alt="" className="h-full w-full object-cover" />
          <div className="auth-brand-overlay absolute inset-0 flex flex-col justify-end p-5">
            <p className="text-sm font-medium text-auth-foreground">{t('auth.artist')}</p>
            <h1 className="text-3xl font-bold text-auth-foreground">{t('auth.brand')}</h1>
          </div>
        </div>
        {children}
        <footer className="mt-8 border-t border-auth-border pt-5 text-center">
          <Link className="text-sm font-medium text-primary underline underline-offset-4" to="/privacy-policy">{t('privacy.title')}</Link>
        </footer>
      </div>
    </main>
  );
}