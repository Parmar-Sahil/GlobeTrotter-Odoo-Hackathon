import React, { useState } from 'react';
import { Vote, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { Trip } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

export const CreatePollModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}> = ({ isOpen, onClose, trip }) => {
  const { currentUser, sendChatMessage, triggerGlobiCelebration } = useTravel();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['Option 1', 'Option 2']);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, `Option ${options.length + 1}`]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (text: string, index: number) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const poll = {
      id: `poll-${Date.now()}`,
      question: question.trim(),
      createdBy: currentUser.id,
      creatorName: currentUser.name,
      options: options
        .filter(opt => opt.trim().length > 0)
        .map((opt, idx) => ({
          id: `opt-${idx + 1}`,
          text: opt.trim(),
          votes: []
        }))
    };

    sendChatMessage(trip.id, `📊 ${currentUser.name} created a live squad poll!`, poll);
    triggerGlobiCelebration();
    onClose();
    setQuestion('');
    setOptions(['Option 1', 'Option 2']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">Create Squad Poll</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live decision voting in chat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Poll Question *
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. Which sunset dinner spot should we book on Day 3?"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Options
            </label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={e => handleOptionChange(e.target.value, idx)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Option</span>
              </button>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Vote className="w-4 h-4" />
              <span>Post Poll to Squad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
