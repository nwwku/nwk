import { Link } from 'wouter';
import { localize, useLanguage } from '../lib/language';
import type { WardrobeItem } from '../lib/mockData';
import { FashionImage } from './FashionImage';
import { Icon } from './Icon';

export function OutfitPieces({ pieces }: { pieces: WardrobeItem[] }) {
  const { language } = useLanguage();
  const tr = (en: string, ru: string) => localize(language, en, ru);

  return <section className="outfit-pieces">
    <div className="section-heading"><div><p className="eyebrow">{tr('Look details', 'Состав образа')}</p><h2>{tr('Pieces in this outfit', 'Вещи в этом образе')}</h2></div></div>
    {pieces.length > 0 ? <div className="outfit-pieces__grid">{pieces.map((piece) => <article key={piece.id}>
      <FashionImage src={piece.image} position={piece.imagePosition} />
      <div><p>{piece.category}</p><h3>{piece.name}</h3><span>{piece.color}</span></div>
    </article>)}</div> : <div className="outfit-pieces__empty">
      <p>{tr('Add items to your wardrobe to see them here.', 'Добавь вещи в гардероб, чтобы увидеть их здесь.')}</p>
      <Link href="/wardrobe?add=true">{tr('Open wardrobe', 'Открыть гардероб')} <Icon name="arrow" size={15} /></Link>
    </div>}
  </section>;
}
