import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
}

// /* TODO: 画像差し替え用パス: 将来本物のイラスト画像（例: '/assets/title_bg.jpg'）に差し替える場合はこの定数にパスを指定 */
const TITLE_BG_IMAGE_PATH: string = '';

// Upper decorative bunting pennants (Rainbow flags)
const BUNTING_FLAGS = [
  { color: '#EF4444', height: 26 },
  { color: '#F97316', height: 30 },
  { color: '#F59E0B', height: 24 },
  { color: '#10B981', height: 28 },
  { color: '#06B6D4', height: 26 },
  { color: '#3B82F6', height: 32 },
  { color: '#8B5CF6', height: 27 },
  { color: '#EC4899', height: 29 },
  { color: '#F43F5E', height: 25 },
  { color: '#EAB308', height: 31 },
  { color: '#10B981', height: 26 },
];

// Title characters with vibrant colors and staggered floating animation delays
const TITLE_WORD_1 = [
  { char: 'お', color: '#EF4444', delay: '0s' },
  { char: 'え', color: '#F59E0B', delay: '0.18s' },
  { char: 'か', color: '#10B981', delay: '0.36s' },
  { char: 'き', color: '#0EA5E9', delay: '0.54s' },
];

const TITLE_WORD_2 = [
  { char: 'し', color: '#3B82F6', delay: '0.1s' },
  { char: 'り', color: '#8B5CF6', delay: '0.28s' },
  { char: 'と', color: '#EC4899', delay: '0.46s' },
  { char: 'り', color: '#F97316', delay: '0.64s' },
  { char: '！', color: '#EAB308', delay: '0.82s' },
];

