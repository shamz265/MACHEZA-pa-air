export type CallType = 'voice' | 'video';
export type CallStatus = 'outgoing' | 'incoming' | 'connected' | 'ended';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: string;
  bio: string;
  phone: string;
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeen?: string;
  bio: string;
  phone: string;
  isGroup?: boolean;
  memberCount?: number;
  sampleVideoUrl?: string; // For simulated incoming video call
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs who reacted
}

export interface Message {
  id: string;
  senderId: string; // 'me' or contact.id
  recipientId: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  audioDuration?: number; // in seconds
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  storyReplyTo?: {
    storyId: string;
    storyTitle: string;
    mediaUrl: string;
  };
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'gradient';
  gradient?: string;
  caption?: string;
  timestamp: string;
  tag?: string;
  musicTrack?: string;
  fontStyle?: 'sans' | 'serif' | 'mono' | 'neon';
  likesCount: number;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isMe?: boolean;
  hasUnseen: boolean;
  updatedAt: string;
  items: StoryItem[];
}

export interface CallLog {
  id: string;
  contactId: string;
  type: CallType;
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  durationSeconds?: number;
}

export interface ActiveCall {
  id: string;
  contact: Contact;
  type: CallType;
  status: CallStatus;
  startedAt?: number;
  isMuted: boolean;
  isSpeaker: boolean;
  isVideoEnabled: boolean;
  isMinimized: boolean;
  remoteVideoActive: boolean;
  hasPermissionCamera?: boolean;
  hasPermissionMic?: boolean;
}

export interface MalawiProfile {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male';
  city: 'Lilongwe' | 'Blantyre' | 'Mzuzu' | 'Zomba' | 'Salima' | 'Mangochi' | 'Kasungu';
  occupation: string;
  avatar: string;
  bio: string;
  lookingFor: 'Marriage' | 'Serious Relationship' | 'Dating & Romance' | 'Companionship';
  verified: boolean;
  phone: string;
  isOnline: boolean;
  interests: string[];
}

export interface ChikondiSubscription {
  isSubscribed: boolean;
  planId?: 'weekly' | 'monthly' | 'lifetime';
  planName?: string;
  expiryDate?: string;
  paymentMethod?: 'airtel_money' | 'tnm_mpamba' | 'card';
  transactionId?: string;
  amountMWK?: number;
}

export interface RevenueTransaction {
  id: string;
  userName: string;
  phone: string;
  planName: string;
  amountMWK: number;
  method: 'airtel_money' | 'tnm_mpamba' | 'card';
  timestamp: string;
  status: 'completed' | 'pending';
}

export interface ChikondiChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderCity: string;
  text?: string;
  audioUrl?: string;
  audioDuration?: number;
  timestamp: string;
  likesCount?: number;
}

