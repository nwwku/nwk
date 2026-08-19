import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { localize, useLanguage } from '../lib/language';
import type { WardrobeItem } from '../lib/mockData';
import { useProfileGender } from '../lib/profileGender';
import { useCurrentUser } from '../lib/useCurrentUser';
import { loadWardrobe } from '../lib/wardrobe';
import { loadCapsuleIds, setCapsuleItem } from '../lib/wardrobeActivity';

export function CapsulePage() {
  const { language } = useLanguage(); const tr = (en: string, ru: string) => localize(language, en, ru);
  const { gender } = useProfileGender(); const { user } = useCurrentUser();
  const [items, setItems] = useState<WardrobeItem[]>([]); const [selected, setSelected] = useState<string[]>([]); const [message, setMessage] = useState('');
  useEffect(() => { if (!user) return; void Promise.all([loadWardrobe(gender), loadCapsuleIds()]).then(([wardrobe, ids]) => { setItems(wardrobe); setSelected(ids.filter((id) => wardrobe.some((item) => item.id === id))); }).catch(() => setMessage(tr('Could not load the capsule.', 'Не удалось загрузить капсулу.'))); }, [gender, user]);
  async function toggle(id: string) {
    if (!user) return; const next = !selected.includes(id); if (next && selected.length >= 15) return setMessage(tr('A capsule can contain up to 15 pieces.', 'В капсуле может быть до 15 вещей.'));
    setSelected((current) => next ? [...current, id] : current.filter((item) => item !== id)); setMessage('');
    try { await setCapsuleItem(user.id, id, next); } catch { setSelected((current) => next ? current.filter((item) => item !== id) : [...current, id]); setMessage(tr('Could not save the capsule.', 'Не удалось сохранить капсулу.')); }
  }
  const combinations = selected.length < 3 ? 0 : Math.min(99, Math.floor(selected.length * (selected.length - 1) / 2));
  if (!user) return <div className="saved-empty"><Icon name="hanger" /><h1>{tr('Capsule wardrobe', 'Капсульный гардероб')}</h1><p>{tr('Sign in to build your capsule.', 'Войди, чтобы собрать свою капсулу.')}</p><Link className="primary-button" href="/auth">{tr('Sign in', 'Войти')}</Link></div>;
  return <div className="stack-lg fade-in"><section className="page-title"><div><p className="eyebrow">{selected.length}/15 {tr('pieces', 'вещей')}</p><h1>{tr('Your capsule', 'Твоя капсула')}</h1></div><span className="score-ring">{combinations}</span></section><p className="page-intro">{tr('Choose versatile pieces that work together. The number shows possible pairings.', 'Выбери универсальные вещи, которые сочетаются между собой. Число показывает возможные пары.')}</p>{message && <p className="form-error">{message}</p>}
    <section className="capsule-grid">{items.map((item) => <button className={selected.includes(item.id) ? 'selected' : ''} onClick={() => void toggle(item.id)} key={item.id}><FashionImage src={item.image} /><span>{selected.includes(item.id) ? '✓ ' : '+ '}{item.name}</span></button>)}</section>
    {!items.length && <div className="empty-state"><Icon name="hanger" /><p>{tr('Add pieces to your wardrobe first.', 'Сначала добавь вещи в гардероб.')}</p><Link href="/wardrobe?add=true">{tr('Open wardrobe', 'Открыть гардероб')}</Link></div>}
  </div>;
}
