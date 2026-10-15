import React from 'react';
import { X, Sparkles, HelpCircle, Smartphone, ArrowRight, Palette } from 'lucide-react';
import { sound } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-4 border-amber-300 text-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-amber-950">あそびかた</h3>
          </div>
          <button
            onClick={() => {
              sound.playPop(400);
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-[11px]">
              1
            </span>
            <div>
              <p className="font-bold text-amber-950 mb-0.5">パレットから色を選んで え を描こう！</p>
              <p className="text-slate-600">
                左下のパレットボタンを押すと16色のカラーがスライド登場。ペンの太さや消しゴムも選べます。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-[11px]">
              2
            </span>
            <div>
              <p className="font-bold text-orange-950 mb-0.5">「かんせい！」を押して手渡し！</p>
              <p className="text-slate-600">
                描き終わったら右下の「かんせい！」をタップ。クラッカーが鳴ったら、つぎの人にスマホを手渡します。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-[11px]">
              3
            </span>
            <div>
              <p className="font-bold text-amber-950 mb-0.5">まえの え から しりとり を つなげる！</p>
              <p className="text-slate-600">
                つぎの人は前の人が描いた え（れい: りんご🍎）につづく言葉（れい: ごりら🦍）を考えて え を描きます。何を描いたかは口頭で楽しく伝え合おう！
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-[11px]">
              4
            </span>
            <div>
              <p className="font-bold text-orange-950 mb-0.5">左上の「りれき」で楽しもう！</p>
              <p className="text-slate-600">
                何人繋がったか、どんなリレーになったかをいつでもみんなで鑑賞できます。
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop(500);
            onClose();
          }}
          className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-md hover:brightness-105 active:scale-98 transition"
        >
          わかった！遊ぶ！
        </button>
      </div>
    </div>
  );
};
