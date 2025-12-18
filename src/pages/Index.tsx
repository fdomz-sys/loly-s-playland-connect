import React, { useState } from 'react';
import { PhoneFrame } from '@/components/PhoneFrame';
import { HomeScreen } from '@/screens/HomeScreen';
import { ChildrenScreen } from '@/screens/ChildrenScreen';
import { ReservationScreen } from '@/screens/ReservationScreen';
import { ExtendScreen } from '@/screens/ExtendScreen';
import { WaitingListScreen } from '@/screens/WaitingListScreen';
import { CameraScreen } from '@/screens/CameraScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { useAppStore } from '@/hooks/useAppStore';
import { Toaster } from '@/components/ui/toaster';

type Screen = 'home' | 'children' | 'reservation' | 'extend' | 'waitingList' | 'camera' | 'history';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const store = useAppStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            occupancyLevel={store.getOccupancyLevel()}
            currentOccupancy={store.currentOccupancy}
            maxCapacity={store.maxCapacity}
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
          />
        );
      case 'children':
        return (
          <ChildrenScreen
            children={store.children}
            onBack={() => setCurrentScreen('home')}
            onAddChild={store.addChild}
            onUpdateChild={store.updateChild}
            onDeleteChild={store.deleteChild}
          />
        );
      case 'reservation':
        return (
          <ReservationScreen
            children={store.children}
            onBack={() => setCurrentScreen('home')}
            onAddBooking={store.addBooking}
          />
        );
      case 'extend':
        return (
          <ExtendScreen
            todayBookings={store.getTodayBookings()}
            onBack={() => setCurrentScreen('home')}
            onExtendBooking={store.extendBooking}
          />
        );
      case 'waitingList':
        return (
          <WaitingListScreen
            children={store.children}
            waitingList={store.waitingList}
            onBack={() => setCurrentScreen('home')}
            onAddToWaitingList={store.addToWaitingList}
            onRemoveFromWaitingList={store.removeFromWaitingList}
          />
        );
      case 'camera':
        return (
          <CameraScreen
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            recentBookings={store.getRecentBookings()}
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PhoneFrame>
        {renderScreen()}
      </PhoneFrame>
      <Toaster />
    </>
  );
};

export default Index;
