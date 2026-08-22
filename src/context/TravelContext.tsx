import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trip,
  User,
  NotificationItem,
  GlobiSmartTip,
  ItineraryActivity,
  TripExpense,
  ChatMessage,
  JoinRequest,
  Poll
} from '../types/travel';
import { MOCK_USERS } from '../data/mockUsers';
import { INITIAL_MOCK_TRIPS } from '../data/mockTrips';

export type AppView = 
  | 'landing'
  | 'home'
  | 'discover'
  | 'trips'
  | 'trip-detail'
  | 'itinerary'
  | 'budget'
  | 'chat'
  | 'catalog'
  | 'profile'
  | 'admin';

export type AppTheme = 'light' | 'dark';

interface TravelContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  currentView: AppView;
  setCurrentView: (view: AppView, tripId?: string) => void;
  theme: AppTheme;
  toggleTheme: () => void;
  trips: Trip[];
  activeTrip: Trip | null;
  activeTripId: string | null;
  setActiveTripId: (tripId: string | null) => void;
  notifications: NotificationItem[];
  globiTip: GlobiSmartTip | null;
  
  // Trip actions
  createTrip: (tripData: Partial<Trip>) => Trip;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  cloneTrip: (tripId: string) => Trip;
  toggleLikeTrip: (tripId: string) => void;
  
  // Join request actions
  submitJoinRequest: (tripId: string, note: string) => boolean;
  respondToJoinRequest: (requestId: string, status: 'approved' | 'declined') => void;
  
  // Itinerary actions
  addActivity: (tripId: string, dayNumber: number, activity: Omit<ItineraryActivity, 'id'>) => void;
  updateActivity: (tripId: string, activityId: string, updates: Partial<ItineraryActivity>) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  voteOnActivity: (tripId: string, activityId: string, vote: 'up' | 'down') => void;
  acceptProposedActivity: (tripId: string, activityId: string) => void;
  
  // Budget & Split actions
  addExpense: (tripId: string, expense: Omit<TripExpense, 'id'>) => void;
  settleExpenseSplit: (tripId: string, expenseId: string, userId: string) => void;
  settleAllDebtsBetween: (tripId: string, debtorId: string, creditorId: string) => void;
  
  // Chat actions
  sendChatMessage: (tripId: string, body: string, poll?: Poll, isGlobi?: boolean) => void;
  voteOnPoll: (tripId: string, messageId: string, optionId: string) => void;
  
  // Globi actions
  dismissGlobiTip: () => void;
  askGlobiAI: (prompt: string, tripId?: string) => string;
  triggerGlobiCelebration: (message?: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  // Search & Filters
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_TRIPS = 'globetrotter_trips_v3';
const LOCAL_STORAGE_KEY_USER = 'globetrotter_current_user_v3';
const LOCAL_STORAGE_KEY_NOTIFS = 'globetrotter_notifs_v3';
const LOCAL_STORAGE_KEY_THEME = 'globetrotter_theme_v3';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'join_request',
    title: 'New Join Request!',
    message: 'Elena Rostova requested to join your "Bali Bliss Expedition".',
    time: '15m ago',
    read: false,
    tripId: 'trip-bali-01',
    joinRequestId: 'req-01',
    actionRequired: true,
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'notif-2',
    type: 'globi_tip',
    title: 'Globi Smart Tip',
    message: 'Your Bali Day 3 schedule is wide open after 2 PM — want suggestions?',
    time: '2h ago',
    read: false,
    tripId: 'trip-bali-01'
  },
  {
    id: 'notif-3',
    type: 'chat_message',
    title: 'New Poll in Bali Group',
    message: 'Sarah Jenkins created a poll: "How should we explore Mount Batur?"',
    time: '4h ago',
    read: true,
    tripId: 'trip-bali-01'
  }
];

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Default clean light mode
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (saved && MOCK_USERS[saved]) return MOCK_USERS[saved];
    return MOCK_USERS['user-sarah'];
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TRIPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored trips', e);
      }
    }
    return INITIAL_MOCK_TRIPS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored notifications', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [currentView, setCurrentViewState] = useState<AppView>('landing');
  const [activeTripId, setActiveTripId] = useState<string | null>('trip-bali-01');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [globiTip, setGlobiTip] = useState<GlobiSmartTip | null>({
    id: 'tip-hero',
    type: 'nudge',
    title: 'Proactive Tip from Globi',
    message: 'Your Bali Bliss trip has 1 pending join request from Elena and 2 open spots! Review her note to form your dream squad.',
    actionLabel: 'Review Request',
    targetTripId: 'trip-bali-01'
  });

  // Sync theme class on <html> document
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TRIPS, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  const activeTrip = trips.find(t => t.id === activeTripId) || null;

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    if (user.id === 'user-sarah') {
      setGlobiTip({
        id: 'tip-sarah',
        type: 'nudge',
        title: 'Welcome back Sarah! 👋',
        message: 'Elena is waiting to join your Bali trip. Also, your Amalfi Coast itinerary has 94 community clones!',
        actionLabel: 'Open Bali Trip',
        targetTripId: 'trip-bali-01'
      });
    } else if (user.id === 'user-alex') {
      setGlobiTip({
        id: 'tip-alex',
        type: 'suggestion',
        title: 'Hi Alex! Ready for Bali? 🎒',
        message: 'Sarah posted a poll for the Mount Batur Sunrise Safari in group chat. Cast your vote!',
        actionLabel: 'Go to Chat',
        targetTripId: 'trip-bali-01'
      });
    } else if (user.id === 'user-elena') {
      setGlobiTip({
        id: 'tip-elena',
        type: 'suggestion',
        title: 'Namaste Elena! ✨',
        message: 'Explore open trips to find fellow wellness nomads, or check the status of your Bali join request.',
        actionLabel: 'Discover Trips'
      });
    } else if (user.isAdmin) {
      setGlobiTip({
        id: 'tip-admin',
        type: 'celebration',
        title: 'Admin Control Center 🛡️',
        message: 'Platform health is optimal with 84% join-approval rate across 6 active trips.',
        actionLabel: 'View Analytics'
      });
    }
  };

  const setCurrentView = (view: AppView, tripId?: string) => {
    if (tripId) {
      setActiveTripId(tripId);
    }
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerGlobiCelebration = (message?: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F2541B', '#0D9488', '#F59E0B', '#3B82F6', '#10B981']
    });
  };

  // Trip CRUD
  const createTrip = (tripData: Partial<Trip>): Trip => {
    const newId = `trip-${Date.now()}`;
    const newTrip: Trip = {
      id: newId,
      title: tripData.title || 'New Dream Expedition',
      destination: tripData.destination || 'Global Explorer',
      country: tripData.country || 'World',
      coverImage: tripData.coverImage || '/assets/dest_bali.jpg',
      startDate: tripData.startDate || '2026-10-01',
      endDate: tripData.endDate || '2026-10-07',
      durationDays: tripData.durationDays || 7,
      description: tripData.description || 'An exciting new travel adventure created with GlobTrottler AI.',
      visibility: tripData.visibility || 'open_to_join',
      maxSpots: tripData.maxSpots || 4,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostBio: currentUser.bio,
      tags: tripData.tags && tripData.tags.length > 0 ? tripData.tags : ['Adventure', 'Culture'],
      totalBudget: tripData.totalBudget || 1500,
      spentBudget: 0,
      currency: tripData.currency || 'USD',
      likesCount: 1,
      clonedCount: 0,
      members: [
        {
          userId: currentUser.id,
          role: 'host',
          name: currentUser.name,
          avatar: currentUser.avatar,
          joinedAt: new Date().toISOString().split('T')[0]
        }
      ],
      joinRequests: [],
      days: [
        {
          dayNumber: 1,
          date: tripData.startDate || '2026-10-01',
          city: tripData.destination || 'Main City',
          highlights: 'Arrival, hotel check-in & welcome dinner',
          activities: [
            {
              id: `act-${Date.now()}-1`,
              day: 1,
              timeSlot: '02:00 PM',
              title: 'Check-in & Settle in Villa',
              location: tripData.destination || 'Central Hotel',
              description: 'Relax after arrival and settle into accommodations.',
              category: 'stay',
              estimatedCost: 120,
              durationHours: 2,
              status: 'accepted'
            },
            {
              id: `act-${Date.now()}-2`,
              day: 1,
              timeSlot: '07:00 PM',
              title: 'Local Welcome Dinner & Trip Kickoff',
              location: 'Old Town Traditional Bistro',
              description: 'Sample local culinary specialties and review tomorrow\'s route.',
              category: 'food',
              estimatedCost: 45,
              durationHours: 2.5,
              status: 'accepted'
            }
          ]
        }
      ],
      expenses: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          tripId: newId,
          senderId: 'globi-bot',
          senderName: 'Globi',
          senderAvatar: '/assets/globi_hero.jpg',
          isGlobi: true,
          body: `🎉 Congratulations on creating "${tripData.title || 'your new trip'}"! I\'m Globi, your AI travel companion. I will help you optimize your itinerary and stay on budget!`,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setTrips(prev => [newTrip, ...prev]);
    triggerGlobiCelebration();

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'globi_tip',
        title: 'Trip Created Successfully! 🚀',
        message: `"${newTrip.title}" is ready. Share with friends or open it for joins!`,
        time: 'Just now',
        read: false,
        tripId: newId
      },
      ...prev
    ]);

    return newTrip;
  };

  const updateTrip = (tripId: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(t => (t.id === tripId ? { ...t, ...updates } : t)));
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (activeTripId === tripId) {
      setActiveTripId(null);
      setCurrentViewState('trips');
    }
  };

  const cloneTrip = (tripId: string): Trip => {
    const original = trips.find(t => t.id === tripId);
    if (!original) throw new Error('Trip not found');

    const clonedId = `trip-clone-${Date.now()}`;
    const clonedTrip: Trip = {
      ...original,
      id: clonedId,
      title: `${original.title} (My Plan)`,
      visibility: 'private',
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostBio: currentUser.bio,
      isCloned: true,
      clonedFromTripId: original.id,
      members: [
        {
          userId: currentUser.id,
          role: 'host',
          name: currentUser.name,
          avatar: currentUser.avatar,
          joinedAt: new Date().toISOString().split('T')[0]
        }
      ],
      joinRequests: [],
      expenses: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          tripId: clonedId,
          senderId: 'globi-bot',
          senderName: 'Globi',
          senderAvatar: '/assets/globi_hero.jpg',
          isGlobi: true,
          body: `📋 Cloned from ${original.hostName}'s trip! You can now customize this itinerary to your own schedule.`,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setTrips(prev => [
      clonedTrip,
      ...prev.map(t => (t.id === tripId ? { ...t, clonedCount: t.clonedCount + 1 } : t))
    ]);

    triggerGlobiCelebration();
    return clonedTrip;
  };

  const toggleLikeTrip = (tripId: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id === tripId) {
          return { ...t, likesCount: t.likesCount + 1 };
        }
        return t;
      })
    );
  };

  // Join Requests
  const submitJoinRequest = (tripId: string, note: string): boolean => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return false;

    if (trip.members.some(m => m.userId === currentUser.id)) return false;
    if (trip.joinRequests.some(r => r.userId === currentUser.id && r.status === 'pending')) return false;

    const newRequest: JoinRequest = {
      id: `req-${Date.now()}`,
      tripId,
      tripTitle: trip.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userBio: currentUser.bio,
      userTags: currentUser.travelStyleTags,
      note,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTrips(prev =>
      prev.map(t => {
        if (t.id === tripId) {
          return {
            ...t,
            joinRequests: [newRequest, ...t.joinRequests]
          };
        }
        return t;
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'join_request',
        title: 'New Join Request!',
        message: `${currentUser.name} requested to join "${trip.title}"`,
        time: 'Just now',
        read: false,
        tripId,
        joinRequestId: newRequest.id,
        actionRequired: true,
        senderAvatar: currentUser.avatar
      },
      ...prev
    ]);

    return true;
  };

  const respondToJoinRequest = (requestId: string, status: 'approved' | 'declined') => {
    let affectedTripId = '';
    let applicantName = '';
    let applicantId = '';
    let applicantAvatar = '';

    setTrips(prev =>
      prev.map(t => {
        const req = t.joinRequests.find(r => r.id === requestId);
        if (!req) return t;

        affectedTripId = t.id;
        applicantName = req.userName;
        applicantId = req.userId;
        applicantAvatar = req.userAvatar;

        const updatedRequests = t.joinRequests.map(r =>
          r.id === requestId ? { ...r, status } : r
        );

        if (status === 'approved') {
          const newMember = {
            userId: req.userId,
            role: 'co_traveler' as const,
            name: req.userName,
            avatar: req.userAvatar,
            joinedAt: new Date().toISOString().split('T')[0]
          };

          const welcomeChat: ChatMessage = {
            id: `msg-join-${Date.now()}`,
            tripId: t.id,
            senderId: 'globi-bot',
            senderName: 'Globi',
            senderAvatar: '/assets/globi_hero.jpg',
            isGlobi: true,
            body: `🎉 ${req.userName} has joined the expedition! Give them a warm welcome and start collaborating on the itinerary!`,
            createdAt: new Date().toISOString()
          };

          return {
            ...t,
            joinRequests: updatedRequests,
            members: [...t.members.filter(m => m.userId !== req.userId), newMember],
            messages: [...t.messages, welcomeChat]
          };
        }

        return {
          ...t,
          joinRequests: updatedRequests
        };
      })
    );

    if (status === 'approved') {
      triggerGlobiCelebration();
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'join_approved',
          title: 'Traveler Joined! 🤝',
          message: `${applicantName} is now a co-traveler on your trip.`,
          time: 'Just now',
          read: false,
          tripId: affectedTripId,
          senderAvatar: applicantAvatar
        },
        ...prev
      ]);
    }
  };

  // Itinerary Activity Operations
  const addActivity = (tripId: string, dayNumber: number, activity: Omit<ItineraryActivity, 'id'>) => {
    const newActivity: ItineraryActivity = {
      ...activity,
      id: `act-${Date.now()}`
    };

    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;

        const dayExists = t.days.some(d => d.dayNumber === dayNumber);
        let updatedDays = [...t.days];

        if (dayExists) {
          updatedDays = updatedDays.map(d => {
            if (d.dayNumber === dayNumber) {
              return {
                ...d,
                activities: [...d.activities, newActivity]
              };
            }
            return d;
          });
        } else {
          updatedDays.push({
            dayNumber,
            date: new Date().toISOString().split('T')[0],
            city: t.destination,
            highlights: 'Exploring new sights',
            activities: [newActivity]
          });
        }

        const totalEstimated = updatedDays.reduce(
          (sum, d) => sum + d.activities.reduce((aSum, a) => aSum + (a.estimatedCost || 0), 0),
          0
        );

        return {
          ...t,
          days: updatedDays,
          spentBudget: Math.max(t.spentBudget, totalEstimated)
        };
      })
    );
  };

  const updateActivity = (tripId: string, activityId: string, updates: Partial<ItineraryActivity>) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          days: t.days.map(d => ({
            ...d,
            activities: d.activities.map(a => (a.id === activityId ? { ...a, ...updates } : a))
          }))
        };
      })
    );
  };

  const deleteActivity = (tripId: string, activityId: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          days: t.days.map(d => ({
            ...d,
            activities: d.activities.filter(a => a.id !== activityId)
          }))
        };
      })
    );
  };

  const voteOnActivity = (tripId: string, activityId: string, vote: 'up' | 'down') => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          days: t.days.map(d => ({
            ...d,
            activities: d.activities.map(a => {
              if (a.id !== activityId) return a;
              const votes = a.votes || [];
              const filtered = votes.filter(v => v.userId !== currentUser.id);
              const newVotes = [
                ...filtered,
                {
                  userId: currentUser.id,
                  userName: currentUser.name,
                  userAvatar: currentUser.avatar,
                  vote
                }
              ];
              return {
                ...a,
                votes: newVotes
              };
            })
          }))
        };
      })
    );
  };

  const acceptProposedActivity = (tripId: string, activityId: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          days: t.days.map(d => ({
            ...d,
            activities: d.activities.map(a => {
              if (a.id === activityId) {
                return {
                  ...a,
                  isProposal: false,
                  status: 'accepted'
                };
              }
              return a;
            })
          }))
        };
      })
    );
    triggerGlobiCelebration();
  };

  // Expenses & Splitwise
  const addExpense = (tripId: string, expense: Omit<TripExpense, 'id'>) => {
    const newExpense: TripExpense = {
      ...expense,
      id: `exp-${Date.now()}`
    };

    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        const updatedExpenses = [newExpense, ...t.expenses];
        const newTotalSpent = updatedExpenses.reduce((sum, e) => sum + e.totalAmount, 0);

        if (newTotalSpent > t.totalBudget) {
          setGlobiTip({
            id: `alert-budget-${Date.now()}`,
            type: 'budget_alert',
            title: 'Budget Alert from Globi! ⚠️',
            message: `Your expenses (${t.currency} ${newTotalSpent}) have exceeded your target budget (${t.currency} ${t.totalBudget}) by ${t.currency} ${newTotalSpent - t.totalBudget}!`,
            actionLabel: 'Review Budget',
            targetTripId: tripId
          });
        }

        return {
          ...t,
          expenses: updatedExpenses,
          spentBudget: newTotalSpent
        };
      })
    );
  };

  const settleExpenseSplit = (tripId: string, expenseId: string, userId: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          expenses: t.expenses.map(e => {
            if (e.id !== expenseId) return e;
            return {
              ...e,
              splits: e.splits.map(s => (s.userId === userId ? { ...s, settled: true } : s))
            };
          })
        };
      })
    );
    triggerGlobiCelebration();
  };

  const settleAllDebtsBetween = (tripId: string, debtorId: string, creditorId: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          expenses: t.expenses.map(e => {
            if (e.paidByUserId === creditorId) {
              return {
                ...e,
                splits: e.splits.map(s => (s.userId === debtorId ? { ...s, settled: true } : s))
              };
            }
            return e;
          })
        };
      })
    );
    triggerGlobiCelebration();
  };

  // Group Chat & Polls
  const sendChatMessage = (tripId: string, body: string, poll?: Poll, isGlobi: boolean = false) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      tripId,
      senderId: isGlobi ? 'globi-bot' : currentUser.id,
      senderName: isGlobi ? 'Globi' : currentUser.name,
      senderAvatar: isGlobi ? '/assets/globi_hero.jpg' : currentUser.avatar,
      isHost: isGlobi ? false : trips.find(t => t.id === tripId)?.hostId === currentUser.id,
      isGlobi,
      body,
      createdAt: new Date().toISOString(),
      poll,
      attachmentType: poll ? 'poll' : undefined
    };

    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      })
    );
  };

  const voteOnPoll = (tripId: string, messageId: string, optionId: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          messages: t.messages.map(m => {
            if (m.id !== messageId || !m.poll) return m;

            const updatedOptions = m.poll.options.map(opt => {
              const cleanVotes = opt.votes.filter(uId => uId !== currentUser.id);
              if (opt.id === optionId) {
                cleanVotes.push(currentUser.id);
              }
              return {
                ...opt,
                votes: cleanVotes
              };
            });

            return {
              ...m,
              poll: {
                ...m.poll,
                options: updatedOptions
              }
            };
          })
        };
      })
    );
  };

  const dismissGlobiTip = () => {
    setGlobiTip(null);
  };

  const askGlobiAI = (prompt: string, tripId?: string): string => {
    const lower = prompt.toLowerCase();
    if (lower.includes('pack') || lower.includes('what to bring')) {
      return "🎒 Globi Packing Checklist: Lightweight breathable linens, power adapter, universal plug, sunscreen SPF 50, reusable filtered bottle, slip-on shoes for temple visits, and a light jacket for breezy nights!";
    }
    if (lower.includes('weather') || lower.includes('forecast') || lower.includes('rain')) {
      return "☀️ Globi Weather Insight: Warm tropical climate with highs around 28°C (82°F) and gentle evening ocean breezes. Perfect for outdoor temple walks and sunset dinners!";
    }
    if (lower.includes('budget') || lower.includes('cost') || lower.includes('save')) {
      return "💰 Globi Budget Tip: Booking group transfers and cooking breakfast in your villa can save up to $180 across your group. Also, street warungs serve legendary meals for under $5!";
    }
    if (lower.includes('food') || lower.includes('eat') || lower.includes('restaurant')) {
      return "🍛 Globi Food Recommendation: You MUST try authentic local delicacies, fresh coconut water by the scenic ridges, and seaside seafood grills with sunset views!";
    }
    if (lower.includes('temple') || lower.includes('etiquette') || lower.includes('rules')) {
      return "🙏 Globi Cultural Etiquette: When visiting sacred heritage sites, dress respectfully with covered shoulders and knees. Always use your right hand when offering or receiving items!";
    }
    return `✨ Globi AI Suggestion: Great question! Based on your group interests, I suggest scheduling morning activities around 7:30 AM to avoid midday heat and peak tourist crowds. Let me know if you want me to draft a custom day plan!`;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <TravelContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: Object.values(MOCK_USERS),
        currentView,
        setCurrentView,
        theme,
        toggleTheme,
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        notifications,
        globiTip,
        createTrip,
        updateTrip,
        deleteTrip,
        cloneTrip,
        toggleLikeTrip,
        submitJoinRequest,
        respondToJoinRequest,
        addActivity,
        updateActivity,
        deleteActivity,
        voteOnActivity,
        acceptProposedActivity,
        addExpense,
        settleExpenseSplit,
        settleAllDebtsBetween,
        sendChatMessage,
        voteOnPoll,
        dismissGlobiTip,
        askGlobiAI,
        triggerGlobiCelebration,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        globalSearchQuery,
        setGlobalSearchQuery
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
