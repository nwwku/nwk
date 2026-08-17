import { Link } from 'wouter';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { useLanguage } from '../lib/language';
import { useProfileGender } from '../lib/profileGender';

const copy = {
  en: {
    greeting: 'Good morning, Nora', title: <>Your style,<br /><em>today.</em></>, today: 'Today’s outfit', outfit: 'Soft structure', dna: 'Your Style DNA', mood: 'Quietly confident.', quick: 'Quick actions', wardrobe: 'Your wardrobe', pieces: <>42 pieces.<br />More possibilities.</>, insight: '3 overlooked items could create 14 new outfits.', explore: 'Explore wardrobe',
    actions: [['Create outfit', 'From your wardrobe'], ['Recreate look', 'Upload inspiration'], ['Scan item', 'Add in seconds'], ['Add to wardrobe', 'Manually']],
  },
  ru: {
    greeting: 'Доброе утро, Нора', title: <>Твой стиль —<br /><em>сегодня.</em></>, today: 'Образ дня', outfit: 'Мягкая структура', dna: 'Твоя ДНК стиля', mood: 'Спокойная уверенность.', quick: 'Быстрые действия', wardrobe: 'Твой гардероб', pieces: <>42 вещи.<br />Больше сочетаний.</>, insight: '3 вещи могут создать 14 новых образов.', explore: 'Открыть гардероб',
    actions: [['Создать образ', 'Из твоего гардероба'], ['Повторить образ', 'Загрузить вдохновение'], ['Сканировать вещь', 'Добавить за секунды'], ['Добавить вещь', 'Вручную']],
  },
};

const actionLinks = [
  { href: '/create', icon: 'sparkle' as const },
  { href: '/create?mode=recreate', icon: 'upload' as const },
  { href: '/create?mode=scan', icon: 'scan' as const },
  { href: '/wardrobe?add=true', icon: 'plus' as const },
];

export function HomePage() {
  const { language } = useLanguage();
  const { gender } = useProfileGender();
  const text = copy[language];
  return <div className="stack-xl fade-in">
    <section className="hero-copy"><p className="eyebrow">{text.greeting}</p><h1>{text.title}</h1></section>
    <section className="outfit-hero"><FashionImage className={gender === 'male' ? 'home-outfit-men' : ''} src={gender === 'male' ? '/assets/home-outfit-men.png' : '/assets/home-outfit.png'} /><div className="outfit-hero__overlay"><div><p className="eyebrow light">{text.today}</p><h2>{text.outfit}</h2><p>Minimal · Casual</p></div><Link href="/create" className="round-arrow"><Icon name="arrow" /></Link></div></section>
    <section><div className="section-heading"><div><p className="eyebrow">{text.dna}</p><h2>{text.mood}</h2></div><span className="score-ring">92</span></div><div className="dna-bars"><div><span style={{ width:'42%' }} /><b>42%</b><p>Casual</p></div><div><span style={{ width:'31%' }} /><b>31%</b><p>Street Style</p></div><div><span style={{ width:'18%' }} /><b>18%</b><p>Minimal</p></div><div><span style={{ width:'9%' }} /><b>9%</b><p>Vintage</p></div></div></section>
    <section><p className="eyebrow section-label">{text.quick}</p><div className="action-grid">{actionLinks.map((action, index) => <Link href={action.href} className="action-card" key={action.href}><Icon name={action.icon} /><div><b>{text.actions[index][0]}</b><span>{text.actions[index][1]}</span></div><Icon name="arrow" size={18} /></Link>)}</div></section>
    <section className="insight-card"><div><p className="eyebrow light">{text.wardrobe}</p><h2>{text.pieces}</h2><p>{text.insight}</p></div><Link href="/wardrobe">{text.explore} <Icon name="arrow" size={17} /></Link></section>
  </div>;
}
