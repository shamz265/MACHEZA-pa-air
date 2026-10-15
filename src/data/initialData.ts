import { Contact, User, Story, Message, CallLog } from '../types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Ibrahim Chitambi',
  username: 'ibrahim',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  status: 'Available',
  bio: 'Exploring ideas, building next-gen apps & capturing moments ✨',
  phone: '+1 (555) 019-2834'
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    username: 'elena_art',
    avatar: '/src/assets/images/avatar_elena_portrait_1792083978671.jpg',
    status: 'online',
    bio: 'Art director & visual storyteller. Living between coffee and canvas 🎨',
    phone: '+1 (555) 234-8901'
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    username: 'marcus_v',
    avatar: '/src/assets/images/avatar_marcus_portrait_1792083979488.jpg',
    status: 'online',
    bio: 'Product architecture & interface craft. Always up for a quick call ☕',
    phone: '+1 (555) 876-5432'
  },
  {
    id: 'chloe',
    name: 'Chloe Bennett',
    username: 'chloe_films',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    status: 'away',
    lastSeen: '12m ago',
    bio: 'Cinematography & documentary director 🎬',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 'dev_squad',
    name: 'Core Design & Dev',
    username: 'group_squad',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80',
    status: 'online',
    bio: 'Daily standup, feature shipping & collaborative sprint team',
    phone: 'Group Chat',
    isGroup: true,
    memberCount: 6
  },
  {
    id: 'liam',
    name: 'Liam Chen',
    username: 'liam_c',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'offline',
    lastSeen: '2h ago',
    bio: 'Sound designer & audio producer. Synthesizers & beats 🎧',
    phone: '+1 (555) 456-7890'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-elena',
    userId: 'elena',
    userName: 'Elena Rostova',
    userAvatar: '/src/assets/images/avatar_elena_portrait_1792083978671.jpg',
    hasUnseen: true,
    updatedAt: '25m ago',
    items: [
      {
        id: 'story-item-elena-1',
        mediaUrl: '/src/assets/images/story_sunset_beach_1792083983866.jpg',
        mediaType: 'image',
        caption: 'Golden hour waves in Big Sur. Nothing beats this tranquil breeze 🌊✨',
        timestamp: '25m ago',
        tag: '📍 Pacific Coast',
        musicTrack: 'Sunset Chillwave · 120 bpm',
        fontStyle: 'sans',
        likesCount: 38
      }
    ]
  },
  {
    id: 'story-marcus',
    userId: 'marcus',
    userName: 'Marcus Vance',
    userAvatar: '/src/assets/images/avatar_marcus_portrait_1792083979488.jpg',
    hasUnseen: true,
    updatedAt: '1h ago',
    items: [
      {
        id: 'story-item-marcus-1',
        mediaUrl: '/src/assets/images/story_coffee_workspace_1792083979912.jpg',
        mediaType: 'image',
        caption: 'Morning design sprint with fresh espresso & sketchbook ☕📐',
        timestamp: '1h ago',
        tag: '☕ Workshop Café',
        musicTrack: 'Lofi Focus Beats',
        fontStyle: 'mono',
        likesCount: 52
      }
    ]
  },
  {
    id: 'story-chloe',
    userId: 'chloe',
    userName: 'Chloe Bennett',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    hasUnseen: false,
    updatedAt: '4h ago',
    items: [
      {
        id: 'story-item-chloe-1',
        mediaUrl: '',
        mediaType: 'gradient',
        gradient: 'from-purple-900 via-indigo-900 to-slate-900',
        caption: 'Wrapped the night shoot! Sneak peek drops Friday on 35mm 🎞️🎬',
        timestamp: '4h ago',
        tag: '🎬 Studio A',
        musicTrack: 'Midnight Synth · Chloe',
        fontStyle: 'neon',
        likesCount: 94
      }
    ]
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  elena: [
    {
      id: 'msg-e1',
      senderId: 'elena',
      recipientId: 'me',
      text: 'Hey Ibrahim! Did you check out the new design palette for the launch?',
      timestamp: '10:14 AM',
      status: 'read'
    },
    {
      id: 'msg-e2',
      senderId: 'me',
      recipientId: 'elena',
      text: 'Yes! The deep indigo and warm stone contrast look super clean and modern.',
      timestamp: '10:16 AM',
      status: 'read'
    },
    {
      id: 'msg-e3',
      senderId: 'elena',
      recipientId: 'me',
      audioUrl: 'voice-note-demo',
      audioDuration: 8,
      timestamp: '10:18 AM',
      status: 'read',
      reactions: [{ emoji: '❤️', count: 1, users: ['me'] }]
    },
    {
      id: 'msg-e4',
      senderId: 'elena',
      recipientId: 'me',
      text: 'I just posted a clip of the coast on my story too! Let me know if you are free for a quick video call later to review the prototypes.',
      timestamp: '10:20 AM',
      status: 'read'
    }
  ],
  marcus: [
    {
      id: 'msg-m1',
      senderId: 'marcus',
      recipientId: 'me',
      text: 'Morning Ibrahim! Are we still syncing at 11 for the voice architecture call?',
      timestamp: '9:45 AM',
      status: 'read'
    },
    {
      id: 'msg-m2',
      senderId: 'me',
      recipientId: 'marcus',
      text: 'Absolutely, 11 AM works perfect. Audio test and camera test are all calibrated.',
      timestamp: '9:50 AM',
      status: 'read'
    },
    {
      id: 'msg-m3',
      senderId: 'marcus',
      recipientId: 'me',
      text: 'Awesome. Ping me directly or tap call whenever you are ready! 👍',
      timestamp: '9:52 AM',
      status: 'read',
      reactions: [{ emoji: '🔥', count: 1, users: ['me'] }]
    }
  ],
  chloe: [
    {
      id: 'msg-c1',
      senderId: 'chloe',
      recipientId: 'me',
      text: 'Hey! The color grade render finished early this morning.',
      timestamp: 'Yesterday',
      status: 'read'
    },
    {
      id: 'msg-c2',
      senderId: 'me',
      recipientId: 'chloe',
      text: 'That is awesome news Chloe. Send over the stills!',
      timestamp: 'Yesterday',
      status: 'read'
    }
  ],
  dev_squad: [
    {
      id: 'msg-d1',
      senderId: 'marcus',
      recipientId: 'dev_squad',
      text: 'Voice and video call components merged into main branch 🚀',
      timestamp: '8:30 AM',
      status: 'read',
      reactions: [{ emoji: '🎉', count: 3, users: ['me', 'elena', 'marcus'] }]
    },
    {
      id: 'msg-d2',
      senderId: 'elena',
      recipientId: 'dev_squad',
      text: 'Stories bar with auto-advance and direct reply is running smoothly too!',
      timestamp: '8:35 AM',
      status: 'read'
    },
    {
      id: 'msg-d3',
      senderId: 'me',
      recipientId: 'dev_squad',
      text: 'Great work team! Ready for real user testing.',
      timestamp: '8:40 AM',
      status: 'read'
    }
  ],
  liam: [
    {
      id: 'msg-l1',
      senderId: 'liam',
      recipientId: 'me',
      text: 'Synthesized some ambient tracks for the story background audio. Check them out!',
      timestamp: 'Tuesday',
      status: 'read'
    }
  ]
};

export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'call-1',
    contactId: 'elena',
    type: 'video',
    direction: 'incoming',
    timestamp: 'Today, 9:30 AM',
    durationSeconds: 342
  },
  {
    id: 'call-2',
    contactId: 'marcus',
    type: 'voice',
    direction: 'outgoing',
    timestamp: 'Yesterday, 4:15 PM',
    durationSeconds: 184
  },
  {
    id: 'call-3',
    contactId: 'chloe',
    type: 'video',
    direction: 'missed',
    timestamp: 'Yesterday, 2:00 PM'
  },
  {
    id: 'call-4',
    contactId: 'elena',
    type: 'voice',
    direction: 'outgoing',
    timestamp: 'Oct 12, 11:20 AM',
    durationSeconds: 512
  }
];
