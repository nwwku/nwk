import type { ProfileGender } from './profilePreferences';

export type StyleQuizOption = {
  name: string;
  image: string;
};

const femaleStyles: StyleQuizOption[] = [
  { name: 'Stockholm', image: '/assets/style-quiz/female/stockholm.png' },
  { name: 'Downtown', image: '/assets/style-quiz/female/downtown.png' },
  { name: 'Y2K', image: '/assets/style-quiz/female/y2k-v2.png' },
  { name: 'Old Money', image: '/assets/style-quiz/female/old-money.png' },
  { name: 'Clean Girl', image: '/assets/style-quiz/female/clean-girl.png' },
  { name: 'Street Style', image: '/assets/style-quiz/female/street-style.png' },
  { name: 'Vintage', image: '/assets/style-quiz/female/vintage.png' },
  { name: 'Coquette', image: '/assets/style-quiz/female/coquette.png' },
  { name: 'Casual', image: '/assets/style-quiz/female/casual.png' },
];

const maleStyles: StyleQuizOption[] = [
  { name: 'Stockholm', image: '/assets/style-quiz/male/stockholm.png' },
  { name: 'Old Money', image: '/assets/style-quiz/male/old-money.png' },
  { name: 'Downtown', image: '/assets/style-quiz/male/downtown.png' },
  { name: 'Street Style', image: '/assets/style-quiz/male/street-style.png' },
  { name: 'Vintage', image: '/assets/style-quiz/male/vintage.png' },
  { name: 'Y2K', image: '/assets/style-quiz/male/y2k.png' },
  { name: 'Acubi', image: '/assets/style-quiz/male/acubi.png' },
  { name: 'Starboy', image: '/assets/style-quiz/male/starboy.png' },
  { name: 'Casual', image: '/assets/style-quiz/male/casual.png' },
];

export function getStyleQuizOptions(gender: ProfileGender) {
  return gender === 'male' ? maleStyles : femaleStyles;
}
