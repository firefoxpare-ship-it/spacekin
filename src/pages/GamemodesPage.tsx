import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GamemodesSection } from '../components/GamemodesSection';
import { DiscordBanner } from '../components/DiscordBanner';

export const GamemodesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in duration-300">
      <GamemodesSection onNavigateBoxPvP={() => navigate('/leaderboard')} />
      <DiscordBanner />
    </div>
  );
};
