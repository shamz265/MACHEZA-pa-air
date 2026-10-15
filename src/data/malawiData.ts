import { MalawiProfile, ChikondiChatMessage, RevenueTransaction } from '../types';

export const INITIAL_MALAWI_PROFILES: MalawiProfile[] = [
  {
    id: 'malawi-grace',
    name: 'Grace Phiri',
    age: 24,
    gender: 'female',
    city: 'Lilongwe',
    occupation: 'Architect & Interior Designer',
    avatar: '/src/assets/images/malawi_grace_portrait_1792084738024.jpg',
    bio: 'Warm-hearted, God-fearing, and passionate about creating beautiful homes. Love quiet lake sunsets at Cape Maclear, gospel melodies, and home-cooked dinners.',
    lookingFor: 'Marriage',
    verified: true,
    phone: '+265 991 234 567',
    isOnline: true,
    interests: ['Lake Malawi', 'Acoustic Guitar', 'Interior Design', 'Cooking Chambo']
  },
  {
    id: 'malawi-kondwani',
    name: 'Kondwani Banda',
    age: 27,
    gender: 'male',
    city: 'Blantyre',
    occupation: 'Software Engineer & Tech Founder',
    avatar: '/src/assets/images/malawi_kondwani_portrait_1792084739515.jpg',
    bio: 'Based in Blantyre. Looking for an ambitious, kind partner to build a life and family with. Enjoys hiking Mount Mulanje, espresso, and good conversation.',
    lookingFor: 'Marriage',
    verified: true,
    phone: '+265 888 765 432',
    isOnline: true,
    interests: ['Mount Mulanje', 'Coffee & Tech', 'Family Values', 'Weekend Roadtrips']
  },
  {
    id: 'malawi-chisomo',
    name: 'Chisomo Mwale',
    age: 23,
    gender: 'female',
    city: 'Zomba',
    occupation: 'Pediatric Healthcare Specialist',
    avatar: '/src/assets/images/malawi_chisomo_portrait_1792084739481.jpg',
    bio: 'Gentle soul with a heart for helping children. Living in the quiet beauty of Zomba Plateau. Looking for someone genuine, honest, and ready for romance.',
    lookingFor: 'Serious Relationship',
    verified: true,
    phone: '+265 994 567 890',
    isOnline: false,
    interests: ['Zomba Plateau', 'Poetry', 'Community Work', 'Baking']
  },
  {
    id: 'malawi-tamara',
    name: 'Tamara Gondwe',
    age: 26,
    gender: 'female',
    city: 'Mzuzu',
    occupation: 'Senior Financial Analyst',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Mzuzu girl at heart! Energetic, career-focused yet deeply family oriented. Seeking a mature man with clear vision and good humor.',
    lookingFor: 'Serious Relationship',
    verified: true,
    phone: '+265 882 345 678',
    isOnline: true,
    interests: ['Finance', 'Travel', 'Northern Malawi Hills', 'Fitness']
  },
  {
    id: 'malawi-kelvin',
    name: 'Dr. Kelvin Chirwa',
    age: 29,
    gender: 'male',
    city: 'Lilongwe',
    occupation: 'Medical Doctor',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    bio: 'Practicing doctor in Area 47, Lilongwe. Looking for a partner who values mutual respect, communication, and faith.',
    lookingFor: 'Marriage',
    verified: true,
    phone: '+265 999 876 543',
    isOnline: false,
    interests: ['Medicine', 'Tennis', 'Reading', 'Gospel Fellowship']
  },
  {
    id: 'malawi-tiwonge',
    name: 'Tiwonge Banda',
    age: 25,
    gender: 'female',
    city: 'Mangochi',
    occupation: 'Eco-Tourism Coordinator',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    bio: 'Born by the lake, living by the lake! Love boat rides, fresh air, and smiling. Ready to find my lifetime companion.',
    lookingFor: 'Dating & Romance',
    verified: true,
    phone: '+265 881 432 109',
    isOnline: true,
    interests: ['Lake Malawi Safaris', 'Photography', 'Sunset Walks', 'Music']
  }
];

export const INITIAL_CHIKONDI_CHAT: ChikondiChatMessage[] = [
  {
    id: 'c-msg-1',
    senderId: 'malawi-grace',
    senderName: 'Grace Phiri',
    senderAvatar: '/src/assets/images/malawi_grace_portrait_1792084738024.jpg',
    senderCity: 'Lilongwe',
    text: 'Muli bwanji nonse! Warm greetings to everyone in this VIP lounge. Happy to be here ✨',
    timestamp: '9:15 AM',
    likesCount: 6
  },
  {
    id: 'c-msg-2',
    senderId: 'malawi-kondwani',
    senderName: 'Kondwani Banda',
    senderAvatar: '/src/assets/images/malawi_kondwani_portrait_1792084739515.jpg',
    senderCity: 'Blantyre',
    text: 'Tili bwino Grace! Greetings from Blantyre city. Looking forward to meeting wonderful people here.',
    timestamp: '9:22 AM',
    likesCount: 8
  },
  {
    id: 'c-msg-3',
    senderId: 'malawi-chisomo',
    senderName: 'Chisomo Mwale',
    senderAvatar: '/src/assets/images/malawi_chisomo_portrait_1792084739481.jpg',
    senderCity: 'Zomba',
    text: 'Hello from Zomba Plateau! The breeze up here is magical today 🌿 Anyone traveling down south for the weekend?',
    timestamp: '9:40 AM',
    likesCount: 4
  }
];

export const INITIAL_REVENUE_TRANSACTIONS: RevenueTransaction[] = [
  {
    id: 'tx-airtel-101',
    userName: 'Kondwani Banda',
    phone: '+265 991 *** 567',
    planName: 'Monthly VIP Matchmaker',
    amountMWK: 3500,
    method: 'airtel_money',
    timestamp: 'Today, 8:45 AM',
    status: 'completed'
  },
  {
    id: 'tx-mpamba-102',
    userName: 'Grace Phiri',
    phone: '+265 888 *** 432',
    planName: 'Lifetime Chikondi Gold',
    amountMWK: 10000,
    method: 'tnm_mpamba',
    timestamp: 'Today, 7:12 AM',
    status: 'completed'
  },
  {
    id: 'tx-airtel-103',
    userName: 'Chisomo Mwale',
    phone: '+265 994 *** 890',
    planName: 'Monthly VIP Matchmaker',
    amountMWK: 3500,
    method: 'airtel_money',
    timestamp: 'Yesterday, 6:30 PM',
    status: 'completed'
  },
  {
    id: 'tx-mpamba-104',
    userName: 'Tamara Gondwe',
    phone: '+265 882 *** 678',
    planName: 'Monthly VIP Matchmaker',
    amountMWK: 3500,
    method: 'tnm_mpamba',
    timestamp: 'Yesterday, 3:15 PM',
    status: 'completed'
  },
  {
    id: 'tx-card-105',
    userName: 'Dr. Kelvin Chirwa',
    phone: '+265 999 *** 543',
    planName: 'Lifetime Chikondi Gold',
    amountMWK: 10000,
    method: 'card',
    timestamp: 'Oct 13, 11:20 AM',
    status: 'completed'
  }
];
