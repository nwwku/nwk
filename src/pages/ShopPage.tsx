import { useState } from 'react';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { ScanFlow } from '../components/ScanFlow';
import { shopItems } from '../lib/mockData';
import { localize, useLanguage } from '../lib/language';
import { useProfileGender } from '../lib/profileGender';

const maleShopImages: Record<string, string> = {
  'Black leather loafers': '/assets/shop/men/ivory-knit.png',
  'Lightweight trench': '/assets/shop/men/graphic-jacket.png',
  'Silver shoulder bag': '/assets/shop/men/gray-knit.png',
};

const femaleShopImages: Record<string, string> = {
  'Black leather loafers': '/assets/shop/women/brown-blouse.png',
  'Lightweight trench': '/assets/shop/women/ivory-cardigan.png',
  'Silver shoulder bag': '/assets/shop/women/brown-leather.png',
};

export function ShopPage() {
  const { language } = useLanguage(); const tr = (en:string,ru:string) => localize(language,en,ru);
  const { gender } = useProfileGender();
  const [filter, setFilter] = useState('Missing');
  const [scanning, setScanning] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  if (scanning) return <ScanFlow shopping onBack={() => setScanning(false)} />;

  function toggleSaved(name: string) {
    setSaved(saved.includes(name) ? saved.filter((item) => item !== name) : [...saved, name]);
  }

  return <div className="stack-lg fade-in">
    <section className="page-title"><div><p className="eyebrow">{tr('Buy only what adds value','Покупай только нужное')}</p><h1>{tr('Smart shop','Умные покупки')}</h1></div></section>
    <div className="buy-check"><div><Icon name="scan" /><div><p className="eyebrow light">{tr('In a store?','В магазине?')}</p><h3>{tr('Should I buy it?','Стоит покупать?')}</h3></div></div><button onClick={() => setScanning(true)}>{tr('Scan item','Сканировать')} <Icon name="arrow" size={17} /></button></div>
    <div className="shop-tabs">{['Missing', 'Recommended', 'Maybe'].map((item) => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{language === 'ru' ? ({Missing:'Не хватает',Recommended:'Рекомендуем',Maybe:'Возможно'} as Record<string,string>)[item] : item}</button>)}</div>
    <section className="shop-list">{shopItems.filter((item) => item.type === filter).map((item) => <article key={item.name}>
      <FashionImage className={gender === 'female' ? 'shop-female-image shop-female-close' : 'shop-male-image'} position={item.position} src={gender === 'female' ? femaleShopImages[item.name] : maleShopImages[item.name]} />
      <div><p className="eyebrow">{item.score}% {tr('priority','приоритет')}</p><h2>{language === 'ru' ? ({'Black leather loafers':'Чёрные кожаные лоферы','Lightweight trench':'Лёгкий тренч','Silver shoulder bag':'Серебристая сумка'} as Record<string,string>)[item.name] : item.name}</h2><div className="shop-stats"><span><b>{item.matches}</b> {tr('matches','сочетаний')}</span><span><b>{item.outfits}</b> {tr('new outfits','новых образов')}</span></div><p>{tr('Fills a real gap and works with your strongest styles.','Закрывает реальный пробел и подходит твоим главным стилям.')}</p><button className="outline-button" onClick={() => toggleSaved(item.name)}>{saved.includes(item.name) ? tr('Added to list ✓','Добавлено ✓') : tr('Add to shopping list','Добавить в список')} <Icon name="arrow" size={16} /></button></div>
    </article>)}</section>
    <div className="sustain-note"><Icon name="sparkle" /><p><b>{tr('Your wardrobe comes first.','Сначала — твой гардероб.')}</b> {tr('NERA only recommends pieces that unlock meaningful new combinations.','NERA рекомендует только вещи, которые создают полезные новые сочетания.')}</p></div>
  </div>;
}
