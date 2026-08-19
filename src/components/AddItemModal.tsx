import { useState, type ChangeEvent, type FormEvent } from 'react';
import { prepareGarmentImage } from '../lib/garmentImage';
import { localize, styleLabel, useLanguage } from '../lib/language';
import type { WardrobeItem } from '../lib/mockData';
import { wardrobeCategories } from '../lib/wardrobeCategories';
import { wardrobeStyles } from '../lib/wardrobeStyles';
import { Icon } from './Icon';

type Props = {
  initialItem?: WardrobeItem;
  onClose: () => void;
  onSave: (item: WardrobeItem) => Promise<void>;
};

export function AddItemModal({ initialItem, onClose, onSave }: Props) {
  const { language } = useLanguage();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const [name, setName] = useState(initialItem?.name ?? '');
  const [category, setCategory] = useState(initialItem?.category ?? 'T-shirts / Tops');
  const [color, setColor] = useState(initialItem?.color ?? 'White');
  const [style, setStyle] = useState(initialItem?.style ?? 'Minimal');
  const [image, setImage] = useState(initialItem?.image ?? '');
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(initialItem);

  async function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProcessing(true); setError('');
    await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
    try { setImage(await prepareGarmentImage(file)); }
    catch { setError(tr('Could not process the photo. Try another one.', 'Не удалось обработать фото. Попробуй другое.')); }
    finally { setProcessing(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!image || processing || saving) return;
    setSaving(true); setError('');
    try { await onSave({
      id: initialItem?.id ?? crypto.randomUUID(),
      name: name.trim() || tr('My item', 'Моя вещь'),
      category, color, style, image,
      material: initialItem?.material ?? 'Cotton',
      imagePosition: '50% 50%',
      imagePath: initialItem?.imagePath,
    }); onClose(); }
    catch { setError(tr('Could not save the item. Check your account and try again.', 'Не удалось сохранить вещь. Проверь вход в аккаунт и попробуй снова.')); }
    finally { setSaving(false); }
  }

  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
    <button className="modal-close" type="button" onClick={onClose}><Icon name="close" /></button>
    <p className="eyebrow">{tr(isEditing ? 'Edit piece' : 'New piece', isEditing ? 'Изменить вещь' : 'Новая вещь')}</p>
    <h2>{tr(isEditing ? 'Update item' : 'Add to wardrobe', isEditing ? 'Исправить данные' : 'Добавить в гардероб')}</h2>
    <input id="garment-photo" className="visually-hidden" type="file" accept="image/*" onChange={chooseImage} />
    {image
      ? <div className="image-upload image-upload--preview"><img src={image} alt={tr('Processed garment', 'Обработанная вещь')} /></div>
      : <label className="image-upload" htmlFor="garment-photo"><Icon name="upload" /><span>{processing ? tr('Preparing the garment…', 'Подготавливаем вещь…') : tr('Add a photo', 'Добавить фото')}</span></label>}
    {!image && <p className="image-processing-note">{tr('AI will find the main garment and remove the person and background.', 'AI найдёт главную вещь и уберёт человека и фон.')}</p>}
    {image && <label className="replace-photo-button" htmlFor="garment-photo">{tr('Replace photo', 'Заменить фото')}</label>}
    {error && <p className="form-error">{error}</p>}
    <label>{tr('Name', 'Название')}<input value={name} onChange={(event) => setName(event.target.value)} placeholder={tr('White oversized shirt', 'Белая оверсайз-рубашка')} autoFocus /></label>
    <div className="form-grid">
      <label>{tr('Category', 'Категория')}<select value={category} onChange={(event) => setCategory(event.target.value)}>{wardrobeCategories.map((item) => <option value={item.value} key={item.value}>{tr(item.en, item.ru)}</option>)}</select></label>
      <label>{tr('Color', 'Цвет')}<select value={color} onChange={(event) => setColor(event.target.value)}><option value="White">{tr('White', 'Белый')}</option><option value="Black">{tr('Black', 'Чёрный')}</option><option value="Blue">{tr('Blue', 'Синий')}</option><option value="Red">{tr('Red', 'Красный')}</option><option value="Green">{tr('Green', 'Зелёный')}</option><option value="Beige">{tr('Beige', 'Бежевый')}</option><option value="Gray">{tr('Gray', 'Серый')}</option></select></label>
    </div>
    <label>{tr('Style', 'Стиль')}<select value={style} onChange={(event) => setStyle(event.target.value)}>{wardrobeStyles.map((item) => <option value={item} key={item}>{styleLabel(item, language)}</option>)}</select></label>
    <button className="primary-button" type="submit" disabled={processing || saving || !image}>{processing ? tr('Processing…', 'Обработка…') : saving ? tr('Saving…', 'Сохраняем…') : tr(isEditing ? 'Save changes' : 'Add to wardrobe', isEditing ? 'Сохранить изменения' : 'Добавить в гардероб')}</button>
  </form></div>;
}
