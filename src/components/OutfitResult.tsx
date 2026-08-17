import { useEffect, useState } from 'react';
import { localize, styleLabel, useLanguage } from '../lib/language';
import type { WardrobeItem } from '../lib/mockData';
import { useProfileGender } from '../lib/profileGender';
import { isLookSaved, toggleSavedLook } from '../lib/savedLooks';
import { useCurrentUser } from '../lib/useCurrentUser';
import { loadWardrobe } from '../lib/wardrobe';
import { FashionImage } from './FashionImage';
import { Icon } from './Icon';
import { OutfitPieces } from './OutfitPieces';

const russianItems: Record<string, string> = {
  'Oversized Oxford Shirt': 'Свободная оксфордская рубашка',
  'Relaxed Blue Denim': 'Свободные синие джинсы',
  'Wool Tailored Coat': 'Шерстяное пальто по фигуре',
  'Stone Knit Cardigan': 'Вязаный кардиган песочного цвета',
  'Black leather loafers': 'Чёрные кожаные лоферы',
  'Burgundy Track Jacket': 'Бордовая спортивная куртка',
  'White fitted tee': 'Белая приталенная футболка',
};

type Props = { style: string; items: string[]; onAgain: () => void; inspirationImage?: string };

export function OutfitResult({ style, items, onAgain, inspirationImage }: Props) {
  const { language } = useLanguage();
  const { gender } = useProfileGender();
  const { user } = useCurrentUser();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [pieceOffset, setPieceOffset] = useState(0);

  useEffect(() => {
    let active = true;
    if (user) void loadWardrobe(gender).then((savedItems) => { if (active) setWardrobe(savedItems); }).catch(() => undefined);
    return () => { active = false; };
  }, [gender, user]);

  const orderedWardrobe = [
    ...wardrobe.filter((piece) => piece.style === style),
    ...wardrobe.filter((piece) => piece.style !== style),
  ];
  const pieces = orderedWardrobe.length === 0 ? [] : Array.from({ length: Math.min(3, orderedWardrobe.length) }, (_, index) => orderedWardrobe[(pieceOffset + index) % orderedWardrobe.length]);
  const displayedItems = pieces.length ? pieces.map((piece) => piece.name) : items;
  const lookId = `generated-${style}-${displayedItems.join('-')}`;
  const [saved, setSaved] = useState(() => isLookSaved(lookId));

  useEffect(() => setSaved(isLookSaved(lookId)), [lookId]);

  function tryAnother() { setPieceOffset((current) => current + 1); onAgain(); }

  return <div className="result-stack">
    <section className="result-card fade-in">
      <div className="result-visual"><FashionImage src={inspirationImage ?? "/assets/outfit-result.png"} /><span className="match-pill"><Icon name="sparkle" size={15} />96% {tr('match', 'совпадение')}</span></div>
      <div className="result-copy"><p className="eyebrow">{tr('Your look:', 'Твой образ:')} {styleLabel(style, language)}</p><h2>{tr('Easy proportions', 'Удачные пропорции')}</h2><ul>{displayedItems.map((item) => <li key={item}><span>✓</span>{localize(language, item, russianItems[item] ?? item)}</li>)}</ul><div className="result-actions"><button className="primary-button" onClick={tryAnother}>{tr('Try another', 'Другой вариант')}</button><button className="save-button" onClick={() => setSaved(toggleSavedLook({ id: lookId, style, items: displayedItems, image: '/assets/outfit-result.png', gender }))}><Icon name="heart" /> {saved ? tr('Saved ✓', 'Сохранено ✓') : tr('Save', 'Сохранить')}</button></div></div>
    </section>
    <OutfitPieces pieces={pieces} />
  </div>;
}
