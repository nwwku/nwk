import { useRef, useState, type ChangeEvent } from 'react';
import { localize, styleLabel, useLanguage } from '../lib/language';
import { scanPhoto, type ScanMode, type ScanResult } from '../lib/scan';
import { Icon } from './Icon';

export function ScanFlow({ shopping = false, onBack }: { shopping?: boolean; onBack: () => void }) {
  const { language } = useLanguage();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ScanMode>('buy');
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectMode = (next: ScanMode) => { setMode(next); setResult(null); setError(''); };
  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (!next) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(next); setPreview(URL.createObjectURL(next)); setResult(null); setError('');
  };
  const analyze = async () => {
    if (!file) return inputRef.current?.click();
    setLoading(true); setError('');
    try { setResult(await scanPhoto(file, mode, language)); }
    catch { setError(tr('Could not analyze the photo. Check the AI connection and try again.', 'Не удалось проанализировать фото. Проверь подключение AI и попробуй снова.')); }
    finally { setLoading(false); }
  };

  const buyLabels = {
    buy: tr('Worth buying', 'Стоит покупать'),
    consider: tr('Think it over', 'Стоит подумать'),
    skip: tr('Better to skip', 'Лучше пропустить'),
  };
  const title = result?.type === 'style'
    ? styleLabel(result.style, language)
    : result?.type === 'material' ? result.material : result ? buyLabels[result.verdict] : '';
  const details = result?.type === 'style'
    ? result.alternatives.map((style) => styleLabel(style, language))
    : result?.type === 'material' ? result.alternatives : result?.considerations;

  return <div className="stack-lg fade-in">
    <button className="back-button" onClick={onBack}>← {tr('Back', 'Назад')}</button>
    <div className="page-title"><div><p className="eyebrow">NERA Scan</p><h1>{tr('Analyze clothing', 'Анализ одежды')}</h1></div></div>
    <div className="scan-kind" role="group" aria-label={tr('Analysis type', 'Тип анализа')}>
      <button className={mode === 'buy' ? 'active' : ''} onClick={() => selectMode('buy')}>{tr('01 · Buy?', '01 · Покупать?')}</button>
      <button className={mode === 'material' ? 'active' : ''} onClick={() => selectMode('material')}>{tr('02 · Material', '02 · Материал')}</button>
      <button className={mode === 'style' ? 'active' : ''} onClick={() => selectMode('style')}>{tr('03 · Style', '03 · Стиль')}</button>
    </div>
    <p className="scan-hint">{mode === 'buy'
      ? tr('Photograph the whole item clearly before buying it.', 'Перед покупкой сфотографируй вещь целиком и при хорошем свете.')
      : mode === 'material'
        ? tr('Photograph one item close up so its texture is visible.', 'Сфотографируй одну вещь близко, чтобы была видна фактура ткани.')
        : tr('Photograph an item or a complete outfit.', 'Сфотографируй отдельную вещь или целый образ.')}</p>
    <input ref={inputRef} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={choosePhoto} />
    <button className="camera-view scan-upload" onClick={() => inputRef.current?.click()}>
      {preview ? <img src={preview} alt={tr('Selected photo', 'Выбранное фото')} /> : <span><Icon name="upload" />{tr('Take or choose a photo', 'Сфотографируй или выбери фото')}</span>}
      <i className="scan-corner top-left" /><i className="scan-corner top-right" /><i className="scan-corner bottom-left" /><i className="scan-corner bottom-right" />
    </button>
    <button className="primary-button" disabled={loading} onClick={analyze}><Icon name="scan" /> {loading
      ? tr('Analyzing…', 'Анализирую…')
      : mode === 'buy' ? tr('Check purchase', 'Проверить покупку')
        : mode === 'material' ? tr('Identify material', 'Определить материал') : tr('Identify style', 'Определить стиль')}</button>
    {error && <p className="scan-error">{error}</p>}
    {result && <section className="style-scan-result">
      <p className="eyebrow">{result.type === 'buy' ? tr('Purchase verdict', 'Решение о покупке') : result.type === 'material' ? tr('Likely material', 'Предполагаемый материал') : tr('Closest style', 'Больше всего похоже на')}</p>
      <h2>{title}</h2><strong>{Math.round(result.confidence)}%</strong><p>{result.reason}</p>
      {!!details?.length && <small>{result.type === 'buy' ? tr('Before buying, check', 'Перед покупкой проверь') : tr('Other possibilities', 'Другие варианты')}: {details.join(', ')}</small>}
    </section>}
    <p className="privacy-note">{mode === 'buy'
      ? tr('The final decision also depends on price, fit, and what is already in your wardrobe.', 'Итоговое решение также зависит от цены, посадки и вещей, которые уже есть в гардеробе.')
      : mode === 'material'
      ? tr('A photo gives an estimate. Check the garment label for the exact composition.', 'По фото можно дать только оценку. Точный состав смотри на бирке вещи.')
      : shopping ? tr('Use the result as one part of your buying decision.', 'Используй результат как одну из подсказок при покупке.') : tr('The result is an AI estimate based on visible details.', 'Результат — оценка AI по видимым деталям.')}</p>
  </div>;
}
