import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Heart, Send, ChevronLeft, ChevronRight, Music2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SoundEngine } from '../utils/soundEffects';

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
}

export const StoryViewerModal: React.FC = () => {
  const {
    stories,
    activeStoryViewer,
    closeStoryViewer,
    nextStoryItem,
    prevStoryItem,
    likeStoryItem,
    sendMessage,
    setActiveContactId,
    setActiveTab
  } = useApp();

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<number | null>(null);

  if (!activeStoryViewer) return null;

  const currentStory = stories[activeStoryViewer.storyIndex];
  if (!currentStory) return null;

  const currentItem = currentStory.items[activeStoryViewer.itemIndex];
  if (!currentItem) return null;

  // Auto-progress bar (5 seconds duration)
  useEffect(() => {
    setProgress(0);
    if (isPaused) return;

    const interval = 50; // update every 50ms
    const step = (interval / 5000) * 100;

    const intervalId = window.setInterval(() => {
      setProgress(prev => {
        if (prev + step >= 100) {
          clearInterval(intervalId);
          nextStoryItem();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [activeStoryViewer.storyIndex, activeStoryViewer.itemIndex, isPaused]);

  // Handle ambient sound
  useEffect(() => {
    if (!isMuted && currentItem.musicTrack) {
      SoundEngine.playStoryAmbient(currentItem.musicTrack);
    } else {
      SoundEngine.stopStoryAmbient();
    }
    return () => {
      SoundEngine.stopStoryAmbient();
    };
  }, [currentItem.musicTrack, isMuted]);

  // Send quick reaction
  const handleTriggerReaction = (emoji: string) => {
    SoundEngine.playReactionPop();
    const id = `${Date.now()}-${Math.random()}`;
    const x = 30 + Math.random() * 40; // 30% to 70%
    setReactions(prev => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 1800);

    // Also send reaction to chat if not current user's own story
    if (currentStory.userId !== 'me') {
      sendMessage({
        contactId: currentStory.userId,
        text: `Reacted ${emoji} to your story!`,
        storyReplyTo: {
          storyId: currentStory.id,
          storyTitle: currentItem.caption || 'Story',
          mediaUrl: currentItem.mediaUrl || ''
        }
      });
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (currentStory.userId !== 'me') {
      sendMessage({
        contactId: currentStory.userId,
        text: replyText.trim(),
        storyReplyTo: {
          storyId: currentStory.id,
          storyTitle: currentItem.caption || 'Story',
          mediaUrl: currentItem.mediaUrl || ''
        }
      });
    }

    setReplyText('');
    closeStoryViewer();
    if (currentStory.userId !== 'me') {
      setActiveContactId(currentStory.userId);
      setActiveTab('chats');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-4 select-none">
      {/* Side Navigation Arrow - Previous */}
      <button
        onClick={prevStoryItem}
        className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all mr-6"
        title="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Story Card Frame */}
      <div
        className="relative w-full h-full md:h-[92vh] md:max-w-[430px] md:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Floating animated reactions */}
        {reactions.map(r => (
          <div
            key={r.id}
            style={{ left: `${r.x}%` }}
            className="absolute bottom-24 text-4xl pointer-events-none animate-bounce transition-all duration-1000 transform -translate-y-48 opacity-90 z-40"
          >
            {r.emoji}
          </div>
        ))}

        {/* Media Backdrop */}
        <div className="absolute inset-0 z-0">
          {currentItem.mediaType === 'image' && currentItem.mediaUrl ? (
            <img
              src={currentItem.mediaUrl}
              alt={currentItem.caption || 'Story media'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${currentItem.gradient || 'from-indigo-900 via-purple-900 to-slate-900'} flex items-center justify-center p-8`}>
              <p className={`text-center text-white text-2xl font-bold leading-relaxed ${
                currentItem.fontStyle === 'neon' ? 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' : ''
              }`}>
                {currentItem.caption}
              </p>
            </div>
          )}

          {/* Gradients for text contrast */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Interactive Tap Zones (Previous 30% width, Next 70% width) */}
        <div className="absolute inset-0 z-10 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              prevStoryItem();
            }}
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              nextStoryItem();
            }}
          />
        </div>

        {/* Top Header & Segmented Progress Bars */}
        <div className="relative z-20 p-4 pt-3 flex flex-col gap-3">
          {/* Progress Segments */}
          <div className="flex items-center gap-1.5 w-full">
            {currentStory.items.map((item, idx) => {
              let segmentProgress = 0;
              if (idx < activeStoryViewer.itemIndex) {
                segmentProgress = 100;
              } else if (idx === activeStoryViewer.itemIndex) {
                segmentProgress = progress;
              }
              return (
                <div key={item.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{ width: `${segmentProgress}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Story Author & Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.userName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold leading-tight drop-shadow">
                  {currentStory.userName}
                </span>
                <span className="text-white/80 text-[11px] drop-shadow">
                  {currentItem.timestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentItem.musicTrack && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  title={isMuted ? 'Unmute audio' : 'Mute audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeStoryViewer();
                }}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                title="Close story"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Music Track Badge */}
          {currentItem.musicTrack && (
            <div className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs">
              <Music2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="text-[11px] truncate max-w-[200px]">{currentItem.musicTrack}</span>
            </div>
          )}
        </div>

        {/* Bottom Content & Interactive Bar */}
        <div className="relative z-20 p-4 pb-6 flex flex-col gap-3">
          {/* Tag & Caption */}
          <div className="flex flex-col gap-1.5">
            {currentItem.tag && (
              <span className="self-start text-[11px] font-semibold text-indigo-300 drop-shadow">
                {currentItem.tag}
              </span>
            )}
            {currentItem.mediaType === 'image' && currentItem.caption && (
              <p className="text-white text-sm font-medium drop-shadow leading-snug">
                {currentItem.caption}
              </p>
            )}
          </div>

          {/* Quick Reaction Bar */}
          <div className="flex items-center justify-between gap-1 px-1">
            {['❤️', '🔥', '👏', '😮', '😂', '🎉'].map(emoji => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriggerReaction(emoji);
                }}
                className="text-xl p-1.5 rounded-full hover:bg-white/20 active:scale-125 transition-transform"
                title={`React ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Input Form */}
          <form
            onSubmit={handleSendReply}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              placeholder={`Send message to ${currentStory.userName.split(' ')[0]}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => likeStoryItem(currentStory.id, currentItem.id)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-110 text-rose-400 flex items-center justify-center transition-all"
              title="Like story"
            >
              <Heart className={`w-5 h-5 ${currentItem.likesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            {replyText.trim() && (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center active:scale-95 transition-transform"
                title="Send reply"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Side Navigation Arrow - Next */}
      <button
        onClick={nextStoryItem}
        className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ml-6"
        title="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
