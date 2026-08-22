import React from 'react';
import {
  BarChart3,
  Users,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Trash2,
  CheckCircle,
  Eye,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { useTravel } from '../../context/TravelContext';

export const AdminDashboard: React.FC = () => {
  const { trips, deleteTrip, theme } = useTravel();

  const totalTrips = trips.length;
  const totalClones = trips.reduce((sum, t) => sum + (t.clonedCount || 0), 0);
  const totalMembers = trips.reduce((sum, t) => sum + t.members.length, 0);
  const openTripsCount = trips.filter(t => t.visibility === 'open_to_join').length;

  const monthlyAdoptionData = [
    { month: 'Apr', trips: 18, joins: 42, activeUsers: 120 },
    { month: 'May', trips: 29, joins: 65, activeUsers: 210 },
    { month: 'Jun', trips: 45, joins: 98, activeUsers: 340 },
    { month: 'Jul', trips: 62, joins: 140, activeUsers: 490 },
    { month: 'Aug', trips: 84, joins: 195, activeUsers: 720 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mt-2">
          GlobeTrotter Platform <span className="text-rose-500">Analytics</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Monitor social trips adoption, community join rates, itinerary cloning engagement, and content moderation.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Total Expeditions</span>
            <Globe2 className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {totalTrips}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+24% this month</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Open Squads Active</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {openTripsCount}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Joinable on Discover feed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Itinerary Clones</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {totalClones + 148}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">High social engagement</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Squad Travelers</span>
            <CheckCircle className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {totalMembers + 18}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Co-travelers connected</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-rose-500" />
          <span>Monthly Travel Adoption & Join Velocity</span>
        </h4>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyAdoptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
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
              <Bar dataKey="trips" name="New Trips" fill="#FF385C" radius={[6, 6, 0, 0]} />
              <Bar dataKey="joins" name="Approved Joins" fill="#0D9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trip Moderation Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
          Community Trip Moderation
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="pb-3">Trip</th>
                <th className="pb-3">Host</th>
                <th className="pb-3">Visibility</th>
                <th className="pb-3">Members</th>
                <th className="pb-3">Budget</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trips.map(trip => (
                <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {trip.title}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {trip.hostName}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {trip.visibility.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {trip.members.length} / {trip.maxSpots || 4}
                  </td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    ${trip.totalBudget}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 font-semibold"
                      title="Moderate / Delete Trip"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
