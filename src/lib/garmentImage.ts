import { removeBackground } from '@imgly/background-removal';
import { findGarmentSegmentation, type GarmentSegmentation } from './garmentSegmentation';

const CARD_WIDTH = 900;
const CARD_HEIGHT = 1200;
const PADDING = 80;

type Bounds = { x: number; y: number; width: number; height: number };

async function extractGarment(file: File, segmentation: GarmentSegmentation) {
  const source = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available');

  const [top, left, bottom, right] = segmentation.box;
  const boxX = left * source.width / 1000;
  const boxY = top * source.height / 1000;
  const boxWidth = (right - left) * source.width / 1000;
  const boxHeight = (bottom - top) * source.height / 1000;
  const [first, ...rest] = segmentation.mask;

  context.beginPath();
  context.moveTo(boxX + first[0] * boxWidth / 1000, boxY + first[1] * boxHeight / 1000);
  rest.forEach(([x, y]) => context.lineTo(boxX + x * boxWidth / 1000, boxY + y * boxHeight / 1000));
  context.closePath();
  context.clip();
  context.drawImage(source, 0, 0);
  source.close();
  return createImageBitmap(canvas);
}

function findGarmentBounds(image: ImageBitmap): Bounds {
  const mask = document.createElement('canvas');
  mask.width = image.width;
  mask.height = image.height;
  const context = mask.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas is not available');
  context.drawImage(image, 0, 0);

  const pixels = context.getImageData(0, 0, image.width, image.height).data;
  let left = image.width; let top = image.height; let right = 0; let bottom = 0;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if (pixels[(y * image.width + x) * 4 + 3] < 12) continue;
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
  if (left > right || top > bottom) return { x: 0, y: 0, width: image.width, height: image.height };
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

export async function prepareGarmentImage(file: File): Promise<string> {
  let garment: ImageBitmap;
  try {
    garment = await extractGarment(file, await findGarmentSegmentation(file));
  } catch {
    garment = await createImageBitmap(await removeBackground(file));
  }
  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const bounds = findGarmentBounds(garment);
  const scale = Math.min(
    (CARD_WIDTH - PADDING * 2) / bounds.width,
    (CARD_HEIGHT - PADDING * 2) / bounds.height,
  );
  const width = bounds.width * scale;
  const height = bounds.height * scale;
  context.drawImage(garment, bounds.x, bounds.y, bounds.width, bounds.height, (CARD_WIDTH - width) / 2, (CARD_HEIGHT - height) / 2, width, height);
  garment.close();

  return canvas.toDataURL('image/jpeg', 0.92);
}
