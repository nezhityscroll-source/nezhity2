import React from 'react';
import { Home, Calendar, Wand2, Droplets, Crown } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDarkTheme: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  isDarkTheme,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      label: 'Дом',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'booking',
      label: 'Запись',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'nezhity',
      label: 'Нежить',
      icon: (
        <div className="relative">
          <Wand2 className="w-5 h-5 text-pink-400 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
        </div>
      ),
    },
    {
      id: 'profile',
      label: 'Уход',
      icon: <Droplets className="w-5 h-5" />,
    },
    {
      id: 'club',
      label: 'Club',
      icon: <Crown className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="mobile-bottom-nav fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-md mx-auto px-4 pb-2.5 pointer-events-auto">
        <div
          className={`flex items-center justify-around py-1.5 px-2 rounded-full backdrop-blur-2xl transition-all duration-300 ${
            isDarkTheme
              ? 'bg-[#150e1c]/90 border border-pink-900/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
              : 'bg-[#ffffff]/90 border border-pink-200/80 shadow-[0_8px_30px_rgba(180,0,102,0.12)]'
          }`}
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                type="button"
                className={`relative flex flex-col items-center justify-center min-w-[58px] min-h-[46px] px-1 py-1 rounded-full transition-all duration-200 active:scale-95 ${
                  isActive
                    ? isDarkTheme
                      ? 'text-pink-300 font-bold'
                      : 'text-pink-600 font-bold'
                    : isDarkTheme
                    ? 'text-slate-400 hover:text-pink-300'
                    : 'text-slate-500 hover:text-pink-600'
                }`}
              >
                {/* Active pill background glow */}
                {isActive && (
                  <span
                    className={`absolute inset-0 rounded-full -z-10 ${
                      isDarkTheme
                        ? 'bg-pink-600/20 border border-pink-500/40 shadow-[0_0_12px_rgba(219,39,119,0.3)]'
                        : 'bg-pink-100 border border-pink-300/60'
                    }`}
                  />
                )}

                {/* Optional subtle badge */}
                {item.id === 'club' && !isActive && (
                  <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                )}

                <div className="relative">
                  {item.icon}
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
