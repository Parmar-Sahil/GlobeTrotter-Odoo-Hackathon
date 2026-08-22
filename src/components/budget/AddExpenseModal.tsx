import React, { useState } from 'react';
import { Receipt, DollarSign, X, Check, Users } from 'lucide-react';
import { Trip } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

export const AddExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}> = ({ isOpen, onClose, trip }) => {
  const { currentUser, addExpense, triggerGlobiCelebration } = useTravel();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'stay' | 'transport' | 'food' | 'activities' | 'misc'>('food');
  const [paidByUserId, setPaidByUserId] = useState(currentUser.id);
  const [splitWithUserIds, setSplitWithUserIds] = useState<string[]>(
    trip.members.map(m => m.userId)
  );

  if (!isOpen) return null;

  const toggleSplitUser = (userId: string) => {
    if (splitWithUserIds.includes(userId)) {
      if (splitWithUserIds.length > 1) {
        setSplitWithUserIds(splitWithUserIds.filter(id => id !== userId));
      }
    } else {
      setSplitWithUserIds([...splitWithUserIds, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const paidMember = trip.members.find(m => m.userId === paidByUserId) || {
      userId: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar
    };

    const sharePerPerson = parseFloat((numAmount / splitWithUserIds.length).toFixed(2));

    const splits = splitWithUserIds.map(uId => {
      const member = trip.members.find(m => m.userId === uId);
      return {
        userId: uId,
        userName: member?.name || 'Traveler',
        userAvatar: member?.avatar || currentUser.avatar,
        amountOwed: sharePerPerson,
        settled: uId === paidByUserId
      };
    });

    addExpense(trip.id, {
      tripId: trip.id,
      title: title || 'Group Shared Expense',
      category,
      totalAmount: numAmount,
      currency: trip.currency || 'USD',
      paidByUserId: paidMember.userId,
      paidByUserName: paidMember.name,
      paidByUserAvatar: paidMember.avatar,
      date: new Date().toISOString().split('T')[0],
      splits
    });

    triggerGlobiCelebration();
    onClose();
    setTitle('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">Record Group Expense</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Automatic Splitwise distribution</p>
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
              Expense Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Seafood Dinner at Jimbaran Beach"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Total Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="120.00"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              >
                <option value="food">Food & Dining</option>
                <option value="stay">Accommodations</option>
                <option value="transport">Transport & Taxi</option>
                <option value="activities">Activities & Tickets</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Paid By
            </label>
            <select
              value={paidByUserId}
              onChange={e => setPaidByUserId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            >
              {trip.members.map(m => (
                <option key={m.userId} value={m.userId}>
                  {m.name} {m.userId === currentUser.id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Split Equally Between ({splitWithUserIds.length} members)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {trip.members.map(m => {
                const isIncluded = splitWithUserIds.includes(m.userId);
                return (
                  <div
                    key={m.userId}
                    onClick={() => toggleSplitUser(m.userId)}
                    className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isIncluded
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-slate-900 dark:text-white font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-xs">{m.name.split(' ')[0]}</span>
                    </div>
                    {isIncluded && <Check className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />}
                  </div>
                );
              })}
            </div>
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
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Record Bill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
