import { FashionImage } from './FashionImage';
import { Icon } from './Icon';
import { localize, useLanguage } from '../lib/language';
import { useProfileGender } from '../lib/profileGender';
import type { ProfileGender } from '../lib/profilePreferences';

const genderCards: Array<{ gender: ProfileGender; image: string; en: string; ru: string }> = [
  { gender: 'female', image: '/assets/style-quiz/female/stockholm.png', en: 'Female', ru: 'Женский' },
  { gender: 'male', image: '/assets/discover/men/stockholm/stockholm-01.jpg', en: 'Male', ru: 'Мужской' },
];

export function GenderGate() {
  const { language } = useLanguage();
  const { isGenderSelected, setGender } = useProfileGender();
  const tr = (en: string, ru: string) => localize(language, en, ru);

  if (isGenderSelected) return null;

  function chooseGender(gender: ProfileGender) {
    setGender(gender);
  }

  return (
    <section className="gender-gate" aria-labelledby="gender-gate-title">
      <div className="gender-gate__panel">
        <p className="wordmark">NERA</p>
        <div>
          <p className="eyebrow">{tr('Start profile', 'Начало профиля')}</p>
          <h1 id="gender-gate-title">{tr('Choose your section.', 'Выбери свой раздел.')}</h1>
        </div>
        <div className="gender-gate__options">
          {genderCards.map((card) => (
            <button key={card.gender} onClick={() => chooseGender(card.gender)}>
              <FashionImage src={card.image} />
              <span>{tr(card.en, card.ru)}</span>
              <Icon name="arrow" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
