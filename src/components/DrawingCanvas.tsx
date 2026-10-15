import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from 'react';

export interface DrawingCanvasHandle {
  clear: () => void;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: boolean;
  canRedo: boolean;
  isEmpty: boolean;
  getCompressedThumbnail: () => string;
  getHighResDataURL: () => string;
}

interface DrawingCanvasProps {
  currentColor: string;
  isEraser: boolean;
  brushSize: number;
  onStrokeChange?: (canUndo: boolean, canRedo: boolean) => void;
}

interface Point {
  x: number;
  y: number;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  ({ currentColor, isEraser, brushSize, onStrokeChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Drawing state refs
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<Point | null>(null);
    const hasDrawnRef = useRef(false);

    // Current tool settings stored in refs for direct event listener access
    const currentColorRef = useRef(currentColor);
    const isEraserRef = useRef(isEraser);
    const brushSizeRef = useRef(brushSize);
    const onStrokeChangeRef = useRef(onStrokeChange);

    useEffect(() => {
      currentColorRef.current = currentColor;
    }, [currentColor]);

    useEffect(() => {
      isEraserRef.current = isEraser;
    }, [isEraser]);

    useEffect(() => {
      brushSizeRef.current = brushSize;
    }, [brushSize]);

    useEffect(() => {
      onStrokeChangeRef.current = onStrokeChange;
    }, [onStrokeChange]);

    // Undo / Redo history stacks (storing canvas ImageData)
    const historyStackRef = useRef<ImageData[]>([]);
    const redoStackRef = useRef<ImageData[]>([]);
    const [canUndoState, setCanUndoState] = useState(false);
    const [canRedoState, setCanRedoState] = useState(false);
    const [hasDrawnState, setHasDrawnState] = useState(false);

    // Canvas dimensions & scale state
    const dprRef = useRef(1);

    // Helper: calculate point coordinates in CSS pixels
    const getCoordinatesFromEvent = (e: MouseEvent | Touch | PointerEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Save snapshot to history stack and report status
    const pushHistorySnapshot = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        historyStackRef.current.push(imageData);
        redoStackRef.current = []; // Clear redo on new action

        // Limit history to 30 steps to conserve memory
        if (historyStackRef.current.length > 30) {
          historyStackRef.current.shift();
        }

        const canUndoNow = historyStackRef.current.length > 1;
        const canRedoNow = false;

        setCanUndoState(canUndoNow);
        setCanRedoState(canRedoNow);
        setHasDrawnState(true);
        hasDrawnRef.current = true;

        // Synchronously report to parent component so Undo button updates on stroke 1
        onStrokeChangeRef.current?.(canUndoNow, canRedoNow);
      } catch (err) {
        console.error('Failed to snapshot canvas', err);
      }
    };

    // Initialize or resize canvas
    const setupCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const targetWidth = Math.floor(rect.width);
      const targetHeight = Math.floor(rect.height);

      if (targetWidth <= 0 || targetHeight <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;

      // Check if size is already identical; avoid wiping history if no resize occurred
      if (
        canvas.width === targetWidth * dpr &&
        canvas.height === targetHeight * dpr &&
        historyStackRef.current.length > 0
      ) {
        return;
      }

      // Preserve existing content if resizing
      let currentContent: ImageData | null = null;
      if (canvas.width > 0 && canvas.height > 0) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          try {
            currentContent = ctx.getImageData(0, 0, canvas.width, canvas.height);
          } catch {
            currentContent = null;
          }
        }
      }

