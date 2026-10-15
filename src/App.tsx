import React, { useState, useRef, useEffect } from 'react';
import {
  History,
  Undo2,
  Redo2,
  RotateCcw,
} from 'lucide-react';
import { TitleScreen } from './components/TitleScreen';
import { DrawingCanvas, DrawingCanvasHandle } from './components/DrawingCanvas';
import {
  ColorPalette,
  DEFAULT_COLOR,
  DEFAULT_BRUSH_SIZE,
} from './components/ColorPalette';
import { CelebrationModal } from './components/CelebrationModal';
import { HistoryModal } from './components/HistoryModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { storage, DrawingRecord } from './utils/storage';

export default function App() {
  const canvasRef = useRef<DrawingCanvasHandle | null>(null);

  // App screen state ('title' | 'game')
  const [currentScreen, setCurrentScreen] = useState<'title' | 'game'>('title');
  const [isBlackOverlay, setIsBlackOverlay] = useState<boolean>(false);

  // Drawing tool state (Default: Black color, 2nd thickest brush size)
  const [currentColor, setCurrentColor] = useState<string>(DEFAULT_COLOR);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);
  const [customColors, setCustomColors] = useState<string[]>([]);

  // Game state
  const [turn, setTurn] = useState<number>(1);
  const [history, setHistory] = useState<DrawingRecord[]>([]);

  // Modals & UI states
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [completedImage, setCompletedImage] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Initialize state: Clear history every time the app loads as requested
  useEffect(() => {
    storage.clearHistory();
    setHistory([]);
    setTurn(1);

    const loadedCustomColors = storage.getCustomColors();
    setCustomColors(loadedCustomColors);
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast((curr) => (curr === msg ? null : curr));
    }, 2400);
  };

  const handleStrokeChange = (canUndoVal?: boolean, canRedoVal?: boolean) => {
    if (typeof canUndoVal === 'boolean' && typeof canRedoVal === 'boolean') {
      setCanUndo(canUndoVal);
      setCanRedo(canRedoVal);
    } else if (canvasRef.current) {
      setCanUndo(canvasRef.current.canUndo);
      setCanRedo(canvasRef.current.canRedo);
    }
  };

  const handleSelectColor = (color: string) => {
    setIsEraser(false);
    setCurrentColor(color);
  };

  const handleToggleEraser = () => {
    setIsEraser((prev) => !prev);
  };

  const handleAddCustomColor = (newColor: string) => {
    const updated = storage.saveCustomColor(newColor);
    setCustomColors(updated);
    triggerToast('あたらしい いろを パレットに ついかしたよ！');
  };

  const handleRemoveCustomColor = (colorToRemove: string) => {
    const updated = storage.removeCustomColor(colorToRemove);
    setCustomColors(updated);
    if (currentColor.toUpperCase() === colorToRemove.toUpperCase()) {
      setCurrentColor(DEFAULT_COLOR);
    }
  };

  const handleUndo = () => {
    if (canvasRef.current && canvasRef.current.canUndo) {
      canvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current && canvasRef.current.canRedo) {
      canvasRef.current.redo();
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      setShowClearConfirm(false);
      setCanUndo(false);
      setCanRedo(false);
    }
  };

  // When "かんせい！" (Finished!) is pressed
  const handleCompleteDrawing = () => {
    if (!canvasRef.current) return;

    if (canvasRef.current.isEmpty) {
      triggerToast('え を かいてから「かんせい」をおしてね！🎨');
      return;
    }

    const thumb = canvasRef.current.getCompressedThumbnail();
    setCompletedImage(thumb);
    setIsCelebrationOpen(true);
  };

  // Next turn handover after celebration
  const handleNextTurn = () => {
    const newRecord: DrawingRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      turn,
      timestamp: Date.now(),
      thumbnail: completedImage,
    };

    const updatedHistory = storage.saveDrawing(newRecord);
    setHistory(updatedHistory);

    const nextTurnNumber = turn + 1;
    storage.setCurrentTurn(nextTurnNumber);
    setTurn(nextTurnNumber);

    // Reset canvas for the next player
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
    setCanUndo(false);
    setCanRedo(false);
    setIsCelebrationOpen(false);
  };

  const handleClearHistory = () => {
    storage.clearHistory();
    setHistory([]);
    setTurn(1);
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
    setCanUndo(false);
    setCanRedo(false);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = storage.deleteDrawing(id);
    setHistory(updated);
    triggerToast('え を けしたよ');
  };

  // Smooth transition from Title to Game with 1-second gradual black screen fade
  const handleStartGame = () => {
    setIsBlackOverlay(true);
    setTimeout(() => {
      setCurrentScreen('game');
      setTimeout(() => {
        setIsBlackOverlay(false);
      }, 80);
    }, 1000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white select-none touch-none flex flex-col font-sans">
      <OfflineIndicator />

      {currentScreen === 'title' ? (
        <TitleScreen onStart={handleStartGame} />
      ) : (
        <>
          {/* Canvas Area (Screen is Canvas base) */}
          <div className="absolute inset-0 w-full h-full z-0 bg-white">
            <DrawingCanvas
              ref={canvasRef}
              currentColor={currentColor}
              isEraser={isEraser}
              brushSize={brushSize}
              onStrokeChange={handleStrokeChange}
            />
          </div>

          {/* TOP HEADER CONTROLS BAR */}
          <header className="relative z-20 flex items-center justify-between p-3 pointer-events-none">
            {/* Top-Left: History Button + PWA Install Button */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* History Button: Icon only, no text */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border-2 border-amber-300 text-slate-700 hover:bg-amber-50 active:scale-90 transition-all"
                aria-label="履歴を見る"
                title="履歴を見る"
              >
                <History className="w-5 h-5 text-orange-500" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-[10px] text-white font-bold shadow-xs">
                    {history.length}
                  </span>
                )}
              </button>

              {/* PWA Install Button */}
              <PWAInstallButton />
            </div>

            {/* Top-Right: Larger & Ergonomic Undo, Redo, and Clear Buttons */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* 戻す (Undo) Button: enlarged for easy tap */}
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-md border-2 transition-all active:scale-90 ${
                  canUndo
                    ? 'bg-white text-slate-800 border-amber-200 hover:bg-amber-50 hover:border-amber-300 shadow-amber-500/10'
                    : 'bg-white/40 text-slate-300 border-gray-100 cursor-not-allowed shadow-none'
                }`}
                title="1つ戻す"
                aria-label="1つ戻す"
              >
                <Undo2 className="w-6 h-6" />
              </button>

              {/* 進む (Redo) Button: enlarged for easy tap */}
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-md border-2 transition-all active:scale-90 ${
                  canRedo
                    ? 'bg-white text-slate-800 border-amber-200 hover:bg-amber-50 hover:border-amber-300 shadow-amber-500/10'
                    : 'bg-white/40 text-slate-300 border-gray-100 cursor-not-allowed shadow-none'
                }`}
                title="やり直す"
                aria-label="やり直す"
              >
                <Redo2 className="w-6 h-6" />
              </button>

              {/* 全削除 (Clear Canvas) Button: enlarged for easy tap */}
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-slate-700 border-2 border-amber-200 shadow-md hover:text-red-500 hover:border-red-300 hover:bg-red-50 active:scale-90 transition-all"
                title="キャンバスを全部消す"
                aria-label="全消去"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* BOTTOM-LEFT: Palette button with sliding color rectangle drawer */}
          <ColorPalette
            currentColor={currentColor}
            isEraser={isEraser}
            brushSize={brushSize}
            customColors={customColors}
            onSelectColor={handleSelectColor}
            onToggleEraser={handleToggleEraser}
            onSelectBrushSize={setBrushSize}
            onAddCustomColor={handleAddCustomColor}
            onRemoveCustomColor={handleRemoveCustomColor}
            onCompleteDrawing={handleCompleteDrawing}
          />
        </>
      )}

      {/* Cinematic Black Fade Transition Veil: 1000ms (1 second) smooth fade */}
      <div
        className={`fixed inset-0 z-50 bg-black pointer-events-none transition-opacity ease-in-out ${
          isBlackOverlay ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: '1000ms' }}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-xl backdrop-blur-xs border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {showToast}
        </div>
      )}

      {/* Clear Canvas Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl border border-amber-200 text-center animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-black text-slate-800 mb-2">かみを まっしろに もどす？</h3>
            <p className="text-xs text-slate-500 mb-4">いま かいている え が ぜんぶ きえるよ。</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                やめる
              </button>
              <button
                onClick={handleClearCanvas}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition"
              >
                ぜんぶ けす
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        drawingImage={completedImage}
        turnNumber={turn}
        onNextTurn={handleNextTurn}
        onClose={() => setIsCelebrationOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onClearHistory={handleClearHistory}
        onDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
}
