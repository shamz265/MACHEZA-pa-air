import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Contact,
  Message,
  Story,
  StoryItem,
  CallLog,
  ActiveCall,
  User,
  CallType,
  MalawiProfile,
  ChikondiSubscription,
  RevenueTransaction,
  ChikondiChatMessage
} from '../types';
import { CURRENT_USER, INITIAL_CONTACTS, INITIAL_MESSAGES, INITIAL_STORIES, INITIAL_CALL_LOGS } from '../data/initialData';
import { INITIAL_MALAWI_PROFILES, INITIAL_CHIKONDI_CHAT, INITIAL_REVENUE_TRANSACTIONS } from '../data/malawiData';
import { SoundEngine } from '../utils/soundEffects';

interface AppContextType {
  currentUser: User;
  updateCurrentUser: (user: Partial<User>) => void;
  activeTab: 'chats' | 'stories' | 'calls' | 'contacts' | 'chikondi' | 'settings';
  setActiveTab: (tab: 'chats' | 'stories' | 'calls' | 'contacts' | 'chikondi' | 'settings') => void;
  contacts: Contact[];
  activeContactId: string;
  setActiveContactId: (id: string) => void;
  activeContact: Contact | undefined;
  messages: Record<string, Message[]>;
  sendMessage: (payload: { contactId: string; text?: string; imageUrl?: string; audioUrl?: string; audioDuration?: number; storyReplyTo?: Message['storyReplyTo'] }) => void;
  addReaction: (contactId: string, messageId: string, emoji: string) => void;
  stories: Story[];
  activeStoryViewer: { storyIndex: number; itemIndex: number } | null;
  openStoryViewer: (storyId: string) => void;
  closeStoryViewer: () => void;
  nextStoryItem: () => void;
  prevStoryItem: () => void;
  likeStoryItem: (storyId: string, itemId: string) => void;
  isStoryCreatorOpen: boolean;
  setIsStoryCreatorOpen: (open: boolean) => void;
  createStory: (item: Omit<StoryItem, 'id' | 'likesCount' | 'timestamp'>) => void;
  activeCall: ActiveCall | null;
  startCall: (contact: Contact, type: CallType) => Promise<void>;
  endCall: () => void;
  answerCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleVideo: () => void;
  minimizeCall: () => void;
  maximizeCall: () => void;
  callLogs: CallLog[];
  localStream: MediaStream | null;
  simulateIncomingCall: (contactId?: string, type?: CallType) => void;
  incomingCallRing: boolean;

