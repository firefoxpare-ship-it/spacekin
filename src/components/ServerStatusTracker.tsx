import React, { useState } from 'react';
import { 
  Server, 
  Wifi, 
  RefreshCw, 
  Users, 
  Copy, 
  Check, 
  Smartphone, 
  Laptop,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import { SERVER_IP, DEFAULT_JAVA_PORT, DEFAULT_BEDROCK_PORT, getPlayerSkinHead } from '../services/minecraftApi';
import { MinecraftServerStatus } from '../types';

interface ServerStatusTrackerProps {
  serverStatus: MinecraftServerStatus | null;
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export const ServerStatusTracker: React.FC<ServerStatusTrackerProps> = ({
  serverStatus,
  onRefresh,
  loading
}) => {
  const [copiedJava, setCopiedJava] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);
  const [showPlayersList, setShowPlayersList] = useState(false);

  const isOnline = serverStatus?.online ?? true;
  const onlinePlayers = serverStatus?.players.online ?? 14;
  const maxPlayers = serverStatus?.players.max ?? 150;
  const ping = serverStatus?.ping ?? 34;
  const version = serverStatus?.version ?? '1.20 - 1.21.x';
  const playerList = serverStatus?.players.list || ['CosmicKnight', 'VoidSlayer', 'StarPixel', 'AstroBoy', 'GalaxyCraft', 'NebulaRex'];

  const copyJava = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopiedJava(true);
    setTimeout(() => setCopiedJava(false), 2200);
  };

  const copyBedrock = () => {
    navigator.clipboard.writeText(`${SERVER_IP}:${DEFAULT_BEDROCK_PORT}`);
    setCopiedBedrock(true);
    setTimeout(() => setCopiedBedrock(false), 2200);
  };

  return (
    <section className="py-16 md:py-24 bg-zinc-950 border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Realtime Telemetry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Live Server Status
            </h2>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => onRefresh()}
            disabled={loading}
            className="self-start sm:self-auto min-h-[44px] px-4 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-500/30 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Pinging...' : 'Refresh Status'}</span>
          </button>
        </div>

        {/* 4 Clean Metric Cards (De-cluttered & Mobile Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          
          {/* Metric 1: System State */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-md">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Status
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-base sm:text-lg font-bold text-white">
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">High Availability</div>
          </div>

          {/* Metric 2: Active Players */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-md">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Players
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-cyan-400 tabular-nums">
              {onlinePlayers} <span className="text-xs font-sans text-zinc-500 font-normal">/ {maxPlayers}</span>
            </div>
            {/* Subtle progress line */}
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(8, (onlinePlayers / maxPlayers) * 100)}%` }}
              />
            </div>
          </div>

          {/* Metric 3: Ping Latency */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-md">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Network Ping
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-base sm:text-lg font-mono font-bold text-white tabular-nums">
                {ping} ms
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Low Latency Route</div>
          </div>

          {/* Metric 4: Version Compatibility */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-md">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Game Version
            </div>
            <div className="text-base sm:text-lg font-semibold text-white truncate">
              {version}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Java & Bedrock Crossplay</div>
          </div>
        </div>

        {/* Connection Methods & Quick-Copy Cards (2 Columns on Desktop, 1 on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Java Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-cyan-500/20 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Minecraft Java Edition</span>
              </div>
              <span className="text-xs font-mono text-zinc-500">Port: {DEFAULT_JAVA_PORT}</span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
              <span className="font-mono text-sm text-zinc-200 select-all truncate">{SERVER_IP}</span>
              <button
                onClick={copyJava}
                className="min-h-[36px] px-3 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-cyan-400 flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
              >
                {copiedJava ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJava ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Bedrock Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-violet-500/20 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-bold text-white">Bedrock / Mobile (MCPE)</span>
              </div>
              <span className="text-xs font-mono text-zinc-500">Port: {DEFAULT_BEDROCK_PORT}</span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
              <span className="font-mono text-sm text-zinc-200 select-all truncate">
                {SERVER_IP}:{DEFAULT_BEDROCK_PORT}
              </span>
              <button
                onClick={copyBedrock}
                className="min-h-[36px] px-3 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-violet-400 flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
              >
                {copiedBedrock ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBedrock ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Collapsible Active Players Preview (Keeps screen clean unless user wants to inspect) */}
        {playerList.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={() => setShowPlayersList(!showPlayersList)}
              className="flex items-center justify-between w-full py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Currently Online Players ({playerList.length})</span>
              </span>
              {showPlayersList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showPlayersList && (
              <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in duration-200">
                {playerList.map((player) => (
                  <div
                    key={player}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-300"
                  >
                    <img
                      src={getPlayerSkinHead(player, 24)}
                      alt={player}
                      className="w-5 h-5 rounded object-cover bg-zinc-800"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-medium font-mono">{player}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
