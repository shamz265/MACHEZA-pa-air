import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowDownLeft,
  Smartphone,
  CreditCard,
  Download,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChikondiOwnerRevenueModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { totalOwnerRevenueMWK, revenueTransactions } = useApp();
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutNumber, setPayoutNumber] = useState('+265 991 000 000');

  if (!isOpen) return null;

  const airtelCount = revenueTransactions.filter(t => t.method === 'airtel_money').length;
  const mpambaCount = revenueTransactions.filter(t => t.method === 'tnm_mpamba').length;
  const cardCount = revenueTransactions.filter(t => t.method === 'card').length;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              App Owner Revenue Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              Live earnings collected from users subscribing to join Chikondi Loved Ones
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 tabular-nums">
              MK {totalOwnerRevenueMWK.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">Malawian Kwacha collected</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Paid VIP Members
            </span>
            <span className="text-2xl font-black text-white font-mono mt-1 tabular-nums">
              {revenueTransactions.length}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">Active paid subscriptions</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Avg. Per Member
            </span>
            <span className="text-2xl font-black text-rose-400 font-mono mt-1 tabular-nums">
              MK {revenueTransactions.length > 0 ? Math.round(totalOwnerRevenueMWK / revenueTransactions.length).toLocaleString() : '0'}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">Per subscriber yield</span>
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-300">Revenue Channels</span>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-red-400 font-medium block">Airtel Money</span>
              <span className="text-base font-bold text-white tabular-nums">{airtelCount} payments</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-emerald-400 font-medium block">TNM Mpamba</span>
              <span className="text-base font-bold text-white tabular-nums">{mpambaCount} payments</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-indigo-400 font-medium block">Bank Card / Visa</span>
              <span className="text-base font-bold text-white tabular-nums">{cardCount} payments</span>
            </div>
          </div>
        </div>

        {/* Recent Subscriber Transactions Ledger */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Recent Member Subscriptions</span>
            <span className="text-[11px] text-slate-500">Auto-credited to owner wallet</span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto rounded-xl bg-slate-950/60 border border-slate-800/80 p-2">
            {revenueTransactions.map(tx => (
              <div key={tx.id} className="py-2.5 px-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.method === 'airtel_money' ? 'bg-red-950 text-red-400' : tx.method === 'tnm_mpamba' ? 'bg-emerald-950 text-emerald-400' : 'bg-indigo-950 text-indigo-400'
                  }`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{tx.userName}</span>
                    <span className="text-[10px] text-slate-400">{tx.phone} · {tx.planName}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums">
                    +MK {tx.amountMWK.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">{tx.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout to Mobile Money Form */}
        <form onSubmit={handleRequestPayout} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col gap-3">
          <span className="text-xs font-semibold text-white">
            Withdraw Your Earnings to Airtel Money / Mpamba / Bank
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={payoutNumber}
              onChange={e => setPayoutNumber(e.target.value)}
              placeholder="+265 99X XXX XXX"
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Withdraw MK {totalOwnerRevenueMWK.toLocaleString()}
            </button>
          </div>
          {payoutSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Payout request initiated! Funds will credit your Airtel/Mpamba wallet within 5 minutes.
            </span>
          )}
        </form>
      </div>
    </div>
  );
};
