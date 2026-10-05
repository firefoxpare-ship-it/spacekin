export type ServerRole = 'Owner' | 'Admin' | 'Sr Mod' | 'Mod' | 'Helper' | 'VIP' | 'Player';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  minecraftUsername?: string;
  role: ServerRole;
  createdAt: string;
  lastLoginAt: string;
  isManualEntry?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  gameMode: 'boxpvp' | 'lifesteal' | 'practice';
  rankPosition?: number;
  kills: number;
  deaths: number;
  score: number;
  prestige: number;
  rankTag?: string;
  updatedAt?: string;
}

export interface MinecraftServerStatus {
  online: boolean;
  ip: string;
  port: number;
  version: string;
  players: {
    online: number;
    max: number;
    list?: string[];
  };
  motd: {
    clean: string[];
    raw?: string[];
    html?: string[];
  };
  icon?: string;
  ping?: number;
  cachedAt?: number;
}

export interface ShopRank {
  id: string;
  name: string;
  tag: string;
  color: string;
  badgeBg: string;
  glowColor: string;
  price: string;
  features: string[];
  multiplier: string;
  perksSummary: string;
  popular?: boolean;
  comingSoon: boolean;
}
