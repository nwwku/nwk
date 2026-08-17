import { Link } from 'wouter';
import { localize, useLanguage } from '../lib/language';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../lib/useCurrentUser';

export function AccountCard() {
  const { language } = useLanguage();
  const { user, loading } = useCurrentUser();
  const tr = (en: string, ru: string) => localize(language, en, ru);

  if (loading) return null;
  return <section className="account-card">
    <div><p className="eyebrow">{tr('Account', 'Аккаунт')}</p><h2>{user ? tr('You are signed in', 'Вы вошли в профиль') : tr('Your NERA profile', 'Твой профиль NERA')}</h2>{user && <p>{user.email}</p>}</div>
    {user ? <button type="button" onClick={() => void supabase.auth.signOut()}>{tr('Log out', 'Выйти')}</button> : <Link href="/auth">{tr('Log in or sign up', 'Войти или зарегистрироваться')}</Link>}
  </section>;
}
