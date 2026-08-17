export type ProfileGender = 'female' | 'male';

const genderStorageKey = 'nera-profile-gender';

export function loadProfileGender(): ProfileGender {
  const savedGender = localStorage.getItem(genderStorageKey);
  return savedGender === 'male' ? 'male' : 'female';
}

export function hasSavedProfileGender() {
  return localStorage.getItem(genderStorageKey) === 'female' || localStorage.getItem(genderStorageKey) === 'male';
}

export function saveProfileGender(gender: ProfileGender) {
  localStorage.setItem(genderStorageKey, gender);
}
