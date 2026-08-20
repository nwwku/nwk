import { useEffect, useState } from 'react';
import { FashionImage } from '../components/FashionImage';
import { AuthRequiredDialog } from '../components/AuthRequiredDialog';
import { Icon } from '../components/Icon';
import { OutfitResult } from '../components/OutfitResult';
import { ScanFlow } from '../components/ScanFlow';
import { localize, styleLabel, useLanguage } from '../lib/language';
import type { WardrobeItem } from '../lib/mockData';
import { styleNames } from '../lib/mockData';
import { generateOutfit, type GeneratedOutfit } from '../lib/outfitGenerator';
import { useProfileGender } from '../lib/profileGender';
import { useCurrentUser } from '../lib/useCurrentUser';
import { loadWardrobe } from '../lib/wardrobe';

type Mode = 'menu' | 'style' | 'recreate' | 'scan';

export function CreatePage() {
  const { language } = useLanguage(); const tr = (en: string, ru: string) => localize(language, en, ru);
  const { gender } = useProfileGender(); const { user, loading: userLoading } = useCurrentUser();
  const params = new URLSearchParams(location.search); const requestedMode = params.get('mode');
  const [mode, setMode] = useState<Mode>(requestedMode === 'recreate' || requestedMode === 'scan' ? requestedMode : 'menu');
  const [style, setStyle] = useState(params.get('style') ?? 'Street Style'); const [items, setItems] = useState<WardrobeItem[]>([]);
  const [result, setResult] = useState<GeneratedOutfit | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const selectedPieces = items.filter((item) => result?.itemIds.includes(item.id));
  const authPrompt = authPromptOpen ? <AuthRequiredDialog onClose={() => setAuthPromptOpen(false)} /> : null;

  useEffect(() => { if (!user) return; void loadWardrobe(gender).then(setItems).catch(() => setError(tr('Could not load your wardrobe.', 'Не удалось загрузить гардероб.'))); }, [gender, user]);
  async function create(nextStyle = style) {
    if (userLoading) return;
    if (!user) { setAuthPromptOpen(true); return; }
    setStyle(nextStyle);
    setLoading(true); setError('');
    try { setResult(await generateOutfit(items, nextStyle, language)); }
    catch { setError(tr('Add at least one piece to your wardrobe first.', 'Сначала добавь хотя бы одну вещь в гардероб.')); }
    finally { setLoading(false); }
  }

  if (mode === 'scan') return <ScanFlow initialMode="outfit" onBack={() => setMode('menu')} />;
  if (result) return <div className="stack-lg"><button className="back-button" onClick={() => setResult(null)}>← {tr('Back to create', 'Назад')}</button><div className="page-title"><div><p className="eyebrow">{tr('Made from what you own', 'Создано из твоих вещей')}</p><h1>{result.title}</h1></div></div><OutfitResult style={style} items={selectedPieces.map((item) => item.name)} pieces={selectedPieces} reason={result.reason} onAgain={() => void create()} /><div className="sustain-note"><Icon name="sparkle" /><p><b>{tr('A no-buy win.', 'Без новых покупок.')}</b> {tr('Every piece in this look is already in your wardrobe.', 'Все вещи для этого образа уже есть в гардеробе.')}</p></div></div>;
  if (mode === 'style') return <div className="stack-lg fade-in"><button className="back-button" onClick={() => setMode('menu')}>← {tr('Create', 'Создать')}</button><div className="page-title"><div><p className="eyebrow">{tr('Create from style', 'Создать по стилю')}</p><h1>{tr('What’s the mood?', 'Какое настроение?')}</h1></div></div><div className="style-grid">{styleNames.map((name, index) => <button className={style === name ? 'style-card active' : 'style-card'} onClick={() => setStyle(name)} key={name}><FashionImage position={`${(index % 3) * 50}% ${index % 2 ? 100 : 0}%`} /><span>{styleLabel(name, language)}</span></button>)}</div>{error && <p className="form-error">{error}</p>}<button className="primary-button sticky-action" disabled={loading || userLoading} onClick={() => void create()}>{loading ? tr('Creating…', 'Создаю…') : tr('Create my outfit', 'Создать мой образ')} <Icon name="sparkle" /></button>{authPrompt}</div>;
  if (mode === 'recreate') return <div className="stack-lg fade-in"><button className="back-button" onClick={() => setMode('menu')}>← {tr('Create', 'Создать')}</button><div className="page-title"><div><p className="eyebrow">{tr('Recreate look', 'Повторить образ')}</p><h1>{tr('Make it yours.', 'Сделай его своим.')}</h1></div></div><p className="page-intro">{tr('Choose the closest style, then NERA will use only pieces from your wardrobe.', 'Выбери ближайший стиль, и NERA использует только вещи из твоего гардероба.')}</p><select value={style} onChange={(event) => setStyle(event.target.value)}>{styleNames.map((name) => <option key={name}>{name}</option>)}</select>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading || userLoading} onClick={() => void create()}>{loading ? tr('Matching…', 'Подбираю…') : tr('Find a close outfit', 'Найти похожий образ')}</button>{authPrompt}</div>;
  return <div className="stack-xl fade-in"><section className="hero-copy create-heading"><p className="eyebrow">{tr('Create with NERA', 'Создавай с NERA')}</p><h1>{tr('Dress for', 'Одевайся под')}<br /><em>{tr('the feeling.', 'настроение.')}</em></h1></section>{error && <p className="form-error">{error}</p>}<div className={`create-options ${gender === 'male' ? 'create-options--male' : ''}`}><button onClick={() => setMode('style')}><FashionImage /><span><small>01</small><b>{tr('Create from style', 'Создать по стилю')}</b><em>{tr('Using your real wardrobe', 'Из твоего гардероба')}</em></span><Icon name="arrow" /></button><button onClick={() => setMode('recreate')}><FashionImage /><span><small>02</small><b>{tr('Recreate a look', 'Повторить образ')}</b><em>{tr('Find a close combination', 'Найди похожее сочетание')}</em></span><Icon name="arrow" /></button><button disabled={userLoading} onClick={() => void create('Style DNA')}><FashionImage /><span><small>03</small><b>{loading ? tr('Creating…', 'Создаю…') : tr('Surprise me', 'Удиви меня')}</b><em>{tr('Picked from your Style DNA', 'По твоей ДНК стиля')}</em></span><Icon name="sparkle" /></button></div><button className="outline-button feature-link" onClick={() => setMode('scan')}>{tr('Evaluate an outfit photo', 'Оценить образ по фото')} <Icon name="scan" /></button>{authPrompt}</div>;
}
