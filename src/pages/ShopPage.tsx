import React from 'react';
import { ShopSection } from '../components/ShopSection';
import { DiscordBanner } from '../components/DiscordBanner';

export const ShopPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-300">
      <ShopSection />
      <DiscordBanner />
    </div>
  );
};
