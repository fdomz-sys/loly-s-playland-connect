import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Video, VideoOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraScreenProps {
  onBack: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onBack }) => {
  const [isLive, setIsLive] = useState(true);
  const [feedId, setFeedId] = useState(0);

  // Simulate feed updates
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setFeedId(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="screen-content">
      <Header title="Live Camera" emoji="📹" onBack={onBack} />

      {/* Live Feed Container */}
      <div className="card-playful overflow-hidden p-0 mb-4">
        <div className="relative aspect-video bg-gradient-to-br from-foreground/5 to-foreground/10">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isLive ? (
              <div className="text-center">
                <div className="text-6xl mb-3 animate-float">🎡</div>
                <p className="text-sm text-muted-foreground">
                  Simulated Live Feed
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Frame #{feedId}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff className="w-16 h-16 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Camera Paused
                </p>
              </div>
            )}
          </div>

          {/* Live Indicator */}
          {isLive && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-destructive/90 text-white px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs font-bold">LIVE</span>
            </div>
          )}

          {/* Timestamp */}
          <div className="absolute bottom-3 right-3 bg-foreground/70 text-background text-xs px-2 py-1 rounded-lg">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={() => setIsLive(!isLive)}
          className={`flex-1 btn-playful ${
            isLive ? 'bg-destructive hover:bg-destructive/80' : 'bg-mint hover:bg-mint-dark'
          }`}
        >
          {isLive ? (
            <>
              <VideoOff className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Resume
            </>
          )}
        </Button>
        <Button
          onClick={() => setFeedId(prev => prev + 1)}
          variant="outline"
          className="btn-playful border-2"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Info Card */}
      <div className="card-playful mt-4">
        <h3 className="font-bold mb-2">👀 Parent Monitoring</h3>
        <p className="text-sm text-muted-foreground">
          Watch your children play safely in our supervised play area. 
          Our cameras cover all zones of Loly's Land.
        </p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-secondary rounded-xl p-3 text-center">
            <span className="text-2xl">🎠</span>
            <p className="text-xs mt-1">Carousel Zone</p>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <span className="text-2xl">🏰</span>
            <p className="text-xs mt-1">Castle Area</p>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <span className="text-2xl">🎨</span>
            <p className="text-xs mt-1">Art Corner</p>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <span className="text-2xl">🧸</span>
            <p className="text-xs mt-1">Toddler Zone</p>
          </div>
        </div>
      </div>
    </div>
  );
};
