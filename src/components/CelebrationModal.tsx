import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, HeartHandshake } from 'lucide-react';
import { sound } from '../utils/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  drawingImage: string;
  turnNumber: number;
  onNextTurn: () => void;
  onClose: () => void;
}

// 10 patterns of praise phrases (all within 8 characters to prevent wrapping)
const PRAISE_PHRASES: string[] = [
  'すてきだね！',   // 6文字
  'じょうずだね！', // 7文字
  'すごいね！',     // 5文字
  'かっこいい！',   // 6文字
  'かわいいね！',   // 6文字
  'さいこう！',     // 5文字
  'かんぺき！',     // 5文字
  'ばっちり！',     // 5文字
  'いいね！',       // 4文字
  'だいせいこう！', // 7文字
];

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  drawingImage,
  turnNumber,
  onNextTurn,
  onClose,
}) => {
  const [praiseText, setPraiseText] = useState<string>(PRAISE_PHRASES[0]);

  // Pick random praise phrase and fire confetti bursts when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * PRAISE_PHRASES.length);
      setPraiseText(PRAISE_PHRASES[randomIndex]);

      sound.playCelebration();

      // Multi-stage celebratory cracker burst!
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      // Side cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          zIndex: 9999,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          zIndex: 9999,
        });
      }, 250);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    onNextTurn();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-4 border-amber-300 text-slate-800 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Festive Header Banner */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black shadow-md mb-2 tracking-wide">
            <Sparkles className="w-4 h-4 animate-spin text-yellow-200" style={{ animationDuration: '3s' }} />
            <span>{turnNumber}つめ かんせい！</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-2xl font-black text-amber-900 tracking-tight flex items-center justify-center gap-1.5 whitespace-nowrap">
            <span>🎉</span>
            <span>{praiseText}</span>
          </h2>
        </div>

        {/* Thumbnail Preview */}
        <div className="relative mx-auto my-3 w-48 h-48 rounded-2xl bg-amber-50 p-2 shadow-inner border-2 border-amber-200 flex items-center justify-center overflow-hidden">
          {drawingImage ? (
            <img
              src={drawingImage}
              alt="かいた え"
              className="max-h-full max-w-full object-contain rounded-xl"
            />
          ) : (
            <div className="text-xs text-amber-500 font-bold">じゅんびちゅう...</div>
          )}
        </div>

        {/* Handover Notice */}
        <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-black text-orange-900">
            <HeartHandshake className="w-5 h-5 text-orange-500" />
            <span>スマホを次のひとにわたしてね</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-black text-base shadow-lg shadow-orange-500/30 hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <span>つぎの え を かく</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
          >
            かきなおす
          </button>
        </div>
      </div>
    </div>
  );
};
