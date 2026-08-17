import { useState } from 'react';
import { useLocation } from 'wouter';
import { FashionImage } from '../components/FashionImage';
import { Icon } from '../components/Icon';
import { localize, styleLabel, useLanguage } from '../lib/language';
import { useProfileGender } from '../lib/profileGender';
import type { ProfileGender } from '../lib/profilePreferences';
import { getStyleQuizOptions } from '../lib/styleQuiz';

const intro = [
  ['Build your digital wardrobe.', 'Everything you own, ready to work together.', 'Создай цифровой гардероб.', 'Все твои вещи готовы сочетаться.'],
  ['Create from what you have.', 'Fresh outfits without another purchase.', 'Создавай из того, что есть.', 'Новые образы без лишних покупок.'],
  ['Recreate the looks you love.', 'Your inspiration, translated into your wardrobe.', 'Повторяй любимые образы.', 'Вдохновение, собранное из твоего гардероба.'],
  ['Know what’s truly missing.', 'Buy only the pieces that add real possibility.', 'Узнай, чего действительно не хватает.', 'Покупай только полезные вещи.'],
];

const dnaScores = [42, 31, 18, 9];

export function OnboardingPage() {
  const { language } = useLanguage();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const { setGender } = useProfileGender();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [quizGender, setQuizGender] = useState<ProfileGender | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const genderStep = intro.length;
  const styleStep = intro.length + 1;
  const resultStep = intro.length + 2;
  const options = getStyleQuizOptions(quizGender ?? 'female');

  function chooseGender(nextGender: ProfileGender) {
    setQuizGender(nextGender);
    setSelected([]);
  }

  function continueWithGender() {
    if (!quizGender) return;
    setGender(quizGender);
    setStep(styleStep);
  }

  function toggle(style: string) {
    setSelected(selected.includes(style) ? selected.filter((item) => item !== style) : [...selected, style]);
  }

  if (step === resultStep) {
    const resultStyles = selected.slice(0, 4);
    const cover = options.find((option) => option.name === resultStyles[0])?.image;
    return <main className="onboarding result-onboarding">
      <p className="wordmark">NERA</p>
      <div className="dna-orbit"><FashionImage src={cover} /><span>{tr('YOUR STYLE DNA', 'ТВОЯ ДНК СТИЛЯ')}</span></div>
      <p className="eyebrow">{tr('Distinctly yours', 'Только твой')}</p>
      <h1>{tr('Your style.', 'Твой стиль.')}<br /><em>{tr('Your rules.', 'Твои правила.')}</em></h1>
      <div className="result-dna">{resultStyles.map((style, index) => <span key={style}><b>{dnaScores[index]}%</b> {styleLabel(style, language)}</span>)}</div>
      <button className="primary-button" onClick={() => navigate('/')}>{tr('Enter NERA', 'Открыть NERA')} <Icon name="arrow" /></button>
    </main>;
  }

  if (step === styleStep) return <main className="onboarding style-onboarding">
    <div className="onboarding-top"><p className="wordmark">NERA</p><span>06 / 07</span></div>
    <div><p className="eyebrow">{tr('Build your Style DNA', 'Создай свою ДНК стиля')}</p><h1>{tr('Choose the looks that feel like you.', 'Выбери образы, которые похожи на тебя.')}</h1><p>{tr('Select at least three aesthetics.', 'Выбери минимум три эстетики.')}</p></div>
    <div className="onboard-style-grid">{options.map((option) => <button className={selected.includes(option.name) ? 'selected' : ''} onClick={() => toggle(option.name)} key={option.name}>
      <FashionImage src={option.image} /><span>{styleLabel(option.name, language)}</span><i>✓</i>
    </button>)}</div>
    <button disabled={selected.length < 3} className="primary-button" onClick={() => setStep(resultStep)}>{tr('Generate my Style DNA', 'Создать мою ДНК стиля')} <Icon name="sparkle" /></button>
  </main>;

  if (step === genderStep) return <main className="onboarding style-onboarding gender-onboarding">
    <div className="onboarding-top"><p className="wordmark">NERA</p><span>05 / 07</span></div>
    <div><p className="eyebrow">{tr('Before the style test', 'Перед тестом стиля')}</p><h1>{tr('Choose your section.', 'Выбери свой раздел.')}</h1><p>{tr('Your answer changes the styles and outfit photos in the test.', 'От выбора зависят стили и фотографии образов в тесте.')}</p></div>
    <div className="onboard-style-grid quiz-gender-grid">
      <button className={quizGender === 'female' ? 'selected' : ''} onClick={() => chooseGender('female')}><FashionImage src="/assets/style-quiz/female/stockholm.png" /><span>{tr('Female', 'Женский')}</span><i>✓</i></button>
      <button className={quizGender === 'male' ? 'selected' : ''} onClick={() => chooseGender('male')}><FashionImage src="/assets/style-quiz/male/gender-choice.png" /><span>{tr('Male', 'Мужской')}</span><i>✓</i></button>
    </div>
    <button disabled={!quizGender} className="primary-button" onClick={continueWithGender}>{tr('Continue to styles', 'Перейти к стилям')} <Icon name="arrow" /></button>
  </main>;

  const [titleEn, subtitleEn, titleRu, subtitleRu] = intro[step];
  return <main className="onboarding intro-onboarding">
    <div className="onboarding-top"><p className="wordmark">NERA</p><button onClick={() => setStep(genderStep)}>{tr('Skip', 'Пропустить')}</button></div>
    <FashionImage position={`${(step % 3) * 50}% ${step > 1 ? 100 : 0}%`} />
    <div className="intro-copy"><p className="eyebrow">0{step + 1} / 07</p><h1>{tr(titleEn, titleRu)}</h1><p>{tr(subtitleEn, subtitleRu)}</p></div>
    <div className="intro-controls"><div>{intro.map((_, index) => <span className={index === step ? 'active' : ''} key={index} />)}</div><button className="circle-button" onClick={() => setStep(step + 1)}><Icon name="arrow" /></button></div>
  </main>;
}
