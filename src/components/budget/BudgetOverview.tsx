import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  DollarSign,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Plus,
  Receipt,
  Bed,
  Utensils,
  Camera,
  Car,
  Tag
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Trip } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { ExpenseSplitter } from './ExpenseSplitter';
import { AddExpenseModal } from './AddExpenseModal';

const CATEGORY_COLORS: Record<string, string> = {
  stay: '#6366F1',
  transport: '#0EA5E9',
  food: '#F43F5E',
  activities: '#F59E0B',
  misc: '#10B981'
};

export const BudgetOverview: React.FC<{ trip: Trip }> = ({ trip }) => {
  const { theme } = useTravel();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const expenses = trip.expenses || [];
  const totalSpent = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const totalBudget = trip.totalBudget || 2000;
  const percentUsed = Math.min(100, Math.round((totalSpent / totalBudget) * 100));
  const isOverBudget = totalSpent > totalBudget;

  const categoryTotals: Record<string, number> = {
    stay: 0,
    transport: 0,
    food: 0,
    activities: 0,
    misc: 0
  };

  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.totalAmount;
  });

  const pieData = Object.entries(categoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([cat, val]) => ({
      name: cat.toUpperCase(),
      value: val,
      color: CATEGORY_COLORS[cat] || '#0D9488'
    }));

  const barData = [
    { name: 'Target Budget', amount: totalBudget, fill: '#0F172A' },
    { name: 'Current Spent', amount: totalSpent, fill: isOverBudget ? '#F43F5E' : '#0D9488' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Planned Target</span>
            <DollarSign className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {trip.currency} {totalBudget.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Fixed target budget</p>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Total Recorded Spent</span>
            <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3
            className={`text-2xl font-extrabold font-display ${
              isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {trip.currency} {totalSpent.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {percentUsed}% of total budget consumed
          </p>
        </div>

        {/* Remaining / Over */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{isOverBudget ? 'Over Budget' : 'Remaining Funds'}</span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3
            className={`text-2xl font-extrabold font-display ${
              isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
            }`}
          >
            {trip.currency} {Math.abs(totalBudget - totalSpent).toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isOverBudget ? 'Exceeded planned target' : 'Safe buffer remaining'}
          </p>
        </div>
      </div>

      {/* Progress Bar & Overbudget Alert */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Budget Burn Rate</span>
          <span className={isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
            {percentUsed}% Used
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        {isOverBudget && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-xs text-rose-800 dark:text-rose-200">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-rose-300 dark:border-rose-700 flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm">
              <img src="/assets/globi_budget.jpg" alt="Globi Budget Guardian" className="w-full h-full object-cover" />
            </div>
            <div>
              <h5 className="font-bold text-rose-700 dark:text-rose-300">Globi Budget Guardian Alert</h5>
              <p>
                Your group has exceeded the planned budget by ${totalSpent - totalBudget}. Consider reviewing dining and transport bookings!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Donut Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-500" />
            <span>Expenses by Category</span>
          </h4>

          {pieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              No category expenses recorded yet
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      borderRadius: '12px',
                      color: theme === 'dark' ? '#fff' : '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {Object.entries(categoryTotals).map(([cat, val]) => (
              <div
                key={cat}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                />
                <span className="capitalize">{cat}:</span>
                <span className="font-bold text-slate-900 dark:text-white">${val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget vs Spent Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Target vs Actual Spending</span>
          </h4>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    color: theme === 'dark' ? '#fff' : '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Splitwise Ledger Section */}
      <ExpenseSplitter trip={trip} />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        trip={trip}
      />
    </div>
  );
};
