import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Shield, 
  LogIn, 
  LogOut, 
  Copy, 
  Check, 
  Menu, 
  X, 
  Sparkles,
  Server,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SERVER_IP, DISCORD_URL, getPlayerSkinHead } from '../services/minecraftApi';
import { MinecraftServerStatus } from '../types';
import { DiscordIcon } from './DiscordIcon';
import { GoogleIcon } from './GoogleIcon';

interface NavbarProps {
  serverStatus: MinecraftServerStatus | null;
  onOpenAdmin: () => void;
  onOpenHowToJoin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  serverStatus,
  onOpenAdmin,
  onOpenHowToJoin,
}) => {
  const { currentUser, userProfile, isAdmin, loginWithGoogle, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const location = useLocation();

  const copyServerIp = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/status', label: 'Server Status' },
    { path: '/store', label: 'Rank Store' },
    { path: '/gamemodes', label: 'Gamemodes' },
  ];

  const avatarSrc = userProfile?.minecraftUsername
    ? getPlayerSkinHead(userProfile.minecraftUsername, 40)
    : currentUser?.photoURL || 'https://mc-heads.net/avatar/Steve/40';

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand Wordmark (Links to Home) */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20 group-hover:shadow-cyan-500/30 transition-all">
                <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                  <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                    SK
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-wider text-base text-white group-hover:text-cyan-300 transition-colors">
                    SPACEKIN
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </Link>
          </div>

          {/* Zone 2: Navigation Links (Multi-Page Routing) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-semibold">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative py-1 transition-colors whitespace-nowrap ${
                    isActive ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Copy IP Button (Desktop & Tablet) */}
            <button
              onClick={copyServerIp}
              title="Click to copy server IP"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer group shadow-sm active:scale-95"
            >
              <span className="text-zinc-400 group-hover:text-cyan-400 transition-colors">
                {SERVER_IP}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400" />
              )}
            </button>

            {/* Discord Community Button */}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-[#c8d0ff] hover:text-white text-xs font-semibold transition-all active:scale-95 shadow-sm"
              title="Join Spacekin Discord Community"
            >
              <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2]" />
              <span className="hidden sm:inline">Discord</span>
            </a>

            {/* Admin Badge/Trigger if authorized */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/40 text-red-300 hover:text-white hover:border-red-400 text-xs font-semibold transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>Admin</span>
              </button>
            )}

            {/* User Profile / Google Sign-In */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-2 p-1 rounded-lg bg-zinc-900/80 border border-white/5 hover:border-white/20 transition-all text-left cursor-pointer"
                >
                  <img
                    src={avatarSrc}
                    alt={userProfile?.displayName || 'User'}
                    className="w-7 h-7 rounded-md bg-zinc-800 object-cover"
                  />
                  <span className="hidden xl:inline text-xs font-medium text-zinc-200 truncate max-w-[90px]">
                    {userProfile?.minecraftUsername || userProfile?.displayName?.split(' ')[0] || 'Player'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 border border-white/20 text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer shadow-sm hover:shadow-cyan-500/10"
                title="Sign in with Google"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Button (Min 44x44px hitbox) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Full Screen Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-black/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-6">
            {/* Server Quick Connect Card on Mobile */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-cyan-500/20 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Server IP Address</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {serverStatus?.players?.online ?? 14} Online
                </span>
              </div>
              <button
                onClick={copyServerIp}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-white/10 hover:border-cyan-500/50 text-left transition-all active:scale-95 cursor-pointer"
              >
                <span className="font-mono text-sm font-semibold text-white tracking-wide">{SERVER_IP}</span>
                <span className="flex items-center gap-1 text-xs text-cyan-400">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>

            {/* Mobile Multi-Page Nav Links */}
            <div className="space-y-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full min-h-[48px] px-4 rounded-xl flex items-center justify-between text-base font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-300'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer Area */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            {/* User Profile or Google Sign-In on Mobile */}
            {!currentUser ? (
              <button
                onClick={() => {
                  handleGoogleLogin();
                  setMobileMenuOpen(false);
                }}
                disabled={authLoading}
                className="w-full h-12 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-lg shadow-white/5 cursor-pointer"
              >
                <GoogleIcon className="w-5 h-5 shrink-0" />
                <span>Sign in with Google</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={avatarSrc}
                    alt={userProfile?.displayName || 'User'}
                    className="w-9 h-9 rounded-lg bg-zinc-800 object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">
                      {userProfile?.displayName || 'Space Explorer'}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      {userProfile?.minecraftUsername || 'Player'} · <span className="text-cyan-400 font-bold">{userProfile?.role || 'Player'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-[#c8d0ff] hover:text-white font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
              <span>Join Official Discord Server</span>
            </a>

            {isAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600/30 to-orange-600/30 border border-red-500/40 text-red-200 font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-red-400" />
                <span>Admin Console</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenHowToJoin();
                setMobileMenuOpen(false);
              }}
              className="w-full h-12 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <Server className="w-4 h-4 text-cyan-400" />
              <span>How to Join (Java & Bedrock)</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
