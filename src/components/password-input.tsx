import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PasswordInput({ id, value, onChange, autoComplete = 'current-password' }: { id: string; value: string; onChange: (value: string) => void; autoComplete?: string }) {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();
  return <div className="relative">
    <Input id={id} type={visible ? 'text' : 'password'} value={value} onChange={event => onChange(event.target.value)} autoComplete={autoComplete} required minLength={6} className="auth-input h-12 pe-14 text-base" />
    <Button type="button" variant="ghost" size="icon" className="absolute end-1 top-1 h-10 w-10 text-auth-foreground" aria-label={t(visible ? 'auth.hidePassword' : 'auth.showPassword')} title={t(visible ? 'auth.hidePassword' : 'auth.showPassword')} onClick={() => setVisible(!visible)}>{visible ? <EyeOff /> : <Eye />}</Button>
  </div>;
}