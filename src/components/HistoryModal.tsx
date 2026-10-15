import React, { useState } from 'react';
import {
  X,
  History,
  Trash2,
  ArrowDown,
  AlertTriangle,
  HardDrive,
  ZoomIn,
} from 'lucide-react';
import { DrawingRecord, storage } from '../utils/storage';

interface HistoryModalProps {
  isOpen: boolean;
  history: DrawingRecord[];
  onClose: () => void;
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onClearHistory,
  onDeleteRecord,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<DrawingRecord | null>(null);

  if (!isOpen) return null;

  const storageKB = storage.getStorageUsageKB();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[90vh] max-h-[750px] rounded-3xl bg-amber-50/95 shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-white border-b border-amber-200/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-950 flex items-center gap-1.5">
                <span>しりとりのりれき</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                  {history.length}まい
                </span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <HardDrive className="w-3 h-3 text-amber-600" />
                <span>データ使用量: 約 {storageKB} KB</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition active:scale-95"
            aria-label="とじる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 history-scroll">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-3xl bg-amber-100/80 flex items-center justify-center mb-3 text-2xl shadow-inner">
                🎨
              </div>
              <p className="font-bold text-sm text-slate-700 mb-1">まだ しりとりのりれき が ないよ</p>
              <p className="text-xs leading-relaxed max-w-xs text-slate-500">
                え を かいて「かんせい」をおすと、ここに ならぶよ！
              </p>
            </div>
          ) : (
            <div className="space-y-4 relative">
              {history.map((record, index) => {
                const dateStr = new Date(record.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={record.id} className="relative">
                    {/* Downward connecting chain arrow */}
                    {index > 0 && (
                      <div className="flex items-center justify-center -my-2.5 mb-1 text-orange-400">
                        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 shadow-xs border border-orange-200 text-[10px] font-bold text-orange-600">
                          <ArrowDown className="w-3 h-3 animate-bounce" />
                          <span>しりとり バトンタッチ！</span>
                        </div>
                      </div>
                    )}

                    {/* Relay Card */}
                    <div className="bg-white rounded-2xl p-3 shadow-md border-2 border-amber-200/90 hover:border-orange-300 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                            {record.turn}
                          </span>
                          <span className="text-xs font-black text-amber-950">
                            {record.turn}つめ の え
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {dateStr}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="この え を けす"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Drawing Image */}
                      <div
                        onClick={() => setZoomedImage(record)}
                        className="relative w-full aspect-4/3 rounded-xl bg-amber-50/50 p-2 border border-amber-100 flex items-center justify-center overflow-hidden cursor-pointer group shadow-inner"
                      >
                        <img
                          src={record.thumbnail}
                          alt={`${record.turn}つめの え`}
                          className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-102 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-white/90 text-slate-700 shadow-md transition-opacity">
                            <ZoomIn className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer controls */}
        {history.length > 0 && (
          <div className="p-3 bg-white border-t border-amber-200/80 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>りれき を ぜんぶ けす</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition"
            >
              とじる
            </button>
          </div>
        )}

        {/* Clear All Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl border-2 border-red-300 text-center animate-in zoom-in-95 duration-150">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-1">りれき を ぜんぶ けしますか？</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                これまで かいた え が ぜんぶ きえるよ。
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  やめる
                </button>
                <button
                  onClick={() => {
                    onClearHistory();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition"
                >
                  けす
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Zoomed Image Viewer Modal */}
        {zoomedImage && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-3xl bg-white p-4 shadow-2xl text-center relative">
              <button
                onClick={() => setZoomedImage(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="text-sm font-black text-amber-950 mb-3">
                {zoomedImage.turn}つめ の え
              </h4>

              <div className="rounded-2xl bg-amber-50 p-2 border border-amber-200 max-h-[60vh] flex items-center justify-center overflow-hidden">
                <img
                  src={zoomedImage.thumbnail}
                  alt={`${zoomedImage.turn}つめの え`}
                  className="max-h-[55vh] max-w-full object-contain rounded-xl"
                />
              </div>

              <div className="mt-3 flex items-center justify-center">
                <button
                  onClick={() => setZoomedImage(null)}
                  className="w-full py-2.5 rounded-xl bg-gray-100 text-slate-700 font-bold text-xs hover:bg-gray-200 transition"
                >
                  とじる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
