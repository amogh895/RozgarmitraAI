import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { chatApi } from '@/api';
import toast from 'react-hot-toast';
import { Send, Bot, User, AlertTriangle, Info } from 'lucide-react';
import clsx from 'clsx';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  sources: string[];
  created_at: string;
}

export default function MentorChat() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<number | undefined>();
  const [sending, setSending] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatApi.status().then(r => setAiAvailable(r.data.data.ai_available)).catch(() => setAiAvailable(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content,
      sources: [],
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await chatApi.sendMessage({
        content,
        session_id: sessionId,
        language: i18n.language as 'en' | 'hi',
      });
      const { reply, sessionId: sid, sources, isAiGenerated } = res.data.data;
      if (!sessionId) setSessionId(sid);

      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        sources: sources ?? [],
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      if (!isAiGenerated) {
        toast(t('mentor.unavailable'), { icon: '⚠️', duration: 5000 });
      }
    } catch {
      toast.error(t('common.error'));
      setSending(false);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const SUGGESTIONS = i18n.language === 'hi'
    ? ['मुझे नई नौकरी कैसे मिलेगी?', 'PM Vishwakarma योजना क्या है?', 'मेरे कौशल बढ़ाने के लिए क्या करूं?']
    : ['How do I find a better job?', 'What is PM Vishwakarma scheme?', 'What skills should I learn to earn more?'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('mentor.title')}</h1>
            <p className="text-xs text-gray-500">{t('mentor.subtitle')}</p>
          </div>
          <div className={clsx('ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full', aiAvailable === true ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
            <span className={clsx('w-2 h-2 rounded-full', aiAvailable === true ? 'bg-green-500' : 'bg-amber-500')} />
            {aiAvailable === true ? 'AI Online' : aiAvailable === false ? 'AI Offline' : '...'}
          </div>
        </div>
      </div>

      {/* Unavailability notice */}
      {aiAvailable === false && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex gap-2">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>{t('mentor.unavailable')}</span>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 flex gap-2">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>{t('mentor.disclaimer')}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-5">Ask me anything about your career or jobs.</p>
            <div className="flex flex-col gap-2 max-w-xs mx-auto">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                  className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-brand-400 hover:bg-brand-50 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={clsx('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={clsx('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm')}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold mb-1">Sources used:</p>
                  {msg.sources.map((s, i) => <p key={i} className="text-xs text-gray-400 truncate">{s}</p>)}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3 items-end bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <textarea
          ref={textareaRef}
          rows={1}
          className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-32 overflow-y-auto"
          placeholder={t('mentor.placeholder')}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={2000}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
          aria-label={t('mentor.send')}
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
