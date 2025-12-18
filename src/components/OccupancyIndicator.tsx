import React from 'react';
import { OccupancyLevel } from '@/types';

interface OccupancyIndicatorProps {
  level: OccupancyLevel;
  current: number;
  max: number;
  compact?: boolean;
}

export const OccupancyIndicator: React.FC<OccupancyIndicatorProps> = ({
  level,
  current,
  max,
  compact = false,
}) => {
  const statusConfig = {
    low: { color: 'status-low', label: 'Low', emoji: '🟢' },
    medium: { color: 'status-medium', label: 'Medium', emoji: '🟡' },
    full: { color: 'status-full', label: 'Full', emoji: '🔴' },
  };

  const config = statusConfig[level];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`status-indicator ${config.color}`} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  }

  return (
    <div className="card-playful">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold">🏃 Live Occupancy</span>
        <div className="flex items-center gap-2">
          <span className={`status-indicator ${config.color}`} />
          <span className="font-bold">{config.emoji} {config.label}</span>
        </div>
      </div>
      <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-500 rounded-full ${
            level === 'low' ? 'bg-status-green' :
            level === 'medium' ? 'bg-status-yellow' : 'bg-status-red'
          }`}
          style={{ width: `${(current / max) * 100}%` }}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        {current} / {max} spots filled
      </p>
    </div>
  );
};
