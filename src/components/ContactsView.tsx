import React, { useState } from 'react';
import { Search, MessageSquare, Phone, Video, UserPlus, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactsView: React.FC = () => {
  const {
    contacts,
    setActiveContactId,
    setActiveTab,
    startCall
  } = useApp();

  const [search, setSearch] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.username.toLowerCase().includes(search.toLowerCase()) ||
    contact.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartChat = (contactId: string) => {
    setActiveContactId(contactId);
    setActiveTab('chats');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden select-none">
      {/* Header */}
      <div className="h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Contacts</h1>
          <p className="text-xs text-slate-400">People & groups you connect with</p>
        </div>

        <button
          onClick={() => {}}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
          Add Contact
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 px-6 border-b border-slate-800/60 bg-slate-900/40">
        <div className="relative flex items-center max-w-md">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, handle, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Contacts List Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
            >
              {/* Header Info */}
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-13 h-13 rounded-full object-cover bg-slate-800"
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

                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">
                    {contact.name}
                  </span>
                  <span className="text-xs text-indigo-400 truncate">
                    @{contact.username}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {contact.bio}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => handleStartChat(contact.id)}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  Message
                </button>
                <button
                  onClick={() => startCall(contact, 'voice')}
                  className="w-9 h-8 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                  title="Voice Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => startCall(contact, 'video')}
                  className="w-9 h-8 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                  title="Video Call"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
