import React, { useState } from 'react';
import { Palette, Plus, Trash2, Check, Eraser } from 'lucide-react';

interface ColorPaletteProps {
  currentColor: string;
  isEraser: boolean;
  brushSize: number;
  customColors: string[];
  onSelectColor: (color: string) => void;
  onToggleEraser: () => void;
  onSelectBrushSize: (size: number) => void;
  onAddCustomColor: (color: string) => void;
  onRemoveCustomColor: (color: string) => void;
  onCompleteDrawing: () => void;
}

// 17 Standard Palette Colors (including White)
export const DEFAULT_COLORS = [
  '#EF4444', // 赤
  '#B91C1C', // 濃赤
  '#F97316', // オレンジ
  '#F59E0B', // アンバー
  '#EAB308', // 黄色
  '#84CC16', // 黄緑
  '#22C55E', // 緑
  '#059669', // 深緑
  '#06B6D4', // シアン
  '#0EA5E9', // 水色
  '#2563EB', // 青
  '#4338CA', // 藍色
  '#8B5CF6', // 紫
  '#EC4899', // ピンク
  '#854D0E', // 茶色
  '#18181B', // 黒
  '#FFFFFF', // 白
];

export const DEFAULT_COLOR = '#18181B'; // 黒（デフォルト色）
export const DEFAULT_BRUSH_SIZE = 14; // 2番目に太いサイズ（デフォルト太さ）

