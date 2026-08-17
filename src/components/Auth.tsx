import { useState } from 'react';
import { useLocation } from 'wouter';
import { localize, useLanguage } from '../lib/language';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { SupabaseSetupMessage } from './SupabaseSetupMessage';

type AuthMode = 'signin' | 'signup';

export function Auth() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const tr = (en: string, ru: string) => localize(language, en, ru);

  if (!isSupabaseConfigured) return <SupabaseSetupMessage />;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');
    if (mode === 'signup' && nickname.trim().length < 2) {
      setMessage(tr('Nickname must contain at least 2 characters.', 'Никнейм должен содержать минимум 2 символа.'));
      return;
    }
    setBusy(true);
    const result = mode === 'signup'
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nickname: nickname.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) { setMessage(result.error.message); return; }
    if (result.data.session) setLocation('/profile');
    else setMessage(tr('Check your email to confirm your account.', 'Проверь почту, чтобы подтвердить аккаунт.'));
  }

  async function continueWithGoogle() {
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setBusy(false);
      setMessage(error.message);
    }
  }

  return <section className="auth-card">
    <p className="eyebrow">NERA ACCOUNT</p>
    <h1>{mode === 'signin' ? tr('Welcome back', 'С возвращением') : tr('Create your profile', 'Создай свой профиль')}</h1>
    <p className="auth-intro">{tr('Save outfits and keep your personal style in one place.', 'Сохраняй образы и свой личный стиль в одном месте.')}</p>
    <form onSubmit={handleSubmit} className="auth-form">
      {mode === 'signup' && <label>{tr('Nickname', 'Никнейм')}<input type="text" value={nickname} onChange={(event) => setNickname(event.target.value)} autoComplete="nickname" minLength={2} maxLength={30} required /></label>}
      <label>{tr('Email', 'Электронная почта')}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
      <label>{tr('Password', 'Пароль')}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={6} required /></label>
      <button className="primary-button" type="submit" disabled={busy}>{busy ? '…' : mode === 'signin' ? tr('Log in', 'Войти') : tr('Create account', 'Зарегистрироваться')}</button>
    </form>
    <div className="auth-divider"><span>{tr('or', 'или')}</span></div>
    <button className="google-auth-button" type="button" disabled={busy} onClick={() => void continueWithGoogle()}>
      <span aria-hidden="true">G</span>{tr('Continue with Google', 'Продолжить с Google')}
    </button>
    {message && <p className="auth-message" role="status">{message}</p>}
    <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(''); }}>{mode === 'signin' ? tr('No account yet? Sign up', 'Нет аккаунта? Зарегистрироваться') : tr('Already have an account? Log in', 'Уже есть аккаунт? Войти')}</button>
  </section>;
}
