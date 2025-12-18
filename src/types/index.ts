export interface Child {
  id: string;
  name: string;
  age: number;
  allergies: string[];
  notes: string;
  avatar: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  childId: string;
  childName: string;
  date: string;
  timeSlot: string;
  duration: number;
  payment: number;
  paymentMethod: 'card' | 'cash';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface WaitingListEntry {
  id: string;
  childId: string;
  childName: string;
  date: string;
  position: number;
  createdAt: Date;
}

export type OccupancyLevel = 'low' | 'medium' | 'full';

export interface AppState {
  children: Child[];
  bookings: Booking[];
  waitingList: WaitingListEntry[];
  currentOccupancy: number;
  maxCapacity: number;
}
