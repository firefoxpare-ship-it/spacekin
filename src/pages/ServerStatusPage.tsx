import React from 'react';
import { ServerStatusTracker } from '../components/ServerStatusTracker';
import { DiscordBanner } from '../components/DiscordBanner';
import { MinecraftServerStatus } from '../types';

interface ServerStatusPageProps {
  serverStatus: MinecraftServerStatus | null;
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export const ServerStatusPage: React.FC<ServerStatusPageProps> = ({
  serverStatus,
  onRefresh,
  loading
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <ServerStatusTracker
        serverStatus={serverStatus}
        onRefresh={onRefresh}
        loading={loading}
      />
      <DiscordBanner />
    </div>
  );
};
