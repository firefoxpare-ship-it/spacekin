import React from 'react';
import { LeaderboardSection } from '../components/LeaderboardSection';
import { LeaderboardEntry } from '../types';

interface LeaderboardPageProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  onOpenAdmin: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  entries,
  loading,
  onOpenAdmin
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <LeaderboardSection
        entries={entries}
        loading={loading}
        onOpenAdmin={onOpenAdmin}
      />
    </div>
  );
};
