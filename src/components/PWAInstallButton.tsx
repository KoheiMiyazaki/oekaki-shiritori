import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all"
        title="アプリをスマホにインストール"
      >
        <Download className="w-3.5 h-3.5" />
        <span>インストール</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-50/80 px-2.5 py-1 text-xs font-medium text-orange-800 hover:bg-orange-100 active:scale-95 transition"
          title="ホーム画面に追加してアプリとして遊ぶ"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>アプリ化</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-orange-100 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src="/app-icon.jpg"
                    alt="おえかき しりとり！ アイコン"
                    className="w-8 h-8 rounded-lg shadow-xs object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="text-base font-bold text-slate-800">ホーム画面に追加</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3 p-2 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <p>Safari画面下部の「共有ボタン（四角から上向き矢印）」をタップします。</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <p>メニューを下にスクロールして「ホーム画面に追加」をタップします。</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                  <p>右上の「追加」を押すと、全画面アプリとして遊べるようになります！</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white hover:bg-orange-600 active:scale-98 transition shadow-sm"
              >
                とじる
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
