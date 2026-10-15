import React, { useState } from 'react';
import { Search, Plus, CheckCheck, Mic, Image as ImageIcon, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoriesBar } from './StoriesBar';
import { AppLogo } from './AppLogo';

export const ChatList: React.FC = () => {
  const {
    contacts,
    activeContactId,
    setActiveContactId,
    messages
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');

  const filteredContacts = contacts.filter(contact => {
    // Search match
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Filter match
    const contactMessages = messages[contact.id] || [];
    const hasUnread = contactMessages.some(m => m.senderId !== 'me' && m.status !== 'read');

    if (filter === 'unread') return hasUnread;
    if (filter === 'groups') return !!contact.isGroup;
    return true;
  });

  return (
    <div className="flex flex-col h-full w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800/80 shrink-0 select-none">
      {/* Top Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppLogo size="sm" />
          <h1 className="text-lg font-bold tracking-tight text-white">Macheza Pa Air</h1>
        </div>
        <button
          onClick={() => {
            const next = contacts.find(c => c.id !== activeContactId);
            if (next) setActiveContactId(next.id);
          }}
          className="w-8 h-8 rounded-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white flex items-center justify-center transition-all"
          title="Start Conversation"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Stories Rail */}
      <StoriesBar />

      {/* Search Bar */}
      <div className="px-4 py-2.5">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations & contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Segmented Filter Controls */}
      <div className="flex items-center gap-1 px-4 py-1.5 border-b border-slate-800/50">
        {(['all', 'unread', 'groups'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${
              filter === tab
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conversation Rows List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/30">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs p-4 text-center">
            <p>No conversations found</p>
          </div>
        ) : (
          filteredContacts.map(contact => {
            const thread = messages[contact.id] || [];
            const lastMsg = thread[thread.length - 1];
            const unreadCount = thread.filter(m => m.senderId !== 'me' && m.status !== 'read').length;
            const isSelected = activeContactId === contact.id;

            return (
              <button
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/10 border-l-2 border-indigo-500'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                {/* Contact Avatar + Status Dot */}
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover bg-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  {contact.isGroup ? (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 border-2 border-slate-900 rounded-full flex items-center justify-center text-[10px] text-white">
                      <Users className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        contact.status === 'online'
                          ? 'bg-emerald-500'
                          : contact.status === 'busy'
                          ? 'bg-amber-500'
                          : 'bg-slate-500'
                      }`}
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold text-slate-100 truncate">
                      {contact.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
                      {lastMsg ? lastMsg.timestamp : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                      {lastMsg?.senderId === 'me' && (
                        <CheckCheck className={`w-3.5 h-3.5 shrink-0 ${
                          lastMsg.status === 'read' ? 'text-indigo-400' : 'text-slate-500'
                        }`} />
                      )}
                      {lastMsg?.audioUrl ? (
                        <span className="flex items-center gap-1 text-indigo-300">
                          <Mic className="w-3 h-3" /> Voice note ({lastMsg.audioDuration || 8}s)
                        </span>
                      ) : lastMsg?.imageUrl ? (
                        <span className="flex items-center gap-1 text-slate-300">
                          <ImageIcon className="w-3 h-3" /> Photo
                        </span>
                      ) : (
                        lastMsg?.text || contact.bio
                      )}
                    </p>

                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-500 text-white rounded-full shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
