import { Link } from 'wouter';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { getLookShoppingItems, storeLinks } from '../lib/lookShopping';
import { localize, styleLabel, useLanguage } from '../lib/language';
import { useProfileGender } from '../lib/profileGender';
import { getStyleQuizOptions } from '../lib/styleQuiz';

export function LookShopPage() {
  const { language } = useLanguage();
  const { gender } = useProfileGender();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const params = new URLSearchParams(window.location.search);
  const style = params.get('style') ?? 'Casual';
  const requestedImage = params.get('image');
  const safeImage = requestedImage?.startsWith('/assets/') ? requestedImage : undefined;
  const cover = safeImage ?? getStyleQuizOptions(gender).find((option) => option.name === style)?.image;
  const items = getLookShoppingItems(style, gender);

  return <div className="stack-lg fade-in">
    <Link className="back-button" href="/create">← {tr('Back to create', 'Назад к созданию')}</Link>
    <section className="look-shop-hero">
      <FashionImage src={cover} />
      <div><p className="eyebrow light">{tr('Shopping guide', 'Гид по покупкам')}</p><h1>{styleLabel(style, language)}</h1><p>{tr('Start with one or two pieces. You do not need to buy the whole look at once.', 'Начни с одной-двух вещей — не обязательно покупать весь образ сразу.')}</p></div>
    </section>
    <section><p className="eyebrow">{tr('Pieces in this look', 'Вещи в этом образе')}</p><div className="look-shopping-list">{items.map((item, index) => <article key={item.en}>
      <span>{String(index + 1).padStart(2, '0')}</span>
      <div><h2>{localize(language, item.en, item.ru)}</h2><p>{tr('Compare the material, fit and price before buying.', 'Перед покупкой сравни материал, посадку и цену.')}</p><div className="look-store-links">{item.stores.map((store) => <a href={storeLinks[store]} target="_blank" rel="noreferrer" key={store}>{store} <Icon name="arrow" size={14} /></a>)}</div></div>
    </article>)}</div></section>
    <p className="shopping-disclaimer">{tr('Store availability and prices may change. Links open official Kazakhstan storefronts.', 'Наличие и цены могут меняться. Ссылки открывают официальные магазины для Казахстана.')}</p>
  </div>;
}
