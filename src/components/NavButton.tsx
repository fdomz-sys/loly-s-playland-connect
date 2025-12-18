import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  emoji?: string;
  onClick: () => void;
  gradient?: 'pink' | 'mint' | 'lavender' | 'peach';
  delay?: number;
}

export const NavButton: React.FC<NavButtonProps> = ({
  icon: Icon,
  label,
  emoji,
  onClick,
  gradient = 'pink',
  delay = 0,
}) => {
  const gradientClasses = {
    pink: 'gradient-pink',
    mint: 'gradient-mint',
    lavender: 'gradient-lavender',
    peach: 'gradient-peach',
  };

  return (
    <button
      onClick={onClick}
      className={`card-playful w-full flex items-center gap-4 p-4 active:scale-95 transition-all duration-300 hover:shadow-lg animate-pop`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`${gradientClasses[gradient]} w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft`}>
        {emoji ? (
          <span className="text-2xl">{emoji}</span>
        ) : (
          <Icon className="w-7 h-7 text-foreground" />
        )}
      </div>
      <span className="font-bold text-lg">{label}</span>
    </button>
  );
};
