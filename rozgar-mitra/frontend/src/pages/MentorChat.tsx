import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { chatApi } from '@/api';
import { Send, Bot, User, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface Msg { role: 'user' | 'assistant'; content: string; sources: string[]; }

export default function MentorChat() {
  const { i18n } = useTranslation();
  const hi = i18n.language === 'hi';
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatApi.status().then(r => setAiAvailable(r.data.data.ai_available)).catch(() => setAiAvailable(false));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput('');
    setSending(true);
    setMessages(prev => [...prev, { role: 'user', content, sources: [] }]);
    try {
      const res = await chatApi.sendMessage({ content, language: i18n.language });
      const { reply, sources } = res.data.data;
      setMessages(prev => [...prev, { role: 'assistant', content: reply, sources: sources ?? [] }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: hi ? 'त्रुटि हुई। पुनः प्रयास करें।' : 'Something went wrong. Please try again.', sources: [] }]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = hi
    ? ['PM Vishwakarma के बारे में बताएं', 'मैं राजमिस्त्री हूं, मुझे कौन सी योजना मिलेगी?', 'e-Shram कार्ड कैसे बनाएं?', 'निःशुल्क कौशल प्रशिक्षण कहाँ मिलेगा?']
    : ['Tell me about PM Vishwakarma scheme', 'I am a mason, what schemes can I apply for?', 'How do I register on e-Shram?', 'Where can I get free skill training?'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
          <Bot size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">{hi ? 'AI करियर सलाहकार' : 'AI Career Mentor'}</h1>
          <p className="text-xs text-gray-500">IBM Granite · watsonx.ai · RAG</p>
        </div>
        <div className={clsx('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full', aiAvailable ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
          <span className={clsx('w-2 h-2 rounded-full', aiAvailable ? 'bg-green-500 animate-pulse' : 'bg-amber-500')} />
          {aiAvailable === null ? '...' : aiAvailable ? (hi ? 'AI चालू' : 'AI Online') : (hi ? 'AI बंद' : 'AI Offline')}
        </div>
      </div>

      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 flex gap-2">
        <Info size={14} className="shrink-0 mt-0.5" />
        {hi ? 'AI के जवाब केवल मार्गदर्शन के लिए हैं। किसी भी योजना के लिए आधिकारिक वेबसाइट पर जाएं।'
           : 'AI responses are for guidance only. Always verify at official government websites before applying.'}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-2">
        {messages.length === 0 && (
          <div className="py-6">
            <p className="text-center text-gray-400 text-sm mb-5">
              {hi ? 'कोई भी सवाल पूछें 👇' : 'Ask me anything about your career or welfare schemes 👇'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); taRef.current?.focus(); }}
                  className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-brand-400 hover:bg-brand-50 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={clsx('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0 mt-1">
                <Bot size={15} className="text-white" />
              </div>
            )}
            <div className={clsx('max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm')}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 mb-1">{hi ? 'स्रोत:' : 'Sources used:'}</p>
                  {msg.sources.map((s, j) => <p key={j} className="text-xs text-gray-400 truncate">{s}</p>)}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                <User size={15} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
              <Bot size={15} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center h-10">
              {[0,150,300].map(d => <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2 items-end bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <textarea ref={taRef} rows={1}
          className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-28 overflow-y-auto"
          placeholder={hi ? 'अपना सवाल लिखें...' : 'Type your question...'}
          value={input} onChange={e => setInput(e.target.value)} maxLength={2000}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
        />
        <button onClick={send} disabled={!input.trim() || sending}
          className="w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0">
          <Send size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}
