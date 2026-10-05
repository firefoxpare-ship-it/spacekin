import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Mail, 
  Crown, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  Sparkles, 
  Trophy, 
  UserCheck, 
  AlertTriangle,
  RefreshCw,
  LogOut,
  Save,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, LeaderboardEntry, ServerRole } from '../types';
import { 
  subscribeToUsers, 
  updateUserRole, 
  deleteUser, 
  manuallyAddUser, 
  saveLeaderboardEntry, 
  deleteLeaderboardEntry, 
  clearAllLeaderboardEntries,
  ADMIN_EMAIL
} from '../services/dbService';
import { getPlayerSkinHead, SERVER_IP } from '../services/minecraftApi';
import { GoogleIcon } from './GoogleIcon';

interface AdminPanelProps {
  onClose: () => void;
  leaderboardEntries: LeaderboardEntry[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, leaderboardEntries }) => {
  const { currentUser, userProfile, isAdmin, isOwner, loginWithGoogle } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'users' | 'leaderboard' | 'config'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Feedback alerts
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal: Manually Add User / Staff
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [manualUsername, setManualUsername] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualRole, setManualRole] = useState<ServerRole>('Player');
  const [addingUser, setAddingUser] = useState(false);

  // Modal: Add / Edit Leaderboard Player
  const [isAddLeaderboardOpen, setIsAddLeaderboardOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [lbUsername, setLbUsername] = useState('');
  const [lbRankPosition, setLbRankPosition] = useState<number>(1);
  const [lbKills, setLbKills] = useState<number>(100);
  const [lbDeaths, setLbDeaths] = useState<number>(20);
  const [lbScore, setLbScore] = useState<number>(0);
  const [lbPrestige, setLbPrestige] = useState<number>(1);
  const [lbRankTag, setLbRankTag] = useState<string>('Player');
  const [lbGamemode, setLbGamemode] = useState<'boxpvp' | 'lifesteal' | 'practice'>('boxpvp');
  const [savingLb, setSavingLb] = useState(false);

  const formatOrdinal = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return `${num}st`;
    if (j === 2 && k !== 12) return `${num}nd`;
    if (j === 3 && k !== 13) return `${num}rd`;
    return `${num}th`;
  };

  const availableRoles: ServerRole[] = ['Owner', 'Admin', 'Sr Mod', 'Mod', 'Helper', 'VIP', 'Player'];

  // Subscribe to all users in real time
  useEffect(() => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    const unsubscribe = subscribeToUsers(
      (loadedUsers) => {
        setUsers(loadedUsers);
        setLoadingUsers(false);
      },
      (err) => {
        console.error('Failed to load users in admin panel:', err);
        setLoadingUsers(false);
      }
    );
    return () => unsubscribe();
  }, [isAdmin]);

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  // Role change handler
  const handleRoleChange = async (targetUserId: string, newRole: ServerRole, userEmail?: string) => {
    try {
      await updateUserRole(targetUserId, newRole, userEmail);
      showNotification(`Role successfully updated to ${newRole}!`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to update role', true);
    }
  };

  // Safe Confirmation Modal Config
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    action: () => Promise<void>;
  } | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const executeConfirmAction = async () => {
    if (!confirmAction) return;
    try {
      setActionInProgress(true);
      await confirmAction.action();
      setConfirmAction(null);
    } catch (err: any) {
      showNotification(err.message || 'Action failed', true);
    } finally {
      setActionInProgress(false);
    }
  };

  // User deletion handler (without window.confirm)
  const handleDeleteUser = (targetUserId: string, username: string) => {
    setConfirmAction({
      title: 'Remove User Record',
      message: `Are you sure you want to permanently remove user "${username}" from the database?`,
      confirmLabel: 'Delete User',
      action: async () => {
        await deleteUser(targetUserId);
        showNotification(`User "${username}" removed successfully.`);
      }
    });
  };

  // Handle Manual User Addition
  const handleManualAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUsername.trim()) {
      showNotification('Minecraft username is required.', true);
      return;
    }
    try {
      setAddingUser(true);
      await manuallyAddUser({
        minecraftUsername: manualUsername.trim(),
        email: manualEmail.trim() || undefined,
        role: manualRole,
        displayName: manualUsername.trim()
      });
      showNotification(`Added user ${manualUsername} with role ${manualRole}!`);
      setIsAddUserModalOpen(false);
      setManualUsername('');
      setManualEmail('');
      setManualRole('Player');
    } catch (err: any) {
      showNotification(err.message || 'Failed to add user manually', true);
    } finally {
      setAddingUser(false);
    }
  };

  // Handle Leaderboard Entry Save (score, KD, and tier removed from UI)
  const handleLeaderboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lbUsername.trim()) {
      showNotification('Player username is required.', true);
      return;
    }
    try {
      setSavingLb(true);
      await saveLeaderboardEntry({
        id: editingEntryId || undefined,
        username: lbUsername.trim(),
        gameMode: lbGamemode,
        rankPosition: Number(lbRankPosition) || 1,
        kills: Number(lbKills) || 0,
        deaths: Number(lbDeaths) || 0,
        score: 0,
        prestige: 1,
        rankTag: 'Player'
      });
      showNotification(`Player ${lbUsername} assigned ${formatOrdinal(lbRankPosition)} rank on ${lbGamemode}!`);
      setIsAddLeaderboardOpen(false);
      setEditingEntryId(null);
      setLbUsername('');
      setLbRankPosition(1);
      setLbKills(0);
      setLbDeaths(0);
    } catch (err: any) {
      showNotification(err.message || 'Failed to save leaderboard entry', true);
    } finally {
      setSavingLb(false);
    }
  };

  // Handle Leaderboard Entry Delete (without window.confirm)
  const handleDeleteLeaderboard = (id: string, username: string) => {
    setConfirmAction({
      title: 'Delete Leaderboard Player',
      message: `Are you sure you want to permanently remove "${username}" from the leaderboard?`,
      confirmLabel: 'Delete Player',
      action: async () => {
        await deleteLeaderboardEntry(id);
        showNotification(`Player "${username}" removed from leaderboard.`);
      }
    });
  };

  // Open Edit Leaderboard Modal
  const openEditLeaderboard = (entry: LeaderboardEntry) => {
    setEditingEntryId(entry.id);
    setLbUsername(entry.username);
    setLbRankPosition(entry.rankPosition || 1);
    setLbKills(entry.kills);
    setLbDeaths(entry.deaths);
    setLbScore(0);
    setLbPrestige(1);
    setLbRankTag('Player');
    setLbGamemode(entry.gameMode);
    setIsAddLeaderboardOpen(true);
  };

  // Clear all leaderboard entries if requested by admin (without window.confirm)
  const handleClearAllLeaderboard = () => {
    setConfirmAction({
      title: 'Clear Entire Leaderboard',
      message: 'Are you sure you want to remove ALL leaderboard entries? Only new players you add will be displayed.',
      confirmLabel: 'Clear All Entries',
      action: async () => {
        const removed = await clearAllLeaderboardEntries();
        showNotification(`Cleared ${removed} leaderboard records successfully.`);
      }
    });
  };

  // Filter users list
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.displayName?.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email?.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.minecraftUsername?.toLowerCase().includes(userSearch.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate stats requested by user:
  // "aur usme aisa bhee karna ki mujhe saf saf dikhe ki kitne bande email ke sath aur usme kitne users total registered hain"
  const totalRegisteredCount = users.length;
  const usersWithGoogleEmailCount = users.filter((u) => u.email && !u.email.endsWith('@spacekin.mc')).length;
  const staffCount = users.filter((u) => ['Owner', 'Admin', 'Sr Mod', 'Mod', 'Helper'].includes(u.role)).length;
  const totalLeaderboardCount = leaderboardEntries.length;

  // Authorization gate check
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="bg-zinc-900 border border-red-500/40 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">
            Restricted Admin Area
          </h3>
          <p className="mt-2 text-xs text-zinc-300">
            This administration portal is strictly reserved for the Spacekin Server Owner and designated Staff.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-amber-300">
            Authorized Owner Email: <br />
            <strong className="text-white">{ADMIN_EMAIL}</strong>
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => loginWithGoogle()}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Sign in with Google</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roleBadgeColors: Record<string, string> = {
    Owner: 'bg-red-500/20 text-red-300 border-red-500/50',
    Admin: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    'Sr Mod': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    Mod: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    Helper: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    VIP: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    Player: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex flex-col justify-start">
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                  Spacekin Staff Command Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {userProfile?.role || 'Owner'} Access
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Server: <strong className="text-cyan-300 font-mono">{SERVER_IP}</strong> • Signed in as: <span className="font-mono text-zinc-300">{currentUser?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-zinc-700"
            >
              <X className="w-4 h-4" />
              <span>Close Admin Panel</span>
            </button>
          </div>
        </div>

        {/* Action Notifications */}
        {actionSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* 4 Metrics Dashboard (Explicit user request for clear stats) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Registered Users */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Total Registered</div>
              <div className="text-2xl font-black text-white font-mono">{totalRegisteredCount} Users</div>
              <div className="text-[10px] text-zinc-500">Firebase Firestore sync</div>
            </div>
          </div>

          {/* Email Accounts (Google Sign In) */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Google Accounts</div>
              <div className="text-2xl font-black text-cyan-300 font-mono">{usersWithGoogleEmailCount} Verified</div>
              <div className="text-[10px] text-zinc-500">With valid email addresses</div>
            </div>
          </div>

          {/* Staff Members Count */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Staff Team</div>
              <div className="text-2xl font-black text-amber-300 font-mono">{staffCount} Members</div>
              <div className="text-[10px] text-zinc-500">Owner, Admin & Mods</div>
            </div>
          </div>

          {/* Leaderboard Players Tracked */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Leaderboard Gladiators</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">{totalLeaderboardCount} Players</div>
              <div className="text-[10px] text-zinc-500">BoxPvP active ladder</div>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-zinc-800 gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>User Management & Roles ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-5 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard Manager ({leaderboardEntries.length})</span>
          </button>
        </div>

        {/* TAB 1: USER MANAGEMENT & ROLE ASSIGNMENT */}
        {activeTab === 'users' && (
          <div className="mt-6 flex-1 flex flex-col">
            
            {/* Filter & Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">All Roles ({users.length})</option>
                  {availableRoles.map((r) => (
                    <option key={r} value={r}>
                      {r} ({users.filter((u) => u.role === r).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Manually Add User Button (Explicitly requested by user!) */}
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Manually Add Player / Staff</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-mono border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Player / Account</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Minecraft IGN</th>
                      <th className="py-3 px-4">Current Role</th>
                      <th className="py-3 px-4">Change Role</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const skinUrl = getPlayerSkinHead(user.minecraftUsername || user.displayName, 32);
                        const isMainOwner = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

                        return (
                          <tr key={user.userId} className="hover:bg-zinc-850/50 transition-colors">
                            {/* Profile & Name */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={skinUrl}
                                  alt={user.displayName}
                                  className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 object-cover shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/32';
                                  }}
                                />
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span>{user.displayName}</span>
                                    {isMainOwner && (
                                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                                        [Super Admin]
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-zinc-500 font-mono">
                                    ID: {user.userId.slice(0, 10)}...
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Email Address - Clearly Highlighted */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 font-mono text-zinc-200">
                                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className={user.email.endsWith('@spacekin.mc') ? 'text-zinc-500' : 'text-cyan-300 font-medium'}>
                                  {user.email}
                                </span>
                              </div>
                            </td>

                            {/* Linked Minecraft Username */}
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-zinc-200 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                                {user.minecraftUsername || '—'}
                              </span>
                            </td>

                            {/* Current Role Badge */}
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${roleBadgeColors[user.role] || roleBadgeColors.Player}`}>
                                {user.role}
                              </span>
                            </td>

                            {/* Change Role Selector */}
                            <td className="py-3 px-4">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.userId, e.target.value as ServerRole, user.email)}
                                disabled={isMainOwner}
                                className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer disabled:opacity-50"
                              >
                                {availableRoles.map((r) => (
                                  <option key={r} value={r}>
                                    {r}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Registered Date */}
                            <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                            </td>

                            {/* Delete User Action */}
                            <td className="py-3 px-4 text-right">
                              {!isMainOwner && (
                                <button
                                  onClick={() => handleDeleteUser(user.userId, user.displayName)}
                                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                                  title="Delete user record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                          {loadingUsers ? 'Loading registered users...' : 'No users found matching your criteria.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADERBOARD MANAGER */}
        {activeTab === 'leaderboard' && (
          <div className="mt-6 flex-1 flex flex-col">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
                  <span>BoxPvP Official Leaderboard</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-normal">
                    Admin Managed Only
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Only players added from this Admin Panel will appear on the public website. Fake and mock rankings are disabled.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {leaderboardEntries.length > 0 && (
                  <button
                    onClick={handleClearAllLeaderboard}
                    className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Delete all records from leaderboard"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Clear All Entries</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setEditingEntryId(null);
                    setLbUsername('');
                    setLbRankPosition(leaderboardEntries.length + 1);
                    setLbKills(100);
                    setLbDeaths(20);
                    setLbScore(0);
                    setLbPrestige(1);
                    setLbRankTag('Player');
                    setLbGamemode('boxpvp');
                    setIsAddLeaderboardOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Player to Leaderboard</span>
                </button>
              </div>
            </div>

            {/* Leaderboard Table (Clean: Rank, Gladiator, Mode, Kills, Deaths, Actions) */}
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-mono border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4 w-24 text-center">Rank</th>
                      <th className="py-3 px-4">Gladiator</th>
                      <th className="py-3 px-4">Game Mode</th>
                      <th className="py-3 px-4 text-right">Kills</th>
                      <th className="py-3 px-4 text-right">Deaths</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 font-mono">
                    {leaderboardEntries.length > 0 ? (
                      leaderboardEntries.map((entry, index) => {
                        const rankNum = entry.rankPosition || index + 1;
                        return (
                          <tr key={entry.id} className="hover:bg-zinc-850/50 transition-colors">
                            <td className="py-3 px-4 text-center font-bold font-mono">
                              <select
                                value={rankNum}
                                onChange={async (e) => {
                                  const newRank = Number(e.target.value);
                                  try {
                                    await saveLeaderboardEntry({
                                      ...entry,
                                      rankPosition: newRank
                                    });
                                    showNotification(`Updated ${entry.username} rank to ${formatOrdinal(newRank)}!`);
                                  } catch (err: any) {
                                    showNotification(err.message || 'Failed to update rank', true);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer font-mono focus:outline-none transition-colors ${
                                  rankNum === 1
                                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 hover:bg-amber-500/35'
                                    : rankNum === 2
                                    ? 'bg-zinc-700/40 text-zinc-200 border-zinc-500/50 hover:bg-zinc-700/60'
                                    : rankNum === 3
                                    ? 'bg-amber-900/30 text-amber-200 border-amber-700/50 hover:bg-amber-900/50'
                                    : 'bg-zinc-850 text-cyan-300 border-zinc-700 hover:border-cyan-500/40'
                                }`}
                                title="Click to change rank (1st, 2nd, 3rd... 10th)"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20].map((r) => (
                                  <option key={r} value={r} className="bg-zinc-950 text-white font-mono">
                                    #{r} ({formatOrdinal(r)})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getPlayerSkinHead(entry.username, 32)}
                                  alt={entry.username}
                                  className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 object-cover shrink-0"
                                />
                                <span className="font-bold text-white font-sans text-sm">{entry.username}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 uppercase text-cyan-400 font-bold">
                              {entry.gameMode}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-cyan-300">
                              {entry.kills.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-zinc-400">
                              {entry.deaths.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditLeaderboard(entry)}
                                  className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                                  title="Edit Rank & Stats"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLeaderboard(entry.id, entry.username)}
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Trophy className="w-8 h-8 text-zinc-600" />
                            <p className="text-zinc-300 font-medium text-xs">No players in leaderboard yet.</p>
                            <p className="text-zinc-500 text-[11px]">Click "+ Add Player to Leaderboard" above to add real player statistics.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* MODAL 1: MANUALLY ADD USER / STAFF (Explicitly requested by user) */}
        {isAddUserModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsAddUserModalOpen(false)}
          >
            <div 
              className="bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white uppercase">Manually Add User / Staff</h3>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleManualAddUserSubmit} className="mt-5 space-y-4">
                
                {/* Username Input with Live Skin Head Preview */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Minecraft Username *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="e.g. SpaceKnight_99"
                      value={manualUsername}
                      onChange={(e) => setManualUsername(e.target.value)}
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={getPlayerSkinHead(manualUsername || 'Steve', 36)}
                        alt="Skin preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. player@gmail.com (defaults to @spacekin.mc)"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Role Assignment */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Assign Role *
                  </label>
                  <select
                    value={manualRole}
                    onChange={(e) => setManualRole(e.target.value as ServerRole)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingUser}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs uppercase tracking-wider cursor-pointer hover:opacity-90 disabled:opacity-50"
                  >
                    {addingUser ? 'Adding...' : 'Save User'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD / EDIT LEADERBOARD PLAYER */}
        {isAddLeaderboardOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsAddLeaderboardOpen(false)}
          >
            <div 
              className="bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white uppercase">
                    {editingEntryId ? 'Edit Leaderboard Player' : 'Add Player to Leaderboard'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddLeaderboardOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleLeaderboardSubmit} className="mt-5 space-y-4">
                
                {/* Username with head preview */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Minecraft Username *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="e.g. VoidReaper"
                      value={lbUsername}
                      onChange={(e) => setLbUsername(e.target.value)}
                      required
                      className="flex-1 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={getPlayerSkinHead(lbUsername || 'Steve', 36)}
                        alt="Skin preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Rank Standing: 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th */}
                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Assign Player Rank *</span>
                    </label>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {formatOrdinal(lbRankPosition)} Place (#{lbRankPosition})
                    </span>
                  </div>

                  {/* Quick Click Rank Chips: 1st to 10th */}
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                      Select Standing:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rank) => {
                        const isSelected = lbRankPosition === rank;
                        return (
                          <button
                            key={rank}
                            type="button"
                            onClick={() => setLbRankPosition(rank)}
                            className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex flex-col items-center justify-center border ${
                              isSelected
                                ? rank === 1
                                  ? 'bg-gradient-to-b from-amber-500/30 to-amber-600/20 text-amber-300 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.04]'
                                  : rank === 2
                                  ? 'bg-gradient-to-b from-zinc-600/40 to-zinc-700/30 text-zinc-100 border-zinc-400 shadow-md scale-[1.04]'
                                  : rank === 3
                                  ? 'bg-gradient-to-b from-amber-900/40 to-amber-800/30 text-amber-200 border-amber-600 shadow-md scale-[1.04]'
                                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md scale-[1.04]'
                                : 'bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                            }`}
                          >
                            <span className="text-[10px] text-zinc-500">
                              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                            </span>
                            <span className="leading-tight text-xs">{formatOrdinal(rank)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dropdown for any rank or higher custom ranks */}
                  <div className="flex items-center gap-2 pt-1">
                    <select
                      value={lbRankPosition}
                      onChange={(e) => setLbRankPosition(Number(e.target.value))}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer font-mono"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                        <option key={num} value={num} className="bg-zinc-950 text-white">
                          {formatOrdinal(num)} Place (#{num}) {num === 1 ? '— 🥇 Top Champion' : num === 2 ? '— 🥈 Runner-up' : num === 3 ? '— 🥉 Podium Bronze' : ''}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => setLbRankPosition((prev) => Math.max(1, prev - 1))}
                        className="px-2.5 py-1.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Previous rank"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-amber-300">#{lbRankPosition}</span>
                      <button
                        type="button"
                        onClick={() => setLbRankPosition((prev) => prev + 1)}
                        className="px-2.5 py-1.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Next rank"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                      Kills
                    </label>
                    <input
                      type="number"
                      value={lbKills}
                      onChange={(e) => setLbKills(Number(e.target.value))}
                      required
                      min={0}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                      Deaths
                    </label>
                    <input
                      type="number"
                      value={lbDeaths}
                      onChange={(e) => setLbDeaths(Number(e.target.value))}
                      required
                      min={0}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Game Mode
                  </label>
                  <select
                    value={lbGamemode}
                    onChange={(e: any) => setLbGamemode(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="boxpvp">BoxPvP (Active)</option>
                    <option value="lifesteal">Lifesteal SMP (Coming Soon)</option>
                    <option value="practice">Practice Duels (Coming Soon)</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsAddLeaderboardOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingLb}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs uppercase tracking-wider cursor-pointer hover:opacity-90 disabled:opacity-50"
                  >
                    {savingLb ? 'Saving...' : 'Save Player'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Safe In-App Confirmation Modal (Zero window.confirm, 100% iFrame resilient) */}
        {confirmAction && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-red-500/40 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-3 shadow-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white uppercase tracking-tight">{confirmAction.title}</h4>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{confirmAction.message}</p>
              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  disabled={actionInProgress}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeConfirmAction}
                  disabled={actionInProgress}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  {actionInProgress ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>{confirmAction.confirmLabel}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
