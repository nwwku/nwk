import { createPortal } from 'react-dom';
import { Link } from 'wouter';
import { localize, useLanguage } from '../lib/language';
import { Icon } from './Icon';

export function AuthRequiredDialog({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const tr = (en: string, ru: string) => localize(language, en, ru);

  return createPortal(<div className="auth-required-backdrop" onMouseDown={onClose}>
    <section className="auth-required-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-required-title" onMouseDown={(event) => event.stopPropagation()}>
      <button className="auth-required-close" type="button" onClick={onClose} aria-label={tr('Close', 'Закрыть')}><Icon name="close" /></button>
      <p className="eyebrow">NERA ACCOUNT</p>
      <h2 id="auth-required-title">{tr('Save your personal outfits', 'Сохраняй свои образы')}</h2>
      <p>{tr(
        'Log in or create a free account to use your wardrobe and create an outfit.',
        'Войди или создай бесплатный аккаунт, чтобы использовать гардероб и создавать образы.',
      )}</p>
      <div className="auth-required-actions">
        <Link className="primary-button" href="/auth?mode=signup">{tr('Create account', 'Зарегистрироваться')}</Link>
        <Link className="auth-required-login" href="/auth?mode=signin">{tr('Log in', 'Войти')}</Link>
      </div>
    </section>
  </div>, document.body);
}
