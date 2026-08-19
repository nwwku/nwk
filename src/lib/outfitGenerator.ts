import type { Language } from './language';
import type { WardrobeItem } from './mockData';
import { supabase } from './supabase';

export type GeneratedOutfit = { title: string; reason: string; itemIds: string[] };

function fallback(items: WardrobeItem[], style: string, language: Language): GeneratedOutfit {
  const preferred = [...items.filter((item) => item.style === style), ...items.filter((item) => item.style !== style)];
  const uniqueCategories = preferred.filter((item, index, list) => list.findIndex((other) => other.category === item.category) === index);
  const chosen = [...uniqueCategories, ...preferred].filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index).slice(0, 3);
  return { title: language === 'ru' ? 'Образ из твоего гардероба' : 'A look from your wardrobe', reason: language === 'ru' ? 'Все выбранные вещи уже есть у тебя.' : 'Every selected piece is already yours.', itemIds: chosen.map((item) => item.id) };
}

export async function generateOutfit(items: WardrobeItem[], style: string, language: Language) {
  if (!items.length) throw new Error('EMPTY_WARDROBE');
  const inventory = items.map(({ id, name, category, color, material, style: itemStyle }) => ({ id, name, category, color, material, style: itemStyle }));
  const prompt = `Build one wearable ${style} outfit using ONLY the inventory below. Pick 2-4 compatible item IDs and never invent an item. Return ONLY JSON: {"title":"short title","reason":"one concise sentence","itemIds":["id"]}. Write title and reason in ${language === 'ru' ? 'Russian' : 'English'}. Inventory: ${JSON.stringify(inventory)}`;
  try {
    const { data, error } = await supabase.functions.invoke('ai', { body: { prompt, system: 'You are a practical teen fashion stylist. Follow the requested JSON schema exactly.' } });
    if (error) throw error;
    const text = (data as { text?: unknown } | null)?.text;
    if (typeof text !== 'string') throw new Error('Empty response');
    const parsed = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()) as Partial<GeneratedOutfit>;
    const validIds = Array.isArray(parsed.itemIds) ? parsed.itemIds.filter((id): id is string => typeof id === 'string' && items.some((item) => item.id === id)).slice(0, 4) : [];
    if (!validIds.length) throw new Error('No valid items');
    return { title: typeof parsed.title === 'string' ? parsed.title : style, reason: typeof parsed.reason === 'string' ? parsed.reason : '', itemIds: validIds };
  } catch {
    return fallback(items, style, language);
  }
}
