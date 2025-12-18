import { useState, useEffect } from 'react';
import { Child, Booking, WaitingListEntry, AppState } from '@/types';

const STORAGE_KEY = 'lolys_land_data';

const initialState: AppState = {
  children: [],
  bookings: [],
  waitingList: [],
  currentOccupancy: 0,
  maxCapacity: 20,
};

export const useAppStore = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        children: parsed.children.map((c: Child) => ({ ...c, createdAt: new Date(c.createdAt) })),
        bookings: parsed.bookings.map((b: Booking) => ({ ...b, createdAt: new Date(b.createdAt) })),
        waitingList: parsed.waitingList.map((w: WaitingListEntry) => ({ ...w, createdAt: new Date(w.createdAt) })),
      };
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Simulate occupancy changes
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        currentOccupancy: Math.min(
          prev.maxCapacity,
          Math.max(0, prev.currentOccupancy + Math.floor(Math.random() * 5) - 2)
        ),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addChild = (child: Omit<Child, 'id' | 'createdAt'>) => {
    const newChild: Child = {
      ...child,
      id: `child_${Date.now()}`,
      createdAt: new Date(),
    };
    setState(prev => ({ ...prev, children: [...prev.children, newChild] }));
    return newChild;
  };

  const updateChild = (id: string, updates: Partial<Child>) => {
    setState(prev => ({
      ...prev,
      children: prev.children.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  };

  const deleteChild = (id: string) => {
    setState(prev => ({
      ...prev,
      children: prev.children.filter(c => c.id !== id),
    }));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `BK${Date.now().toString().slice(-8)}`,
      createdAt: new Date(),
    };
    setState(prev => ({
      ...prev,
      bookings: [...prev.bookings, newBooking],
      currentOccupancy: Math.min(prev.maxCapacity, prev.currentOccupancy + 1),
    }));
    return newBooking;
  };

  const extendBooking = (id: string, additionalMinutes: number, additionalPayment: number) => {
    setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(b =>
        b.id === id
          ? { ...b, duration: b.duration + additionalMinutes, payment: b.payment + additionalPayment }
          : b
      ),
    }));
  };

  const completeBooking = (id: string) => {
    setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(b =>
        b.id === id ? { ...b, status: 'completed' as const } : b
      ),
      currentOccupancy: Math.max(0, prev.currentOccupancy - 1),
    }));
  };

  const addToWaitingList = (entry: Omit<WaitingListEntry, 'id' | 'position' | 'createdAt'>) => {
    const position = state.waitingList.filter(w => w.date === entry.date).length + 1;
    const newEntry: WaitingListEntry = {
      ...entry,
      id: `wait_${Date.now()}`,
      position,
      createdAt: new Date(),
    };
    setState(prev => ({ ...prev, waitingList: [...prev.waitingList, newEntry] }));
    return newEntry;
  };

  const removeFromWaitingList = (id: string) => {
    setState(prev => ({
      ...prev,
      waitingList: prev.waitingList.filter(w => w.id !== id),
    }));
  };

  const getOccupancyLevel = () => {
    const ratio = state.currentOccupancy / state.maxCapacity;
    if (ratio < 0.5) return 'low';
    if (ratio < 0.8) return 'medium';
    return 'full';
  };

  const getTodayBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return state.bookings.filter(b => b.date === today && b.status === 'active');
  };

  const getRecentBookings = () => {
    return [...state.bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  return {
    ...state,
    addChild,
    updateChild,
    deleteChild,
    addBooking,
    extendBooking,
    completeBooking,
    addToWaitingList,
    removeFromWaitingList,
    getOccupancyLevel,
    getTodayBookings,
    getRecentBookings,
  };
};
