import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Minimize2,
  Smile,
  Shield,
  Wifi,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SoundEngine } from '../utils/soundEffects';

interface InCallReaction {
  id: string;
  emoji: string;
  x: number;
}

export const VideoCallModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleMute,
    toggleVideo,
    minimizeCall,
    localStream,
    currentUser
  } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [reactions, setReactions] = useState<InCallReaction[]>([]);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [pipCorner, setPipCorner] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right');
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Bind local webcam stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, activeCall?.isVideoEnabled]);

  // Duration timer
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

  if (!activeCall || activeCall.type !== 'video' || activeCall.isMinimized) {
    return null;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const triggerReaction = (emoji: string) => {
    SoundEngine.playReactionPop();
    const id = `${Date.now()}-${Math.random()}`;
    const x = 20 + Math.random() * 60;
    setReactions(prev => [...prev, { id, emoji, x }]);
    setShowReactionsMenu(false);

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const getCornerClass = () => {
    switch (pipCorner) {
      case 'top-left': return 'top-20 left-6';
      case 'top-right': return 'top-20 right-6';
      case 'bottom-left': return 'bottom-28 left-6';
      case 'bottom-right': return 'bottom-28 right-6';
    }
  };

  const cycleCorner = () => {
    const corners: Array<'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'> = [
      'top-right',
      'bottom-right',
      'bottom-left',
      'top-left'
    ];
    const currentIndex = corners.indexOf(pipCorner);
    setPipCorner(corners[(currentIndex + 1) % corners.length]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200">
      {/* Floating In-Call Reactions */}
      {reactions.map(r => (
        <div
          key={r.id}
          style={{ left: `${r.x}%` }}
          className="absolute bottom-28 text-5xl pointer-events-none animate-bounce transition-all duration-1000 transform -translate-y-64 opacity-90 z-40"
        >
          {r.emoji}
        </div>
      ))}

      {/* Main Remote Video Viewport */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        {activeCall.status === 'connected' ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={activeCall.contact.avatar}
              alt={activeCall.contact.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isBackgroundBlurred ? 'blur-[1px] scale-105' : 'scale-100'
              }`}
              referrerPolicy="no-referrer"
            />
            {/* Ambient simulated motion vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

            {/* In-Call Live Remote Audio Waveform */}
            <div className="absolute bottom-28 left-6 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/90 font-medium">{activeCall.contact.name}</span>
              <div className="flex items-center gap-0.5 h-3">
                {[40, 80, 50, 90, 60].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-0.5 bg-emerald-400 rounded-full animate-wave-bar"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Connecting / Ringing Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
            <div className="relative">
              <div className="absolute w-36 h-36 rounded-full border-2 border-indigo-500/50 animate-ping" />
              <img
                src={activeCall.contact.avatar}
                alt={activeCall.contact.name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-500/30 shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {activeCall.contact.name}
            </h2>
            <p className="text-sm font-medium text-indigo-400">
              {activeCall.status === 'incoming' ? 'Incoming Video Call...' : 'Connecting HD Video Call...'}
            </p>
          </div>
        )}
      </div>

      {/* Picture-In-Picture Local Video Feed (Draggable/Clickable Corner) */}
      <div
        onClick={cycleCorner}
        className={`absolute z-20 w-32 md:w-44 h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 cursor-pointer group transition-all duration-300 ${getCornerClass()}`}
        title="Click to reposition selfie preview"
      >
        {activeCall.isVideoEnabled ? (
          localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={currentUser.avatar}
                alt="Me"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-md">
                Camera Feed
              </span>
            </div>
          )
        ) : (
          <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-400 gap-1 p-2">
            <VideoOff className="w-6 h-6 text-slate-500" />
            <span className="text-[10px] text-center">Camera Off</span>
          </div>
        )}

        <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded transition-opacity">
          Tap to move
        </span>
      </div>

      {/* Top Header Bar */}
      <div className="relative z-30 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <button
            onClick={minimizeCall}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors"
            title="Minimize call to picture-in-picture"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h3 className="text-white font-semibold text-base leading-tight drop-shadow">
              {activeCall.contact.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/80 drop-shadow">
              <span className="tabular-nums font-mono">
                {activeCall.status === 'connected' ? formatTime(callDuration) : 'Connecting...'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Wifi className="w-3 h-3" /> HD 1080p
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-xs text-white/90 border border-white/10">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Floating In-Call Reactions Menu */}
      {showReactionsMenu && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full shadow-2xl">
          {['❤️', '🔥', '👏', '😂', '🎉', '🙌'].map(emoji => (
            <button
              key={emoji}
              onClick={() => triggerReaction(emoji)}
              className="text-2xl p-2 hover:bg-white/10 rounded-full active:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Video Controls Dock */}
      <div className="relative z-30 p-6 flex flex-col items-center gap-3 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-center justify-center gap-3 md:gap-5 p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          {/* Mic Toggle */}
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              activeCall.isMuted
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={activeCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              !activeCall.isVideoEnabled
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={activeCall.isVideoEnabled ? 'Turn camera off' : 'Turn camera on'}
          >
            {activeCall.isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Background Blur / Filter */}
          <button
            onClick={() => setIsBackgroundBlurred(!isBackgroundBlurred)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isBackgroundBlurred
                ? 'bg-indigo-600 text-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Toggle background blur effect"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Emoji Reactions Trigger */}
          <button
            onClick={() => setShowReactionsMenu(!showReactionsMenu)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              showReactionsMenu
                ? 'bg-amber-500 text-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="In-call reactions"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Hangup Red Button */}
          <button
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-transform"
            title="End Video Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
