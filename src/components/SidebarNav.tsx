import React from 'react';
import { MessageSquare, Camera, Phone, Users, Settings, PhoneCall, Video, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';

export const SidebarNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    simulateIncomingCall,
    activeCall,
    messages
  } = useApp();

  // Compute unread message count
  const unreadCount = Object.values(messages).reduce((acc, thread) => {
    return acc + thread.filter(m => m.senderId !== 'me' && m.status !== 'read').length;
  }, 0);

  const navItems = [
    { id: 'chats', label: 'Chats', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'chikondi', label: 'Chikondi', icon: Heart, badge: 'MW' },
    { id: 'stories', label: 'Stories', icon: Camera, badge: 'New' },
    { id: 'calls', label: 'Calls', icon: Phone, badge: null },
    { id: 'contacts', label: 'Contacts', icon: Users, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ] as const;

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col items-center justify-between w-20 py-6 bg-slate-900 border-r border-slate-800/80 z-20 shrink-0 select-none">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* App Brand Logo */}
          <button
            onClick={() => setActiveTab('chats')}
            className="group relative flex items-center justify-center p-0.5 rounded-2xl hover:scale-105 active:scale-95 transition-transform"
            title="Macheza Pa Air"
          >
            <AppLogo size="md" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-3 w-full px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] tracking-tight mt-1 leading-none">{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Incoming Call Simulation Button & User Avatar */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          {!activeCall && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => simulateIncomingCall('elena', 'video')}
                className="group flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-violet-950/70 text-violet-300 hover:bg-violet-900 border border-violet-800/40 transition-colors"
                title="Simulate Incoming Video Call"
              >
                <Video className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => simulateIncomingCall('marcus', 'voice')}
                className="group flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/40 transition-colors"
                title="Simulate Incoming Voice Call"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className="relative group w-11 h-11 rounded-full overflow-hidden ring-2 ring-slate-700 hover:ring-indigo-500 transition-all"
            title={`${currentUser.name} (${currentUser.username})`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar (thumb navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 z-30 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] transition-colors ${
                isActive ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-2 px-1 py-0.2 text-[9px] font-bold bg-indigo-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
