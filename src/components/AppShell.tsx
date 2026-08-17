import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Icon } from './Icon';
import { useLanguage } from '../lib/language';
import { useAvatar } from '../lib/avatar';

const nav = [
  { href: '/', label: 'Home', icon: 'home' as const },
  { href: '/wardrobe', label: 'Wardrobe', icon: 'hanger' as const },
  { href: '/create', label: 'Create', icon: 'plus' as const },
  { href: '/discover', label: 'Discover', icon: 'compass' as const },
  { href: '/shop', label: 'Shop', icon: 'bag' as const },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { avatar } = useAvatar();
  const labels = language === 'ru' ? ['Главная', 'Гардероб', 'Создать', 'Идеи', 'Покупки'] : nav.map((item) => item.label);
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" className="wordmark">NERA</Link>
        <div className="topbar__actions">
          <Link href="/stylist" className="stylist-button" aria-label={language === 'ru' ? 'Открыть AI-стилиста' : 'Open AI stylist'}><Icon name="sparkle" /><span>AI</span></Link>
          <Link href="/saved" className="icon-button saved-button" aria-label={language === 'ru' ? 'Сохранённые образы' : 'Saved looks'}><Icon name="heart" /></Link>
          <button className="language-button" onClick={toggleLanguage} aria-label={language === 'en' ? 'Переключить на русский' : 'Switch to English'}>{language === 'en' ? 'RU' : 'EN'}</button>
          <Link href="/create?mode=scan" className="icon-button" aria-label="Scan item"><Icon name="scan" /></Link>
          <Link href="/profile" className="avatar" aria-label="Profile"><img src={avatar} alt="" /></Link>
        </div>
      </header>
      <main className="page">{children}</main>
      <nav className="bottom-nav">
        {nav.map((item, index) => <Link key={item.href} href={item.href} className={location === item.href ? 'nav-link active' : 'nav-link'}><Icon name={item.icon} /><span>{labels[index]}</span></Link>)}
      </nav>
    </div>
  );
}
