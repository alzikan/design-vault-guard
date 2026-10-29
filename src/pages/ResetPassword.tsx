import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/auth-layout';
import PasswordInput from '@/components/password-input';
import { isRecoveryCallback, passwordValidation } from '@/lib/password-recovery';

// Capture the callback marker before the SDK removes tokens from the address bar.
const initialCallback = isRecoveryCallback(window.location.hash, window.location.search);

export default function ResetPassword() {
  const { t } = useLanguage();
  const [state, setState] = useState<'checking' | 'ready' | 'invalid' | 'success'>('checking');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    let recoveryEvent = false;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const hasError = fragment.has('error') || query.has('error');
    const hasCallback = initialCallback || isRecoveryCallback(window.location.hash, window.location.search);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') recoveryEvent = true;
    });
    const verify = async () => {
      try {
        // Await SDK initialization/URL processing, then validate against the Auth server.
        const { error: sessionError } = await supabase.auth.getSession();
        if (hasError || sessionError || (!hasCallback && !recoveryEvent)) {
          if (active) setState('invalid');
          return;
        }
        const { data, error } = await supabase.auth.getUser();
        if (active) setState(!error && data.user ? 'ready' : 'invalid');
      } catch { if (active) setState('invalid'); }
      finally {
        if (active) window.history.replaceState({}, '', '/reset-password');
      }
    };
    void verify();
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || state !== 'ready') return;
    const validation = passwordValidation(password, confirmation);
    if (validation) { setError(t(validation)); return; }
    setBusy(true); setError('');
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setError(t('auth.updateFailed')); return; }
      setPassword(''); setConfirmation(''); setState('success');
      await supabase.auth.signOut({ scope: 'local' });
    } catch { setError(t('auth.genericError')); }
    finally { setBusy(false); }
  };

  return <AuthLayout>
    <KeyRound className="mb-4 h-8 w-8 text-primary" />
    <h2 className="mb-3 text-2xl font-bold">{t('auth.resetPassword')}</h2>
    {state === 'checking' && <p role="status">{t('auth.checkingLink')}</p>}
    {state === 'invalid' && <div className="space-y-5"><p role="alert" className="text-base">{t('auth.invalidLink')}</p><Button asChild className="h-12 w-full text-base"><Link to="/auth?mode=forgot">{t('auth.requestNewLink')}</Link></Button></div>}
    {state === 'success' && <div className="space-y-5"><p role="status" className="flex items-start gap-3"><CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />{t('auth.passwordUpdated')}</p><Button asChild className="h-12 w-full text-base"><Link to="/auth">{t('auth.backToSignIn')}</Link></Button></div>}
    {state === 'ready' && <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2"><Label htmlFor="new-password" className="text-base font-semibold">{t('auth.newPassword')}</Label><PasswordInput id="new-password" value={password} onChange={setPassword} autoComplete="new-password" /></div>
      <div className="space-y-2"><Label htmlFor="confirm-password" className="text-base font-semibold">{t('auth.confirmPassword')}</Label><PasswordInput id="confirm-password" value={confirmation} onChange={setConfirmation} autoComplete="new-password" /></div>
      {error && <p role="alert" className="rounded-md border border-primary bg-auth-input p-3">{error}</p>}
      <Button type="submit" disabled={busy} className="h-12 w-full text-base font-bold">{t(busy ? 'auth.updatingPassword' : 'auth.updatePassword')}</Button>
    </form>}
  </AuthLayout>;
}