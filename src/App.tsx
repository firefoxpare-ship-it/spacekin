import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { HowToJoinModal } from './components/HowToJoinModal';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ServerStatusPage } from './pages/ServerStatusPage';
import { ShopPage } from './pages/ShopPage';
import { GamemodesPage } from './pages/GamemodesPage';
import { fetchServerStatus, SERVER_IP } from './services/minecraftApi';
import { subscribeToLeaderboard } from './services/dbService';
import { MinecraftServerStatus, LeaderboardEntry } from './types';
import { 
  Home, 
  Activity, 
  Trophy, 
  ShoppingBag, 
  Gamepad2, 
  Sparkles
} from 'lucide-react';

// Scroll to top upon navigating to any page
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function MainApp() {
  const { currentUser, isAdmin } = useAuth();

  const [serverStatus, setServerStatus] = useState<MinecraftServerStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHowToJoinOpen, setIsHowToJoinOpen] = useState(false);

  // Load server status
  const loadStatus = async () => {
    setStatusLoading(true);
    try {
      const data = await fetchServerStatus(SERVER_IP);
      setServerStatus(data);
    } catch (err) {
      console.error('Error fetching server status:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 45000);
    return () => clearInterval(interval);
  }, []);

  // Listen to BoxPvP leaderboards (strict: only genuine admin-added entries)
  useEffect(() => {
    setLeaderboardLoading(true);
    const unsubscribe = subscribeToLeaderboard('boxpvp', (entries) => {
      setLeaderboardEntries(entries);
      setLeaderboardLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-cyan-500 selection:text-zinc-950 font-sans pb-16 lg:pb-0">
        
        {/* Navigation Top Bar */}
        <Navbar
          serverStatus={serverStatus}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenHowToJoin={() => setIsHowToJoinOpen(true)}
        />

        {/* Multi-Page Routes */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage
                  serverStatus={serverStatus}
                  leaderboardEntries={leaderboardEntries}
                  onOpenHowToJoin={() => setIsHowToJoinOpen(true)}
                />
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <LeaderboardPage
                  entries={leaderboardEntries}
                  loading={leaderboardLoading}
                  onOpenAdmin={() => setIsAdminOpen(true)}
                />
              } 
            />
            <Route 
              path="/status" 
              element={
                <ServerStatusPage
                  serverStatus={serverStatus}
                  onRefresh={loadStatus}
                  loading={statusLoading}
                />
              } 
            />
            <Route 
              path="/store" 
              element={<ShopPage />} 
            />
            <Route 
              path="/gamemodes" 
              element={<GamemodesPage />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </main>

        {/* Persistent Footer */}
        <Footer
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenHowToJoin={() => setIsHowToJoinOpen(true)}
        />

        {/* Mobile Bottom Thumb Navigation Bar (Ergonomic 1-thumb multi-page switching) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-black/90 backdrop-blur-2xl border-t border-white/10 px-2 flex items-center justify-around shadow-2xl">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`
            }
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-1">Home</span>
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`
            }
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-1">Top PvP</span>
          </NavLink>

          <NavLink
            to="/status"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`
            }
          >
            <Activity className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-1">Status</span>
          </NavLink>

          <NavLink
            to="/store"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'
              }`
            }
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-1">Store</span>
          </NavLink>

          <button
            onClick={() => setIsHowToJoinOpen(true)}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-bold tracking-tight mt-1">Connect</span>
          </button>
        </nav>

        {/* Admin Panel Modal */}
        {isAdminOpen && (
          <AdminPanel
            onClose={() => setIsAdminOpen(false)}
            leaderboardEntries={leaderboardEntries}
          />
        )}

        {/* How to Connect Modal */}
        {isHowToJoinOpen && (
          <HowToJoinModal onClose={() => setIsHowToJoinOpen(false)} />
        )}
      </div>
    </HashRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
