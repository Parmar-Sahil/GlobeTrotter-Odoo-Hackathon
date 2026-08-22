import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  UserPlus,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  ThumbsUp,
  ArrowRight
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const NotificationDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentView
  } = useTravel();

  if (!isOpen) return null;

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    if (n.tripId) {
      if (n.type === 'join_request') {
        setCurrentView('trip-detail', n.tripId);
      } else if (n.type === 'chat_message') {
        setCurrentView('chat', n.tripId);
      } else if (n.type === 'budget_alert') {
        setCurrentView('budget', n.tripId);
      } else {
        setCurrentView('trip-detail', n.tripId);
      }
    }
    onClose();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'join_request':
      case 'join_approved':
        return <UserPlus className="w-4 h-4 text-rose-500" />;
      case 'globi_tip':
        return <Sparkles className="w-4 h-4 text-teal-500" />;
      case 'chat_message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'budget_alert':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-white dark:bg-slate-900">
          {notifications.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  n.read
                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 opacity-75'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
                  {getNotifIcon(n.type)}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{n.title}</h5>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
