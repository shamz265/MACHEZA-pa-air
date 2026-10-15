import React, { useState, useEffect } from 'react';
import { Maximize2, Mic, MicOff, PhoneOff, Video, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingCallPiP: React.FC = () => {
  const {
    activeCall,
    maximizeCall,
    endCall,
    toggleMute
  } = useApp();

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    if (activeCall?.status === 'connected' && activeCall.startedAt) {
      interval = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - (activeCall.startedAt || Date.now())) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall?.status, activeCall?.startedAt]);

  if (!activeCall || !activeCall.isMinimized) {
    return null;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-40 w-64 md:w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col select-none animate-in slide-in-from-bottom-4 duration-200">
      {/* Top Banner / Video Thumbnail */}
      <div className="relative h-28 bg-slate-950 flex items-center justify-center overflow-hidden">
        {activeCall.type === 'video' ? (
          <img
            src={activeCall.contact.avatar}
            alt={activeCall.contact.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-indigo-500">
              <img
                src={activeCall.contact.avatar}
                alt={activeCall.contact.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-0.5 h-4">
              {[30, 80, 50, 100, 60].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1 bg-emerald-400 rounded-full animate-wave-bar"
                />
              ))}
            </div>
          </div>
        )}

        {/* Maximize Button */}
        <button
          onClick={maximizeCall}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          title="Expand Call"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Type & Duration Badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-md text-[10px] text-white">
          {activeCall.type === 'video' ? (
            <Video className="w-3 h-3 text-indigo-400" />
          ) : (
            <Phone className="w-3 h-3 text-emerald-400" />
          )}
          <span className="font-mono tabular-nums">
            {activeCall.status === 'connected' ? formatTime(duration) : 'Calling...'}
          </span>
        </div>
      </div>

      {/* Bottom Info & Quick Actions */}
      <div className="p-3 bg-slate-900 flex items-center justify-between">
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-xs font-semibold text-white truncate">
            {activeCall.contact.name}
          </span>
          <span className="text-[10px] text-emerald-400">
            {activeCall.status === 'connected' ? 'Active call' : 'Connecting...'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleMute}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              activeCall.isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Toggle mute"
          >
            {activeCall.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={endCall}
            className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-colors"
            title="End Call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
