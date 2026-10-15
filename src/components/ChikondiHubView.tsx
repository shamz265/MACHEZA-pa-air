import React, { useState } from 'react';
import {
  Heart,
  Lock,
  Sparkles,
  Phone,
  Video,
  MessageSquare,
  MapPin,
  Briefcase,
  CheckCircle,
  Search,
  Filter,
  Wallet,
  Send,
  Users,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MalawiProfile } from '../types';
import { ChikondiPaywallModal } from './ChikondiPaywallModal';
import { ChikondiOwnerRevenueModal } from './ChikondiOwnerRevenueModal';
import { AppLogo } from './AppLogo';

export const ChikondiHubView: React.FC = () => {
  const {
    malawiProfiles,
    likedProfileIds,
    toggleLikeMalawiProfile,
    chikondiSubscription,
    chikondiChatMessages,
    sendChikondiChatMessage,
    connectWithMalawianLovedOne,
    startCall,
    totalOwnerRevenueMWK
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profiles' | 'vip_chat'>('profiles');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedIntent, setSelectedIntent] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [paywallTarget, setPaywallTarget] = useState<string | undefined>(undefined);
  const [isOwnerRevenueOpen, setIsOwnerRevenueOpen] = useState<boolean>(false);
  const [chatInputText, setChatInputText] = useState<string>('');

  const cities = ['All', 'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi', 'Salima'];
  const intents = ['All', 'Marriage', 'Serious Relationship', 'Dating & Romance'];

  const filteredProfiles = malawiProfiles.filter(p => {
    if (selectedCity !== 'All' && p.city !== selectedCity) return false;
    if (selectedIntent !== 'All' && p.lookingFor !== selectedIntent) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleActionRequiresSubscription = (profile: MalawiProfile, action: 'chat' | 'voice' | 'video') => {
    if (!chikondiSubscription.isSubscribed) {
      setPaywallTarget(profile.name);
      setIsPaywallOpen(true);
      return;
    }

    if (action === 'chat') {
      connectWithMalawianLovedOne(profile);
    } else {
      // Create contact or call directly
      startCall(
        {
          id: profile.id,
          name: profile.name,
          username: profile.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: profile.avatar,
          status: profile.isOnline ? 'online' : 'away',
          bio: `${profile.occupation} in ${profile.city}`,
          phone: profile.phone
        },
        action
      );
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    sendChikondiChatMessage(chatInputText);
    setChatInputText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden select-none">
      {/* Top Banner Header */}
      <div className="p-4 md:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <AppLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
                Macheza Pa Air · Chikondi
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Loved Ones Hub
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Find genuine Malawian singles in Lilongwe, Blantyre, Zomba & Mzuzu
            </p>
          </div>
        </div>

        {/* Top Actions: Sub Status & Owner Revenue Button */}
        <div className="flex items-center gap-2.5">
          {/* Owner Revenue Tracker Trigger */}
          <button
            onClick={() => setIsOwnerRevenueOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="View app owner subscription earnings"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tabular-nums">Owner MK {totalOwnerRevenueMWK.toLocaleString()}</span>
          </button>

          {/* User Membership Status Button */}
          {chikondiSubscription.isSubscribed ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>VIP Member</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setPaywallTarget(undefined);
                setIsPaywallOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Unlock VIP (MK 1,500)
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs: Profiles vs VIP Group Chat */}
      <div className="px-4 md:px-6 py-2.5 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab('profiles')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'profiles'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Loved Ones Directory
          </button>
          <button
            onClick={() => setActiveSubTab('vip_chat')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'vip_chat'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            VIP Loved Ones Chatroom
            {!chikondiSubscription.isSubscribed && (
              <Lock className="w-3 h-3 text-amber-400" />
            )}
          </button>
        </div>

        {activeSubTab === 'profiles' && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {filteredProfiles.length} Singles in Malawi
            </span>
          </div>
        )}
      </div>

      {/* Tab 1: Profiles Directory */}
      {activeSubTab === 'profiles' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filters Bar */}
          <div className="p-3 md:px-6 bg-slate-900/30 border-b border-slate-800/40 flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Lilongwe, Blantyre, name..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* City Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                    selectedCity === city
                      ? 'bg-slate-700 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Prompt Notice if Unsubscribed */}
          {!chikondiSubscription.isSubscribed && (
            <div className="mx-4 md:mx-6 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Private Malawian Matchmaking & Dating
                  </span>
                  <span className="text-[11px] text-slate-300">
                    To start texting, voice calling, or video dating with loved ones, pay MK 1,500 / MK 3,500 via Airtel Money or TNM Mpamba.
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setPaywallTarget(undefined);
                  setIsPaywallOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 shadow-md transition-all active:scale-95"
              >
                Join VIP Now
              </button>
            </div>
          )}

          {/* Profiles Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProfiles.map(profile => {
                const isLiked = likedProfileIds.includes(profile.id);

                return (
                  <div
                    key={profile.id}
                    className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    {/* Photo Container */}
                    <div className="relative h-64 w-full bg-slate-800">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/10">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {profile.city}, Malawi
                        </span>

                        <button
                          onClick={() => toggleLikeMalawiProfile(profile.id)}
                          className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-125 ${
                            isLiked
                              ? 'bg-rose-600 text-white shadow-lg'
                              : 'bg-black/50 text-white/80 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Info on Photo */}
                      <div className="absolute bottom-3 inset-x-3 z-10 flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-lg font-bold text-white drop-shadow">
                            {profile.name}, {profile.age}
                          </h3>
                          {profile.verified && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                          )}
                        </div>
                        <span className="text-xs text-slate-300 drop-shadow flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-indigo-400" />
                          {profile.occupation}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex flex-col gap-3">
                      {/* Looking For Tag */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Seeking:</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-medium border border-rose-500/20">
                          ❤️ {profile.lookingFor}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {profile.bio}
                      </p>

                      {/* Interests */}
                      <div className="flex flex-wrap gap-1">
                        {profile.interests.map(interest => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons: Chat, Voice Call, Video Call */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() => handleActionRequiresSubscription(profile, 'chat')}
                          className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                          Message
                        </button>
                        <button
                          onClick={() => handleActionRequiresSubscription(profile, 'voice')}
                          className="w-10 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                          title={`Voice call ${profile.name}`}
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleActionRequiresSubscription(profile, 'video')}
                          className="w-10 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                          title={`Video date call with ${profile.name}`}
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: VIP Loved Ones Chatroom */}
      {activeSubTab === 'vip_chat' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {!chikondiSubscription.isSubscribed ? (
            /* Paywall Overlay on VIP Chatroom */
            <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-rose-600/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                VIP Loved Ones Chatroom (Members Only)
              </h2>
              <p className="text-xs text-slate-300 max-w-md mt-2 leading-relaxed">
                This is the exclusive live community where Malawians connect, introduce themselves, and match directly. Pay the membership fee to join the conversation.
              </p>

              <div className="grid grid-cols-2 gap-3 my-6 max-w-sm w-full">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">7-Day Pass</span>
                  <span className="text-base font-bold text-rose-400 font-mono">MK 1,500</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Monthly VIP</span>
                  <span className="text-base font-bold text-rose-400 font-mono">MK 3,500</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPaywallTarget(undefined);
                  setIsPaywallOpen(true);
                }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-rose-600/25 active:scale-95 transition-all"
              >
                Pay with Airtel Money / Mpamba & Join Chat
              </button>
            </div>
          ) : null}

          {/* Active VIP Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div className="flex flex-col items-center justify-center py-4 text-center text-slate-400">
              <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center mb-2">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">Chikondi Malawi VIP Lounge</h3>
              <p className="text-xs text-slate-400">Respectful, verified community for Malawians seeking loved ones</p>
            </div>

            {chikondiChatMessages.map(msg => {
              const isMe = msg.senderId === 'me';
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`max-w-[80%] rounded-2xl p-3.5 ${
                    isMe
                      ? 'bg-rose-600 text-white rounded-br-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-xs'
                  }`}>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-xs font-semibold text-white">
                        {msg.senderName}
                      </span>
                      <span className={`text-[10px] ${isMe ? 'text-rose-200' : 'text-slate-400'}`}>
                        {msg.senderCity} · {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VIP Chat Message Input */}
          <form onSubmit={handleSendChatMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={chatInputText}
              onChange={e => setChatInputText(e.target.value)}
              placeholder="Write a message to Chikondi VIP Lounge..."
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Subscription Paywall Modal */}
      <ChikondiPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        targetProfileName={paywallTarget}
      />

      {/* App Owner Revenue Modal */}
      <ChikondiOwnerRevenueModal
        isOpen={isOwnerRevenueOpen}
        onClose={() => setIsOwnerRevenueOpen(false)}
      />
    </div>
  );
};
