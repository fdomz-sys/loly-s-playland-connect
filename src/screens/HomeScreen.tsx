import React from 'react';
import { NavButton } from '@/components/NavButton';
import { OccupancyIndicator } from '@/components/OccupancyIndicator';
import { OccupancyLevel } from '@/types';
import {
  Users,
  Calendar,
  Clock,
  ListOrdered,
  Video,
  History,
} from 'lucide-react';

interface HomeScreenProps {
  occupancyLevel: OccupancyLevel;
  currentOccupancy: number;
  maxCapacity: number;
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  occupancyLevel,
  currentOccupancy,
  maxCapacity,
  onNavigate,
}) => {
  return (
    <div className="screen-content">
      {/* Logo & Welcome */}
      <div className="text-center mb-6 animate-pop">
        <div className="text-6xl mb-2 animate-float">🎠</div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-dark via-lavender-dark to-mint-dark bg-clip-text text-transparent">
          Loly's Land
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          ✨ Where fun meets safety ✨
        </p>
      </div>

      {/* Occupancy */}
      <div className="mb-6 animate-pop" style={{ animationDelay: '100ms' }}>
        <OccupancyIndicator
          level={occupancyLevel}
          current={currentOccupancy}
          max={maxCapacity}
        />
      </div>

      {/* Navigation Grid */}
      <div className="space-y-3">
        <NavButton
          icon={Users}
          emoji="👨‍👩‍👧‍👦"
          label="My Children"
          onClick={() => onNavigate('children')}
          gradient="pink"
          delay={150}
        />
        <NavButton
          icon={Calendar}
          emoji="📅"
          label="Make Reservation"
          onClick={() => onNavigate('reservation')}
          gradient="mint"
          delay={200}
        />
        <NavButton
          icon={Clock}
          emoji="⏰"
          label="Extend Playtime"
          onClick={() => onNavigate('extend')}
          gradient="lavender"
          delay={250}
        />
        <NavButton
          icon={ListOrdered}
          emoji="📋"
          label="Waiting List"
          onClick={() => onNavigate('waitingList')}
          gradient="peach"
          delay={300}
        />
        <NavButton
          icon={Video}
          emoji="📹"
          label="Live Camera"
          onClick={() => onNavigate('camera')}
          gradient="pink"
          delay={350}
        />
        <NavButton
          icon={History}
          emoji="📖"
          label="Booking History"
          onClick={() => onNavigate('history')}
          gradient="mint"
          delay={400}
        />
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Made with 💖 for families
      </p>
    </div>
  );
};
