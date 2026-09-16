import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Wand2,
  Image as ImageIcon,
  BookOpen,
  ExternalLink,
  Flame,
  Terminal,
  Heart,
  Dices,
  MessageCircleHeart,
  X,
  RefreshCw,
  Droplets,
  Crown,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TabType, GallerySet, ActiveBooking } from '../../types';
import { GALLERY_SETS } from '../../data/servicesData';

interface HomeScreenProps {
  isDarkTheme: boolean;
  onNavigate: (tab: TabType) => void;
  onOpenAiBuilder: () => void;
  onSelectSetToBook: (set: GallerySet) => void;
  cuticleApplied: boolean;
  onToggleCuticleCare: () => void;
  careDays: number;
  tickets?: number;
  onConsoleButtonClick?: () => void;
  activeBooking?: ActiveBooking | null;
  onOpenBookingDetails?: () => void;
}

const NEZHITY_SPEECHES = [
  'Хей! Твои ноготки сегодня заслуживают фирменной магии и дерзости! ✨',
  'Не забудь нанести масло на кутикулу перед сном! Капельки творят чудеса 🩸',
  'Укрепление прочным гелем и спа-парафин сегодня за мой счёт! ♡',
  'Загляни в Колесо Фортуны — у тебя есть бесплатная попытка на приз! 🎁',
  'Нравится мой чокер с сердечком? Тебе тоже такой стиль пойдёт! 🦇',
  'Черный глянец + хром — главный тренд сезона в ART XAOC! 🖤',
];

export type MascotEmotion = 'hello' | 'joy' | 'thinking';

export const MASCOT_EMOTIONS: Record<
  MascotEmotion,
  { src: string; title: string; badge: string; quote: string; short: string }
