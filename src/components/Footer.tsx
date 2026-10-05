import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Shield, Sparkles, Heart } from 'lucide-react';
import { SERVER_IP, DISCORD_URL } from '../services/minecraftApi';
import { DiscordIcon } from './DiscordIcon';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenHowToJoin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenHowToJoin,
}) => {
  const [copied, setCopied] = useState(false);

  const copyIp = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-black text-white text-sm">
                SK
              </div>
              <span className="text-lg font-black text-white uppercase tracking-wider">
                Spacekin Network
              </span>
            </div>
            <p className="text-zinc-400 max-w-sm leading-relaxed text-xs">
              Next-generation competitive Minecraft network featuring intense BoxPvP, custom enchants, balanced kits, and an active gaming community.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={copyIp}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-300 font-mono border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : SERVER_IP}</span>
              </button>
              <button
                onClick={onOpenHowToJoin}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
              >
                Join Guide
              </button>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#c8d0ff] hover:text-white border border-[#5865F2]/40 flex items-center gap-1.5 transition-colors"
              >
                <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                <span>Discord</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 font-mono text-[11px]">
              Navigation
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Server Home
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-cyan-400 transition-colors">
                  BoxPvP Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-cyan-400 transition-colors">
                  Live Status Tracker
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-cyan-400 transition-colors">
                  Rank Store (Coming Soon)
                </Link>
              </li>
              <li>
                <Link to="/gamemodes" className="hover:text-cyan-400 transition-colors">
                  Gamemodes Universe
                </Link>
              </li>
              <li>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c8d0ff] text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>Discord Community</span>
                </a>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-amber-400 text-zinc-300 flex items-center gap-1 transition-colors cursor-pointer">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Staff Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Game Modes */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 font-mono text-[11px]">
              Game Modes
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-zinc-200 font-semibold">BoxPvP</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">(Active)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Lifesteal SMP</span>
                <span className="text-[10px] text-amber-400 font-mono">(Soon)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>Practice Duels</span>
                <span className="text-[10px] text-amber-400 font-mono">(Soon)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Spacekin Network ({SERVER_IP}). All rights reserved.
          </div>
          <div className="text-center sm:text-right">
            Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
          </div>
        </div>

      </div>
    </footer>
  );
};
