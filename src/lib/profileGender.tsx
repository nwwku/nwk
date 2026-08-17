import { createContext, useContext, useState, type ReactNode } from 'react';
import { hasSavedProfileGender, loadProfileGender, type ProfileGender, saveProfileGender } from './profilePreferences';

const ProfileGenderContext = createContext<{
  gender: ProfileGender;
  isGenderSelected: boolean;
  setGender: (gender: ProfileGender) => void;
}>({ gender: 'female', isGenderSelected: false, setGender: () => undefined });

export function ProfileGenderProvider({ children }: { children: ReactNode }) {
  const [gender, setGenderState] = useState<ProfileGender>(loadProfileGender);
  const [isGenderSelected, setIsGenderSelected] = useState(hasSavedProfileGender);

  function setGender(nextGender: ProfileGender) {
    setGenderState(nextGender);
    setIsGenderSelected(true);
    saveProfileGender(nextGender);
  }

  return <ProfileGenderContext.Provider value={{ gender, isGenderSelected, setGender }}>{children}</ProfileGenderContext.Provider>;
}

export function useProfileGender() {
  return useContext(ProfileGenderContext);
}