> = {
  hello: {
    src: '/assets/art-haos-nezhity-transparent-hello.png',
    title: 'Нежить: Приветствие ♡',
    badge: 'Привет ♡',
    short: 'Приветствие',
    quote: '«Привет! Я Нежить. Твои ноготки заслуживают дерзкой заботы и фирменной магии ART XAOC ♡»',
  },
  joy: {
    src: '/assets/art-haos-nezhity-transparent-hello.png',
    title: 'Нежить: Восторг!',
    badge: 'Восторг! ✨',
    short: 'Восторг',
    quote: '«Ура-а! Отличный выбор! Сделаем безупречно дерзкий и стойкий маникюр! ✨»',
  },
  thinking: {
    src: '/assets/art-haos-nezhity-transparent-hello.png',
    title: 'Нежить: Раздумья ?',
    badge: 'Выбор ?',
    short: 'В раздумьях',
    quote: '«Хм-м... Какой дизайн выберем сегодня: острый готический стилет или нежный корейский градиент? 🤔»',
  },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  isDarkTheme,
  onNavigate,
  onOpenAiBuilder,
  onSelectSetToBook,
  cuticleApplied,
  onToggleCuticleCare,
  careDays,
  tickets = 4,
  onConsoleButtonClick,
  activeBooking,
  onOpenBookingDetails,
}) => {
  const [consoleFeedback, setConsoleFeedback] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>('hello');
  const [activeMascotQuote, setActiveMascotQuote] = useState(
    MASCOT_EMOTIONS.hello.quote
  );
  const [mascotBubbleKey, setMascotBubbleKey] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(['set-1']);
  const [highlightedSetId, setHighlightedSetId] = useState<string | null>(null);
  const [selectedRandomSet, setSelectedRandomSet] = useState<GallerySet | null>(null);

  // Play audio chime for random choice celebration
  const playRandomChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.28);
      });
    } catch {
      // ignore
    }
  };

  // Interactive Button requested by USER: logs "Кнопка нажата!" into browser console
  const handleConsoleLogAction = () => {
    console.log('Кнопка нажата!');
    if (onConsoleButtonClick) {
      onConsoleButtonClick();
    }
    setConsoleFeedback(true);
    setTimeout(() => {
      setConsoleFeedback(false);
    }, 2800);
  };

  // Interactive Mascot Tap: switches emotion & plays speech + confetti
  const handleMascotTap = () => {
    // Cycle emotions: hello -> joy -> thinking -> hello
    const nextEmotion: MascotEmotion =
      mascotEmotion === 'hello'
        ? 'joy'
        : mascotEmotion === 'joy'
        ? 'thinking'
        : 'hello';
    setMascotEmotion(nextEmotion);

    const randomSpeech =
      Math.random() > 0.4
        ? MASCOT_EMOTIONS[nextEmotion].quote
        : NEZHITY_SPEECHES[Math.floor(Math.random() * NEZHITY_SPEECHES.length)];

    setActiveMascotQuote(randomSpeech);
    setMascotBubbleKey((prev) => prev + 1);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.35, x: 0.75 },
        colors: ['#f43f5e', '#ec4899', '#ffffff', '#a855f7'],
      });
    } catch {
      // ignore
    }
  };

  // Toggle Favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Random Set Picker (Случайный выбор)
  const handleRandomPick = () => {
    const randomIndex = Math.floor(Math.random() * GALLERY_SETS.length);
    const chosen = GALLERY_SETS[randomIndex];
    setHighlightedSetId(chosen.id);
    setSelectedRandomSet(chosen);
    setMascotEmotion('joy');
    setActiveMascotQuote(`«Ура! Я выбрала для тебя сет «${chosen.title}»! Тебе точно понравится! ♡»`);
    setMascotBubbleKey((prev) => prev + 1);
    playRandomChime();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#ec4899', '#db2777', '#a855f7', '#fb7185'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setHighlightedSetId(null);
    }, 5000);
  };

  return (
    <div id="screen-home" className="flex flex-col gap-5 pb-24 animate-in fade-in duration-300">
      {/* CONSOLE FEEDBACK TOAST (Active when console button is pressed) */}
      {consoleFeedback && (
        <div
          id="console-toast-banner"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 backdrop-blur-xl text-emerald-200 text-xs shadow-[0_8px_32px_rgba(16,185,129,0.3)] flex items-center justify-between animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <strong className="text-white block font-bold">Кнопка нажата!</strong>
              <span className="text-[11px] text-emerald-300">
                Сообщение «Кнопка нажата!» выведено в консоль.
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
            console.log
          </span>
        </div>
      )}

      {/* 1. HERO BANNER - Exact match to screen.png with Nezhity mascot */}
      <div
        id="hero-mascot-card"
        className="glassmorphism rounded-3xl p-5 border border-pink-500/30 shadow-neon relative overflow-hidden flex items-center justify-between transition-all duration-300"
      >
        {/* Ambient Neon Glow behind mascot */}
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-pink-500/30 rounded-full blur-2xl pointer-events-none" />

        {/* Left column: Text & Actions */}
        <div className="flex-1 pr-2 z-10 min-w-0">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-pink-950/60 border border-pink-500/40 text-[10px] text-pink-200 uppercase tracking-widest font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEZHYT · ONLINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-title text-white leading-tight">
            Привет, <span className="font-serif italic font-normal text-pink-300">Ангелина ♡</span>
          </h1>

          <p
            id="hero-mascot-speech"
            onClick={handleMascotTap}
            title="Нажми, чтобы Нежить сказала что-то новое!"
            className="text-xs sm:text-sm text-pink-200/90 mt-1.5 leading-relaxed cursor-pointer hover:text-pink-100 transition break-words"
          >
            {activeMascotQuote || '«Красота без компромиссов. Твои ноготки заслуживают дерзкой заботы и фирменной магии». '}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              id="hero-btn-book"
              onClick={() => onNavigate('booking')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-[#c2185b] text-white text-xs font-bold tracking-wide shadow-neon hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
            >
              <span>Записаться</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="hero-btn-ask-nezhity"
              onClick={() => onNavigate('nezhity')}
              className="px-3 py-2 rounded-xl bg-white/5 border border-pink-500/40 hover:bg-pink-500/15 text-pink-200 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Спросить Нежить</span>
            </button>
          </div>
        </div>

        {/* Right column: Interactive Nezhity Mascot with Floating Micro-Animation */}
        <div className="relative flex-shrink-0 flex flex-col items-center select-none z-10">
          <motion.div
            id="mascot-avatar-interactive"
            onClick={handleMascotTap}
            title="Нажми на Нежить!"
            className="relative cursor-pointer"
            whileHover={{
              y: [0, -6, 0, -3, 0],
              rotate: [0, -2, 0, 2, 0],
              scale: 1.05,
              transition: {
                y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
                rotate: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' },
                scale: { duration: 0.2, ease: 'easeOut' },
              },
            }}
            whileTap={{ scale: 0.94 }}
          >
            <motion.img
              id="hero-mascot-avatar-image"
              key={mascotEmotion}
              src={MASCOT_EMOTIONS[mascotEmotion].src}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('art-haos-nezhity-transparent-hello.png')) {
                  target.src = '/assets/art-haos-nezhity-transparent-hello.png';
                }
              }}
              alt={MASCOT_EMOTIONS[mascotEmotion].title}
              referrerPolicy="no-referrer"
              className="w-32 sm:w-40 max-h-52 object-contain mascot-rim-glow transition-all"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          {/* Quick emotion pills */}
          <div className="flex items-center gap-1 mt-1">
            {(['hello', 'joy', 'thinking'] as MascotEmotion[]).map((emo) => {
              const isActive = mascotEmotion === emo;
              return (
                <button
                  key={emo}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMascotEmotion(emo);
                    setActiveMascotQuote(MASCOT_EMOTIONS[emo].quote);
                    setMascotBubbleKey((prev) => prev + 1);
                  }}
                  title={MASCOT_EMOTIONS[emo].short}
                  className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold transition-all ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-xs scale-105'
                      : 'bg-white/10 text-pink-300/70 hover:bg-white/20'
                  }`}
                >
                  {emo === 'hello' ? '♡' : emo === 'joy' ? '✨' : '💭'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN WIDGET GRID (Matches screen.png) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left widget: УХОД НЕДЕЛИ */}
        <div
          id="widget-weekly-care"
          className="glassmorphism rounded-2xl p-4 border border-pink-500/20 shadow-neon flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1">
              Уход недели <span className="text-rose-500">🩸</span>
            </span>
            <Flame className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-title text-pink-400">{careDays}</span>
              <span className="text-xs text-slate-400">/ 7 дней</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-pink-950/40 overflow-hidden mt-1.5 border border-pink-500/20">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                style={{ width: `${(careDays / 7) * 100}%` }}
              />
            </div>
          </div>

          <button
            id="btn-toggle-cuticle"
            onClick={onToggleCuticleCare}
            className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-between transition-colors ${
              cuticleApplied
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 hover:bg-white/10 border border-pink-500/20 text-pink-200'
            }`}
          >
            <span className="truncate">
              {cuticleApplied ? 'Масло нанесено' : 'Нанести масло'}
            </span>
            <CheckCircle2
              className={`w-3.5 h-3.5 flex-shrink-0 ${
                cuticleApplied ? 'text-emerald-400' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Right widget: ART ATELIER HIGHLIGHT */}
        <div
          id="widget-atelier-featured"
          className="glassmorphism rounded-2xl p-4 border border-pink-500/20 shadow-neon flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
              ART ATELIER
            </span>
            <span className="text-xs font-bold text-pink-400">3 400 ₽</span>
          </div>

          <div className="my-1.5">
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-xs truncate text-white">GOTH BARBIE NEON</h3>
              <span className="px-1 py-0.2 text-[8px] font-black uppercase rounded bg-pink-600 text-white">
                NEW
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              Неоновый градиент & пирсинг
            </p>
            <div className="text-[9px] font-semibold text-pink-400/80 mt-1">
              AI-концепт · не портфолио
            </div>
          </div>

          <button
            id="btn-want-goth-barbie"
            onClick={() => onNavigate('booking')}
            className="w-full py-1.5 px-2 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <span>Хочу такой</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. ACTIVE APPOINTMENT STATUS CARD */}
      {activeBooking ? (
        <div
          id="card-active-appointment"
          onClick={onOpenBookingDetails}
          className="glassmorphism rounded-2xl p-4 border border-pink-500/30 shadow-neon cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 text-[9px] font-extrabold uppercase tracking-widest border border-pink-500/30">
                  {activeBooking.status || 'Запись подтверждена'}
                </span>
                <span className="text-[10px] text-slate-400">Студия «Нежная жесть»</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-pink-200 mt-1 font-title">
                {activeBooking.service}
              </h4>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                <span>
                  Мастер: <strong className="text-pink-200">{activeBooking.master}</strong> · {activeBooking.date}, {activeBooking.time}
                </span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-300 flex-shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      ) : (
        <div
          id="card-no-active-appointment"
          onClick={() => onNavigate('booking')}
          className="glassmorphism rounded-2xl p-4 border border-pink-500/20 shadow-neon cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-pink-200">
                  Нет активных записей
                </h4>
                <p className="text-[11px] text-slate-400">
                  Выбери ритуал и удобное время у Ангелины
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('booking');
              }}
              className="px-3 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-bold whitespace-nowrap"
            >
              Записаться
            </button>
          </div>
        </div>
      )}

      {/* 4. QUICK ACTION BAR (Interactive Console Button & Random Picker) */}
      <div
        id="interactive-actions-bar"
        className="glassmorphism p-3 rounded-2xl border border-pink-500/20 flex items-center justify-between gap-2 transition-all"
      >
        {/* The requested interactive console button */}
        <button
          id="btn-console-log-main"
          onClick={handleConsoleLogAction}
          type="button"
          title="Выводит 'Кнопка нажата!' в консоль браузера"
          className="flex-1 py-2 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
        >
          <Terminal className="w-3.5 h-3.5 text-pink-400" />
          <span>Консоль-кнопка</span>
        </button>

        {/* Interactive Random Set Picker */}
        <button
          id="btn-random-pick-set"
          onClick={handleRandomPick}
          type="button"
          title="Случайный выбор сета от Нежити"
          className="py-2 px-3.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all text-purple-300 hover:text-purple-200 shadow-xs"
        >
          <Dices className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Случайный выбор</span>
        </button>
      </div>

      {/* 5. QUICK NAVIGATION TILES */}
      <div className="quick-tiles-adaptive grid">
        {/* Tile 1: AI BUILDER */}
        <button
          id="tile-ai-builder"
          onClick={onOpenAiBuilder}
          className="glassmorphism flex flex-col items-center justify-center p-3 rounded-2xl border border-pink-500/20 text-center transition-all active:scale-95 hover:border-pink-500/40"
        >
          <div className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-1.5">
            <Wand2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white">AI BUILDER</span>
          <span className="text-[10px] text-slate-400">Конструктор</span>
        </button>

        {/* Tile 2: ЗАПИСЬ */}
        <button
          id="tile-booking"
          onClick={() => onNavigate('booking')}
          className="glassmorphism flex flex-col items-center justify-center p-3 rounded-2xl border border-pink-500/20 text-center transition-all active:scale-95 hover:border-pink-500/40"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-1.5">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white">ЗАПИСЬ</span>
          <span className="text-[10px] text-slate-400">Слоты к мастеру</span>
        </button>

        {/* Tile 3: NAIL DIARY */}
        <button
          id="tile-nail-diary"
          onClick={() => onNavigate('profile')}
          className="glassmorphism flex flex-col items-center justify-center p-3 rounded-2xl border border-pink-500/20 text-center transition-all active:scale-95 hover:border-pink-500/40"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-1.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white">NAIL DIARY</span>
          <span className="text-[10px] text-slate-400">История сетов</span>
        </button>

        {/* Tile 4: CLUB & FORTUNA */}
        <button
          id="tile-wheel-club"
          onClick={() => onNavigate('club')}
          className="glassmorphism flex flex-col items-center justify-center p-3 rounded-2xl border border-pink-500/20 text-center transition-all active:scale-95 hover:border-pink-500/40"
        >
          <div className="w-8 h-8 rounded-xl bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center mb-1.5">
            <Crown className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white">КОЛЕСО</span>
          <span className="text-[10px] text-slate-400">Клуб бонусов</span>
        </button>
      </div>

      {/* 6. STUDIO LOCATION & DIRECT CONTACTS CARD */}
      <div
        id="card-studio-location-info"
        className="glassmorphism p-4 rounded-3xl border border-pink-500/20 flex flex-col gap-3 transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-pink-300 font-title">
                Студия ART XAOC · «Нежная жесть»
              </h3>
              <p className="text-[11px] text-slate-400">
                Топ-мастер Ангелина · Приём один на один в уютной студии
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">📍 Адрес студии</span>
            <span className="font-medium text-slate-200">ул. Мате Залка, д. 25</span>
            <span className="text-[11px] text-slate-400">вход с торца дома</span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">📞 Контакты & Запись</span>
            <div className="flex flex-wrap items-center gap-x-2 text-[11px]">
              <a href="tel:89279973780" className="hover:text-pink-300 transition-colors font-medium text-slate-200">8 (927) 997-37-80</a>
              <span>·</span>
              <a href="tel:89806082670" className="hover:text-pink-300 transition-colors font-medium text-slate-200">8 (980) 608-26-70</a>
            </div>
            <a
              href="https://t.me/Ni_Gelya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-pink-300 hover:text-pink-200 font-semibold flex items-center gap-1 mt-0.5"
            >
              <span>Telegram: @Ni_Gelya</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 7. WHEEL OF FORTUNE BANNER */}
      <div
        id="banner-wheel-club"
        className="glassmorphism relative overflow-hidden rounded-3xl p-4 border border-pink-500/30 shadow-neon transition-all"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center shadow-md animate-bounce">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                КОЛЕСО ФОРТУНЫ В CLUB
              </span>
              <span className="text-xs text-slate-300">
                У тебя есть 1 бесплатная попытка!
              </span>
            </div>
          </div>

          <button
            id="btn-spin-wheel-banner"
            onClick={() => onNavigate('club')}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
          >
            <span>Крутить</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RANDOM SET SUGGESTION MODAL («Случайный выбор») */}
      {selectedRandomSet && (
        <div
          id="modal-random-set-choice"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedRandomSet(null)}
        >
          <div
            className={`relative w-full max-w-sm rounded-3xl p-5 border shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 duration-200 ${
              isDarkTheme
                ? 'bg-[#180f24] border-pink-500/40 text-slate-100'
                : 'bg-white border-pink-200 text-slate-900 shadow-xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / close */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-pink-500/40 shadow-sm flex-shrink-0">
                  <img
                    src="/assets/art-haos-nezhity-transparent-hello.png"
                    alt="Нежить"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400 block">
                    Выбор Нежити ✨
                  </span>
                  <h3 className="font-serif font-bold text-sm text-pink-300">
                    Случайный сет дня
                  </h3>
                </div>
              </div>
              <button
                id="btn-close-random-modal"
                onClick={() => setSelectedRandomSet(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Set Preview Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-3 group">
              <img
                src={selectedRandomSet.imageUrl}
                alt={selectedRandomSet.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-pink-500/40 text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                {selectedRandomSet.category}
              </div>
              <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-pink-600 text-white font-serif font-bold text-sm shadow-md">
                {selectedRandomSet.price.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1 mb-4">
              <h4 className="font-serif font-bold text-lg text-pink-300">
                {selectedRandomSet.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedRandomSet.description}
              </p>
              {selectedRandomSet.tags && selectedRandomSet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {selectedRandomSet.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                id="btn-reroll-random-set"
                onClick={handleRandomPick}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ещё вариант</span>
              </button>

              <button
                id="btn-book-random-set"
                onClick={() => {
                  const set = selectedRandomSet;
                  setSelectedRandomSet(null);
                  onSelectSetToBook(set);
                }}
                className="flex-[1.5] py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(219,39,119,0.35)] transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Записаться на сет</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
