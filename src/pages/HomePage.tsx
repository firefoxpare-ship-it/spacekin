import React from 'react';
import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { DiscordBanner } from '../components/DiscordBanner';
import { MinecraftServerStatus, LeaderboardEntry } from '../types';
import { 
  Trophy, 
  Swords, 
  ShoppingBag, 
  Activity, 
  ChevronRight, 
  Wifi, 
  Sparkles,
  Heart,
  Target,
  Users
} from 'lucide-react';
import { SERVER_IP, DEFAULT_JAVA_PORT, DEFAULT_BEDROCK_PORT } from '../services/minecraftApi';

interface HomePageProps {
  serverStatus: MinecraftServerStatus | null;
  leaderboardEntries: LeaderboardEntry[];
  onOpenHowToJoin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  serverStatus,
  leaderboardEntries,
  onOpenHowToJoin
}) => {
  const isOnline = serverStatus?.online ?? true;
  const onlinePlayers = serverStatus?.players.online ?? 14;
  const maxPlayers = serverStatus?.players.max ?? 150;
  const ping = serverStatus?.ping ?? 34;

  const topThree = leaderboardEntries
    .filter((e) => e.gameMode === 'boxpvp')
    .sort((a, b) => (b.kills || 0) - (a.kills || 0))
    .slice(0, 3);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Cinematic Hero */}
      <HeroBanner
        serverStatus={serverStatus}
        onNavigateLeaderboard={() => {}}
        onNavigateStore={() => {}}
        onOpenHowToJoin={onOpenHowToJoin}
      />

      {/* Quick Telemetry & Highlights Strip */}
      <section className="py-12 bg-zinc-950 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            <Link
              to="/status"
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Server Status</span>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              </div>
              <div className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {isOnline ? 'Online & Ready' : 'Sleeping'}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                <span>View Full Telemetry</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link
              to="/status"
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Active Players</span>
                <Users className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-cyan-400 tabular-nums">
                {onlinePlayers} <span className="text-xs font-sans text-zinc-500 font-normal">/ {maxPlayers}</span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">Crossplay Java & PE</div>
            </Link>

            <Link
              to="/leaderboard"
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Top Gladiator</span>
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-300 truncate group-hover:text-amber-200 transition-colors">
                {topThree[0]?.username || 'Rankings'}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                <span>View Rankings</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link
              to="/store"
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-violet-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Rank Store</span>
                <ShoppingBag className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <div className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                VIP to Cosmic
              </div>
              <div className="text-[11px] text-violet-400 mt-1">Coming Soon · Season 1</div>
            </Link>

          </div>
        </div>
      </section>

      {/* Featured Arena Spotlight: BoxPvP */}
      <section className="py-16 md:py-20 bg-black border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
                <Swords className="w-3.5 h-3.5" />
                <span>Featured Game Mode</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-3">
                BoxPvP Season 1 is Active
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Jump into high-intensity arena warfare. Mine ores from Coal to Netherite, trade for custom kits, enchant god-tier swords, and dominate the bounty pit.
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/leaderboard"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Check Leaderboard</span>
                </Link>
                <Link
                  to="/gamemodes"
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Explore All Gamemodes</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </Link>
              </div>
            </div>

            {/* Quick Teaser Cards for Other Modes */}
            <div className="w-full lg:w-80 space-y-3 shrink-0">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Lifesteal SMP</div>
                    <div className="text-[11px] text-zinc-500">Hardcore Survival</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Soon
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Practice Duels</div>
                    <div className="text-[11px] text-zinc-500">Ranked 1v1 PvP</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Soon
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Official Discord Community Banner */}
      <DiscordBanner />
    </div>
  );
};
