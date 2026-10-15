import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  Info,
  Send,
  Paperclip,
  Mic,
  Smile,
  CheckCheck,
  Play,
  Pause,
  Trash2,
  X,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Contact, Message } from '../types';

export const ChatConversation: React.FC = () => {
  const {
    activeContact,
    messages,
    sendMessage,
    addReaction,
    startCall,
    currentUser
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<number | null>(null);

  // Audio voice note playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState<Record<string, number>>({});
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const thread = activeContact ? messages[activeContact.id] || [] : [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.length]);

  // Voice note recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-500 text-sm">
        Select a conversation to start texting or calling
      </div>
    );
  }

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage({
      contactId: activeContact.id,
      text: inputText.trim()
    });
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sendMessage({
          contactId: activeContact.id,
          imageUrl: reader.result as string,
          text: 'Shared a photo'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartVoiceRecording = () => {
    setIsRecording(true);
  };

  const handleCancelVoiceRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleSendVoiceRecording = () => {
    const duration = Math.max(1, recordingSeconds);
    sendMessage({
      contactId: activeContact.id,
      audioUrl: 'custom-recorded-voice-note',
      audioDuration: duration
    });
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleTogglePlayVoiceNote = (messageId: string, duration: number = 8) => {
    if (playingAudioId === messageId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(messageId);
      // Simulate playback
      let currentProgress = 0;
      const interval = 100;
      const step = (interval / (duration * 1000 / playbackSpeed)) * 100;
      const timer = window.setInterval(() => {
        currentProgress += step;
        setAudioPlaybackProgress(prev => ({ ...prev, [messageId]: currentProgress }));
        if (currentProgress >= 100) {
          clearInterval(timer);
          setPlayingAudioId(null);
          setAudioPlaybackProgress(prev => ({ ...prev, [messageId]: 0 }));
        }
      }, interval);
    }
  };

  return (
    <div className="flex-1 flex h-full bg-slate-950 relative overflow-hidden select-none">
      {/* Central Conversation Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="h-16 px-4 md:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between shrink-0 z-10">
          {/* Contact Details */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="w-10 h-10 rounded-full object-cover bg-slate-800"
                referrerPolicy="no-referrer"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  activeContact.status === 'online'
                    ? 'bg-emerald-500'
                    : activeContact.status === 'busy'
                    ? 'bg-amber-500'
                    : 'bg-slate-500'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white leading-tight">
                {activeContact.name}
              </span>
              <span className="text-xs text-slate-400">
                {activeContact.status === 'online'
                  ? 'Online'
                  : activeContact.lastSeen
                  ? `Active ${activeContact.lastSeen}`
                  : activeContact.isGroup
                  ? `${activeContact.memberCount} members`
                  : 'Offline'}
              </span>
            </div>
          </div>

          {/* Action Buttons: Voice Call, Video Call, Info */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => startCall(activeContact, 'voice')}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-emerald-400 flex items-center justify-center transition-all"
              title="Start Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => startCall(activeContact, 'video')}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-indigo-400 flex items-center justify-center transition-all"
              title="Start Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowContactInfo(!showContactInfo)}
              className={`w-9 h-9 rounded-xl active:scale-95 flex items-center justify-center transition-all ${
                showContactInfo
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
              }`}
              title="Contact details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* Welcome Banner */}
          <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
            <img
              src={activeContact.avatar}
              alt={activeContact.name}
              className="w-16 h-16 rounded-full object-cover mb-2 ring-2 ring-slate-800"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-sm font-semibold text-white">{activeContact.name}</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-0.5">{activeContact.bio}</p>
            <span className="text-[11px] text-slate-500 mt-2 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800/60">
              End-to-end encrypted messaging & calls
            </span>
          </div>

          {/* Messages */}
          {thread.map((msg) => {
            const isMe = msg.senderId === 'me';

            return (
              <div
                key={msg.id}
                onMouseEnter={() => setHoveredMessageId(msg.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
                className={`relative flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Floating Quick Reaction Tooltip */}
                {hoveredMessageId === msg.id && (
                  <div
                    className={`absolute -top-7 ${
                      isMe ? 'right-2' : 'left-2'
                    } z-20 flex items-center gap-1 p-1 bg-slate-900 border border-slate-700 rounded-full shadow-lg`}
                  >
                    {['❤️', '👍', '🔥', '😂', '😮'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(activeContact.id, msg.id, emoji)}
                        className="text-xs hover:scale-125 px-1 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] md:max-w-md rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                    isMe
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-xs'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/50 rounded-bl-xs'
                  }`}
                >
                  {/* Story Reply Quote Box */}
                  {msg.storyReplyTo && (
                    <div className="mb-2 p-2 rounded-xl bg-black/25 border border-white/10 flex items-center gap-2.5">
                      {msg.storyReplyTo.mediaUrl ? (
                        <img
                          src={msg.storyReplyTo.mediaUrl}
                          alt="Story reply"
                          className="w-10 h-10 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-900/80 flex items-center justify-center text-xs">
                          ✨
                        </div>
                      )}
                      <div className="flex flex-col text-xs overflow-hidden">
                        <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">
                          Replied to Story
                        </span>
                        <span className="truncate text-white/90">
                          {msg.storyReplyTo.storyTitle}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Image Content */}
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden max-h-72">
                      <img
                        src={msg.imageUrl}
                        alt="Attached media"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Voice Note Audio Player */}
                  {msg.audioUrl && (
                    <div className="flex items-center gap-3 py-1 min-w-[210px]">
                      <button
                        onClick={() => handleTogglePlayVoiceNote(msg.id, msg.audioDuration || 8)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          isMe
                            ? 'bg-white text-indigo-700 hover:bg-slate-100'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                        }`}
                      >
                        {playingAudioId === msg.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Animated Soundwave Bars */}
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center gap-0.5 h-6">
                          {[40, 70, 30, 90, 50, 100, 60, 45, 80, 55, 30, 75, 95, 40, 65].map((height, i) => {
                            const isPlayed = ((audioPlaybackProgress[msg.id] || 0) / 100) * 15 >= i;
                            return (
                              <div
                                key={i}
                                style={{ height: `${height}%` }}
                                className={`w-1 rounded-full transition-colors ${
                                  isPlayed
                                    ? isMe ? 'bg-white' : 'bg-indigo-400'
                                    : isMe ? 'bg-white/40' : 'bg-slate-600'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/70">
                          <span>
                            0:0{Math.floor(((audioPlaybackProgress[msg.id] || 0) / 100) * (msg.audioDuration || 8))}
                          </span>
                          <span>0:0{msg.audioDuration || 8}</span>
                        </div>
                      </div>

                      {/* Playback Speed Toggle */}
                      <button
                        onClick={() => setPlaybackSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/20 text-white/90 hover:bg-black/40"
                      >
                        {playbackSpeed}x
                      </button>
                    </div>
                  )}

                  {/* Regular Text */}
                  {msg.text && (
                    <p className="leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  )}

                  {/* Footer Timestamp & Read Receipt */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isMe ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    <span className="tabular-nums">{msg.timestamp}</span>
                    {isMe && (
                      <CheckCheck
                        className={`w-3.5 h-3.5 ${
                          msg.status === 'read' ? 'text-cyan-300' : 'text-indigo-300/80'
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Message Reactions Badges */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 px-1">
                    {msg.reactions.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => addReaction(activeContact.id, msg.id, r.emoji)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-transform active:scale-95 ${
                          r.users.includes('me')
                            ? 'bg-indigo-600/40 border border-indigo-500 text-white'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] font-semibold">{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock */}
        <div className="p-3 md:p-4 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80">
          {isRecording ? (
            /* Live Voice Recording Dock */
            <div className="flex items-center justify-between p-2.5 bg-slate-800 rounded-2xl border border-red-500/40">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-semibold text-red-400">
                  Recording audio...
                </span>
                <span className="font-mono text-xs text-white tabular-nums bg-slate-900 px-2 py-0.5 rounded-md">
                  0:0{recordingSeconds}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelVoiceRecording}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendVoiceRecording}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Note
                </button>
              </div>
            </div>
          ) : (
            /* Standard Text & Attachment Input Form */
            <form onSubmit={handleSendText} className="flex items-center gap-2">
              {/* Photo Attachment */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Send photo"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Emoji Picker Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center ${
                    showEmojiPicker
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Emoji reactions"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 p-2.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl grid grid-cols-6 gap-1 z-30">
                    {['😀', '😂', '😍', '🔥', '👍', '🎉', '🙌', '✨', '☕', '🌊', '🚀', '❤️'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-xl p-1.5 hover:bg-slate-800 rounded-lg active:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Text Area Input */}
              <input
                type="text"
                placeholder={`Message ${activeContact.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />

              {/* Record Audio Note or Send Button */}
              {inputText.trim() ? (
                <button
                  type="submit"
                  className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartVoiceRecording}
                  className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 flex items-center justify-center transition-all active:scale-95"
                  title="Record Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Right Drawer: Contact Profile Details */}
      {showContactInfo && (
        <div className="w-72 bg-slate-900 border-l border-slate-800/80 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-end">
              <button
                onClick={() => setShowContactInfo(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={activeContact.avatar}
              alt={activeContact.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-800 mb-3"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-base font-bold text-white">{activeContact.name}</h3>
            <p className="text-xs text-indigo-400">@{activeContact.username}</p>
            <p className="text-xs text-slate-300 mt-3 px-2 leading-relaxed">{activeContact.bio}</p>

            <div className="w-full mt-6 flex flex-col gap-3 text-left">
              <div className="p-3 bg-slate-800/70 rounded-xl">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Phone</span>
                <p className="text-xs text-white font-mono mt-0.5">{activeContact.phone}</p>
              </div>

              <div className="p-3 bg-slate-800/70 rounded-xl">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Encryption</span>
                <p className="text-xs text-emerald-400 mt-0.5">End-to-End Encrypted</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
            <button
              onClick={() => startCall(activeContact, 'voice')}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Voice Call
            </button>
            <button
              onClick={() => startCall(activeContact, 'video')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              Video Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
