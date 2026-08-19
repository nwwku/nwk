import { useEffect, useMemo, useState } from 'react';
import { AddItemModal } from '../components/AddItemModal';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { localize, useLanguage } from '../lib/language';
import type { WardrobeItem } from '../lib/mockData';
import { useCurrentUser } from '../lib/useCurrentUser';
import { deleteWardrobeItem, loadWardrobe, saveWardrobeItem } from '../lib/wardrobe';
import { wardrobeCategories } from '../lib/wardrobeCategories';
import { useProfileGender } from '../lib/profileGender';
import { loadWearCounts, logWear } from '../lib/wardrobeActivity';

export function WardrobePage() {
  const { language } = useLanguage();
  const { gender } = useProfileGender();
  const { user, loading: userLoading } = useCurrentUser();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAdd, setShowAdd] = useState(new URLSearchParams(location.search).has('add'));
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [wearCounts, setWearCounts] = useState<Record<string, number>>({});
  const visible = useMemo(() => items.filter((item) => (category === 'All' || item.category === category) && item.name.toLowerCase().includes(search.toLowerCase())), [items, category, search]);

  useEffect(() => {
    let active = true;
    if (userLoading) return () => { active = false; };
    if (!user) { setItems([]); setLoading(false); return () => { active = false; }; }
    setLoading(true); setMessage('');
    void Promise.all([loadWardrobe(gender), loadWearCounts()]).then(([savedItems, counts]) => { if (active) { setItems(savedItems); setWearCounts(counts); } })
      .catch(() => { if (active) setMessage(tr('Could not load the wardrobe.', 'Не удалось загрузить гардероб.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [gender, user, userLoading]);

  async function saveItem(item: WardrobeItem) {
    if (!user) throw new Error('Sign in required');
    const savedItem = await saveWardrobeItem(item, gender, user.id);
    setItems((current) => current.some((currentItem) => currentItem.id === savedItem.id)
      ? current.map((currentItem) => currentItem.id === savedItem.id ? savedItem : currentItem)
      : [savedItem, ...current]);
  }

  async function removeItem(item: WardrobeItem) {
    if (!confirm(tr(`Delete “${item.name}”?`, `Удалить «${item.name}»?`))) return;
    try { await deleteWardrobeItem(item); setItems((current) => current.filter((currentItem) => currentItem.id !== item.id)); }
    catch { setMessage(tr('Could not delete the item.', 'Не удалось удалить вещь.')); }
  }

  function closeModal() { setShowAdd(false); setEditingItem(null); }
  async function woreToday(item: WardrobeItem) {
    if (!user) return;
    try { await logWear(user.id, item.id); setWearCounts((current) => ({ ...current, [item.id]: Math.max(1, current[item.id] ?? 0) })); setMessage(tr(`Marked “${item.name}” as worn today.`, `Отмечено: «${item.name}» сегодня надета.`)); }
    catch { setMessage(tr('Could not record the wear.', 'Не удалось отметить носку.')); }
  }

  return <div className="stack-lg fade-in">
    <section className="page-title"><div><p className="eyebrow">{tr(`${items.length} pieces`, `${items.length} вещей`)}</p><h1>{tr('Wardrobe', 'Гардероб')}</h1></div><button className="circle-button" onClick={() => { setEditingItem(null); setShowAdd(true); }}><Icon name="plus" /></button></section>
    <div className="search-box"><Icon name="search" size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tr('Search your wardrobe', 'Поиск в гардеробе')} /></div>
    <div className="chip-row"><button onClick={() => setCategory('All')} className={category === 'All' ? 'chip active' : 'chip'}>{tr('All', 'Все')}</button>{wardrobeCategories.map((item) => <button key={item.value} onClick={() => setCategory(item.value)} className={category === item.value ? 'chip active' : 'chip'}>{tr(item.en, item.ru)}</button>)}</div>
    {message && <p className="form-error">{message}</p>}
    {loading ? <div className="empty-state"><p>{tr('Loading wardrobe…', 'Загружаем гардероб…')}</p></div> : <section className="wardrobe-grid">{visible.map((item) => <article className="item-card" key={item.id}>
      <FashionImage position={item.imagePosition} src={item.image} />
      <div><p>{item.category}</p><h3>{item.name}</h3><span>{item.color} · {item.material} · {wearCounts[item.id] ?? 0}× {tr('worn', 'надета')}</span></div>
      <div className="item-card__actions"><button onClick={() => void woreToday(item)}>{tr('Wore today', 'Надел сегодня')}</button><button onClick={() => setEditingItem(item)}>{tr('Edit', 'Изменить')}</button><button className="danger" onClick={() => void removeItem(item)}>{tr('Delete', 'Удалить')}</button></div>
    </article>)}</section>}
    {!loading && visible.length === 0 && <div className="empty-state"><Icon name="search" /><h3>{tr('No pieces found', 'Ничего не найдено')}</h3><p>{user ? tr('Add your first item.', 'Добавь свою первую вещь.') : tr('Sign in to save your wardrobe.', 'Войди в аккаунт, чтобы сохранять гардероб.')}</p></div>}
    {(showAdd || editingItem) && <AddItemModal initialItem={editingItem ?? undefined} onClose={closeModal} onSave={saveItem} />}
  </div>;
}
