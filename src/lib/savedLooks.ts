import type { ProfileGender } from './profilePreferences';

export type SavedCategory = 'idea' | 'outfit' | 'item';
export type SavedLook = { id: string; style: string; items: string[]; image: string; category?: SavedCategory; title?: string; gender?: ProfileGender };

const storageKey = 'nera-saved-looks';

export function loadSavedLooks(): SavedLook[] {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as unknown;
    return Array.isArray(value) ? value as SavedLook[] : [];
  } catch { return []; }
}

export const savedCategory = (look: SavedLook): SavedCategory => look.category ?? 'outfit';
export const savedGender = (look: SavedLook): ProfileGender => look.gender ?? 'female';
export const isLookSaved = (id: string) => loadSavedLooks().some((look) => look.id === id);

export function toggleSavedLook(look: SavedLook) {
  const looks = loadSavedLooks();
  const exists = looks.some((item) => item.id === look.id);
  localStorage.setItem(storageKey, JSON.stringify(exists ? looks.filter((item) => item.id !== look.id) : [look, ...looks]));
  return !exists;
}

export function removeSavedLook(id: string) {
  localStorage.setItem(storageKey, JSON.stringify(loadSavedLooks().filter((look) => look.id !== id)));
}
