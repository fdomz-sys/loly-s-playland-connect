import React from 'react';
import { Booking } from '@/types';
import { Clock, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingCardProps {
  booking: Booking;
  onExtend?: () => void;
  showExtend?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onExtend,
  showExtend = false,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="card-playful">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs text-muted-foreground font-medium">
            Booking #{booking.id}
          </span>
          <h3 className="font-bold text-lg">👶 {booking.childName}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          booking.status === 'active' ? 'bg-status-green/20 text-green-700' :
          booking.status === 'completed' ? 'bg-secondary text-muted-foreground' :
          'bg-destructive/20 text-destructive'
        }`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>{booking.timeSlot}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">⏱️</span>
          <span>{booking.duration} min</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="font-bold">${booking.payment}</span>
        </div>
      </div>

      {showExtend && booking.status === 'active' && (
        <Button
          onClick={onExtend}
          className="w-full mt-4 btn-playful bg-mint hover:bg-mint-dark text-foreground"
        >
          ⏰ Extend +30 min
        </Button>
      )}
    </div>
  );
};
