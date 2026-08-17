import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Theme } from './theme';

export const lightAvatar = '/assets/avatars/soft-blush.jpg';
export const darkAvatar = '/assets/avatars/classic-black.jpg';
export const fallbackAvatar = '/assets/avatars/soft-blue.jpg';

export const defaultAvatars = [
  lightAvatar,
  fallbackAvatar,
  '/assets/avatars/soft-pink.jpg',
  '/assets/avatars/soft-yellow.jpg',
  '/assets/avatars/sage-green.jpg',
  darkAvatar,
];

export function isAvatarAllowed(avatar: string, theme: Theme) {
  return theme === 'light' ? avatar !== lightAvatar : avatar !== darkAvatar;
}

function textMetadata(user: User, key: string) {
  const value: unknown = user.user_metadata[key];
  return typeof value === 'string' ? value : '';
}

export function getNickname(user: User) {
  return textMetadata(user, 'nickname')
    || textMetadata(user, 'full_name')
    || user.email?.split('@')[0]
    || 'NERA user';
}

export async function updateNickname(nickname: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { nickname: nickname.trim() },
  });
  if (error) throw error;
  return data.user;
}
