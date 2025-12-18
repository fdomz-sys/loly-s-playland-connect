import React from 'react';
import { Header } from '@/components/Header';
import { BookingCard } from '@/components/BookingCard';
import { Booking } from '@/types';

interface HistoryScreenProps {
  recentBookings: Booking[];
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  recentBookings,
  onBack,
}) => {
  return (
    <div className="screen-content">
      <Header title="Booking History" emoji="📖" onBack={onBack} />

      {recentBookings.length === 0 ? (
        <div className="text-center py-12 animate-pop">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="font-bold text-lg mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground text-sm">
            Your booking history will appear here after you make a reservation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            📋 Showing your last {recentBookings.length} bookings
          </p>
          {recentBookings.map((booking, index) => (
            <div
              key={booking.id}
              className="animate-pop"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BookingCard booking={booking} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
