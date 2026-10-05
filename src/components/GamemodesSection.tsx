import React from 'react';
import { Swords, Flame, Heart, Target, ChevronRight, Check } from 'lucide-react';

interface GamemodesSectionProps {
  onNavigateBoxPvP: () => void;
}

export const GamemodesSection: React.FC<GamemodesSectionProps> = ({ onNavigateBoxPvP }) => {
  return (
    <section className="py-16 md:py-24 bg-black relative border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
            Game Universe
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Available Gamemodes
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Tailored combat realms designed for peak performance and latency.
          </p>
        </div>

        {/* 3 Gamemode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: BoxPvP (Active & Ready) */}
          <div className="rounded-3xl bg-zinc-900/70 border border-cyan-500/40 p-6 flex flex-col justify-between shadow-xl shadow-cyan-950/20 backdrop-blur-md relative group hover:border-cyan-400 transition-all">
            <div className="absolute top-6 right-6">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Now
              </span>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
                <Swords className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-black text-white uppercase mb-1">
                BoxPvP Season 1
              </h3>
              <div className="text-xs text-cyan-400 font-mono mb-3">
                Fast Mining · PvP Combat · Prestige
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Fast-paced enclosed arena. Mine progression blocks, trade for cosmic gear, and claim bounty rewards in the pit.
              </p>

              <div className="space-y-2 py-3 border-t border-white/5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Custom block progression</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>50 Prestige levels & kill streaks</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button
                onClick={onNavigateBoxPvP}
                className="w-full min-h-[44px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>View BoxPvP Leaderboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Lifesteal SMP (Coming Soon) */}
          <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 flex flex-col justify-between backdrop-blur-md opacity-90">
            <div className="flex justify-end mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-white/5">
                Coming Soon
              </span>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
                <Heart className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-black text-white uppercase mb-1">
                Lifesteal SMP
              </h3>
              <div className="text-xs text-red-400 font-mono mb-3">
                Hardcore Survival · Heart Steal
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Defeat enemies to steal their max health hearts. Team up to build fortress bases and craft heart crystals.
              </p>

              <div className="space-y-2 py-3 border-t border-white/5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>Custom heart crafting recipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>Base raiding with TNT mechanics</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="w-full min-h-[44px] rounded-xl bg-zinc-850/60 text-zinc-500 font-medium text-xs uppercase tracking-wider flex items-center justify-center">
                Under Active Build
              </div>
            </div>
          </div>

          {/* Card 3: Practice Duels (Coming Soon) */}
          <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 flex flex-col justify-between backdrop-blur-md opacity-90">
            <div className="flex justify-end mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-white/5">
                Coming Soon
              </span>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <Target className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-black text-white uppercase mb-1">
                Competitive Duels
              </h3>
              <div className="text-xs text-amber-400 font-mono mb-3">
                1v1 Ranked · Crystal · Nodebuff
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Sharpen mechanics with ranked 1v1 ladders, custom kits, zero ghost hits, and fluid knockback.
              </p>

              <div className="space-y-2 py-3 border-t border-white/5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Ranked ELO competitive tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Instant rematches & party fights</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="w-full min-h-[44px] rounded-xl bg-zinc-850/60 text-zinc-500 font-medium text-xs uppercase tracking-wider flex items-center justify-center">
                Queued for Deployment
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