// Single floating illustrated motifs scattered gently across the screen,
// including the upper space above the central title card.
// Each is an independent single emoji floating with its own gentle animation.
const FLOATING_MOTIFS = [
  // Upper space directly above the title card (appropriately filling the open space)
  { emoji: '🎨', top: '10%', left: '26%', size: 'text-3xl sm:text-4xl', delay: '0.2s' },
  { emoji: '⭐', top: '9%', right: '28%', size: 'text-2xl sm:text-3xl', delay: '1.0s' },
  { emoji: '🖍️', top: '19%', left: '38%', size: 'text-3xl sm:text-4xl', delay: '1.5s' },
  { emoji: '🍓', top: '18%', right: '36%', size: 'text-3xl sm:text-4xl', delay: '0.6s' },
  { emoji: '🎈', top: '13%', left: '50%', size: 'text-3xl sm:text-4xl', delay: '1.8s' },
  { emoji: '🐱', top: '23%', left: '20%', size: 'text-3xl sm:text-4xl', delay: '1.3s' },
  { emoji: '🐰', top: '22%', right: '20%', size: 'text-3xl sm:text-4xl', delay: '0.4s' },

  // Outer sides (Upper)
  { emoji: '🍎', top: '14%', left: '7%', size: 'text-3xl sm:text-5xl', delay: '0s' },
  { emoji: '🍌', top: '15%', right: '8%', size: 'text-3xl sm:text-5xl', delay: '0.7s' },

  // Outer sides (Middle)
  { emoji: '🦋', top: '38%', left: '5%', size: 'text-2xl sm:text-4xl', delay: '1.2s' },
  { emoji: '🚗', top: '39%', right: '6%', size: 'text-2xl sm:text-4xl', delay: '0.8s' },
  { emoji: '🐢', top: '53%', left: '5%', size: 'text-3xl sm:text-5xl', delay: '0.5s' },
  { emoji: '🐬', top: '54%', right: '5%', size: 'text-3xl sm:text-4xl', delay: '1.4s' },

  // Lower sides & Bottom space (gracefully filling the open space below the start button)
  { emoji: '🐥', top: '63%', left: '23%', size: 'text-3xl sm:text-4xl', delay: '1.2s' },
  { emoji: '🍭', top: '64%', right: '22%', size: 'text-3xl sm:text-4xl', delay: '0.5s' },
  { emoji: '🌸', top: '72%', left: '33%', size: 'text-2xl sm:text-4xl', delay: '1.7s' },
  { emoji: '🎵', top: '73%', right: '32%', size: 'text-2xl sm:text-4xl', delay: '0.8s' },
  { emoji: '🐼', top: '77%', left: '49%', size: 'text-3xl sm:text-4xl', delay: '1.4s' },
  { emoji: '🐘', top: '68%', left: '7%', size: 'text-3xl sm:text-5xl', delay: '0.9s' },
  { emoji: '☂️', top: '67%', right: '7%', size: 'text-3xl sm:text-5xl', delay: '1.6s' },
  { emoji: '🚒', top: '79%', left: '8%', size: 'text-2xl sm:text-4xl', delay: '0.4s' },
  { emoji: '🍇', top: '78%', right: '8%', size: 'text-3xl sm:text-4xl', delay: '1.3s' },
  { emoji: '🚅', top: '86%', left: '16%', size: 'text-2xl sm:text-4xl', delay: '0.3s' },
  { emoji: '☀️', top: '85%', right: '16%', size: 'text-2xl sm:text-4xl', delay: '1.1s' },
  { emoji: '🌻', top: '88%', left: '32%', size: 'text-2xl sm:text-4xl', delay: '0.6s' },
  { emoji: '🐳', top: '87%', right: '33%', size: 'text-2xl sm:text-4xl', delay: '1.0s' },
];

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-between select-none touch-none"
      style={{
        backgroundImage: TITLE_BG_IMAGE_PATH ? `url(${TITLE_BG_IMAGE_PATH})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 
        On-Memory Watercolor & Crayon Paper Background 
      */}
      {!TITLE_BG_IMAGE_PATH && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFFDF7]">
          {/* Soft pastel watercolor perimeter washes */}
          <div className="absolute inset-0 bg-radial from-transparent via-amber-50/40 to-orange-100/35" />

          {/* Top soft pastel watercolor clouds */}
          <div className="absolute -top-10 left-10 w-64 h-64 rounded-full bg-sky-200/35 blur-3xl" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-80 h-64 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute -top-10 right-10 w-64 h-64 rounded-full bg-pink-200/35 blur-3xl" />

          {/* Bottom soft pasture watercolor washes */}
          <div className="absolute -bottom-10 left-8 w-72 h-72 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="absolute -bottom-8 right-8 w-72 h-72 rounded-full bg-purple-200/35 blur-3xl" />
        </div>
      )}

      {/* 
        Single Floating Motifs:
        Standalone single emojis gently floating across the screen and upper space
      */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {FLOATING_MOTIFS.map((m, i) => (
          <div
            key={i}
            className={`absolute flex flex-col items-center ${m.size} drop-shadow-xs`}
            style={{
              top: m.top,
              left: m.left,
              right: m.right,
              animation: `floatGentle 3.4s ease-in-out infinite`,
              animationDelay: m.delay,
            }}
          >
            <span>{m.emoji}</span>
          </div>
        ))}
      </div>

      {/* 
        UPPER AREA: Festive Bunting Garland
      */}
      <div className="relative z-20 pt-2 sm:pt-4 px-3 w-full flex flex-col items-center pointer-events-none">
        {/* Festive SVG Pennants / Bunting Flags Garland */}
        <div className="w-full max-w-lg flex items-start justify-center gap-1 sm:gap-2 px-2 overflow-hidden">
          {BUNTING_FLAGS.map((flag, idx) => (
            <svg
              key={idx}
              width="24"
              height={flag.height}
              viewBox="0 0 24 34"
              fill="none"
              className="drop-shadow-xs flex-shrink-0 animate-in fade-in"
              style={{
                animation: `floatGentle 2.8s ease-in-out infinite`,
                animationDelay: `${idx * 0.15}s`,
              }}
            >
              <polygon points="0,0 24,0 12,32" fill={flag.color} />
              <line x1="0" y1="1" x2="24" y2="1" stroke="#FDE68A" strokeWidth="2" />
            </svg>
          ))}
        </div>
        {/* Colorful hanging pastel dots */}
        <div className="flex items-center gap-2.5 sm:gap-3 mt-2 text-xs sm:text-sm opacity-70">
          <span className="text-red-400">●</span>
          <span className="text-orange-400">●</span>
          <span className="text-yellow-400">●</span>
          <span className="text-emerald-400">●</span>
          <span className="text-sky-400">●</span>
          <span className="text-purple-400">●</span>
          <span className="text-pink-400">●</span>
        </div>
      </div>

      {/* 
        CENTRAL FOCAL GROUP:
        Significantly Enlarged, Ultra-Readable Title directly above Start Button
      */}
      <div className="relative z-20 my-auto flex flex-col items-center gap-4 sm:gap-6 px-3 w-full max-w-md">
        {/* Title Cloud Card */}
        <div className="relative w-full flex flex-col items-center px-4 sm:px-8 py-5 sm:py-7 rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border-4 border-amber-300 ring-4 ring-orange-200/70 pointer-events-none">
          {/* Top Line: 「お え か き」 (Grand, extra-bold, readable) */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-1.5 whitespace-nowrap">
            {TITLE_WORD_1.map((item, idx) => (
              <span
                key={idx}
                className="inline-block font-black text-5xl sm:text-6xl md:text-7xl px-1 sm:px-2 py-0.5 rounded-2xl drop-shadow-sm"
                style={{
                  color: item.color,
                  textShadow: '0 3px 6px rgba(0,0,0,0.16), 0 0 2px rgba(255,255,255,0.9)',
                  animation: `floatLetter 2.2s ease-in-out infinite`,
                  animationDelay: item.delay,
                }}
              >
                {item.char}
              </span>
            ))}
          </div>

          {/* Bottom Line: 「し り と り ！」 (Hero prominence) */}
          <div className="flex items-center justify-center gap-1 sm:gap-2.5 whitespace-nowrap">
            {TITLE_WORD_2.map((item, idx) => (
              <span
                key={idx}
                className="inline-block font-black text-5xl sm:text-7xl md:text-8xl px-1 sm:px-2 py-0.5 rounded-2xl drop-shadow-md"
                style={{
                  color: item.color,
                  textShadow: '0 4px 8px rgba(0,0,0,0.18), 0 0 3px rgba(255,255,255,0.9)',
                  animation: `floatLetter 2.4s ease-in-out infinite`,
                  animationDelay: item.delay,
                }}
              >
                {item.char}
              </span>
            ))}
          </div>
        </div>

        {/* Start Button: Immediately below Title Card */}
        <div className="pointer-events-auto">
          <button
            onClick={onStart}
            className="animate-pulse-btn group relative flex items-center justify-center gap-3 sm:gap-4 px-10 sm:px-14 py-3.5 sm:py-4.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 text-white font-black text-2xl sm:text-3xl tracking-wider shadow-2xl border-4 border-white ring-4 ring-orange-300 active:scale-95 transition-all cursor-pointer"
            aria-label="ゲームをスタートする"
          >
            <Play className="w-7 h-7 sm:w-8 h-8 fill-white drop-shadow-sm group-hover:scale-110 transition-transform" />
            <span className="drop-shadow-md">スタート！</span>
            <Sparkles className="w-6 h-6 sm:w-7 h-7 text-yellow-100 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* BOTTOM FOOTER: Simple and clean encouragement without emoji sequence */}
      <div className="relative z-20 pb-4 px-4 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900/80 bg-white/75 px-4 py-1.5 rounded-full backdrop-blur-xs shadow-xs border border-amber-200/60">
          <span>え で しりとり を つなげてね！</span>
        </div>
      </div>
    </div>
  );
};
