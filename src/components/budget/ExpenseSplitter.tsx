import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  CheckCircle2,
  Receipt,
  Plus,
  ArrowRight,
  Sparkles,
  Check,
  CreditCard
} from 'lucide-react';
import { Trip, TripExpense } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { AddExpenseModal } from './AddExpenseModal';

export const ExpenseSplitter: React.FC<{ trip: Trip }> = ({ trip }) => {
  const { currentUser, settleExpenseSplit, settleAllDebtsBetween } = useTravel();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const expenses = trip.expenses || [];
  const members = trip.members || [];

  const debts: { debtor: typeof members[0]; creditor: typeof members[0]; amount: number }[] = [];

  const memberBalances: Record<string, { paid: number; share: number; net: number }> = {};
  members.forEach(m => {
    memberBalances[m.userId] = { paid: 0, share: 0, net: 0 };
  });

  expenses.forEach(exp => {
    if (memberBalances[exp.paidByUserId]) {
      memberBalances[exp.paidByUserId].paid += exp.totalAmount;
    }
    exp.splits.forEach(split => {
      if (memberBalances[split.userId]) {
        memberBalances[split.userId].share += split.amountOwed;
      }
      if (!split.settled && split.userId !== exp.paidByUserId) {
        const debtor = members.find(m => m.userId === split.userId);
        const creditor = members.find(m => m.userId === exp.paidByUserId);
        if (debtor && creditor) {
          const existing = debts.find(
            d => d.debtor.userId === debtor.userId && d.creditor.userId === creditor.userId
          );
          if (existing) {
            existing.amount += split.amountOwed;
          } else {
            debts.push({ debtor, creditor, amount: split.amountOwed });
          }
        }
      }
    });
  });

  Object.keys(memberBalances).forEach(uId => {
    memberBalances[uId].net = memberBalances[uId].paid - memberBalances[uId].share;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Record Action */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Group Expense Ledger (Splitwise)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track who paid, split bills automatically & settle balances in one tap
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="px-4 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record Shared Expense</span>
        </button>
      </div>

      {/* Group Net Balances Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {members.map(m => {
          const bal = memberBalances[m.userId] || { paid: 0, share: 0, net: 0 };
          const isPositive = bal.net >= 0;
          return (
            <div
              key={m.userId}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{m.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Paid: <strong className="text-slate-800 dark:text-slate-200">${bal.paid}</strong> • Share: <strong className="text-slate-800 dark:text-slate-200">${bal.share}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Net Standing:</span>
                <span
                  className={`font-extrabold px-2 py-0.5 rounded text-xs ${
                    isPositive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {isPositive ? `+$${bal.net.toFixed(2)}` : `-$${Math.abs(bal.net).toFixed(2)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outstanding Debts & Settle Up Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span>Outstanding Group Debts</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {debts.length} Pending
          </span>
        </h4>

        {debts.length === 0 ? (
          <div className="p-5 text-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>All group expenses are completely settled up! 🎉</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {debts.map((d, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <img src={d.debtor.avatar} alt={d.debtor.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{d.debtor.name}</span>
                  </div>

                  <span className="text-xs text-rose-500 font-semibold">owes</span>

                  <div className="flex items-center gap-2">
                    <img src={d.creditor.avatar} alt={d.creditor.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{d.creditor.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ${d.amount.toFixed(2)}
                  </span>

                  <button
                    onClick={() => settleAllDebtsBetween(trip.id, d.debtor.userId, d.creditor.userId)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Settle Up</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expense History List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Recorded Expenses History ({expenses.length})
        </h4>

        {expenses.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs shadow-sm">
            No expenses recorded yet. Click "Record Shared Expense" above to add your first bill!
          </div>
        ) : (
          expenses.map(exp => (
            <div
              key={exp.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">{exp.title}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Paid by <strong className="text-slate-800 dark:text-slate-200">{exp.paidByUserName}</strong> on {exp.date}
                    </p>
                  </div>
                </div>

                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  ${exp.totalAmount}
                </span>
              </div>

              {/* Splits List */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                {exp.splits.map((s, sIdx) => (
                  <div
                    key={sIdx}
                    onClick={() => !s.settled && settleExpenseSplit(trip.id, exp.id, s.userId)}
                    className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                      s.settled
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 cursor-pointer hover:bg-rose-100'
                    }`}
                  >
                    <img src={s.userAvatar} alt={s.userName} className="w-4 h-4 rounded-full object-cover" />
                    <span>{s.userName.split(' ')[0]}: ${s.amountOwed}</span>
                    {s.settled ? (
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                    ) : (
                      <span className="text-[10px] underline font-bold">Unsettled</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        trip={trip}
      />
    </div>
  );
};
