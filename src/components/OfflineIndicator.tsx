import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-800/90 text-amber-300 px-3 py-1 text-xs font-medium shadow-lg backdrop-blur-xs border border-amber-500/30">
      <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-400" />
      <span>オフライン動作中（てわたし おえかき は もんだいなく あそべます）</span>
    </div>
  );
};
