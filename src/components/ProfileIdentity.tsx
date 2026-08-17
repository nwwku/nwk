import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useAvatar } from '../lib/avatar';
import { localize, useLanguage } from '../lib/language';
import { defaultAvatars, getNickname, isAvatarAllowed, updateNickname } from '../lib/profile';
import { useTheme } from '../lib/theme';
import { useCurrentUser } from '../lib/useCurrentUser';
import { FashionImage } from './FashionImage';

export function ProfileIdentity() {
  const { language } = useLanguage();
  const { user, loading } = useCurrentUser();
  const { avatar, setAvatar } = useAvatar();
  const { theme } = useTheme();
  const [nickname, setNickname] = useState('');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const tr = (en: string, ru: string) => localize(language, en, ru);

  useEffect(() => {
    setNickname(user ? getNickname(user) : '');
  }, [user]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      setEditing(false);
      setMessage(tr('Avatar saved on this device.', 'Аватар сохранён на этом устройстве.'));
      return;
    }
    if (nickname.trim().length < 2) {
      setMessage(tr('Nickname must contain at least 2 characters.', 'Никнейм должен содержать минимум 2 символа.'));
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const updatedUser = await updateNickname(nickname);
      setNickname(getNickname(updatedUser));
      setEditing(false);
      setMessage(tr('Profile saved.', 'Профиль сохранён.'));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : tr('Could not save the profile.', 'Не удалось сохранить профиль.'));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <section className="profile-head" aria-busy="true" />;

  return <section className="profile-head">
    <FashionImage src={avatar} />
    <p className="eyebrow">{tr('Personal style profile', 'Профиль личного стиля')}</p>
    <h1>{user ? nickname : tr('Your profile', 'Твой профиль')}</h1>
    {!editing && <button className="profile-edit-button" type="button" onClick={() => { setEditing(true); setMessage(''); }}>{tr('Edit profile', 'Изменить профиль')}</button>}
    {editing && <form className="profile-edit-form" onSubmit={handleSave}>
      {user && <label>{tr('Nickname', 'Никнейм')}<input value={nickname} minLength={2} maxLength={30} onChange={(event) => setNickname(event.target.value)} required /></label>}
      <fieldset className="profile-avatar-options">
        <legend>{tr('Choose an avatar', 'Выбрать аватарку')}</legend>
        <div>{defaultAvatars.map((src, index) => {
          const allowed = isAvatarAllowed(src, theme);
          return <button className={avatar === src ? 'selected' : ''} type="button" key={src} onClick={() => setAvatar(src)} disabled={!allowed} aria-label={`${tr('Avatar', 'Аватар')} ${index + 1}`}><img src={src} alt="" /></button>;
        })}</div>
      </fieldset>
      <div><button type="button" onClick={() => setEditing(false)}>{tr('Cancel', 'Отмена')}</button><button type="submit" disabled={busy}>{busy ? '…' : tr('Save', 'Сохранить')}</button></div>
    </form>}
    {!user && <p>{tr('You can choose an avatar without an account. Log in to change your nickname.', 'Аватарку можно выбрать без аккаунта. Войди, чтобы изменить никнейм.')}</p>}
    {message && <p className="profile-message" role="status">{message}</p>}
    <Link href="/onboarding">{tr('Retake style quiz', 'Пройти тест заново')}</Link>
  </section>;
}
