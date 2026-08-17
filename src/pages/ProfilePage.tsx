import { Link } from 'wouter';
import { ProfileIdentity } from '../components/ProfileIdentity';
import { Icon } from '../components/Icon';
import { localize, useLanguage } from '../lib/language';
import { useTheme } from '../lib/theme';
import { useProfileGender } from '../lib/profileGender';
import { AccountCard } from '../components/AccountCard';

export function ProfilePage() {
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { gender, setGender } = useProfileGender();
  const tr = (en: string, ru: string) => localize(language, en, ru);

  return <div className="stack-xl fade-in">
    <AccountCard />
    <ProfileIdentity />
    <section className="profile-gender"><div><p className="eyebrow">{tr('Profile settings', 'Настройки профиля')}</p><h2>{tr('Gender', 'Пол')}</h2></div><div className="gender-options" role="group" aria-label={tr('Gender', 'Пол')}><button className={gender === 'female' ? 'active' : ''} onClick={() => setGender('female')}>{tr('Female', 'Женский')}</button><button className={gender === 'male' ? 'active' : ''} onClick={() => setGender('male')}>{tr('Male', 'Мужской')}</button></div></section>
    <section className="profile-gender"><div><p className="eyebrow">{tr('Appearance', 'Оформление')}</p><h2>{tr('Theme', 'Тема')}</h2></div><div className="gender-options" role="group" aria-label={tr('Theme', 'Тема')}><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>{tr('Light', 'Светлая')}</button><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>{tr('Dark', 'Тёмная')}</button></div></section>
    <section className="profile-stats"><div><b>42</b><span>{tr('Wardrobe', 'Гардероб')}</span></div><div><b>27</b><span>{tr('Saved looks', 'Сохранённые')}</span></div><div><b>84</b><span>{tr('Outfits', 'Образы')}</span></div></section>
    {gender === 'female' ? <section><div className="section-heading"><div><p className="eyebrow">{tr('Style DNA', 'ДНК стиля')}</p><h2>{tr('Your visual language', 'Твой визуальный язык')}</h2></div><span className="score-ring">92</span></div><div className="profile-tags"><span>{tr('Casual', 'Повседневный')} 42%</span><span>{tr('Street Style', 'Уличный стиль')} 31%</span><span>{tr('Minimal', 'Минимализм')} 18%</span><span>{tr('Vintage', 'Винтаж')} 9%</span></div></section> : <section className="saved-empty"><Icon name="hanger" size={34} /><h2>{tr('Build your men’s Style DNA', 'Создай мужскую ДНК стиля')}</h2><p>{tr('Women’s styles are hidden in this profile. Men’s recommendations will be kept separately.', 'Женские стили скрыты в этом профиле. Мужские рекомендации будут храниться отдельно.')}</p></section>}
    <section className="insight-card"><div><p className="eyebrow light">{tr('Wardrobe impact', 'Возможности гардероба')}</p><h2>{tr('76% well worn', '76% вещей используются')}</h2><p>{tr('Your most versatile color is black. Your strongest category is outerwear.', 'Самый универсальный цвет — чёрный. Сильная категория — верхняя одежда.')}</p></div><Link href="/shop">{tr('See wardrobe gaps', 'Посмотреть пробелы')} <Icon name="arrow" size={17} /></Link></section>
  </div>;
}