export const BRUSH_SIZES = [
  { size: 3, label: 'ごくぼそ', dotSize: 3 },
  { size: 7, label: 'ほそめ', dotSize: 6 },
  { size: 14, label: 'ふつう', dotSize: 10 },
  { size: 24, label: 'ふとめ', dotSize: 15 },
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  currentColor,
  isEraser,
  brushSize,
  customColors,
  onSelectColor,
  onToggleEraser,
  onSelectBrushSize,
  onAddCustomColor,
  onRemoveCustomColor,
  onCompleteDrawing,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newColorInput, setNewColorInput] = useState('#ff5500');

  const allColors = [...DEFAULT_COLORS, ...customColors];

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handlePickColor = (color: string) => {
    onSelectColor(color);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColorInput) {
      onAddCustomColor(newColorInput);
      onSelectColor(newColorInput);
      setShowAddModal(false);
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 z-30 flex items-end justify-between gap-2 select-none pointer-events-none">
      {/* 
        左側：線の太さ＆消しゴム（パレットボタンの真上に配置） + パレット開閉ボタン
      */}
      <div className="flex flex-col items-start gap-1.5 pointer-events-auto flex-shrink-0">
        {/* ペンの太さ & 消しゴム（パレットボタンの真上） */}
        <div className="flex flex-col items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-amber-200/90">
          <button
            onClick={onToggleEraser}
            className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-90 ${
              isEraser
                ? 'bg-amber-500 text-white shadow-xs scale-105'
                : 'text-slate-600 hover:bg-amber-50'
            }`}
            title="けしごむ"
            aria-label="けしごむ"
          >
            <Eraser className="w-4 h-4" />
          </button>

          <div className="w-4 h-px bg-amber-200 my-0.5" />

          {BRUSH_SIZES.map((b) => {
            const isSelected = !isEraser && brushSize === b.size;
            return (
              <button
                key={b.size}
                onClick={() => onSelectBrushSize(b.size)}
                title={`ペンの太さ: ${b.label}`}
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-90 ${
                  isSelected
                    ? 'bg-amber-100 ring-2 ring-amber-500 shadow-xs scale-105'
                    : 'hover:bg-amber-50 text-slate-700'
                }`}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: `${b.dotSize}px`,
                    height: `${b.dotSize}px`,
                    backgroundColor: isSelected ? currentColor : '#334155',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* パレット開閉ボタン */}
        <button
          onClick={handleToggleOpen}
          className={`flex items-center justify-center w-11 h-11 rounded-2xl shadow-lg border-2 transition-all active:scale-90 relative ${
            isOpen
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-300 ring-2 ring-orange-300/60'
              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
          }`}
          aria-label="カラーパレットの開閉"
          title="パレットを開閉する"
        >
          <Palette className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-12 scale-110' : ''}`} />
          <span
            className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-xs"
            style={{ backgroundColor: isEraser ? '#ffffff' : currentColor }}
          />
        </button>
      </div>

      {/* 
        中央：スライド展開カラーパレット
        ※ flex-1 min-w-0 により、左のパレットボタンと右の「かんせい」ボタンの間のスペースのみを占有。
        絶対に「かんせい」ボタンと被りません。
      */}
      <div
        className={`flex-1 min-w-0 overflow-x-auto no-scrollbar py-1 transition-all duration-300 ease-out flex items-center pointer-events-auto ${
          isOpen
            ? 'opacity-100 translate-x-0'
            : 'w-0 max-w-0 opacity-0 -translate-x-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200/90 whitespace-nowrap">
          {allColors.map((color, idx) => {
            const isSelected = !isEraser && currentColor.toUpperCase() === color.toUpperCase();
            const isCustom = idx >= DEFAULT_COLORS.length;
            const isWhite = color.toUpperCase() === '#FFFFFF';

            return (
              <div key={`${color}-${idx}`} className="relative group flex-shrink-0">
                <button
                  onClick={() => handlePickColor(color)}
                  className={`w-7 h-7 rounded-xl shadow-xs transition-all active:scale-90 flex items-center justify-center relative ${
                    isSelected
                      ? 'ring-2 ring-orange-500 ring-offset-2 scale-110 z-10 shadow-md'
                      : isWhite
                      ? 'border-2 border-slate-300 hover:scale-105'
                      : 'hover:scale-105 border border-black/10'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`色: ${color}`}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 drop-shadow-xs ${
                        ['#EAB308', '#84CC16', '#FFFFFF', '#06B6D4'].includes(color.toUpperCase())
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>

                {isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCustomColor(color);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-70 hover:opacity-100 shadow-xs"
                    title="この色を削除"
                  >
                    <Trash2 className="w-2 h-2" />
                  </button>
                )}
              </div>
            );
          })}

          {/* "+ 追加" ボタン */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-7 h-7 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 shadow-xs"
            title="新しい色を追加する"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 
        右側：「かんせい」ボタン
        flex-shrink-0 により、中央のパレットに押し出されたり被られたりすることが一切ありません
      */}
      <button
        onClick={onCompleteDrawing}
        className="h-11 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-500/25 border border-white/70 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center tracking-wider flex-shrink-0 pointer-events-auto"
        aria-label="え を かんせいさせて つぎへ"
        title="え を かんせいさせて つぎの ひとへ"
      >
        かんせい
      </button>

      {/* カラーピッカーモーダル */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 pointer-events-auto">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl border border-amber-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-orange-500" />
              <span>あたらしい いろ を ついか</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newColorInput}
                  onChange={(e) => setNewColorInput(e.target.value)}
                  className="w-14 h-14 rounded-xl cursor-pointer border border-gray-200 p-0.5 bg-white shadow-inner"
                />
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    カラーコード
                  </label>
                  <input
                    type="text"
                    value={newColorInput.toUpperCase()}
                    onChange={(e) => setNewColorInput(e.target.value)}
                    className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase"
                  />
                </div>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 mb-1.5">おすすめの いろ</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '#FF4081',
                    '#7C4DFF',
                    '#00E5FF',
                    '#76FF03',
                    '#FFD600',
                    '#FF6D00',
                    '#A1887F',
                    '#90A4AE',
                  ].map((hex) => (
                    <button
                      type="button"
                      key={hex}
                      onClick={() => setNewColorInput(hex)}
                      className="w-6 h-6 rounded-lg border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  やめる
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md transition"
                >
                  ついか する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
