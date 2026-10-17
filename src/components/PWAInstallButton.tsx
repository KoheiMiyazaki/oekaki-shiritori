import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'title';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(isIOS ? 'ios' : 'android');

  // If already installed and running standalone:
  if (isInstalled) {
    if (variant === 'title') {
      return (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 text-emerald-700 text-[11px] font-bold border border-emerald-200/90 shadow-2xs backdrop-blur-xs">
          <Check className="w-3 h-3 text-emerald-600" />
          <span>インストール済み</span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'title' ? (
        /* Title Screen Top-Right Unobtrusive Button */
        <button
          onClick={handleClick}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white active:scale-95 text-slate-700 hover:text-orange-600 font-bold text-xs shadow-xs border border-amber-200/80 backdrop-blur-xs transition-all cursor-pointer"
          title="スマートフォンにインストール"
          aria-label="インストール"
        >
          <span className="text-sm leading-none" role="img" aria-label="インストール">📲</span>
          <span>インストール</span>
        </button>
      ) : (
        /* In-game header compact button */
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all cursor-pointer"
          title="スマートフォンにインストール"
          aria-label="インストール"
        >
          <span className="text-xs leading-none" role="img" aria-label="インストール">📲</span>
          <span>インストール</span>
        </button>
      )}

      {/* Installation Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border-2 border-orange-200 text-slate-800 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div className="flex items-center gap-2.5">
                <img
                  src="./app-icon.jpg"
                  alt="おえかき しりとり！ アイコン"
                  className="w-10 h-10 rounded-xl shadow-xs object-cover border border-amber-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-black text-slate-800">アプリをインストール</h3>
                  <p className="text-[11px] font-medium text-amber-700">おえかき しりとり！</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-orange-50 active:scale-90 transition-all cursor-pointer"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct install button if browser supports it */}
            {isInstallable && (
              <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md">
                <p className="text-xs font-bold text-orange-100 mb-1.5">ワンタップでインストール可能：</p>
                <button
                  onClick={async () => {
                    await install();
                    setShowGuide(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white text-orange-600 font-black text-sm shadow-sm hover:bg-orange-50 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>今すぐインストールする</span>
                </button>
              </div>
            )}

            {/* OS Tabs */}
            <div className="mt-4 flex rounded-xl bg-orange-100/70 p-1">
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'ios'
                    ? 'bg-white text-orange-700 shadow-xs'
                    : 'text-amber-800 hover:text-orange-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'android'
                    ? 'bg-white text-orange-700 shadow-xs'
                    : 'text-amber-800 hover:text-orange-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android / Chrome</span>
              </button>
            </div>

            {/* Steps */}
            <div className="mt-4 space-y-2.5 text-xs text-slate-700">
              {activeTab === 'ios' ? (
                <>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    <p className="leading-relaxed">
                      Safari画面下部（iPadは上部）の<strong className="text-orange-600">「共有ボタン（四角から上向き矢印）」</strong>をタップします。
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px] font-black">
                      2
                    </span>
                    <p className="leading-relaxed">
                      メニューを少し下へスクロールし、<strong className="text-orange-600">「ホーム画面に追加」</strong>をタップします。
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px] font-black">
                      3
                    </span>
                    <p className="leading-relaxed">
                      右上の<strong className="text-orange-600">「追加」</strong>を押すと、ホーム画面にアプリアイコンが追加されます！
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    <p className="leading-relaxed">
                      Chromeブラウザ右上にある<strong className="text-orange-600">「︙（メニュー）」</strong>ボタンをタップします。
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px] font-black">
                      2
                    </span>
                    <p className="leading-relaxed">
                      メニュー内から<strong className="text-orange-600">「アプリをインストール」</strong>または<strong className="text-orange-600">「ホーム画面に追加」</strong>をタップします。
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px] font-black">
                      3
                    </span>
                    <p className="leading-relaxed">
                      画面の案内に従って「インストール」を押すと完了です！
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Benefits Note */}
            <div className="mt-3.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <span className="text-sm">✨</span>
              <span>全画面で快適に遊べ、オフラインでもそのままプレイできます！</span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 py-2.5 text-xs font-black text-white transition shadow-sm cursor-pointer"
            >
              とじる
            </button>
          </div>
        </div>
      )}
    </>
  );
};
