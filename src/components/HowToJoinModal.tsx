import React, { useState } from 'react';
import { Laptop, Smartphone, Copy, Check, X, ShieldCheck } from 'lucide-react';
import { SERVER_IP, DEFAULT_JAVA_PORT, DEFAULT_BEDROCK_PORT, DISCORD_URL } from '../services/minecraftApi';
import { DiscordIcon } from './DiscordIcon';

interface HowToJoinModalProps {
  onClose: () => void;
}

export const HowToJoinModal: React.FC<HowToJoinModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'java' | 'bedrock'>('java');
  const [copied, setCopied] = useState(false);

  const copyIp = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const copyBedrockFull = () => {
    navigator.clipboard.writeText(`${SERVER_IP}:${DEFAULT_BEDROCK_PORT}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">How to Connect</h3>
              <p className="text-xs text-zinc-400">Join Spacekin Network in seconds</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Java vs Bedrock Tabs */}
        <div className="mt-4 flex gap-1 p-1 bg-zinc-950 rounded-2xl border border-white/5">
          <button
            onClick={() => setTab('java')}
            className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'java'
                ? 'bg-cyan-500 text-zinc-950 font-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Java (PC)</span>
          </button>
          <button
            onClick={() => setTab('bedrock')}
            className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'bedrock'
                ? 'bg-violet-600 text-white font-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Bedrock / Mobile</span>
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          {tab === 'java' ? (
            <ol className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong>Launch Minecraft Java Edition</strong> (Version 1.20 - 1.21.x recommended).
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                <div>
                  Click <strong>Multiplayer</strong> → <strong>Add Server</strong>.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                <div className="flex-1">
                  Name it <strong className="text-white">Spacekin Network</strong> and enter the server IP:
                  <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-cyan-500/30 font-mono text-cyan-300">
                    <span className="font-bold select-all truncate">{SERVER_IP}</span>
                    <button
                      onClick={copyIp}
                      className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
                <div>
                  Click <strong>Done</strong>, select Spacekin, and click <strong>Join Server</strong>!
                </div>
              </li>
            </ol>
          ) : (
            <ol className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                <div>
                  Open Minecraft on your <strong>Phone, Tablet, Xbox, PS, or Windows Bedrock</strong>.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                <div>
                  Tap <strong>Play</strong> → select the <strong>Servers</strong> tab.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                <div className="flex-1">
                  Scroll down and tap <strong>Add Server</strong>:
                  <div className="mt-2 space-y-2">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Server Name:</span>
                      <strong className="text-white font-mono">Spacekin</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Server Address:</span>
                      <strong className="text-cyan-300 select-all truncate">{SERVER_IP}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Port:</span>
                      <strong className="text-violet-400">{DEFAULT_BEDROCK_PORT}</strong>
                    </div>
                  </div>
                  <button
                    onClick={copyBedrockFull}
                    className="mt-2 w-full py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied IP & Port!' : 'Copy Bedrock Connection Info'}</span>
                  </button>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/80 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
                <div>
                  Tap <strong>Save</strong> or <strong>Play</strong> to connect instantly!
                </div>
              </li>
            </ol>
          )}

          <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row gap-2">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[44px] rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-[#c8d0ff] hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
              <span>Need Help? Join Discord</span>
            </a>
            <button
              onClick={onClose}
              className="flex-1 min-h-[44px] rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Got it, let's play!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
