import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MailCheck, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthLayout from '@/components/auth-layout';
import PasswordInput from '@/components/password-input';
import { isRecoveryCallback, resetRedirectUrl } from '@/lib/password-recovery';

export default function Auth() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(new URLSearchParams(location.search).get('mode') === 'forgot' ? 'forgot' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  if (isRecoveryCallback(location.hash, location.search)) {
    return <Navigate to={`/reset-password${location.search}${location.hash}`} replace />;
  }
  const changeMode = (value: string) => { setMode(value); setMessage(''); setError(''); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: resetRedirectUrl(window.location.origin) });
        if (error) { setError(t(error.status === 429 ? 'auth.rateLimited' : 'auth.sendFailed')); return; }
        setMessage(t('auth.resetSent'));
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin } });
        if (error) { setError(t('auth.signupFailed')); return; }
        if (data.session) navigate('/', { replace: true });
        else setMessage(t('auth.confirmEmail'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) { setError(t('auth.invalidCredentials')); return; }
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError || !data.user) { setError(t('auth.genericError')); return; }
        navigate('/', { replace: true });
      }
    } catch { setError(t('auth.genericError')); }
    finally { setLoading(false); }
  };
  return <AuthLayout>
    {mode !== 'forgot' && <Tabs value={mode} onValueChange={changeMode} className="mb-6"><TabsList className="grid h-12 w-full grid-cols-2 bg-auth-input text-auth-foreground"><TabsTrigger value="signin" className="h-10 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{t('auth.signIn')}</TabsTrigger><TabsTrigger value="signup" className="h-10 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{t('auth.signUp')}</TabsTrigger></TabsList></Tabs>}
    <h2 className="mb-2 text-2xl font-bold">{t(mode === 'forgot' ? 'auth.resetPassword' : mode === 'signup' ? 'auth.signUp' : 'auth.welcomeBack')}</h2>
    {mode === 'forgot' && <p className="mb-6 text-base text-auth-foreground">{t('auth.forgotIntro')}</p>}
    <form onSubmit={submit} className="mt-6 space-y-5">
      <div className="space-y-2"><Label htmlFor="auth-email" className="text-base font-semibold">{t('auth.email')}</Label><Input id="auth-email" type="email" dir="ltr" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="auth-input h-12 text-base" /></div>
      {mode !== 'forgot' && <div className="space-y-2"><Label htmlFor="auth-password" className="text-base font-semibold">{t('auth.password')}</Label><PasswordInput id="auth-password" value={password} onChange={setPassword} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></div>}
      {mode === 'signin' && <Button type="button" variant="link" onClick={() => changeMode('forgot')} className="h-11 px-0 text-base font-semibold underline underline-offset-4">{t('auth.forgotPassword')}</Button>}
      {error && <p role="alert" className="rounded-md border border-primary bg-auth-input p-3 text-base text-auth-foreground">{error}</p>}
      {message && <div role="status" className="flex gap-3 rounded-md border border-primary bg-auth-input p-4"><MailCheck className="mt-1 h-5 w-5 shrink-0 text-primary" /><p>{message}</p></div>}
      <Button type="submit" disabled={loading || !!message} className="h-12 w-full text-base font-bold">{mode === 'signin' && <LogIn />}{t(loading ? mode === 'forgot' ? 'auth.sending' : mode === 'signup' ? 'auth.signingUp' : 'auth.signingIn' : mode === 'forgot' ? 'auth.sendResetLink' : mode === 'signup' ? 'auth.signUp' : 'auth.signIn')}</Button>
      {mode === 'forgot' && <Button type="button" variant="ghost" onClick={() => changeMode('signin')} className="h-12 w-full text-base"><ArrowLeft className="rtl:rotate-180" />{t('auth.backToSignIn')}</Button>}
      {message && <Button type="button" variant="link" onClick={() => { setMessage(''); setError(''); }} className="w-full text-base">{t('auth.tryAnotherEmail')}</Button>}
    </form>
  </AuthLayout>;
}
