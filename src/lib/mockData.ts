export type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  style: string;
  material: string;
  imagePosition: string;
  image?: string;
  imagePath?: string;
};

export const styleNames = [
  'Stockholm',
  'Downtown',
  'Y2K',
  'Old Money',
  'Clean Girl',
  'Street Style',
  'Vintage',
  'Coquette',
  'Casual',
];

export const wardrobeItems: WardrobeItem[] = [];

export const outfits = [
  ['Oversized Oxford Shirt', 'Relaxed Blue Denim', 'Wool Tailored Coat'],
  ['Stone Knit Cardigan', 'Relaxed Blue Denim', 'Black leather loafers'],
  ['Burgundy Track Jacket', 'White fitted tee', 'Relaxed Blue Denim'],
];

export const shopItems = [
  { name: 'Black leather loafers', type: 'Missing', score: 96, matches: 11, outfits: 9, position: '100% 0%' },
  { name: 'Lightweight trench', type: 'Recommended', score: 84, matches: 8, outfits: 7, position: '0% 0%' },
  { name: 'Silver shoulder bag', type: 'Maybe', score: 61, matches: 4, outfits: 3, position: '100% 100%' },
];
