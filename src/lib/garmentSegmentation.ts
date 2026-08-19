import { supabase } from './supabase';

export type GarmentSegmentation = {
  box: [number, number, number, number];
  mask: Array<[number, number]>;
};

const MAX_IMAGE_SIDE = 1280;
const prompt = `Segment only the single main clothing item that should be added to a digital wardrobe.
If it is worn by a person, exclude the person, skin, hair, other clothes, shoes, bags, and accessories.
Keep only the visible pixels of that one garment; do not reshape or invent hidden parts.
Return ONLY JSON in this exact shape: {"boxes":[{"box_2d":[ymin,xmin,ymax,xmax],"mask":[[x,y]],"label":"garment"}]}.
All coordinates must be integers from 0 to 1000. box_2d is relative to the full image. Mask points are relative to the box and must closely follow the garment outline.`;

async function prepareImage(file: File) {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();
  return canvas.toDataURL('image/jpeg', 0.82).split(',')[1];
}

function isNumberList(value: unknown, size: number): value is number[] {
  return Array.isArray(value) && value.length === size && value.every((item) => typeof item === 'number' && Number.isFinite(item));
}

function parseSegmentation(text: string): GarmentSegmentation {
  const parsed = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()) as { boxes?: unknown };
  if (!Array.isArray(parsed.boxes) || parsed.boxes.length === 0) throw new Error('Garment was not found');
  const first = parsed.boxes[0] as { box_2d?: unknown; mask?: unknown };
  if (!isNumberList(first.box_2d, 4) || !Array.isArray(first.mask)) throw new Error('Invalid garment mask');
  if (first.box_2d[2] <= first.box_2d[0] || first.box_2d[3] <= first.box_2d[1]) throw new Error('Garment box is empty');
  const points = first.mask.filter((point): point is number[] => isNumberList(point, 2));
  if (points.length < 3) throw new Error('Garment mask is empty');
  return {
    box: first.box_2d.map((value) => Math.min(1000, Math.max(0, value))) as GarmentSegmentation['box'],
    mask: points.map(([x, y]) => [Math.min(1000, Math.max(0, x)), Math.min(1000, Math.max(0, y))]),
  };
}

export async function findGarmentSegmentation(file: File) {
  const imageBase64 = await prepareImage(file);
  const { data, error } = await supabase.functions.invoke('ai', {
    body: { prompt, imageBase64, mimeType: 'image/jpeg' },
  });
  if (error) throw new Error(error.message);
  const text = (data as { text?: unknown } | null)?.text;
  if (typeof text !== 'string') throw new Error('AI returned no garment mask');
  return parseSegmentation(text);
}