      canvas.width = targetWidth * dpr;
      canvas.height = targetHeight * dpr;
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (currentContent) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = currentContent.width;
        tempCanvas.height = currentContent.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.putImageData(currentContent, 0, 0);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
        }
      } else {
        // Initial clean white canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        // Base state (index 0)
        historyStackRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
        redoStackRef.current = [];
        setCanUndoState(false);
        setCanRedoState(false);
        setHasDrawnState(false);
        hasDrawnRef.current = false;
        onStrokeChangeRef.current?.(false, false);
      }
    }, []);

    // ResizeObserver ensures canvas initializes properly
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      setupCanvas();

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
              setupCanvas();
            }
          }
        });
        resizeObserver.observe(container);
      }

      const handleResize = () => {
        setupCanvas();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    }, [setupCanvas]);

    // Native Drawing Logic
    const startDrawing = (pt: Point) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      isDrawingRef.current = true;
      lastPointRef.current = pt;

      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw immediate circle dot so single taps appear instantly
      ctx.beginPath();
      ctx.fillStyle = isEraserRef.current ? '#ffffff' : currentColorRef.current;
      ctx.arc(pt.x, pt.y, brushSizeRef.current / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawMove = (pt: Point) => {
      if (!isDrawingRef.current || !lastPointRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = isEraserRef.current ? '#ffffff' : currentColorRef.current;
      ctx.lineWidth = brushSizeRef.current;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastPointRef.current = pt;
      hasDrawnRef.current = true;
    };

    const endDrawing = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      lastPointRef.current = null;
      pushHistorySnapshot();
    };

    // Attach native DOM event listeners
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          // Ignore
        }
        e.preventDefault();
        const pt = getCoordinatesFromEvent(e);
        startDrawing(pt);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDrawingRef.current) return;
        e.preventDefault();
        const pt = getCoordinatesFromEvent(e);
        drawMove(pt);
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!isDrawingRef.current) return;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore
        }
        e.preventDefault();
        endDrawing();
      };

      const onPointerCancel = (e: PointerEvent) => {
        if (!isDrawingRef.current) return;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore
        }
        endDrawing();
      };

      // Listen on canvas for down, and on window for move/up to never miss stroke endings
      canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp, { passive: false });
      window.addEventListener('pointercancel', onPointerCancel, { passive: false });

      return () => {
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerCancel);
      };
    }, []);

    // Imperative API
    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = dprRef.current;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        pushHistorySnapshot();
        setHasDrawnState(false);
        hasDrawnRef.current = false;
      },

      undo: () => {
        if (historyStackRef.current.length <= 1) return false;
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        const current = historyStackRef.current.pop();
        if (current) {
          redoStackRef.current.push(current);
        }

        const previous = historyStackRef.current[historyStackRef.current.length - 1];
        if (previous) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.putImageData(previous, 0, 0);
          ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
        }

        const canUndoNow = historyStackRef.current.length > 1;
        const canRedoNow = redoStackRef.current.length > 0;

        setCanUndoState(canUndoNow);
        setCanRedoState(canRedoNow);
        setHasDrawnState(canUndoNow);
        hasDrawnRef.current = canUndoNow;

        onStrokeChangeRef.current?.(canUndoNow, canRedoNow);
        return true;
      },

      redo: () => {
        if (redoStackRef.current.length === 0) return false;
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        const next = redoStackRef.current.pop();
        if (next) {
          historyStackRef.current.push(next);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.putImageData(next, 0, 0);
          ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
        }

        const canUndoNow = historyStackRef.current.length > 1;
        const canRedoNow = redoStackRef.current.length > 0;

        setCanUndoState(canUndoNow);
        setCanRedoState(canRedoNow);
        setHasDrawnState(true);
        hasDrawnRef.current = true;

        onStrokeChangeRef.current?.(canUndoNow, canRedoNow);
        return true;
      },

      get canUndo() {
        return historyStackRef.current.length > 1;
      },
      get canRedo() {
        return redoStackRef.current.length > 0;
      },
      get isEmpty() {
        return !hasDrawnRef.current && historyStackRef.current.length <= 1;
      },

      getCompressedThumbnail: () => {
        const canvas = canvasRef.current;
        if (!canvas || canvas.width === 0 || canvas.height === 0) return '';

        const maxDim = 360;
        let thumbWidth = canvas.width;
        let thumbHeight = canvas.height;

        if (thumbWidth > thumbHeight) {
          if (thumbWidth > maxDim) {
            thumbHeight = Math.round((thumbHeight * maxDim) / thumbWidth);
            thumbWidth = maxDim;
          }
        } else {
          if (thumbHeight > maxDim) {
            thumbWidth = Math.round((thumbWidth * maxDim) / thumbHeight);
            thumbHeight = maxDim;
          }
        }

        const offscreen = document.createElement('canvas');
        offscreen.width = thumbWidth;
        offscreen.height = thumbHeight;
        const offCtx = offscreen.getContext('2d');
        if (!offCtx) return '';

        offCtx.fillStyle = '#ffffff';
        offCtx.fillRect(0, 0, thumbWidth, thumbHeight);
        offCtx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);

        try {
          const webp = offscreen.toDataURL('image/webp', 0.72);
          if (webp.startsWith('data:image/webp')) {
            return webp;
          }
        } catch {
          // Fall back
        }
        return offscreen.toDataURL('image/jpeg', 0.72);
      },

      getHighResDataURL: () => {
        const canvas = canvasRef.current;
        if (!canvas) return '';
        return canvas.toDataURL('image/png');
      },
    }));

    return (
      <div
        ref={containerRef}
        className="w-full h-full relative overflow-hidden bg-white touch-none cursor-crosshair select-none"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full touch-none select-none"
          style={{ touchAction: 'none' }}
        />
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
