import { useState } from 'react';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { OutfitResult } from '../components/OutfitResult';
import { ScanFlow } from '../components/ScanFlow';
import { outfits, styleNames } from '../lib/mockData';
import { localize, styleLabel, useLanguage } from '../lib/language';
import { useProfileGender } from '../lib/profileGender';

type Mode = 'menu' | 'style' | 'recreate' | 'surprise' | 'scan';

export function CreatePage() {
  const { language } = useLanguage(); const tr = (en:string,ru:string) => localize(language,en,ru);
  const { gender } = useProfileGender();
  const params = new URLSearchParams(location.search);
  const requestedMode = params.get('mode');
  const inspirationImage = params.get('image') ?? undefined;
  const requestedStyle = params.get('style');
  const initial: Mode = requestedMode === 'recreate' || requestedMode === 'scan' ? requestedMode : 'menu';
  const [mode, setMode] = useState<Mode>(initial);
  const [style, setStyle] = useState(requestedStyle ?? 'Street Style');
  const [secondStyle, setSecondStyle] = useState('Y2K');
  const [mix, setMix] = useState(false);
  const [generated, setGenerated] = useState(Boolean(inspirationImage));
  const [outfit, setOutfit] = useState(0);

  if (mode === 'scan') return <ScanFlow onBack={() => setMode('menu')} />;

  if (generated) return <div className="stack-lg"><button className="back-button" onClick={() => setGenerated(false)}>← {tr('Back to create','Назад')}</button><div className="page-title"><div><p className="eyebrow">{tr('Made from what you own','Создано из твоих вещей')}</p><h1>{tr('Your outfit','Твой образ')}</h1></div></div><OutfitResult style={mix ? `${styleLabel(style,language)} + ${styleLabel(secondStyle,language)}` : style} items={outfits[outfit]} onAgain={() => setOutfit((outfit + 1) % outfits.length)} inspirationImage={inspirationImage} /><div className="sustain-note"><Icon name="sparkle" /><p><b>{tr('A no-buy win.','Без новых покупок.')}</b> {tr('Every piece in this look is already in your wardrobe.','Все вещи для этого образа уже есть в гардеробе.')}</p></div></div>;

  if (mode === 'style' && gender === 'male') return <div className="stack-lg fade-in"><button className="back-button" onClick={() => setMode('menu')}>← {tr('Create','Создать')}</button><section className="saved-empty"><Icon name="hanger" size={34} /><h2>{tr('Men’s styles are coming soon', 'Мужские стили скоро появятся')}</h2><p>{tr('Women’s styles are hidden while the men’s profile is selected.', 'Пока выбран мужской профиль, женские стили скрыты.')}</p></section></div>;

  if (mode === 'style') return <div className="stack-lg fade-in"><button className="back-button" onClick={() => setMode('menu')}>← {tr('Create','Создать')}</button><div className="page-title"><div><p className="eyebrow">{tr('Create from style','Создать по стилю')}</p><h1>{tr('What’s the mood?','Какое настроение?')}</h1></div></div><div className="style-grid">{styleNames.map((name, index) => <button className={style === name ? 'style-card active' : 'style-card'} onClick={() => setStyle(name)} key={name}><FashionImage position={`${(index % 3) * 50}% ${index % 2 ? 100 : 0}%`} /><span>{styleLabel(name,language)}</span></button>)}</div><button className="mix-toggle" onClick={() => setMix(!mix)}><span><Icon name="plus" /> {tr('Mix two styles','Смешать два стиля')}</span><b>{mix ? tr('On','Вкл') : tr('Off','Выкл')}</b></button>{mix && <div className="mix-panel"><div><span>{styleLabel(style,language)} 70%</span><span>{styleLabel(secondStyle,language)} 30%</span></div><input type="range" defaultValue="70" /><select value={secondStyle} onChange={(event) => setSecondStyle(event.target.value)}>{styleNames.filter((name) => name !== style).map((name) => <option key={name} value={name}>{styleLabel(name,language)}</option>)}</select></div>}<button className="primary-button sticky-action" onClick={() => setGenerated(true)}>{tr('Create my outfit','Создать мой образ')} <Icon name="sparkle" /></button></div>;

  if (mode === 'recreate') return <div className="stack-lg fade-in"><button className="back-button" onClick={() => setMode('menu')}>← {tr('Create','Создать')}</button><div className="page-title"><div><p className="eyebrow">{tr('Recreate look','Повторить образ')}</p><h1>{tr('Make it yours.','Сделай его своим.')}</h1></div></div><label className="drop-zone"><input type="file" accept="image/*" onChange={() => setGenerated(true)} /><Icon name="upload" size={30} /><h3>{tr('Upload your inspiration','Загрузи вдохновение')}</h3><p>{tr('Photo, screenshot or saved look','Фото, скриншот или сохранённый образ')}</p><span>{tr('Choose image','Выбрать изображение')}</span></label><p className="privacy-note">{tr('NERA finds the closest match using pieces you already own first.','NERA сначала найдёт самое близкое сочетание из твоих вещей.')}</p></div>;

  return <div className="stack-xl fade-in"><section className="hero-copy create-heading"><p className="eyebrow">{tr('Create with NERA','Создавай с NERA')}</p><h1>{tr('Dress for','Одевайся под')}<br /><em>{tr('the feeling.','настроение.')}</em></h1></section><div className={`create-options ${gender === 'male' ? 'create-options--male' : ''}` }><button onClick={() => setMode('style')}><FashionImage position="0% 0%" /><span><small>01</small><b>{tr('Create from style','Создать по стилю')}</b><em>{tr('Choose the exact aesthetic','Выбери нужную эстетику')}</em></span><Icon name="arrow" /></button><button onClick={() => setMode('recreate')}><FashionImage position="50% 100%" /><span><small>02</small><b>{tr('Recreate a look','Повторить образ')}</b><em>{tr('Use a photo you love','Используй любимое фото')}</em></span><Icon name="arrow" /></button><button onClick={() => { setMode('surprise'); setStyle('Style DNA'); setGenerated(true); }}><FashionImage position="100% 100%" /><span><small>03</small><b>{tr('Surprise me','Удиви меня')}</b><em>{tr('Picked from your Style DNA','По твоей ДНК стиля')}</em></span><Icon name="sparkle" /></button></div></div>;
}
