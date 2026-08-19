export type ProfileGender = 'female' | 'male';

const genderStorageKey = 'nera-profile-gender';
const genderSessionKey = 'nera-profile-gender-selected';

export function loadProfileGender(): ProfileGender {
  const savedGender = localStorage.getItem(genderStorageKey);
  return savedGender === 'male' ? 'male' : 'female';
}

export function hasSelectedGenderThisSession() {
  return sessionStorage.getItem(genderSessionKey) === 'true';
}

export function saveProfileGender(gender: ProfileGender) {
  localStorage.setItem(genderStorageKey, gender);
  sessionStorage.setItem(genderSessionKey, 'true');
}
