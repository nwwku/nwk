import { createPortal } from 'react-dom';
import { Link } from 'wouter';
import { localize, useLanguage } from '../lib/language';
import { Icon } from './Icon';

type WardrobeAction = 'outfit' | 'capsule' | 'calendar';

type Props = {
  action: WardrobeAction;
  onClose: () => void;
  secondaryHref?: string;
};

const copy = {
  outfit: {
    en: 'To create an outfit, first add the clothes you own to your wardrobe.',
    ru: 'Чтобы создать образ, сначала добавь в гардероб вещи, которые у тебя есть.',
  },
  capsule: {
    en: 'To build a capsule, first add a few pieces to your wardrobe.',
    ru: 'Чтобы собрать капсулу, сначала добавь несколько вещей в гардероб.',
  },
  calendar: {
    en: 'To plan an outfit, first add clothes to your wardrobe.',
    ru: 'Чтобы запланировать образ, сначала добавь вещи в гардероб.',
  },
} satisfies Record<WardrobeAction, { en: string; ru: string }>;

export function WardrobeRequiredDialog({ action, onClose, secondaryHref }: Props) {
  const { language } = useLanguage();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const message = copy[action];

  return createPortal(<div className="auth-required-backdrop" onMouseDown={onClose}>
    <section className="auth-required-dialog" role="dialog" aria-modal="true" aria-labelledby="wardrobe-required-title" onMouseDown={(event) => event.stopPropagation()}>
      <button className="auth-required-close" type="button" onClick={onClose} aria-label={tr('Close', 'Закрыть')}><Icon name="close" /></button>
      <Icon name="hanger" size={34} />
      <p className="eyebrow">NERA WARDROBE</p>
      <h2 id="wardrobe-required-title">{tr('Add clothes first', 'Сначала добавь вещи')}</h2>
      <p>{localize(language, message.en, message.ru)}</p>
      <div className="auth-required-actions">
        <Link className="primary-button" href="/wardrobe?add=true">{tr('Go to wardrobe', 'Перейти в гардероб')}</Link>
        {secondaryHref && <Link className="auth-required-login" href={secondaryHref}>{tr('Find pieces for this look', 'Найти вещи для образа')}</Link>}
      </div>
    </section>
  </div>, document.body);
}
