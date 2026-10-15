import React from 'react';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const IncomingCallBanner: React.FC = () => {
  const { activeCall, answerCall, endCall } = useApp();

  if (!activeCall || activeCall.status !== 'incoming') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6 text-center">
        {/* Pulsing Avatar */}
        <div className="relative flex items-center justify-center mt-2">
          <div className="absolute w-28 h-28 rounded-full border-2 border-indigo-500 animate-ping opacity-40" />
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-500/50 shadow-2xl relative z-10">
            <img
              src={activeCall.contact.avatar}
              alt={activeCall.contact.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {activeCall.contact.name}
          </h3>
          <p className="text-xs font-medium text-indigo-400 flex items-center justify-center gap-1.5">
            {activeCall.type === 'video' ? (
              <>
                <Video className="w-3.5 h-3.5" /> Incoming Video Call
              </>
            ) : (
              <>
                <Phone className="w-3.5 h-3.5" /> Incoming Voice Call
              </>
            )}
          </p>
        </div>

        {/* Action Buttons: Decline / Accept */}
        <div className="flex items-center gap-8 w-full justify-center">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={endCall}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-transform"
              title="Decline"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <span className="text-[11px] text-slate-400 font-medium">Decline</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={answerCall}
              className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-transform animate-pulse"
              title="Answer"
            >
              {activeCall.type === 'video' ? (
                <Video className="w-6 h-6" />
              ) : (
                <Phone className="w-6 h-6" />
              )}
            </button>
            <span className="text-[11px] text-slate-400 font-medium">Answer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
