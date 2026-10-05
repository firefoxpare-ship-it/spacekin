import React, { useState } from 'react';
import { 
  Trophy, 
  Swords, 
  Flame, 
  Gamepad2, 
  Search, 
  Crown, 
  Medal, 
  Sparkles, 
  Shield, 
  PlusCircle, 
  Clock, 
  Heart, 
  Target, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { getPlayerSkinHead } from '../services/minecraftApi';
import { deleteLeaderboardEntry } from '../services/dbService';
import { useAuth } from '../context/AuthContext';

interface LeaderboardSectionProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  onOpenAdmin: () => void;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  entries,
  loading,
  onOpenAdmin
}) => {
  const { isAdmin } = useAuth();
  const [activeGamemode, setActiveGamemode] = useState<'boxpvp' | 'lifesteal' | 'practice'>('boxpvp');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'kills' | 'deaths'>('rank');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const formatOrdinal = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return `${num}st`;
    if (j === 2 && k !== 12) return `${num}nd`;
    if (j === 3 && k !== 13) return `${num}rd`;
    return `${num}th`;
  };

  const handleDeletePlayer = async (id: string, username: string) => {
    try {
      setDeletingId(id);
      await deleteLeaderboardEntry(id);
      setConfirmDeleteId(null);
      setNotification(`Player "${username}" deleted from leaderboard.`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification(err.message || 'Failed to delete player');
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter BoxPvP entries
  const boxpvpEntries = entries.filter((e) => e.gameMode === 'boxpvp');

  const filteredEntries = boxpvpEntries
    .filter((entry) => entry.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rank') {
        const rankA = a.rankPosition != null ? a.rankPosition : 9999;
        const rankB = b.rankPosition != null ? b.rankPosition : 9999;
        if (rankA !== rankB) return rankA - rankB;
        return (b.kills || 0) - (a.kills || 0);
      }
      if (sortBy === 'kills') return (b.kills || 0) - (a.kills || 0);
      if (sortBy === 'deaths') return (b.deaths || 0) - (a.deaths || 0);
      return 0;
    });

  const topThree = filteredEntries.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-black border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center justify-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Competitive Hall of Fame</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Server Leaderboard
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Realtime rankings updated exclusively by Server Administrators.
          </p>
        </div>

        {/* Gamemode Selector Tabs (Single-line, Mobile Thumb-Friendly) */}
        <div className="flex justify-center mb-10">
          <div className="p-1 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center gap-1 max-w-md w-full">
            <button
              onClick={() => setActiveGamemode('boxpvp')}
              className={`flex-1 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeGamemode === 'boxpvp'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>BoxPvP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            <button
              onClick={() => setActiveGamemode('lifesteal')}
              className={`flex-1 min-h-[44px] rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeGamemode === 'lifesteal'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Heart className="w-4 h-4 text-red-400" />
              <span>Lifesteal</span>
              <span className="text-[10px] text-zinc-500 font-mono">SOON</span>
            </button>

            <button
              onClick={() => setActiveGamemode('practice')}
              className={`flex-1 min-h-[44px] rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeGamemode === 'practice'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Practice</span>
              <span className="text-[10px] text-zinc-500 font-mono">SOON</span>
            </button>
          </div>
        </div>

        {/* Gamemode: BoxPvP (Active) */}
        {activeGamemode === 'boxpvp' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {loading ? (
              <div className="max-w-md mx-auto p-8 rounded-3xl bg-zinc-900/40 border border-white/5 text-center">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-zinc-400 font-mono">Syncing official records with database...</p>
              </div>
            ) : boxpvpEntries.length === 0 ? (
              <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-white/10 text-center animate-in fade-in duration-300 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
                  Authentic Arena Standings
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-2">
                  No Leaderboard Entries Yet
                </h3>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  Sirf wahi gladiators yahan display honge jo <span className="text-white font-medium">Server Admin Panel</span> se dale gaye hain. Sabhi fake/mock rankings hata di gayi hain.
                </p>
                {isAdmin ? (
                  <button
                    onClick={onOpenAdmin}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Open Admin Panel & Add First Player</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live records will appear once added by staff</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Top 3 Podium (Sleek, Compact, Non-cluttered) */}
                {topThree.length >= 3 && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto items-end pt-4">
                    
                    {/* #2 Rank (Silver) */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/60 border border-zinc-400/20 text-center flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-zinc-700/80 text-zinc-200 text-xs font-black flex items-center justify-center mb-2">
                        #2
                      </div>
                      <img
                        src={getPlayerSkinHead(topThree[1].username, 48)}
                        alt={topThree[1].username}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-800 border border-white/10 mb-2 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      <div className="font-bold text-xs sm:text-sm text-white truncate max-w-full">
                        {topThree[1].username}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                        {topThree[1].kills} Kills
                      </div>
                    </div>

                    {/* #1 Rank (Gold - Center & Elevated) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 via-zinc-900/90 to-zinc-900 border border-amber-500/40 text-center flex flex-col items-center shadow-xl shadow-amber-950/30 -translate-y-2">
                      <Crown className="w-5 h-5 text-amber-400 mb-1 animate-bounce" />
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-zinc-950 text-xs font-black flex items-center justify-center mb-2 shadow-sm">
                        #1
                      </div>
                      <img
                        src={getPlayerSkinHead(topThree[0].username, 64)}
                        alt={topThree[0].username}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-zinc-800 border-2 border-amber-400/60 mb-2 shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div className="font-extrabold text-xs sm:text-base text-amber-300 truncate max-w-full">
                        {topThree[0].username}
                      </div>
                      <div className="text-xs font-mono font-bold text-white mt-1">
                        {topThree[0].kills.toLocaleString()} Kills
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        {topThree[0].deaths.toLocaleString()} Deaths
                      </div>
                    </div>

                    {/* #3 Rank (Bronze) */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/60 border border-amber-700/20 text-center flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-900/60 text-amber-200 text-xs font-black flex items-center justify-center mb-2">
                        #3
                      </div>
                      <img
                        src={getPlayerSkinHead(topThree[2].username, 48)}
                        alt={topThree[2].username}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-800 border border-white/10 mb-2 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      <div className="font-bold text-xs sm:text-sm text-white truncate max-w-full">
                        {topThree[2].username}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                        {topThree[2].kills} Kills
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        {topThree[2].deaths} Deaths
                      </div>
                    </div>

                  </div>
                )}

                {/* Filter / Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-zinc-900/80 border border-white/5">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search player IGN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  {/* Sort pills: Kills & Deaths only */}
                  <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-[11px] text-zinc-500 px-2 shrink-0">Sort by:</span>
                    <button
                      onClick={() => setSortBy('kills')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        sortBy === 'kills' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white bg-zinc-800/60'
                      }`}
                    >
                      Kills
                    </button>
                    <button
                      onClick={() => setSortBy('deaths')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        sortBy === 'deaths' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white bg-zinc-800/60'
                      }`}
                    >
                      Deaths
                    </button>
                  </div>
                </div>

                {/* Action Feedback Banner */}
                {notification && (
                  <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{notification}</span>
                  </div>
                )}

                {filteredEntries.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-white/5">
                    <p className="text-zinc-400 text-xs">No players found matching "{searchQuery}".</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile View: Clean Tap Cards (Zero horizontal breakage, no Tier/KD/Score) */}
                    <div className="block md:hidden space-y-2.5">
                      {filteredEntries.map((player, index) => {
                        const rankNum = player.rankPosition != null ? player.rankPosition : index + 1;
                        const isConfirming = confirmDeleteId === player.id;
                        return (
                          <div
                            key={player.id}
                            className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={`w-9 text-center font-mono font-bold text-xs shrink-0 ${
                                rankNum === 1 ? 'text-amber-400' : rankNum === 2 ? 'text-zinc-300' : rankNum === 3 ? 'text-amber-500' : 'text-zinc-400'
                              }`}>
                                {formatOrdinal(rankNum)}
                              </span>
                              <img
                                src={getPlayerSkinHead(player.username, 36)}
                                alt={player.username}
                                className="w-8 h-8 rounded-lg bg-zinc-800 object-cover shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-sm text-white truncate font-mono">
                                  {player.username}
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-3">
                              <div>
                                <div className="text-sm font-mono font-bold text-cyan-400 tabular-nums">
                                  {player.kills.toLocaleString()} <span className="text-[10px] text-zinc-500 font-sans font-normal">K</span>
                                </div>
                                <div className="text-[11px] font-mono text-zinc-400 tabular-nums">
                                  {player.deaths.toLocaleString()} <span className="text-[10px] text-zinc-500 font-sans font-normal">D</span>
                                </div>
                              </div>

                              {isAdmin && (
                                <button
                                  onClick={() => {
                                    if (isConfirming) {
                                      handleDeletePlayer(player.id, player.username);
                                    } else {
                                      setConfirmDeleteId(player.id);
                                    }
                                  }}
                                  disabled={deletingId === player.id}
                                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                                    isConfirming
                                      ? 'bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] px-2.5 shadow-md shadow-red-600/30'
                                      : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10'
                                  }`}
                                  title={isConfirming ? 'Click again to permanently delete' : 'Delete Player'}
                                >
                                  {deletingId === player.id ? (
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                                  ) : isConfirming ? (
                                    'Delete?'
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop View: Sleek Tabular Format (No Tier, No K/D, No Score) */}
                    <div className="hidden md:block rounded-2xl bg-zinc-900/40 border border-white/5 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/5 bg-zinc-900/80 text-zinc-400 uppercase font-semibold">
                            <th className="py-3.5 px-4 w-20 text-center">Rank</th>
                            <th className="py-3.5 px-4">Player</th>
                            <th className="py-3.5 px-4 text-right">Kills</th>
                            <th className="py-3.5 px-4 text-right">Deaths</th>
                            {isAdmin && <th className="py-3.5 px-4 text-right w-28">Admin</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                          {filteredEntries.map((player, index) => {
                            const rankNum = player.rankPosition != null ? player.rankPosition : index + 1;
                            const isConfirming = confirmDeleteId === player.id;
                            return (
                              <tr key={player.id} className="hover:bg-zinc-800/40 transition-colors">
                                <td className="py-3.5 px-4 text-center font-bold font-mono">
                                  <span className={`px-2 py-0.5 rounded-lg text-xs border ${
                                    rankNum === 1
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : rankNum === 2
                                      ? 'bg-zinc-700/40 text-zinc-200 border-zinc-600/40'
                                      : rankNum === 3
                                      ? 'bg-amber-900/30 text-amber-200 border-amber-800/40'
                                      : 'bg-zinc-800/60 text-zinc-400 border-white/5'
                                  }`}>
                                    {formatOrdinal(rankNum)}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={getPlayerSkinHead(player.username, 30)}
                                      alt={player.username}
                                      className="w-7 h-7 rounded-md bg-zinc-800 shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <span className="font-bold text-white text-xs font-mono">{player.username}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-right font-bold text-cyan-400 tabular-nums">
                                  {player.kills.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-4 text-right text-zinc-400 tabular-nums">
                                  {player.deaths.toLocaleString()}
                                </td>
                                {isAdmin && (
                                  <td className="py-3.5 px-4 text-right font-sans">
                                    <button
                                      onClick={() => {
                                        if (isConfirming) {
                                          handleDeletePlayer(player.id, player.username);
                                        } else {
                                          setConfirmDeleteId(player.id);
                                        }
                                      }}
                                      disabled={deletingId === player.id}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1 ${
                                        isConfirming
                                          ? 'bg-red-600 hover:bg-red-500 text-white font-bold shadow-md shadow-red-600/30'
                                          : 'text-zinc-400 hover:text-red-300 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/40'
                                      }`}
                                      title={isConfirming ? 'Click again to confirm delete' : 'Delete Player'}
                                    >
                                      {deletingId === player.id ? (
                                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : isConfirming ? (
                                        'Confirm Delete'
                                      ) : (
                                        <>
                                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                          <span>Delete</span>
                                        </>
                                      )}
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* Admin shortcut if logged in */}
                {isAdmin && (
                  <div className="text-center pt-2">
                    <button
                      onClick={onOpenAdmin}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Admin: Manage Leaderboard Players</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Gamemode: Lifesteal (Coming Soon Card) */}
        {activeGamemode === 'lifesteal' && (
          <div className="max-w-xl mx-auto p-8 rounded-3xl bg-zinc-900/40 border border-red-500/20 text-center animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Heart className="w-7 h-7" />
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-red-400 mb-1">
              Under Development
            </div>
            <h3 className="text-2xl font-black text-white uppercase mb-2">
              Lifesteal SMP Season 1
            </h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Steal hearts with every kill, craft custom revives, and conquer rival bases in ruthless hardcore PvP. The arena is currently in closed testing.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-red-400" />
              <span>Launching Soon · Stay Tuned</span>
            </div>
          </div>
        )}

        {/* Gamemode: Practice (Coming Soon Card) */}
        {activeGamemode === 'practice' && (
          <div className="max-w-xl mx-auto p-8 rounded-3xl bg-zinc-900/40 border border-amber-500/20 text-center animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Target className="w-7 h-7" />
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              Coming Soon
            </div>
            <h3 className="text-2xl font-black text-white uppercase mb-2">
              Competitive Practice Duels
            </h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              1v1 ranked matches, Nodebuff, Crystal PvP, Gapple, and Combo duels with custom knockback profiles.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>In Queue for Release</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
