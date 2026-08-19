import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { localize, useLanguage } from '../lib/language';
import { useProfileGender } from '../lib/profileGender';
import { useCurrentUser } from '../lib/useCurrentUser';
import { loadWardrobe } from '../lib/wardrobe';
import { loadActivityTotals } from '../lib/wardrobeActivity';

type Totals = { wardrobe: number; wears: number; plans: number; capsule: number };

export function AchievementsPage() {
  const { language } = useLanguage(); const tr = (en: string, ru: string) => localize(language, en, ru);
  const { gender } = useProfileGender(); const { user } = useCurrentUser();
  const [totals, setTotals] = useState<Totals>({ wardrobe: 0, wears: 0, plans: 0, capsule: 0 });
  useEffect(() => { if (!user) return; void Promise.all([loadWardrobe(gender), loadActivityTotals()]).then(([items, activity]) => setTotals({ wardrobe: items.length, ...activity })).catch(() => undefined); }, [gender, user]);
  const badges = [
    { icon: 'hanger' as const, title: tr('Wardrobe starter', 'Начало гардероба'), detail: tr('Add 5 pieces', 'Добавь 5 вещей'), value: totals.wardrobe, goal: 5 },
    { icon: 'sparkle' as const, title: tr('Wear it again', 'Носи снова'), detail: tr('Record 7 wears', 'Отметь 7 носок'), value: totals.wears, goal: 7 },
    { icon: 'plus' as const, title: tr('Plan ahead', 'Планируй заранее'), detail: tr('Plan 3 outfits', 'Запланируй 3 образа'), value: totals.plans, goal: 3 },
    { icon: 'heart' as const, title: tr('Capsule creator', 'Создатель капсулы'), detail: tr('Choose 10 capsule pieces', 'Выбери 10 вещей'), value: totals.capsule, goal: 10 },
  ];
  return <div className="stack-lg fade-in"><section className="page-title"><div><p className="eyebrow">NERA Progress</p><h1>{tr('Achievements', 'Достижения')}</h1></div></section><section className="achievement-grid">{badges.map((badge) => { const done = badge.value >= badge.goal; return <article className={done ? 'unlocked' : ''} key={badge.title}><span><Icon name={badge.icon} /></span><div><p>{done ? tr('Unlocked', 'Получено') : `${Math.min(badge.value, badge.goal)}/${badge.goal}`}</p><h2>{badge.title}</h2><small>{badge.detail}</small><i><b style={{ width: `${Math.min(100, badge.value / badge.goal * 100)}%` }} /></i></div></article>; })}</section></div>;
}
