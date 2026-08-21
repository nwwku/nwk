import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { WardrobeRequiredDialog } from '../components/WardrobeRequiredDialog';
import { localize, useLanguage } from '../lib/language';
import type { WardrobeItem } from '../lib/mockData';
import { useProfileGender } from '../lib/profileGender';
import { useCurrentUser } from '../lib/useCurrentUser';
import { loadWardrobe } from '../lib/wardrobe';
import { addPlan, loadPlans, removePlan, type OutfitPlan } from '../lib/wardrobeActivity';

export function PlannerPage() {
  const { language } = useLanguage(); const tr = (en: string, ru: string) => localize(language, en, ru);
  const { gender } = useProfileGender(); const { user } = useCurrentUser();
  const [plans, setPlans] = useState<OutfitPlan[]>([]); const [items, setItems] = useState<WardrobeItem[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [occasion, setOccasion] = useState('');
  const [selected, setSelected] = useState<string[]>([]); const [message, setMessage] = useState('');
  const [wardrobePromptOpen, setWardrobePromptOpen] = useState(false);
  const itemMap = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  useEffect(() => { if (!user) return; void Promise.all([loadPlans(gender), loadWardrobe(gender)])
    .then(([savedPlans, wardrobe]) => { setPlans(savedPlans); setItems(wardrobe); setWardrobePromptOpen(wardrobe.length === 0); }).catch(() => setMessage(tr('Could not load the planner.', 'Не удалось загрузить календарь.'))); }, [gender, user]);

  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current); }
  async function submit(event: FormEvent) {
    event.preventDefault(); if (!user || !selected.length) return;
    try { const plan = await addPlan(user.id, gender, { plannedFor: date, title: occasion.trim() || tr('My outfit', 'Мой образ'), occasion: occasion.trim(), wardrobeItemIds: selected }); setPlans((current) => [...current, plan].sort((a, b) => a.plannedFor.localeCompare(b.plannedFor))); setSelected([]); setOccasion(''); }
    catch { setMessage(tr('Could not save the outfit.', 'Не удалось сохранить образ.')); }
  }
  async function remove(id: string) { try { await removePlan(id); setPlans((current) => current.filter((plan) => plan.id !== id)); } catch { setMessage(tr('Could not delete the plan.', 'Не удалось удалить план.')); } }

  if (!user) return <div className="saved-empty"><Icon name="hanger" /><h1>{tr('Outfit calendar', 'Календарь образов')}</h1><p>{tr('Sign in to plan and save outfits.', 'Войди, чтобы планировать и сохранять образы.')}</p><Link className="primary-button" href="/auth">{tr('Sign in', 'Войти')}</Link></div>;
  return <div className="stack-lg fade-in"><section className="page-title"><div><p className="eyebrow">{tr('Plan ahead', 'Планируй заранее')}</p><h1>{tr('Outfit calendar', 'Календарь образов')}</h1></div></section>
    <form className="planner-form" onSubmit={submit}><div className="form-grid"><label>{tr('Date', 'Дата')}<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>{tr('Occasion', 'Событие')}<input value={occasion} maxLength={60} onChange={(event) => setOccasion(event.target.value)} placeholder={tr('School, party…', 'Школа, праздник…')} /></label></div><p>{tr('Choose up to 4 pieces', 'Выбери до 4 вещей')}</p><div className="planner-picks">{items.map((item) => <button type="button" className={selected.includes(item.id) ? 'selected' : ''} onClick={() => toggle(item.id)} key={item.id}><FashionImage src={item.image} /><span>{item.name}</span></button>)}</div><button className="primary-button" disabled={!selected.length}>{tr('Add to calendar', 'Добавить в календарь')}</button></form>
    {message && <p className="form-error">{message}</p>}<section className="plan-list">{plans.map((plan) => <article key={plan.id}><time>{new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' }).format(new Date(`${plan.plannedFor}T12:00:00`))}</time><div><h2>{plan.title}</h2><p>{plan.wardrobeItemIds.map((id) => itemMap.get(id)?.name).filter(Boolean).join(' · ')}</p></div><button onClick={() => void remove(plan.id)} aria-label={tr('Delete', 'Удалить')}><Icon name="close" /></button></article>)}</section>
    {wardrobePromptOpen && <WardrobeRequiredDialog action="calendar" onClose={() => setWardrobePromptOpen(false)} />}
  </div>;
}
