import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Minimize2,
  Grid,
  PauseCircle,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VoiceCallModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleMute,
    toggleSpeaker,
    minimizeCall
  } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [isOnHold, setIsOnHold] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (activeCall?.status === 'connected' && activeCall.startedAt) {
      interval = window.setInterval(() => {
        setCallDuration(Math.floor((Date.now() - (activeCall.startedAt || Date.now())) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall?.status, activeCall?.startedAt]);

  if (!activeCall || activeCall.type !== 'voice' || activeCall.isMinimized) {
    return null;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="w-full max-w-md flex items-center justify-between text-slate-400">
        <button
          onClick={minimizeCall}
          className="p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Minimize call"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Aura Voice Call · HD Audio
        </span>
        <button
          onClick={() => setShowKeypad(!showKeypad)}
          className={`p-2.5 rounded-full transition-colors ${
            showKeypad ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Dial Keypad"
        >
          <Grid className="w-5 h-5" />
        </button>
      </div>

      {/* Center Caller Profile & Acoustic Rings */}
      <div className="flex flex-col items-center gap-6 my-auto">
        <div className="relative flex items-center justify-center">
          {/* Pulsing Radar Rings */}
          {activeCall.status === 'connected' && !isOnHold && (
            <>
              <div className="absolute w-44 h-44 rounded-full border border-emerald-500/30 animate-radar" />
              <div className="absolute w-56 h-56 rounded-full border border-emerald-500/20 animate-radar" style={{ animationDelay: '0.6s' }} />
            </>
          )}

          {activeCall.status === 'outgoing' && (
            <div className="absolute w-44 h-44 rounded-full border border-indigo-500/40 animate-ping" />
          )}

          {/* Avatar Image */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-slate-800 shadow-2xl z-10">
            <img
              src={activeCall.contact.avatar}
              alt={activeCall.contact.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Name and Status */}
        <div className="flex flex-col items-center text-center gap-1.5 z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {activeCall.contact.name}
          </h2>
          <p className="text-sm font-medium text-emerald-400">
            {activeCall.status === 'outgoing'
              ? 'Ringing...'
              : activeCall.status === 'incoming'
              ? 'Incoming Voice Call...'
              : isOnHold
              ? 'Call On Hold'
              : formatTime(callDuration)}
          </p>
        </div>

        {/* Dynamic Voice Visualizer Bars */}
        {activeCall.status === 'connected' && !isOnHold && (
          <div className="flex items-center gap-1.5 h-8 z-10 mt-2">
            {[30, 60, 90, 45, 80, 100, 70, 40, 85, 95, 50, 75, 40].map((h, i) => (
              <div
                key={i}
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.1}s`
                }}
                className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-teal-300 animate-wave-bar"
              />
            ))}
          </div>
        )}

        {/* Keypad Modal Overlay */}
        {showKeypad && (
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-20">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
              <button
                key={key}
                onClick={() => {}}
                className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-semibold text-lg flex items-center justify-center transition-all"
              >
                {key}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Call Controls Dock */}
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {/* Mute Mic */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 ${
              activeCall.isMuted
                ? 'bg-red-500/20 border border-red-500 text-red-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={activeCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Speakerphone */}
          <button
            onClick={toggleSpeaker}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 ${
              activeCall.isSpeaker
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Speakerphone"
          >
            {activeCall.isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Hold Call */}
          <button
            onClick={() => setIsOnHold(!isOnHold)}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 ${
              isOnHold
                ? 'bg-amber-500/20 border border-amber-500 text-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isOnHold ? 'Resume Call' : 'Hold Call'}
          >
            {isOnHold ? <Play className="w-6 h-6" /> : <PauseCircle className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-transform"
            title="End Voice Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Encrypted voice channel · Tap minimize to chat while calling
        </p>
      </div>
    </div>
  );
};
