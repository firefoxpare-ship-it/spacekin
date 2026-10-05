import React from 'react';
import { DISCORD_URL } from '../services/minecraftApi';
import { DiscordIcon } from './DiscordIcon';
import { Users, Sparkles, MessageSquare, Shield, Gift, ChevronRight } from 'lucide-react';

export const DiscordBanner: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-black relative border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#5865F2]/20 via-[#5865F2]/10 to-transparent border border-[#5865F2]/30 p-6 sm:p-10 overflow-hidden shadow-2xl shadow-[#5865F2]/10">
          
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#5865F2]/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#c8d0ff] text-xs font-semibold uppercase tracking-wider mb-3">
                <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                <span>Official Discord Server</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Join the Spacekin Community
              </h3>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                Connect with thousands of BoxPvP players, participate in weekly rank giveaways, report bugs directly to staff, and receive instant server update announcements.
              </p>

              {/* Quick Perks Pill Row */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Weekly Giveaways</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>24/7 Ticket Support</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                  <span>PvP Discussion & Clips</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="shrink-0 w-full sm:w-auto">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[52px] px-8 rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-[#5865F2]/30 transition-all active:scale-95 group"
              >
                <DiscordIcon className="w-5 h-5 text-white" />
                <span>Join Discord Server</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
