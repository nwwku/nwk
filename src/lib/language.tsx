import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'en' | 'ru';

const LanguageContext = createContext<{ language: Language; toggleLanguage: () => void }>({
  language: 'en',
  toggleLanguage: () => undefined,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('nera-language') === 'ru' ? 'ru' : 'en');
  function toggleLanguage() {
    setLanguage((current) => {
      const next = current === 'en' ? 'ru' : 'en';
      localStorage.setItem('nera-language', next);
      return next;
    });
  }
  return <LanguageContext.Provider value={{ language, toggleLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function localize(language: Language, english: string, russian: string) {
  return language === 'ru' ? russian : english;
}

const russianStyles: Record<string, string> = {
  'For you': 'Для тебя', Stockholm: 'Стокгольм', Downtown: 'Даунтаун', Y2K: 'Y2K',
  'Old Money': 'Олд мани', 'Clean Girl': 'Клин гёрл', 'Street Style': 'Уличный стиль',
  Vintage: 'Винтаж', Coquette: 'Кокет', Casual: 'Повседневный', Minimal: 'Минимализм',
  Sporty: 'Спортивный', Preppy: 'Преппи', Grunge: 'Гранж', Boho: 'Бохо', Elegant: 'Элегантный',
  Streetwear: 'Стритвир', Starboy: 'Старбой', Acubi: 'Акуби',
  'Style DNA': 'ДНК стиля',
};

export function styleLabel(style: string, language: Language) {
  return language === 'ru' ? russianStyles[style] ?? style : style;
}
