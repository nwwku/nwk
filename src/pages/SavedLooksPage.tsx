import { useState } from 'react';
import { Link } from 'wouter';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { localize, styleLabel, useLanguage } from '../lib/language';
import { loadSavedLooks, removeSavedLook, savedCategory, savedGender, type SavedCategory } from '../lib/savedLooks';
import { useProfileGender } from '../lib/profileGender';

type Filter = 'all' | SavedCategory;
const filters: Filter[] = ['all', 'idea', 'outfit', 'item'];

export function SavedLooksPage() {
  const { language } = useLanguage();
  const { gender } = useProfileGender();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const [looks, setLooks] = useState(loadSavedLooks);
  const [filter, setFilter] = useState<Filter>('all');
  const genderLooks = looks.filter((look) => savedGender(look) === gender);
  const visible = filter === 'all' ? genderLooks : genderLooks.filter((look) => savedCategory(look) === filter);
  const labels: Record<Filter, string> = { all: tr('All', 'Все'), idea: tr('Ideas', 'Идеи'), outfit: tr('Outfits', 'Наряды'), item: tr('Items', 'Вещи') };
  const count = (item: Filter) => item === 'all' ? genderLooks.length : genderLooks.filter((look) => savedCategory(look) === item).length;
  const remove = (id: string) => { removeSavedLook(id); setLooks(loadSavedLooks()); };

  return <div className="stack-lg fade-in saved-looks-page">
    <div className="page-title"><div><p className="eyebrow">NERA EDIT</p><h1>{tr('Favorites', 'Избранное')}</h1></div><Icon name="heart" /></div>
    <div className="saved-tabs" role="tablist" aria-label={tr('Favorite categories', 'Категории избранного')}>
      {filters.map((item) => <button role="tab" aria-selected={filter === item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{labels[item]} <span>{count(item)}</span></button>)}
    </div>
    {visible.length === 0 ? <section className="saved-empty"><Icon name="heart" size={34} /><h2>{tr('Nothing here yet', 'Здесь пока пусто')}</h2><p>{tr('Tap a heart to add something to this section.', 'Нажми на сердечко, чтобы добавить сюда понравившееся.')}</p><Link href="/discover" className="primary-button">{tr('Find inspiration', 'Найти вдохновение')}</Link></section> :
      <div className="saved-looks-grid">{visible.map((look) => <article key={look.id}><FashionImage src={look.image} /><div><p className="eyebrow">{styleLabel(look.style, language)}</p><h2>{look.title ?? tr('Your saved outfit', 'Твой сохранённый наряд')}</h2><button onClick={() => remove(look.id)}><Icon name="heart" size={17} /> {tr('Remove', 'Удалить')}</button></div></article>)}</div>}
  </div>;
}
