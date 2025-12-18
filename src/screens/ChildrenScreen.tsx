import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ChildCard } from '@/components/ChildCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Child } from '@/types';
import { Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AVATARS = ['👶', '👧', '👦', '🧒', '👼', '🎀', '⭐', '🌈'];

interface ChildrenScreenProps {
  children: Child[];
  onBack: () => void;
  onAddChild: (child: Omit<Child, 'id' | 'createdAt'>) => Child;
  onUpdateChild: (id: string, updates: Partial<Child>) => void;
  onDeleteChild: (id: string) => void;
}

export const ChildrenScreen: React.FC<ChildrenScreenProps> = ({
  children,
  onBack,
  onAddChild,
  onUpdateChild,
  onDeleteChild,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    allergies: '',
    notes: '',
    avatar: '👶',
  });

  const resetForm = () => {
    setFormData({ name: '', age: '', allergies: '', notes: '', avatar: '👶' });
    setEditingChild(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.age) {
      toast({
        title: "⚠️ Missing Info",
        description: "Please enter name and age",
        variant: "destructive",
      });
      return;
    }

    const childData = {
      name: formData.name,
      age: parseInt(formData.age),
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
      notes: formData.notes,
      avatar: formData.avatar,
    };

    if (editingChild) {
      onUpdateChild(editingChild.id, childData);
      toast({
        title: "✅ Updated!",
        description: `${formData.name}'s profile has been updated`,
      });
    } else {
      onAddChild(childData);
      toast({
        title: "🎉 Welcome!",
        description: `${formData.name} has been added to your family`,
      });
    }

    resetForm();
  };

  const handleEdit = (child: Child) => {
    setFormData({
      name: child.name,
      age: child.age.toString(),
      allergies: child.allergies.join(', '),
      notes: child.notes,
      avatar: child.avatar,
    });
    setEditingChild(child);
    setShowForm(true);
  };

  const handleDelete = (child: Child) => {
    onDeleteChild(child.id);
    toast({
      title: "👋 Removed",
      description: `${child.name} has been removed`,
    });
  };

  return (
    <div className="screen-content">
      <Header
        title="My Children"
        emoji="👨‍👩‍👧‍👦"
        onBack={onBack}
        rightAction={
          !showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="btn-playful bg-primary hover:bg-pink-dark rounded-2xl"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          )
        }
      />

      {showForm ? (
        <div className="card-playful animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">
              {editingChild ? '✏️ Edit Profile' : '➕ New Child'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetForm}
              className="rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Avatar Selection */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Pick an Avatar</Label>
              <div className="flex gap-2 flex-wrap">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                    className={`text-2xl p-2 rounded-xl transition-all ${
                      formData.avatar === avatar
                        ? 'bg-primary scale-110 shadow-lg'
                        : 'bg-secondary hover:bg-muted'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Child's name"
                className="rounded-xl mt-1"
              />
            </div>

            {/* Age */}
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Age in years"
                className="rounded-xl mt-1"
                min="1"
                max="12"
              />
            </div>

            {/* Allergies */}
            <div>
              <Label htmlFor="allergies">Allergies (comma separated)</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                placeholder="e.g. Peanuts, Dairy"
                className="rounded-xl mt-1"
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Special needs, preferences..."
                className="rounded-xl mt-1 min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full btn-playful bg-mint hover:bg-mint-dark text-foreground"
            >
              {editingChild ? '💾 Save Changes' : '✨ Add Child'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {children.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👶</div>
              <h3 className="font-bold text-lg mb-2">No children yet</h3>
              <p className="text-muted-foreground text-sm">
                Add your first child to get started!
              </p>
            </div>
          ) : (
            children.map((child, index) => (
              <div
                key={child.id}
                className="animate-pop"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ChildCard
                  child={child}
                  onEdit={() => handleEdit(child)}
                  onDelete={() => handleDelete(child)}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
