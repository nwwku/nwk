import type { ProfileGender } from './profilePreferences';

export type LookShoppingItem = {
  en: string;
  ru: string;
  stores: Array<'Zara' | 'Mango' | 'LC Waikiki' | 'Lamoda'>;
};

export const storeLinks = {
  Zara: 'https://www.zara.com/kz/',
  Mango: 'https://shop.mango.com/kz/ru',
  'LC Waikiki': 'https://www.lcwaikiki.kz/',
  Lamoda: 'https://www.lamoda.kz/',
} as const;

const femaleLooks: Record<string, LookShoppingItem[]> = {
  Stockholm: [
    { en: 'Oversized grey blazer', ru: 'Серый оверсайз-пиджак', stores: ['Zara', 'Mango'] },
    { en: 'White fitted T-shirt', ru: 'Белая приталенная футболка', stores: ['LC Waikiki', 'Lamoda'] },
    { en: 'Straight blue jeans', ru: 'Прямые синие джинсы', stores: ['Zara', 'LC Waikiki'] },
    { en: 'Minimal sneakers', ru: 'Минималистичные кроссовки', stores: ['Lamoda', 'Zara'] },
  ],
  Downtown: [
    { en: 'Black leather jacket', ru: 'Чёрная кожаная куртка', stores: ['Zara', 'Lamoda'] },
    { en: 'Graphic T-shirt', ru: 'Футболка с принтом', stores: ['LC Waikiki', 'Lamoda'] },
    { en: 'Wide charcoal jeans', ru: 'Широкие серые джинсы', stores: ['Zara', 'Lamoda'] },
    { en: 'Black sneakers', ru: 'Чёрные кроссовки', stores: ['Lamoda', 'Zara'] },
  ],
  Y2K: [
    { en: 'Fitted top', ru: 'Приталенный топ', stores: ['Zara', 'Mango'] },
    { en: 'Wide low-rise jeans', ru: 'Широкие джинсы с низкой посадкой', stores: ['Zara', 'Lamoda'] },
    { en: 'Small shoulder bag', ru: 'Маленькая сумка на плечо', stores: ['Mango', 'Zara'] },
    { en: 'Chunky sneakers', ru: 'Массивные кроссовки', stores: ['Lamoda', 'Zara'] },
  ],
  'Old Money': [
    { en: 'Cream knit cardigan', ru: 'Кремовый кардиган', stores: ['Mango', 'Zara'] },
    { en: 'Striped Oxford shirt', ru: 'Оксфордская рубашка в полоску', stores: ['Mango', 'LC Waikiki'] },
    { en: 'Pleated trousers', ru: 'Брюки со складками', stores: ['Zara', 'Mango'] },
    { en: 'Leather loafers', ru: 'Кожаные лоферы', stores: ['Lamoda', 'Mango'] },
  ],
  'Clean Girl': [
    { en: 'Neutral cardigan', ru: 'Нейтральный кардиган', stores: ['Mango', 'LC Waikiki'] },
    { en: 'White basic top', ru: 'Белый базовый топ', stores: ['Zara', 'LC Waikiki'] },
    { en: 'Straight light jeans', ru: 'Прямые светлые джинсы', stores: ['Zara', 'Lamoda'] },
    { en: 'Clean white sneakers', ru: 'Белые кроссовки', stores: ['Lamoda', 'Zara'] },
  ],
  Coquette: [
    { en: 'Ruffled blouse', ru: 'Блуза с оборками', stores: ['Mango', 'Lamoda'] },
    { en: 'A-line skirt', ru: 'Юбка А-силуэта', stores: ['Zara', 'Mango'] },
    { en: 'Ballet flats', ru: 'Балетки', stores: ['Lamoda', 'Mango'] },
    { en: 'Ribbon shoulder bag', ru: 'Сумка с бантом', stores: ['Zara', 'Lamoda'] },
  ],
};

const sharedLooks: Record<string, LookShoppingItem[]> = {
  'Street Style': [
    { en: 'Oversized bomber jacket', ru: 'Оверсайз-бомбер', stores: ['Zara', 'Lamoda'] },
    { en: 'Graphic T-shirt', ru: 'Футболка с принтом', stores: ['LC Waikiki', 'Lamoda'] },
    { en: 'Cargo trousers', ru: 'Брюки карго', stores: ['Zara', 'LC Waikiki'] },
    { en: 'Street sneakers', ru: 'Уличные кроссовки', stores: ['Lamoda', 'Zara'] },
  ],
  Vintage: [
    { en: 'Vintage-style jacket', ru: 'Куртка в винтажном стиле', stores: ['Zara', 'Lamoda'] },
    { en: 'Textured knit sweater', ru: 'Фактурный свитер', stores: ['Mango', 'LC Waikiki'] },
    { en: 'Faded relaxed jeans', ru: 'Свободные выцветшие джинсы', stores: ['Zara', 'Lamoda'] },
    { en: 'Suede shoes', ru: 'Замшевая обувь', stores: ['Lamoda', 'Mango'] },
  ],
  Casual: [
    { en: 'Relaxed hoodie', ru: 'Свободное худи', stores: ['LC Waikiki', 'Lamoda'] },
    { en: 'Basic cotton T-shirt', ru: 'Базовая хлопковая футболка', stores: ['LC Waikiki', 'Mango'] },
    { en: 'Relaxed jeans', ru: 'Свободные джинсы', stores: ['Zara', 'Lamoda'] },
    { en: 'Everyday sneakers', ru: 'Повседневные кроссовки', stores: ['Lamoda', 'Zara'] },
  ],
};

const maleDowntown: LookShoppingItem[] = [
  { en: 'Oversized black leather bomber', ru: 'Чёрный кожаный оверсайз-бомбер', stores: ['Zara', 'Lamoda'] },
  { en: 'Black basic T-shirt', ru: 'Чёрная базовая футболка', stores: ['LC Waikiki', 'Mango'] },
  { en: 'Wide washed grey jeans', ru: 'Широкие выцветшие серые джинсы', stores: ['Zara', 'Lamoda'] },
  { en: 'Black technical sneakers', ru: 'Чёрные технологичные кроссовки', stores: ['Lamoda', 'Zara'] },
];

export function getLookShoppingItems(style: string, gender: ProfileGender) {
  if (gender === 'male' && (style === 'Downtown' || style === 'Acubi' || style === 'Starboy')) return maleDowntown;
  return sharedLooks[style] ?? femaleLooks[style] ?? sharedLooks.Casual;
}
