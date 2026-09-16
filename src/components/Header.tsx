import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, Gem, Ticket, Moon, Sun, Clock, ChevronRight } from 'lucide-react';
import { ActiveBooking, MascotReactionEvent } from '../types';
import { HeaderMascot } from './HeaderMascot';

interface HeaderProps {
  points: number;
  tickets: number;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  hasUnreadNotifications?: boolean;
  userAvatar?: string;
  activeBooking?: ActiveBooking | null;
  onOpenBookingDetails?: () => void;
  mascotReaction?: MascotReactionEvent | null;
  onClearMascotReaction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  points,
  tickets,
  isDarkTheme,
  onToggleTheme,
  onOpenNotifications,
  onOpenProfile,
  hasUnreadNotifications = true,
  userAvatar = '/assets/art-haos-nezhity-transparent-hello.png',
  activeBooking,
  onOpenBookingDetails,
  mascotReaction,
  onClearMascotReaction,
}) => {
  const [countdownText, setCountdownText] = useState<string>('');
  const [compactCountdown, setCompactCountdown] = useState<string>('');
  const [pointsBump, setPointsBump] = useState(false);

  // Animate points badge when points change
  useEffect(() => {
    setPointsBump(true);
    const t = setTimeout(() => setPointsBump(false), 800);
    return () => clearTimeout(t);
  }, [points]);

  useEffect(() => {
    if (!activeBooking) {
      setCountdownText('');
      setCompactCountdown('');
      return;
    }

    const updateCountdown = () => {
      const target = activeBooking.targetTimestamp || Date.now() + 3 * 3600 * 1000;
      const diff = target - Date.now();

      if (diff <= 0) {
        setCountdownText('Процедура началась!');
        setCompactCountdown('Сейчас');
        return;
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const fullStr =
        totalHours > 0
          ? `${totalHours} ч ${minutes} мин ${seconds} с`
          : `${minutes} мин ${seconds} с`;

      const compactStr =
        totalHours > 0
          ? `${totalHours}ч ${minutes}м`
          : `${minutes}м ${seconds}с`;

      setCountdownText(fullStr);
      setCompactCountdown(compactStr);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeBooking]);

  return (
    <header
      id="app-header"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-[#0f0b12]/90 text-slate-100 border-b border-pink-950/40 shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
          : 'bg-[#fff7fb]/95 text-[#1e1b1e] border-b border-pink-100 shadow-[0_2px_16px_rgba(180,0,102,0.06)]'
      } backdrop-blur-xl`}
    >
      {/* VISUAL INDICATOR BANNER IN HEADER (Only when activeBooking exists) */}
      {activeBooking && (
        <div
          id="header-booking-indicator-strip"
          onClick={onOpenBookingDetails}
          title="Нажми для просмотра деталей записи"
          className="w-full bg-gradient-to-r from-[#2c0d38] via-[#1d0a27] to-[#2e0e3b] border-b border-pink-500/30 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs cursor-pointer transition-all hover:bg-pink-900/30 group select-none"
        >
          <div className="max-w-md mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>

              <span className="text-[11px] font-bold text-pink-300 truncate">
                Ближайший ритуал:{' '}
                <span className="text-slate-200 font-medium">{activeBooking.service}</span>
              </span>

              <span className="hidden xs:inline text-[10px] text-slate-400">
                ({activeBooking.time})
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
              <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-pink-300 bg-pink-950/70 group-hover:bg-pink-900/80 px-2 py-0.5 rounded-full border border-pink-500/40 shadow-xs transition-colors">
                <Clock className="w-3 h-3 text-pink-400 animate-pulse" />
                <span>{countdownText || 'Считаем...'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-pink-400/80 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand with AX badge and typography matching screen.png */}
        <div
          id="brand-logo"
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-full border border-pink-500/60 bg-gradient-to-tr from-pink-600 to-purple-950 flex items-center justify-center shadow-neon font-title font-bold text-xs text-white flex-shrink-0 group-hover:scale-105 transition-transform">
            AX
          </div>
          <div className="flex flex-col">
            <span className="font-title text-[13px] font-black tracking-[0.25em] text-white leading-tight">
              ART ХАОС
            </span>
            <span className="text-[9px] font-serif italic text-pink-300/80 -mt-0.5 tracking-wider">
              нежная жесть
            </span>
          </div>
        </div>

        {/* Right side stats & actions matching screen.png */}
        <div className="flex items-center gap-2">
          {/* Tickets badge */}
          <div
            id="user-tickets-badge"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-200"
          >
            <Ticket className="w-3 h-3 text-pink-400" />
            <span className="text-xs font-bold font-title">{tickets}</span>
            <span className="text-[9px] uppercase tracking-wider text-pink-300/70 font-semibold">
              БИЛЕТА
            </span>
          </div>

          {/* Theme switcher */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            aria-label="Сменить тему"
            className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-300 hover:text-white transition"
          >
            {isDarkTheme ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Notifications bell */}
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            aria-label="Уведомления"
            className="relative w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-200 hover:text-white transition"
          >
            <Bell className="w-3.5 h-3.5" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#0f0b12] animate-ping" />
            )}
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#0f0b12]" />
            )}
          </button>

          {/* Quick profile avatar */}
          <button
            id="header-profile-avatar"
            onClick={onOpenProfile}
            title="Профиль"
            className="w-8 h-8 rounded-full overflow-hidden border border-pink-500/50 hover:border-pink-400 transition cursor-pointer flex-shrink-0"
          >
            <img
              src={userAvatar || '/assets/nezhity-avatar.png'}
              alt="Профиль"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

