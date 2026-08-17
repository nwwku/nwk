import { supabase } from './supabase';

export type ScanMode = 'buy' | 'material' | 'style';
export type BuyVerdict = 'buy' | 'consider' | 'skip';
export type BuyScan = { type: 'buy'; verdict: BuyVerdict; confidence: number; reason: string; considerations: string[] };
export type StyleScan = { type: 'style'; style: string; confidence: number; reason: string; alternatives: string[] };
export type MaterialScan = { type: 'material'; material: string; confidence: number; reason: string; alternatives: string[] };
export type ScanResult = BuyScan | StyleScan | MaterialScan;

const styles = ['Stockholm', 'Downtown', 'Y2K', 'Old Money', 'Clean Girl', 'Street Style', 'Vintage', 'Coquette', 'Casual'] as const;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

async function prepareImage(file: File) {
  const image = await loadImage(file);
  const scale = Math.min(1, 1280 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(image.src);
  return { mimeType: 'image/jpeg', imageBase64: canvas.toDataURL('image/jpeg', 0.82).split(',')[1] };
}

async function askVision(file: File, prompt: string) {
  const image = await prepareImage(file);
  const { data, error } = await supabase.functions.invoke('ai', { body: { prompt, ...image } });
  if (error) throw new Error(error.message);
  const text = (data as { text?: unknown } | null)?.text;
  if (typeof text !== 'string') throw new Error('Empty AI response');
  return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()) as Record<string, unknown>;
}

const confidence = (value: unknown) => Math.min(100, Math.max(0, Number(value) || 0));
const words = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, 2) : [];

export async function scanPhoto(file: File, mode: ScanMode, language: 'en' | 'ru'): Promise<ScanResult> {
  const answerLanguage = language === 'ru' ? 'Russian' : 'English';
  if (mode === 'buy') {
    const parsed = await askVision(file, `Assess whether this clothing item is worth considering as a purchase using only visible evidence: versatility, condition, construction, practicality, and how easily it can be styled. Do not invent its price, exact material, fit, brand, or the user's wardrobe. Return ONLY JSON: {"verdict":"buy|consider|skip","confidence":0-100,"reason":"one concise explanation","considerations":["up to two useful things to check before buying"]}. Keep verdict in English and write all other text in ${answerLanguage}.`);
    const verdict = parsed.verdict;
    if (verdict !== 'buy' && verdict !== 'consider' && verdict !== 'skip') throw new Error('Unknown verdict');
    return {
      type: 'buy', verdict, confidence: confidence(parsed.confidence),
      reason: typeof parsed.reason === 'string' ? parsed.reason : '',
      considerations: words(parsed.considerations),
    };
  }

  if (mode === 'material') {
    const parsed = await askVision(file, `Visually estimate the main material of the clothing item. Do not claim certainty because exact composition requires its label or a physical test. Return ONLY JSON: {"material":"short material name","confidence":0-100,"reason":"one concise visual explanation","alternatives":["up to two possible materials"]}. Write all text in ${answerLanguage}.`);
    if (typeof parsed.material !== 'string') throw new Error('Unknown material');
    return { type: 'material', material: parsed.material, confidence: confidence(parsed.confidence), reason: typeof parsed.reason === 'string' ? parsed.reason : '', alternatives: words(parsed.alternatives) };
  }

  const parsed = await askVision(file, `Analyze the clothing item or complete outfit. Choose the closest style only from: ${styles.join(', ')}. Return ONLY JSON: {"style":"one listed style","confidence":0-100,"reason":"one concise sentence","alternatives":["up to two listed styles"]}. Write reason in ${answerLanguage}.`);
  if (typeof parsed.style !== 'string' || !styles.includes(parsed.style as typeof styles[number])) throw new Error('Unknown style');
  const alternatives = words(parsed.alternatives).filter((style) => styles.includes(style as typeof styles[number]));
  return { type: 'style', style: parsed.style, confidence: confidence(parsed.confidence), reason: typeof parsed.reason === 'string' ? parsed.reason : '', alternatives };
}
