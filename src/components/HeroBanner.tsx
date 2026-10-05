import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Copy, 
  Check, 
  Trophy, 
  ChevronRight,
  Wifi,
  Swords,
  Sparkles
} from 'lucide-react';
import { SERVER_IP, DISCORD_URL } from '../services/minecraftApi';
import { MinecraftServerStatus } from '../types';
import { DiscordIcon } from './DiscordIcon';

interface HeroBannerProps {
  serverStatus: MinecraftServerStatus | null;
  onNavigateLeaderboard: () => void;
  onNavigateStore: () => void;
  onOpenHowToJoin: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  serverStatus,
  onNavigateLeaderboard,
  onNavigateStore,
  onOpenHowToJoin
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const isOnline = serverStatus?.online ?? true;
  const playerCount = serverStatus?.players.online ?? 14;
  const maxPlayers = serverStatus?.players.max ?? 150;
  const ping = serverStatus?.ping ?? 34;

  return (
    <div className="relative min-h-[520px] md:min-h-[620px] flex items-center justify-center overflow-hidden border-b border-white/5 bg-black">
      {/* Background Cinematic Space Image with Deep Dark Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/spacekin_cosmic_hero_1791212164786.jpg"
          alt="Spacekin Cosmic Void"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transform animate-pulse duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Layered dark gradients for contrast and anti-clutter */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/70 to-black" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-center flex flex-col items-center">
        
        {/* Live Status Pill with Minimalist Anti-Pill Discipline */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md mb-6 shadow-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </span>
          <span className="text-xs font-medium text-zinc-300">
            {isOnline ? 'Server Online' : 'Server Sleeping'}
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-xs font-mono font-medium text-emerald-400 tabular-nums">
            {playerCount}/{maxPlayers} Online
          </span>
          <span className="hidden sm:inline text-zinc-600">·</span>
          <span className="hidden sm:flex items-center gap-1 text-xs text-zinc-400">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <span className="font-mono tabular-nums">{ping}ms</span>
          </span>
        </div>

        {/* Hero Title with Balanced Leading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase mb-4 text-balance">
          BATTLE BEYOND <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
            THE STARS
          </span>
        </h1>

        {/* Subtitle with High Legibility */}
        <p className="max-w-xl text-sm sm:text-base text-zinc-400 mb-8 leading-relaxed font-normal">
          Join India's premier cosmic Minecraft server. Dominate the fast-paced <span className="text-cyan-300 font-medium">BoxPvP</span> arena, climb the global leaderboards, and conquer the void.
        </p>

        {/* Primary Interactive IP Box (Engineered for Mobile 1-Tap & Desktop Precision) */}
        <div className="w-full max-w-lg mb-8">
          <div className="relative p-1.5 sm:p-2 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 hover:border-cyan-400/60 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl transition-all">
            <button
              onClick={handleCopyIp}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-950/80 hover:bg-zinc-950 border border-white/5 text-left group transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
                    Click / Tap to copy Server IP
                  </div>
                  <div className="font-mono text-base sm:text-lg font-bold text-white tracking-wide truncate group-hover:text-cyan-300 transition-colors">
                    {SERVER_IP}
                  </div>
                </div>
              </div>

              {/* Copy indicator */}
              <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-zinc-950 transition-all font-semibold text-xs">
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden xs:inline">COPY</span>
                  </>
                )}
              </div>
            </button>
          </div>
          
          <div className="mt-2.5 flex items-center justify-center gap-4 text-xs text-zinc-500">
            <span>Java: <strong className="text-zinc-400 font-mono">25565</strong></span>
            <span>·</span>
            <span>Bedrock: <strong className="text-zinc-400 font-mono">19132</strong></span>
            <span>·</span>
            <span>Version: <strong className="text-zinc-400">1.20 - 1.21.x</strong></span>
          </div>
        </div>

        {/* Action Buttons (Generous Touch Hitboxes) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            to="/leaderboard"
            className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>BoxPvP Leaderboard</span>
          </Link>

          <button
            onClick={onOpenHowToJoin}
            className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-white/10 hover:border-white/20 text-zinc-200 font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>How to Connect</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[48px] px-5 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 hover:border-[#5865F2]/70 text-[#c8d0ff] hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-[#5865F2]/10"
          >
            <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
            <span>Join Discord</span>
          </a>
        </div>

      </div>
    </div>
  );
};
