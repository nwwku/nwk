import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabase';

export function AuthCallbackPage() {
  const [, setLocation] = useLocation();
  const started = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      setError('Не удалось завершить вход. Попробуйте войти ещё раз.');
      return;
    }

    void supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      if (exchangeError) {
        setError('Ссылка входа недействительна или уже использована. Попробуйте ещё раз.');
        return;
      }
      setLocation('/profile', { replace: true });
    });
  }, [setLocation]);

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <p className="eyebrow">NERA ACCOUNT</p>
        <h1>{error ? 'Не удалось войти' : 'Завершаем вход…'}</h1>
        {error && <p className="auth-message" role="alert">{error}</p>}
      </section>
    </main>
  );
}
