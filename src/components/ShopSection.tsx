import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Crown, 
  Zap, 
  Check, 
  Clock, 
  Bell,
  Star,
  Sparkles
} from 'lucide-react';
import { ShopRank } from '../types';

export const SHOP_RANKS: ShopRank[] = [
  {
    id: 'vip',
    name: 'VIP',
    tag: 'VIP',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    glowColor: 'from-emerald-500/20 to-transparent',
    price: '$4.99',
    features: [
      '[VIP] In-Game Chat Prefix',
      '/fly command in Hub & Lobbies',
      '2x BoxPvP Coin Multiplier',
      '2 Private Ender Vaults (/pv 1-2)',
      'Emerald Particle Footsteps'
    ],
    multiplier: '2.0x Boost',
    perksSummary: 'Starter rank with lobby fly and coin boosts.',
    comingSoon: true
  },
  {
    id: 'mvp',
    name: 'MVP',
    tag: 'MVP',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    glowColor: 'from-cyan-500/20 to-transparent',
    price: '$9.99',
    features: [
      '[MVP] Cyan Glowing Prefix',
      'Priority Server Join Queue',
      '3x BoxPvP Coin Multiplier',
      '4 Private Ender Vaults (/pv 1-4)',
      'Access to /craft & /workbench',
      'Custom Join Sound Effect'
    ],
    multiplier: '3.0x Boost',
    perksSummary: 'Popular tier with priority server queue and vaults.',
    popular: true,
    comingSoon: true
  },
  {
    id: 'elite',
    name: 'ELITE',
    tag: 'ELITE',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    glowColor: 'from-amber-500/20 to-transparent',
    price: '$19.99',
    features: [
      '[ELITE] Golden Flame Prefix',
      '4x Coin & Kill Multiplier',
      '8 Private Ender Vaults (/pv 1-8)',
      '/repair & /fix command access',
      'Exclusive Elite Battle Arena Access',
      '2x Monthly Cosmetic Mystery Boxes'
    ],
    multiplier: '4.0x Boost',
    perksSummary: 'Pro fighter rank with repair commands and 8 vaults.',
    comingSoon: true
  },
  {
    id: 'cosmic',
    name: 'COSMIC',
    tag: 'COSMIC',
    color: 'text-violet-400',
    badgeBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    glowColor: 'from-violet-500/30 to-transparent',
    price: '$39.99',
    features: [
      '★ COSMIC ★ Ultimate Prefix',
      '6x Ultra Coin Multiplier',
      'Unlimited /pv Private Vaults',
      'Custom Death & Kill Broadcasts',
      'Access to All Particle Auras',
      'Private Discord VIP Lounge'
    ],
    multiplier: '6.0x Boost',
    perksSummary: 'The ultimate space rank with all cosmetic perks unlocked.',
    comingSoon: true
  }
];

export const ShopSection: React.FC = () => {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail.trim()) {
      setNotified(true);
      setTimeout(() => setNotified(false), 4000);
      setNotifyEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-zinc-950 border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-violet-400 mb-2 flex items-center justify-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Server Store Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Ranks & Perks
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Support Spacekin development and unlock cosmetic perks. Shop launches with Season 1.
          </p>
          
          {/* Notification bar */}
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-medium text-violet-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Store Launching Soon — Payment gateway in integration</span>
          </div>
        </div>

        {/* Rank Cards Grid (Responsive, high contrast, clean) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {SHOP_RANKS.map((rank) => (
            <div
              key={rank.id}
              className={`relative rounded-3xl bg-zinc-900/60 border ${
                rank.popular ? 'border-cyan-500/40 shadow-xl shadow-cyan-950/20' : 'border-white/5'
              } p-6 flex flex-col justify-between backdrop-blur-md transition-all hover:border-white/20`}
            >
              {/* Popular badge */}
              {rank.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-zinc-950 font-bold text-[10px] tracking-wider uppercase shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${rank.badgeBg}`}>
                    {rank.tag}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {rank.multiplier}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-black text-white">{rank.name}</div>
                  <div className="text-sm font-semibold text-zinc-400">{rank.price}</div>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{rank.perksSummary}</p>
                </div>

                {/* Features List */}
                <div className="space-y-2 py-4 border-t border-white/5">
                  {rank.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Coming soon state */}
              <div className="pt-4 border-t border-white/5">
                <button
                  disabled
                  className="w-full h-11 rounded-xl bg-zinc-800/80 border border-white/5 text-zinc-400 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Coming Soon</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe / Email Alert Box */}
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-zinc-900/40 border border-white/5 text-center">
          <div className="text-sm font-bold text-white mb-1">Get Notified at Store Launch</div>
          <p className="text-xs text-zinc-400 mb-4">Be the first to claim early-bird discounts and exclusive cosmetic tags.</p>
          
          {notified ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              ✓ Thanks! You will receive launch alerts for Spacekin ranks.
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notify Me</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
