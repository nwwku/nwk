import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { defaultAvatars, fallbackAvatar, isAvatarAllowed } from './profile';
import { useTheme } from './theme';

const storageKey = 'nera-default-avatar';

function loadAvatar() {
  const saved = localStorage.getItem(storageKey);
  return saved && defaultAvatars.includes(saved) ? saved : defaultAvatars[0];
}

const AvatarContext = createContext({
  avatar: defaultAvatars[0],
  setAvatar: (_avatar: string) => {},
});

export function AvatarProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [savedAvatar, setSavedAvatar] = useState(loadAvatar);
  const avatar = isAvatarAllowed(savedAvatar, theme) ? savedAvatar : fallbackAvatar;

  useEffect(() => {
    if (avatar === savedAvatar) return;
    localStorage.setItem(storageKey, avatar);
    setSavedAvatar(avatar);
  }, [avatar, savedAvatar]);

  function setAvatar(nextAvatar: string) {
    if (!defaultAvatars.includes(nextAvatar) || !isAvatarAllowed(nextAvatar, theme)) return;
    localStorage.setItem(storageKey, nextAvatar);
    setSavedAvatar(nextAvatar);
  }

  return <AvatarContext.Provider value={{ avatar, setAvatar }}>{children}</AvatarContext.Provider>;
}

export function useAvatar() {
  return useContext(AvatarContext);
}
