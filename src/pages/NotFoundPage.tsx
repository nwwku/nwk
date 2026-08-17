import { Link } from 'wouter';
import { localize, useLanguage } from '../lib/language';

export function NotFoundPage() {
  const { language } = useLanguage(); const tr = (en:string,ru:string) => localize(language,en,ru);
  return (
    <main className="onboarding result-onboarding">
      <p className="wordmark">NERA</p>
      <p className="eyebrow">404</p>
      <h1>{tr('That look','Такого образа')}<br /><em>{tr('isn’t here.','здесь нет.')}</em></h1>
      <p>{tr('The page may have moved or never existed.','Страница перемещена или ещё не создана.')}</p>
      <Link className="primary-button" href="/">{tr('Back home','На главную')}</Link>
    </main>
  );
}
