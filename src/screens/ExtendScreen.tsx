import React from 'react';
import { Header } from '@/components/Header';
import { BookingCard } from '@/components/BookingCard';
import { Booking } from '@/types';
import { toast } from '@/hooks/use-toast';

const EXTENSION_PRICE = 10; // $10 per 30 min extension

interface ExtendScreenProps {
  todayBookings: Booking[];
  onBack: () => void;
  onExtendBooking: (id: string, additionalMinutes: number, additionalPayment: number) => void;
}

export const ExtendScreen: React.FC<ExtendScreenProps> = ({
  todayBookings,
  onBack,
  onExtendBooking,
}) => {
  const handleExtend = (booking: Booking) => {
    onExtendBooking(booking.id, 30, EXTENSION_PRICE);
    toast({
      title: "⏰ Playtime Extended!",
      description: `Added 30 minutes for ${booking.childName}. Extra charge: $${EXTENSION_PRICE}`,
    });
  };

  const activeBookings = todayBookings.filter(b => b.status === 'active');

  return (
    <div className="screen-content">
      <Header title="Extend Playtime" emoji="⏰" onBack={onBack} />

      {activeBookings.length === 0 ? (
        <div className="text-center py-12 animate-pop">
          <div className="text-6xl mb-4">🎈</div>
          <h3 className="font-bold text-lg mb-2">No Active Bookings</h3>
          <p className="text-muted-foreground text-sm">
            You don't have any active bookings for today.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            💡 Extend any active booking by 30 minutes for ${EXTENSION_PRICE}
          </p>
          {activeBookings.map((booking, index) => (
            <div
              key={booking.id}
              className="animate-pop"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BookingCard
                booking={booking}
                onExtend={() => handleExtend(booking)}
                showExtend
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
