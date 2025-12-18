import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ChildCard } from '@/components/ChildCard';
import { Button } from '@/components/ui/button';
import { Child, Booking } from '@/types';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Banknote, Check } from 'lucide-react';

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const DURATIONS = [
  { minutes: 30, price: 15 },
  { minutes: 60, price: 25 },
  { minutes: 90, price: 35 },
  { minutes: 120, price: 45 },
];

interface ReservationScreenProps {
  children: Child[];
  onBack: () => void;
  onAddBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
}

export const ReservationScreen: React.FC<ReservationScreenProps> = ({
  children,
  onBack,
  onAddBooking,
}) => {
  const [step, setStep] = useState<'child' | 'details' | 'payment' | 'success'>('child');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<typeof DURATIONS[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | null>(null);
  const [bookingId, setBookingId] = useState('');

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        isToday: i === 0,
      });
    }
    return days;
  };

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    setStep('details');
  };

  const handleDetailsComplete = () => {
    if (!selectedDate || !selectedTime || !selectedDuration) {
      toast({
        title: "⚠️ Missing Info",
        description: "Please select date, time, and duration",
        variant: "destructive",
      });
      return;
    }
    setStep('payment');
  };

  const handlePayment = () => {
    if (!paymentMethod || !selectedChild || !selectedDuration) return;

    const booking = onAddBooking({
      childId: selectedChild.id,
      childName: selectedChild.name,
      date: selectedDate,
      timeSlot: selectedTime,
      duration: selectedDuration.minutes,
      payment: selectedDuration.price,
      paymentMethod,
      status: 'active',
    });

    setBookingId(booking.id);
    setStep('success');

    toast({
      title: "🎉 Payment Successful!",
      description: `Booking confirmed for ${selectedChild.name}`,
    });
  };

  if (children.length === 0) {
    return (
      <div className="screen-content">
        <Header title="Make Reservation" emoji="📅" onBack={onBack} />
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👶</div>
          <h3 className="font-bold text-lg mb-2">No Children Added</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Please add a child profile first before making a reservation.
          </p>
          <Button
            onClick={onBack}
            className="btn-playful bg-primary hover:bg-pink-dark"
          >
            Go to My Children
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content">
      <Header title="Make Reservation" emoji="📅" onBack={step === 'child' ? onBack : () => setStep('child')} />

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {['child', 'details', 'payment', 'success'].map((s, i) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              step === s ? 'bg-primary scale-125' :
              ['child', 'details', 'payment', 'success'].indexOf(step) > i
                ? 'bg-mint' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Step: Select Child */}
      {step === 'child' && (
        <div className="space-y-3 animate-slide-up">
          <h2 className="font-bold text-lg mb-4">👶 Select a Child</h2>
          {children.map((child, index) => (
            <div key={child.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-pop">
              <ChildCard
                child={child}
                onSelect={() => handleChildSelect(child)}
                selected={selectedChild?.id === child.id}
                showActions={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Step: Select Details */}
      {step === 'details' && selectedChild && (
        <div className="space-y-4 animate-slide-up">
          <div className="card-playful flex items-center gap-3">
            <span className="text-3xl">{selectedChild.avatar}</span>
            <div>
              <p className="font-bold">{selectedChild.name}</p>
              <p className="text-sm text-muted-foreground">Selected</p>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <h3 className="font-bold mb-3">📆 Select Date</h3>
            <div className="grid grid-cols-2 gap-2">
              {getNext7Days().map((day) => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDate(day.value)}
                  className={`p-3 rounded-2xl text-sm font-medium transition-all ${
                    selectedDate === day.value
                      ? 'bg-primary text-primary-foreground shadow-button'
                      : 'bg-card border border-border hover:border-primary'
                  }`}
                >
                  {day.isToday ? '🌟 Today' : day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="font-bold mb-3">⏰ Select Time</h3>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-xl text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-mint text-foreground shadow-button'
                      : 'bg-card border border-border hover:border-mint'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <h3 className="font-bold mb-3">⏱️ Select Duration</h3>
            <div className="grid grid-cols-2 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.minutes}
                  onClick={() => setSelectedDuration(d)}
                  className={`p-3 rounded-2xl text-center transition-all ${
                    selectedDuration?.minutes === d.minutes
                      ? 'gradient-lavender shadow-button'
                      : 'bg-card border border-border hover:border-lavender'
                  }`}
                >
                  <p className="font-bold">{d.minutes} min</p>
                  <p className="text-lg font-extrabold">${d.price}</p>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleDetailsComplete}
            className="w-full btn-playful bg-primary hover:bg-pink-dark mt-4"
          >
            Continue to Payment 💳
          </Button>
        </div>
      )}

      {/* Step: Payment */}
      {step === 'payment' && selectedDuration && (
        <div className="space-y-4 animate-slide-up">
          <div className="card-playful text-center">
            <p className="text-muted-foreground">Total Amount</p>
            <p className="text-4xl font-extrabold text-primary">${selectedDuration.price}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDuration.minutes} minutes of fun! 🎉
            </p>
          </div>

          <h3 className="font-bold">💰 Select Payment Method</h3>

          <button
            onClick={() => setPaymentMethod('card')}
            className={`card-playful w-full flex items-center gap-4 transition-all ${
              paymentMethod === 'card' ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="gradient-mint w-12 h-12 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold">Credit/Debit Card</p>
              <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('cash')}
            className={`card-playful w-full flex items-center gap-4 transition-all ${
              paymentMethod === 'cash' ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="gradient-peach w-12 h-12 rounded-xl flex items-center justify-center">
              <Banknote className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold">Cash</p>
              <p className="text-sm text-muted-foreground">Pay at counter</p>
            </div>
          </button>

          <Button
            onClick={handlePayment}
            disabled={!paymentMethod}
            className="w-full btn-playful bg-mint hover:bg-mint-dark text-foreground mt-4"
          >
            ✨ Confirm & Pay
          </Button>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <div className="text-center animate-pop">
          <div className="w-24 h-24 mx-auto bg-status-green/20 rounded-full flex items-center justify-center mb-4">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed! 🎉</h2>
          <p className="text-muted-foreground mb-4">
            Have a wonderful time at Loly's Land!
          </p>
          
          <div className="card-playful text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="font-bold">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Child:</span>
                <span className="font-bold">{selectedChild?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-bold">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-bold">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-bold">{selectedDuration?.minutes} min</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground">Total Paid:</span>
                <span className="font-bold text-lg">${selectedDuration?.price}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={onBack}
            className="w-full btn-playful bg-primary hover:bg-pink-dark mt-6"
          >
            🏠 Back to Home
          </Button>
        </div>
      )}
    </div>
  );
};
