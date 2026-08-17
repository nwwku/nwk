import type { WardrobeItem } from './mockData';
import type { ProfileGender } from './profilePreferences';
import { supabase } from './supabase';

type WardrobeRow = {
  id: string;
  name: string;
  category: string;
  color: string;
  style: string;
  material: string;
  image_path: string;
};

async function signedImage(path: string) {
  const { data, error } = await supabase.storage.from('wardrobe').createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}

function rowToItem(row: WardrobeRow, image: string): WardrobeItem {
  return {
    id: row.id, name: row.name, category: row.category, color: row.color,
    style: row.style, material: row.material, image,
    imagePath: row.image_path, imagePosition: '50% 50%',
  };
}

export async function loadWardrobe(gender: ProfileGender) {
  const { data, error } = await supabase.from('wardrobe_items').select('id,name,category,color,style,material,image_path').eq('gender', gender).order('created_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data as WardrobeRow[]).map(async (row) => rowToItem(row, await signedImage(row.image_path))));
}

export async function saveWardrobeItem(item: WardrobeItem, gender: ProfileGender, userId: string) {
  let imagePath = item.imagePath;
  let uploadedPath = '';
  if (item.image?.startsWith('data:')) {
    const imageBlob = await fetch(item.image).then((response) => response.blob());
    uploadedPath = `${userId}/${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage.from('wardrobe').upload(uploadedPath, imageBlob, { contentType: 'image/jpeg' });
    if (error) throw error;
    imagePath = uploadedPath;
  }
  if (!imagePath) throw new Error('Add a photo first');

  const { data, error } = await supabase.from('wardrobe_items').upsert({
    id: item.id, user_id: userId, gender, name: item.name, category: item.category,
    color: item.color, style: item.style, material: item.material, image_path: imagePath,
  }).select('id,name,category,color,style,material,image_path').single();
  if (error) {
    if (uploadedPath) await supabase.storage.from('wardrobe').remove([uploadedPath]);
    throw error;
  }
  if (uploadedPath && item.imagePath && item.imagePath !== uploadedPath) {
    await supabase.storage.from('wardrobe').remove([item.imagePath]);
  }
  const row = data as WardrobeRow;
  return rowToItem(row, await signedImage(row.image_path));
}

export async function deleteWardrobeItem(item: WardrobeItem) {
  const { error } = await supabase.from('wardrobe_items').delete().eq('id', item.id);
  if (error) throw error;
  if (item.imagePath) await supabase.storage.from('wardrobe').remove([item.imagePath]);
}
