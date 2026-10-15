import React, { useState } from 'react';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CallsHistoryView: React.FC = () => {
  const { callLogs, contacts, startCall } = useApp();
  const [filter, setFilter] = useState<'all' | 'missed'>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = callLogs.filter(log => {
    const contact = contacts.find(c => c.id === log.contactId);
    const matchesSearch = contact ? contact.name.toLowerCase().includes(search.toLowerCase()) : true;
    if (!matchesSearch) return false;
    if (filter === 'missed') return log.direction === 'missed';
    return true;
  });

  const formatDuration = (secs?: number) => {
    if (!secs) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden select-none">
      {/* Header */}
      <div className="h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Call History</h1>
          <p className="text-xs text-slate-400">Review recent voice and HD video calls</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Calls
          </button>
          <button
            onClick={() => setFilter('missed')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'missed' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Missed
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 px-6 border-b border-slate-800/60 bg-slate-900/40">
        <div className="relative flex items-center max-w-md">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search call logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Call Logs Feed */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 px-4 md:px-6">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm">
            <Phone className="w-8 h-8 stroke-[1.5] mb-2 text-slate-600" />
            <p>No call logs found</p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const contact = contacts.find(c => c.id === log.contactId);
            if (!contact) return null;

            return (
              <div
                key={log.id}
                className="py-3.5 flex items-center justify-between hover:bg-slate-900/50 rounded-xl px-2 transition-colors"
              >
                {/* Left: Avatar & Details */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-11 h-11 rounded-full object-cover bg-slate-800 ring-1 ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {contact.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {log.direction === 'incoming' && (
                        <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {log.direction === 'outgoing' && (
                        <PhoneOutgoing className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      {log.direction === 'missed' && (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span className={log.direction === 'missed' ? 'text-rose-400' : ''}>
                        {log.direction === 'missed' ? 'Missed Call' : log.direction === 'incoming' ? 'Incoming' : 'Outgoing'}
                      </span>
                      <span>·</span>
                      <span className="tabular-nums">{log.timestamp}</span>
                      {log.durationSeconds && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-slate-500">
                            {formatDuration(log.durationSeconds)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Callback Triggers */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startCall(contact, 'voice')}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
                    title={`Voice call ${contact.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startCall(contact, 'video')}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
                    title={`Video call ${contact.name}`}
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
