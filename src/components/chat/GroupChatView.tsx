import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Vote,
  Receipt,
  Pin,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Smile,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Trip, ChatMessage, Poll } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { CreatePollModal } from './CreatePollModal';
import { AddExpenseModal } from '../budget/AddExpenseModal';

export const GroupChatView: React.FC<{ trip: Trip }> = ({ trip }) => {
  const { currentUser, sendChatMessage, voteOnPoll, setCurrentView } = useTravel();

  const [input, setInput] = useState('');
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const messages = trip.messages || [];
  const members = trip.members || [];
  const todayActivities = trip.days?.[0]?.activities || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (input.startsWith('/globi')) {
      const prompt = input.replace('/globi', '').trim();
      sendChatMessage(trip.id, prompt || 'Can you help our group with recommendations?');
      setInput('');

      setTimeout(() => {
        const reply = `✨ Globi AI Assistant: For ${trip.destination}, I recommend wrapping up your morning adventures before 11:30 AM to stay refreshed. Would you like me to suggest top dinner spots for tonight?`;
        sendChatMessage(trip.id, reply, undefined, true);
      }, 700);
      return;
    }

    sendChatMessage(trip.id, input);
    setInput('');
  };

  const handleSummonGlobi = () => {
    sendChatMessage(
      trip.id,
      `✨ Globi AI Assistant: Hey everyone! I am actively monitoring ${trip.title}. Don't forget that Day 2 includes the early morning sunrise walk — make sure you get good rest tonight!`,
      undefined,
      true
    );
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col h-[650px] shadow-sm">
      {/* Top Banner: Pinned Itinerary Widget */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center flex-shrink-0">
            <Pin className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <p className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
              Pinned Itinerary • Day 1 Kickoff
            </p>
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {todayActivities[0]?.title || 'Arrival & Check-in'} ({todayActivities[0]?.timeSlot || '02:00 PM'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCurrentView('itinerary', trip.id)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm"
          >
            Full Plan
          </button>
          <div className="flex items-center -space-x-1.5">
            {members.map(m => (
              <img
                key={m.userId}
                src={m.avatar}
                alt={m.name}
                title={m.name}
                className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-slate-900"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-white dark:bg-slate-900">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-rose-500 opacity-60" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Welcome to the Squad Chat!</p>
            <p className="text-xs text-slate-500">
              Say hi, create polls, share expenses, or summon Globi with <span className="text-rose-500 font-mono">/globi</span>.
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  {msg.isHost && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
                  )}
                </div>

                {/* Bubble Container */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Timestamp */}
                  <div className={`flex items-center gap-1.5 text-[11px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                    {msg.isHost && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-extrabold uppercase bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        Host
                      </span>
                    )}
                    {msg.isGlobi && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-extrabold uppercase bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        AI Companion
                      </span>
                    )}
                    <span className="text-slate-400 text-[10px]">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Body Text */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.isGlobi
                        ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-100 rounded-tl-none'
                        : isMe
                        ? 'bg-rose-500 text-white font-medium rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.body}</p>

                    {/* Render Interactive Poll */}
                    {msg.poll && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-900 dark:text-white flex items-center gap-1">
                            <Vote className="w-3.5 h-3.5 text-rose-500" />
                            <span>{msg.poll.question}</span>
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {msg.poll.options.map(opt => {
                            const totalPollVotes = msg.poll!.options.reduce(
                              (sum, o) => sum + o.votes.length,
                              0
                            );
                            const percent = totalPollVotes > 0 ? Math.round((opt.votes.length / totalPollVotes) * 100) : 0;
                            const hasVoted = opt.votes.includes(currentUser.id);

                            return (
                              <button
                                key={opt.id}
                                onClick={() => voteOnPoll(trip.id, msg.id, opt.id)}
                                className={`w-full text-left p-2.5 rounded-xl border relative overflow-hidden transition-all ${
                                  hasVoted
                                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 text-slate-900 dark:text-white font-bold'
                                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div
                                  className="absolute left-0 top-0 bottom-0 bg-rose-500/15 dark:bg-rose-500/25 transition-all duration-500"
                                  style={{ width: `${percent}%` }}
                                />

                                <div className="relative flex items-center justify-between text-xs z-10">
                                  <span className="line-clamp-1">{opt.text}</span>
                                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                    <span className="font-bold text-rose-600 dark:text-rose-400">{percent}%</span>
                                    <span className="text-[10px] text-slate-500">({opt.votes.length})</span>
                                    {hasVoted && <Check className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Bar & Quick Action Shortcuts */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setIsPollModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap shadow-sm transition-colors"
          >
            <Vote className="w-3.5 h-3.5 text-rose-500" />
            <span>Create Poll</span>
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap shadow-sm transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
            <span>Split Expense</span>
          </button>

          <button
            onClick={handleSummonGlobi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-700 dark:text-teal-300 whitespace-nowrap shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
            <span>Ask Globi AI</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message or /globi for AI tips..."
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Modals */}
      <CreatePollModal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        trip={trip}
      />
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        trip={trip}
      />
    </div>
  );
};
