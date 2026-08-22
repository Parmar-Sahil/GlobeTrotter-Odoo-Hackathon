import React from 'react';
import { Sparkles } from 'lucide-react';

interface GlobiBadgeProps {
  text?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const GlobiBadge: React.FC<GlobiBadgeProps> = ({
  text = 'Globi Smart Tip',
  size = 'md',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 font-medium ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${onClick ? 'cursor-pointer hover:bg-teal-500/20 transition-colors' : ''}`}
    >
      <img
        src="/assets/globi_hero.jpg"
        alt="Globi"
        className="w-4 h-4 rounded-full object-cover border border-teal-400/50"
      />
      <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
      <span>{text}</span>
    </div>
  );
};
