import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ChildCard } from '@/components/ChildCard';
import { Button } from '@/components/ui/button';
import { Child, WaitingListEntry } from '@/types';
import { toast } from '@/hooks/use-toast';
import { X, Users } from 'lucide-react';

interface WaitingListScreenProps {
  children: Child[];
  waitingList: WaitingListEntry[];
  onBack: () => void;
  onAddToWaitingList: (entry: Omit<WaitingListEntry, 'id' | 'position' | 'createdAt'>) => WaitingListEntry;
  onRemoveFromWaitingList: (id: string) => void;
}

export const WaitingListScreen: React.FC<WaitingListScreenProps> = ({
  children,
  waitingList,
  onBack,
  onAddToWaitingList,
  onRemoveFromWaitingList,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayWaitingList = waitingList
    .filter(w => w.date === today)
    .sort((a, b) => a.position - b.position);

  const handleAddToList = () => {
    if (!selectedChild) {
      toast({
        title: "⚠️ Select a Child",
        description: "Please select a child to add to the waiting list",
        variant: "destructive",
      });
      return;
    }

    // Check if child is already in waiting list
    if (todayWaitingList.some(w => w.childId === selectedChild.id)) {
      toast({
        title: "⚠️ Already in List",
        description: `${selectedChild.name} is already in today's waiting list`,
        variant: "destructive",
      });
      return;
    }

    const entry = onAddToWaitingList({
      childId: selectedChild.id,
      childName: selectedChild.name,
      date: today,
    });

    toast({
      title: "📋 Added to Waiting List",
      description: `${selectedChild.name} is now #${entry.position} in line`,
    });

    setSelectedChild(null);
    setShowAddForm(false);
  };

  const handleRemove = (entry: WaitingListEntry) => {
    onRemoveFromWaitingList(entry.id);
    toast({
      title: "👋 Removed",
      description: `${entry.childName} has been removed from the waiting list`,
    });
  };

  const childrenNotInList = children.filter(
    c => !todayWaitingList.some(w => w.childId === c.id)
  );

  return (
    <div className="screen-content">
      <Header
        title="Waiting List"
        emoji="📋"
        onBack={onBack}
        rightAction={
          !showAddForm && children.length > 0 && childrenNotInList.length > 0 && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="btn-playful bg-primary hover:bg-pink-dark rounded-2xl"
              size="sm"
            >
              Join Queue
            </Button>
          )
        }
      />

      {showAddForm ? (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">👶 Select a Child</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setShowAddForm(false); setSelectedChild(null); }}
              className="rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-3 mb-4">
            {childrenNotInList.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onSelect={() => setSelectedChild(child)}
                selected={selectedChild?.id === child.id}
                showActions={false}
              />
            ))}
          </div>

          <Button
            onClick={handleAddToList}
            disabled={!selectedChild}
            className="w-full btn-playful bg-mint hover:bg-mint-dark text-foreground"
          >
            ✨ Add to Waiting List
          </Button>
        </div>
      ) : (
        <>
          {/* Today's Queue */}
          <div className="card-playful mb-4 flex items-center gap-3">
            <div className="gradient-lavender w-12 h-12 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">Today's Queue</p>
              <p className="text-sm text-muted-foreground">
                {todayWaitingList.length} {todayWaitingList.length === 1 ? 'family' : 'families'} waiting
              </p>
            </div>
          </div>

          {todayWaitingList.length === 0 ? (
            <div className="text-center py-12 animate-pop">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-bold text-lg mb-2">No Wait!</h3>
              <p className="text-muted-foreground text-sm">
                The waiting list is empty. You can book directly!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayWaitingList.map((entry, index) => (
                <div
                  key={entry.id}
                  className="card-playful flex items-center gap-4 animate-pop"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-xl text-primary-foreground">
                    #{entry.position}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{entry.childName}</p>
                    <p className="text-xs text-muted-foreground">
                      Added at {new Date(entry.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(entry)}
                    className="rounded-xl text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {children.length === 0 && (
        <div className="text-center py-12 animate-pop">
          <div className="text-6xl mb-4">👶</div>
          <h3 className="font-bold text-lg mb-2">No Children Added</h3>
          <p className="text-muted-foreground text-sm">
            Please add a child profile first.
          </p>
        </div>
      )}
    </div>
  );
};