  // Malawi Loved Ones (Chikondi Hub) & Subscriptions
  malawiProfiles: MalawiProfile[];
  likedProfileIds: string[];
  toggleLikeMalawiProfile: (profileId: string) => void;
  chikondiSubscription: ChikondiSubscription;
  subscribeToChikondi: (planId: 'weekly' | 'monthly' | 'lifetime', method: 'airtel_money' | 'tnm_mpamba' | 'card', phone: string) => void;
  cancelChikondiSubscription: () => void;
  chikondiChatMessages: ChikondiChatMessage[];
  sendChikondiChatMessage: (text: string) => void;
  connectWithMalawianLovedOne: (profile: MalawiProfile) => void;
  revenueTransactions: RevenueTransaction[];
  totalOwnerRevenueMWK: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [activeTab, setActiveTab] = useState<'chats' | 'stories' | 'calls' | 'contacts' | 'chikondi' | 'settings'>('chats');
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>('elena');
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('aura_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('aura_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });
  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('aura_call_logs');
    return saved ? JSON.parse(saved) : INITIAL_CALL_LOGS;
  });

  const [activeStoryViewer, setActiveStoryViewer] = useState<{ storyIndex: number; itemIndex: number } | null>(null);
  const [isStoryCreatorOpen, setIsStoryCreatorOpen] = useState<boolean>(false);

  // Calls
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [incomingCallRing, setIncomingCallRing] = useState(false);
  const callTimerRef = useRef<number | null>(null);

  // Malawi Loved Ones (Chikondi) state
  const [malawiProfiles, setMalawiProfiles] = useState<MalawiProfile[]>(INITIAL_MALAWI_PROFILES);
  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(['malawi-grace']);
  const [chikondiSubscription, setChikondiSubscription] = useState<ChikondiSubscription>(() => {
    const saved = localStorage.getItem('aura_chikondi_sub');
    return saved ? JSON.parse(saved) : { isSubscribed: false };
  });
  const [chikondiChatMessages, setChikondiChatMessages] = useState<ChikondiChatMessage[]>(() => {
    const saved = localStorage.getItem('aura_chikondi_msgs');
    return saved ? JSON.parse(saved) : INITIAL_CHIKONDI_CHAT;
  });
  const [revenueTransactions, setRevenueTransactions] = useState<RevenueTransaction[]>(() => {
    const saved = localStorage.getItem('aura_revenue_tx');
    return saved ? JSON.parse(saved) : INITIAL_REVENUE_TRANSACTIONS;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('aura_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('aura_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('aura_call_logs', JSON.stringify(callLogs));
  }, [callLogs]);

  useEffect(() => {
    localStorage.setItem('aura_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aura_chikondi_sub', JSON.stringify(chikondiSubscription));
  }, [chikondiSubscription]);

  useEffect(() => {
    localStorage.setItem('aura_chikondi_msgs', JSON.stringify(chikondiChatMessages));
  }, [chikondiChatMessages]);

  useEffect(() => {
    localStorage.setItem('aura_revenue_tx', JSON.stringify(revenueTransactions));
  }, [revenueTransactions]);

  const updateCurrentUser = (partial: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...partial }));
  };

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  // Send message handler with sound and simulated smart reply
  const sendMessage = ({
    contactId,
    text,
    imageUrl,
    audioUrl,
    audioDuration,
    storyReplyTo
  }: {
    contactId: string;
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
    audioDuration?: number;
    storyReplyTo?: Message['storyReplyTo'];
  }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderId: 'me',
      recipientId: contactId,
      text,
      imageUrl,
      audioUrl,
      audioDuration,
      storyReplyTo,
      timestamp: timeStr,
      status: 'sent'
    };

    SoundEngine.playMessageSent();

    setMessages(prev => {
      const existing = prev[contactId] || [];
      return {
        ...prev,
        [contactId]: [...existing, newMsg]
      };
    });

    // Mark as delivered
    setTimeout(() => {
      setMessages(prev => {
        const contactMsgs = prev[contactId] || [];
        return {
          ...prev,
          [contactId]: contactMsgs.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m)
        };
      });
    }, 900);

    // Simulate smart interactive reply from active contact after 2-3s (if not a group or customized)
    const targetContact = contacts.find(c => c.id === contactId);
    if (targetContact && !targetContact.isGroup) {
      setTimeout(() => {
        // Mark user msg as read
        setMessages(prev => {
          const contactMsgs = prev[contactId] || [];
          return {
            ...prev,
            [contactId]: contactMsgs.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m)
          };
        });

        // Determine thoughtful reply
        let replyText = 'Got it! Looking forward to catching up.';
        if (targetContact.id.startsWith('malawi-')) {
          replyText = `Muli bwanji! So glad we connected through Chikondi Malawi ❤️ How is your day in Malawi?`;
        } else if (storyReplyTo) {
          replyText = `Thanks for checking out my story! ${storyReplyTo.storyTitle ? 'It was such a vibe.' : 'Appreciate you ❤️'}`;
        } else if (audioUrl) {
          replyText = 'Listening to your voice note right now! Sounds super clear.';
        } else if (imageUrl) {
          replyText = 'That looks stunning! Thanks for sharing this photo.';
        } else if (text) {
          const lower = text.toLowerCase();
          if (lower.includes('call') || lower.includes('video') || lower.includes('voice')) {
            replyText = 'I am available right now! Feel free to hit the call button 📞';
          } else if (lower.includes('how are you') || lower.includes('sup') || lower.includes('hey')) {
            replyText = 'Doing fantastic! Just relaxing today. How about you?';
          } else {
            replyText = `Totally agree with that. Let's sync up in detail!`;
          }
        }

        const replyMsg: Message = {
          id: `reply-${Date.now()}`,
          senderId: contactId,
          recipientId: 'me',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };

        SoundEngine.playMessageReceived();
        setMessages(prev => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), replyMsg]
        }));
      }, 2400);
    }
  };

  const addReaction = (contactId: string, messageId: string, emoji: string) => {
    SoundEngine.playReactionPop();
    setMessages(prev => {
      const list = prev[contactId] || [];
      return {
        ...prev,
        [contactId]: list.map(msg => {
          if (msg.id !== messageId) return msg;
          const reactions = msg.reactions ? [...msg.reactions] : [];
          const existing = reactions.find(r => r.emoji === emoji);
          if (existing) {
            if (existing.users.includes('me')) {
              existing.users = existing.users.filter(u => u !== 'me');
              existing.count -= 1;
              return {
                ...msg,
                reactions: reactions.filter(r => r.count > 0)
              };
            } else {
              existing.users.push('me');
              existing.count += 1;
              return { ...msg, reactions };
            }
          } else {
            reactions.push({ emoji, count: 1, users: ['me'] });
            return { ...msg, reactions };
          }
        })
      };
    });
  };

  // Stories
  const openStoryViewer = (storyId: string) => {
    const idx = stories.findIndex(s => s.id === storyId);
    if (idx !== -1) {
      setStories(prev => prev.map((s, i) => i === idx ? { ...s, hasUnseen: false } : s));
      setActiveStoryViewer({ storyIndex: idx, itemIndex: 0 });
      const story = stories[idx];
      const item = story.items[0];
      if (item?.musicTrack) {
        SoundEngine.playStoryAmbient(item.musicTrack);
      }
    }
  };

  const closeStoryViewer = () => {
    SoundEngine.stopStoryAmbient();
    setActiveStoryViewer(null);
  };

  const nextStoryItem = () => {
    if (!activeStoryViewer) return;
    const currentStory = stories[activeStoryViewer.storyIndex];
    if (activeStoryViewer.itemIndex < currentStory.items.length - 1) {
      const nextIdx = activeStoryViewer.itemIndex + 1;
      setActiveStoryViewer(prev => prev ? { ...prev, itemIndex: nextIdx } : null);
      if (currentStory.items[nextIdx]?.musicTrack) {
        SoundEngine.playStoryAmbient(currentStory.items[nextIdx].musicTrack);
      }
    } else if (activeStoryViewer.storyIndex < stories.length - 1) {
      const nextStoryIdx = activeStoryViewer.storyIndex + 1;
      setStories(prev => prev.map((s, i) => i === nextStoryIdx ? { ...s, hasUnseen: false } : s));
      setActiveStoryViewer({ storyIndex: nextStoryIdx, itemIndex: 0 });
      const nextStory = stories[nextStoryIdx];
      if (nextStory.items[0]?.musicTrack) {
        SoundEngine.playStoryAmbient(nextStory.items[0].musicTrack);
      }
    } else {
      closeStoryViewer();
    }
  };

  const prevStoryItem = () => {
    if (!activeStoryViewer) return;
    if (activeStoryViewer.itemIndex > 0) {
      setActiveStoryViewer(prev => prev ? { ...prev, itemIndex: prev.itemIndex - 1 } : null);
    } else if (activeStoryViewer.storyIndex > 0) {
      const prevStoryIdx = activeStoryViewer.storyIndex - 1;
      const prevStory = stories[prevStoryIdx];
      setActiveStoryViewer({
        storyIndex: prevStoryIdx,
        itemIndex: prevStory.items.length - 1
      });
    }
  };

  const likeStoryItem = (storyId: string, itemId: string) => {
    SoundEngine.playReactionPop();
    setStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      return {
        ...s,
        items: s.items.map(item => item.id === itemId ? { ...item, likesCount: item.likesCount + 1 } : item)
      };
    }));
  };

  const createStory = (itemData: Omit<StoryItem, 'id' | 'likesCount' | 'timestamp'>) => {
    const newItem: StoryItem = {
      ...itemData,
      id: `my-story-${Date.now()}`,
      likesCount: 0,
      timestamp: 'Just now'
    };

    setStories(prev => {
      const meIdx = prev.findIndex(s => s.userId === 'me');
      if (meIdx !== -1) {
        const updated = [...prev];
        updated[meIdx] = {
          ...updated[meIdx],
          updatedAt: 'Just now',
          items: [newItem, ...updated[meIdx].items]
        };
        return updated;
      } else {
        const myStory: Story = {
          id: 'story-me',
          userId: 'me',
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          isMe: true,
          hasUnseen: false,
          updatedAt: 'Just now',
          items: [newItem]
        };
        return [myStory, ...prev];
      }
    });

    setIsStoryCreatorOpen(false);
  };

  // Calling
  const startCall = async (contact: Contact, type: CallType) => {
    let stream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === 'video'
        });
        setLocalStream(stream);
      }
    } catch {
      // Permission rejected or not supported in sandbox
    }

    const call: ActiveCall = {
      id: `call-${Date.now()}`,
      contact,
      type,
      status: 'outgoing',
      isMuted: false,
      isSpeaker: true,
      isVideoEnabled: type === 'video',
      isMinimized: false,
      remoteVideoActive: true,
      hasPermissionCamera: !!stream && type === 'video',
      hasPermissionMic: !!stream
    };

    setActiveCall(call);
    SoundEngine.startOutgoingRing();

    callTimerRef.current = window.setTimeout(() => {
      SoundEngine.playCallConnected();
      setActiveCall(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'connected',
          startedAt: Date.now()
        };
      });
    }, 2800);
  };

  const endCall = () => {
    SoundEngine.stopRing();
    SoundEngine.playCallEnded();

    if (callTimerRef.current) {
      clearTimeout(callTimerRef.current);
      callTimerRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      setLocalStream(null);
    }

    if (activeCall) {
      const duration = activeCall.startedAt ? Math.round((Date.now() - activeCall.startedAt) / 1000) : 0;
      const newLog: CallLog = {
        id: `log-${Date.now()}`,
        contactId: activeCall.contact.id,
        type: activeCall.type,
        direction: activeCall.status === 'connected' ? 'outgoing' : 'missed',
        timestamp: 'Just now',
        durationSeconds: duration > 0 ? duration : undefined
      };
      setCallLogs(prev => [newLog, ...prev]);
    }

    setActiveCall(null);
    setIncomingCallRing(false);
  };

  const answerCall = () => {
    SoundEngine.stopRing();
    SoundEngine.playCallConnected();
    setIncomingCallRing(false);
    setActiveCall(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'connected',
        startedAt: Date.now()
      };
    });
  };

  const toggleMute = () => {
    if (!activeCall) return;
    const nextMuted = !activeCall.isMuted;
    if (localStream) {
      localStream.getAudioTracks().forEach(t => { t.enabled = !nextMuted; });
    }
    setActiveCall(prev => prev ? { ...prev, isMuted: nextMuted } : null);
  };

  const toggleSpeaker = () => {
    if (!activeCall) return;
    setActiveCall(prev => prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null);
  };

  const toggleVideo = () => {
    if (!activeCall) return;
    const nextVideo = !activeCall.isVideoEnabled;
    if (localStream) {
      localStream.getVideoTracks().forEach(t => { t.enabled = nextVideo; });
    }
    setActiveCall(prev => prev ? { ...prev, isVideoEnabled: nextVideo } : null);
  };

  const minimizeCall = () => {
    setActiveCall(prev => prev ? { ...prev, isMinimized: true } : null);
  };

  const maximizeCall = () => {
    setActiveCall(prev => prev ? { ...prev, isMinimized: false } : null);
  };

  const simulateIncomingCall = (contactId: string = 'elena', type: CallType = 'video') => {
    const contact = contacts.find(c => c.id === contactId) || contacts[0];
    const call: ActiveCall = {
      id: `inc-call-${Date.now()}`,
      contact,
      type,
      status: 'incoming',
      isMuted: false,
      isSpeaker: true,
      isVideoEnabled: type === 'video',
      isMinimized: false,
      remoteVideoActive: true
    };
    setActiveCall(call);
    setIncomingCallRing(true);
    SoundEngine.startOutgoingRing();
  };

  // Malawi Loved Ones (Chikondi) Subscription and Chat
  const toggleLikeMalawiProfile = (profileId: string) => {
    SoundEngine.playReactionPop();
    setLikedProfileIds(prev =>
      prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]
    );
  };

  const subscribeToChikondi = (
    planId: 'weekly' | 'monthly' | 'lifetime',
    method: 'airtel_money' | 'tnm_mpamba' | 'card',
    phone: string
  ) => {
    let amount = 3500;
    let planName = 'Monthly VIP Matchmaker';
    let durationDays = 30;

    if (planId === 'weekly') {
      amount = 1500;
      planName = '7-Day Chikondi Pass';
      durationDays = 7;
    } else if (planId === 'lifetime') {
      amount = 10000;
      planName = 'Lifetime Chikondi Gold VIP';
      durationDays = 3650;
    }

    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const txId = `tx-${method}-${Date.now().toString().slice(-6)}`;

    // Set user subscription
    const sub: ChikondiSubscription = {
      isSubscribed: true,
      planId,
      planName,
      expiryDate,
      paymentMethod: method,
      transactionId: txId,
      amountMWK: amount
    };
    setChikondiSubscription(sub);

    // Add to app owner's revenue ledger
    const newTx: RevenueTransaction = {
      id: txId,
      userName: currentUser.name,
      phone: phone || currentUser.phone,
      planName,
      amountMWK: amount,
      method,
      timestamp: 'Just now',
      status: 'completed'
    };
    setRevenueTransactions(prev => [newTx, ...prev]);

    SoundEngine.playCallConnected();
  };

  const cancelChikondiSubscription = () => {
    setChikondiSubscription({ isSubscribed: false });
  };

  const sendChikondiChatMessage = (text: string) => {
    if (!text.trim()) return;
    SoundEngine.playMessageSent();

    const newMsg: ChikondiChatMessage = {
      id: `c-msg-${Date.now()}`,
      senderId: 'me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderCity: 'Lilongwe',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likesCount: 0
    };

    setChikondiChatMessages(prev => [...prev, newMsg]);

    // Simulate Malawian peer response in group
    setTimeout(() => {
      const peer = malawiProfiles[Math.floor(Math.random() * malawiProfiles.length)];
      const replies = [
        `Takulandirani ${currentUser.name}! Great to see you in the Chikondi lounge.`,
        `Welcome from ${peer.city}! Hope you find your blessed match here ❤️`,
        `Nice to connect! Feel free to message anyone or hop on a call.`
      ];
      const peerMsg: ChikondiChatMessage = {
        id: `c-msg-peer-${Date.now()}`,
        senderId: peer.id,
        senderName: peer.name,
        senderAvatar: peer.avatar,
        senderCity: peer.city,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        likesCount: 1
      };
      SoundEngine.playMessageReceived();
      setChikondiChatMessages(prev => [...prev, peerMsg]);
    }, 2500);
  };

  const connectWithMalawianLovedOne = (profile: MalawiProfile) => {
    // Add to contacts if not already added
    const existing = contacts.find(c => c.id === profile.id);
    if (!existing) {
      const newContact: Contact = {
        id: profile.id,
        name: profile.name,
        username: profile.name.toLowerCase().replace(/\s+/g, '_'),
        avatar: profile.avatar,
        status: profile.isOnline ? 'online' : 'away',
        bio: `${profile.occupation} in ${profile.city} · Seeking ${profile.lookingFor} ❤️`,
        phone: profile.phone
      };
      setContacts(prev => [newContact, ...prev]);

      // Seed starter message
      const starterMsg: Message = {
        id: `msg-starter-${Date.now()}`,
        senderId: profile.id,
        recipientId: 'me',
        text: `Muli bwanji! I saw your profile in Chikondi Malawi. So wonderful to connect with you!`,
        timestamp: 'Just now',
        status: 'read'
      };
      setMessages(prev => ({
        ...prev,
        [profile.id]: [starterMsg]
      }));
    }

    setActiveContactId(profile.id);
    setActiveTab('chats');
  };

  const totalOwnerRevenueMWK = revenueTransactions.reduce((acc, tx) => acc + tx.amountMWK, 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        activeTab,
        setActiveTab,
        contacts,
        activeContactId,
        setActiveContactId,
        activeContact,
        messages,
        sendMessage,
        addReaction,
        stories,
        activeStoryViewer,
        openStoryViewer,
        closeStoryViewer,
        nextStoryItem,
        prevStoryItem,
        likeStoryItem,
        isStoryCreatorOpen,
        setIsStoryCreatorOpen,
        createStory,
        activeCall,
        startCall,
        endCall,
        answerCall,
        toggleMute,
        toggleSpeaker,
        toggleVideo,
        minimizeCall,
        maximizeCall,
        callLogs,
        localStream,
        simulateIncomingCall,
        incomingCallRing,

        // Malawi Loved Ones
        malawiProfiles,
        likedProfileIds,
        toggleLikeMalawiProfile,
        chikondiSubscription,
        subscribeToChikondi,
        cancelChikondiSubscription,
        chikondiChatMessages,
        sendChikondiChatMessage,
        connectWithMalawianLovedOne,
        revenueTransactions,
        totalOwnerRevenueMWK
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
