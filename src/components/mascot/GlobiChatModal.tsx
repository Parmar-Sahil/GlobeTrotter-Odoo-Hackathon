import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, Compass, CloudSun, DollarSign, Utensils, Luggage } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

interface Message {
  sender: 'user' | 'globi';
  text: string;
  time: string;
}

export const GlobiChatModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { askGlobiAI, activeTrip } = useTravel();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'globi',
      text: `👋 Hi! I'm Globi, your AI travel companion. Ask me for packing lists, local cultural etiquette, weather forecasts, or top foodie spots for ${activeTrip ? activeTrip.title : 'any destination'}!`,
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = askGlobiAI(query, activeTrip?.id);
      const globiMsg: Message = {
        sender: 'globi',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, globiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = [
    { icon: <Luggage className="w-3.5 h-3.5 text-teal-500" />, label: 'Packing List', prompt: 'What should I pack for this trip?' },
    { icon: <CloudSun className="w-3.5 h-3.5 text-amber-500" />, label: 'Weather', prompt: 'What is the weather like right now?' },
    { icon: <DollarSign className="w-3.5 h-3.5 text-emerald-500" />, label: 'Budget Tips', prompt: 'How can our group save on daily expenses?' },
    { icon: <Utensils className="w-3.5 h-3.5 text-rose-500" />, label: 'Local Food', prompt: 'What are the must-eat local dishes and restaurants?' },
    { icon: <Compass className="w-3.5 h-3.5 text-blue-500" />, label: 'Local Etiquette', prompt: 'What cultural etiquette and rules should I know?' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col h-[85vh] sm:h-[580px] overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm animate-globi-soft">
                <img src="/assets/globi_idea.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display">Globi AI Companion</h3>
                <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeTrip ? `Destination: ${activeTrip.destination}` : 'Ready to help your journey'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt pills */}
        <div className="p-2 bg-slate-100/70 dark:bg-slate-950/40 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-sm whitespace-nowrap transition-all"
            >
              {qp.icon}
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Chat message stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white dark:bg-slate-900">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {m.sender === 'globi' ? (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-800">
                  <img src="/assets/globi_hero.jpg" alt="Globi" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-xs font-bold text-white dark:text-slate-900 flex-shrink-0">
                  You
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-rose-500 text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`block text-[10px] mt-1 ${
                    m.sender === 'user' ? 'text-white/80 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src="/assets/globi_idea.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-1 items-center px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Globi anything about your trip..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
