import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Check,
  Smartphone,
  CreditCard,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetProfileName?: string;
}

export const ChikondiPaywallModal: React.FC<Props> = ({ isOpen, onClose, targetProfileName }) => {
  const { subscribeToChikondi } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'lifetime'>('monthly');
  const [selectedMethod, setSelectedMethod] = useState<'airtel_money' | 'tnm_mpamba' | 'card'>('airtel_money');
  const [phoneNumber, setPhoneNumber] = useState('+265 99');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'weekly',
      name: '7-Day Pass',
      price: 'MK 1,500',
      period: '7 days',
      desc: 'Quick trial access to Loved Ones chat & matches'
    },
    {
      id: 'monthly',
      name: 'Monthly VIP Matchmaker',
      price: 'MK 3,500',
      period: '30 days',
      popular: true,
      desc: 'Full access to VIP Lounge, 1-on-1 calls & verified match badge'
    },
    {
      id: 'lifetime',
      name: 'Lifetime Chikondi Gold',
      price: 'MK 10,000',
      period: 'Permanent',
      desc: 'One-time fee. Unlimited messaging & video calls forever'
    }
  ] as const;

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (selectedMethod === 'airtel_money') {
      setProcessingStep('Sending Airtel Money push prompt to handset...');
      setTimeout(() => {
        setProcessingStep('Awaiting 4-digit PIN confirmation on your phone...');
      }, 1200);
    } else if (selectedMethod === 'tnm_mpamba') {
      setProcessingStep('Connecting to TNM Mpamba USSD gateway...');
      setTimeout(() => {
        setProcessingStep('Authorizing wallet payment on handset...');
      }, 1200);
    } else {
      setProcessingStep('Securing bank transaction with 3D Secure...');
    }

    setTimeout(() => {
      setProcessingStep('Payment Approved! Unlocking VIP Lounge...');
      subscribeToChikondi(selectedPlan, selectedMethod, phoneNumber);
      setSuccess(true);
      setIsProcessing(false);

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Lockup */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Heart className="w-7 h-7 fill-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Join Chikondi Malawi VIP
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-sm">
              {targetProfileName
                ? `To text, call, or chat directly with ${targetProfileName}, join the exclusive Malawian loved ones community.`
                : 'Connect with verified Malawian singles in Lilongwe, Blantyre, Mzuzu & Zomba looking for marriage & true companionship.'}
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex flex-col items-center text-center gap-3 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-white">Takulandirani! Payment Approved</h3>
            <p className="text-xs text-emerald-200">
              Your VIP Loved Ones membership is active. You can now chat, message, and call anyone!
            </p>
          </div>
        ) : (
          <form onSubmit={handlePayNow} className="flex flex-col gap-5">
            {/* Subscription Plans */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">Choose Membership Plan</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {plans.map(p => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`relative p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-600/10'
                          : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600'
                      }`}
                    >
                      {'popular' in p && p.popular && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold tracking-tight">
                          POPULAR
                        </span>
                      )}
                      <div>
                        <span className="text-xs font-bold text-white block">{p.name}</span>
                        <span className="text-base font-black text-rose-400 mt-0.5 block tabular-nums">
                          {p.price}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 leading-tight">
                        {p.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">Pay With (Malawi Payment Gateway)</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('airtel_money');
                    setPhoneNumber('+265 99');
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'airtel_money'
                      ? 'bg-red-950/40 border-red-500 text-red-400 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-red-500" />
                  <span className="text-[11px]">Airtel Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('tnm_mpamba');
                    setPhoneNumber('+265 88');
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'tnm_mpamba'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px]">TNM Mpamba</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-400 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span className="text-[11px]">Bank / Card</span>
                </button>
              </div>
            </div>

            {/* Mobile Money Phone Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {selectedMethod === 'airtel_money'
                  ? 'Airtel Money Mobile Number'
                  : selectedMethod === 'tnm_mpamba'
                  ? 'TNM Mpamba Mobile Number'
                  : 'Bank Card / Account Contact'}
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+265 99X XXX XXX"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500">
                You will receive an instant USSD PIN prompt on your phone to authorize payment.
              </span>
            </div>

            {/* Benefits Included */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Unlimited 1-on-1 texting and love notes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Voice & HD video dating calls with Malawian matches</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Instant access to the VIP Loved Ones Group Chat</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {processingStep}
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay with {selectedMethod === 'airtel_money' ? 'Airtel Money' : selectedMethod === 'tnm_mpamba' ? 'TNM Mpamba' : 'Card'} & Unlock VIP
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
