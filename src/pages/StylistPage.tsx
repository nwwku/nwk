import { useState, type FormEvent } from 'react';
import { Icon } from '../components/Icon';
import { localize, useLanguage } from '../lib/language';
import { askStylist, type ChatMessage } from '../lib/stylist';

const starters = {
  en: ['What should I wear today?', 'How can I style wide-leg jeans?', 'Should I buy this jacket?'],
  ru: ['Что надеть сегодня?', 'С чем носить широкие джинсы?', 'Стоит ли покупать эту куртку?'],
};

export function StylistPage() {
  const { language } = useLanguage(); const tr = (en:string,ru:string) => localize(language,en,ru);
  const [messages, setMessages] = useState<ChatMessage[]>([]); const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); const [error, setError] = useState('');

  async function send(text: string) {
    const value = text.trim(); if (!value || loading) return;
    const next: ChatMessage[] = [...messages, { role:'user', text:value }];
    setMessages(next); setInput(''); setLoading(true); setError('');
    try { setMessages([...next, { role:'assistant', text:await askStylist(next, language) }]); }
    catch { setError(tr('The stylist is not connected yet. Set the Gemini secret and deploy the AI function.','Стилист пока не подключён. Добавьте секрет Gemini и разверните AI-функцию.')); }
    finally { setLoading(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void send(input); }

  return <div className="stylist-page fade-in">
    <header className="stylist-heading"><span className="stylist-mark"><Icon name="sparkle" /></span><div><p className="eyebrow">NERA AI</p><h1>{tr('Your stylist','Твой стилист')}</h1><p>{tr('Advice built around what you already own.','Советы с учётом вещей, которые у тебя уже есть.')}</p></div></header>
    <section className="chat-window">
      {messages.length === 0 && <div className="stylist-welcome"><h2>{tr('What are we dressing for?','Для чего подбираем образ?')}</h2><p>{tr('Ask about an outfit, a new item, colors, or a special occasion.','Спроси про образ, новую вещь, цвета или особый случай.')}</p><div>{starters[language].map((starter) => <button key={starter} onClick={() => void send(starter)}>{starter}<Icon name="arrow" size={15} /></button>)}</div></div>}
      {messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === 'assistant' ? 'N' : tr('You','Ты')}</span><p>{message.text}</p></div>)}
      {loading && <div className="chat-message assistant"><span>N</span><p className="typing"><i /><i /><i /></p></div>}
      {error && <p className="chat-error">{error}</p>}
    </section>
    <form className="chat-form" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={tr('Ask your stylist…','Спроси стилиста…')} maxLength={1200} /><button disabled={!input.trim() || loading} aria-label={tr('Send','Отправить')}><Icon name="arrow" /></button></form>
  </div>;
}
