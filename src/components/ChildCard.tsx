import React from 'react';
import { Child } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChildCardProps {
  child: Child;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  selected?: boolean;
  showActions?: boolean;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  child,
  onEdit,
  onDelete,
  onSelect,
  selected = false,
  showActions = true,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`card-playful transition-all duration-300 ${
        onSelect ? 'cursor-pointer active:scale-95' : ''
      } ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{child.avatar}</div>
          <div>
            <h3 className="font-bold text-lg">{child.name}</h3>
            <p className="text-muted-foreground text-sm">
              {child.age} years old
            </p>
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="rounded-xl h-9 w-9 hover:bg-secondary"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="rounded-xl h-9 w-9 hover:bg-destructive/20 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      
      {(child.allergies.length > 0 || child.notes) && (
        <div className="mt-3 pt-3 border-t border-border">
          {child.allergies.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="text-xs">⚠️ Allergies:</span>
              {child.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-destructive/20 text-destructive rounded-full"
                >
                  {allergy}
                </span>
              ))}
            </div>
          )}
          {child.notes && (
            <p className="text-xs text-muted-foreground">
              📝 {child.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
