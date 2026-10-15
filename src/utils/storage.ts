// Storage helper for Shiritori drawings and custom colors

export interface DrawingRecord {
  id: string;
  turn: number;
  timestamp: number;
  thumbnail: string; // Compact low-resolution WebP/JPEG data URL (~8-15KB)
  title?: string;
  artistNote?: string;
}

const HISTORY_KEY = 'oekaki_shiritori_history_v1';
const CUSTOM_COLORS_KEY = 'oekaki_shiritori_custom_colors_v1';
const CURRENT_TURN_KEY = 'oekaki_shiritori_current_turn_v1';

export const storage = {
  getHistory(): DrawingRecord[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load history', e);
      return [];
    }
  },

  saveDrawing(record: DrawingRecord): DrawingRecord[] {
    try {
      const current = this.getHistory();
      const updated = [...current, record];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save drawing', e);
      return this.getHistory();
    }
  },

  deleteDrawing(id: string): DrawingRecord[] {
    try {
      const current = this.getHistory();
      const updated = current.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to delete drawing', e);
      return this.getHistory();
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
      localStorage.setItem(CURRENT_TURN_KEY, '1');
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  },

  getCurrentTurn(): number {
    try {
      const saved = localStorage.getItem(CURRENT_TURN_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      const history = this.getHistory();
      return history.length + 1;
    } catch {
      return 1;
    }
  },

  setCurrentTurn(turn: number): void {
    try {
      localStorage.setItem(CURRENT_TURN_KEY, turn.toString());
    } catch (e) {
      console.error('Failed to save current turn', e);
    }
  },

  getCustomColors(): string[] {
    try {
      const data = localStorage.getItem(CUSTOM_COLORS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomColor(color: string): string[] {
    try {
      const current = this.getCustomColors();
      if (!current.includes(color.toUpperCase())) {
        const updated = [...current, color.toUpperCase()];
        localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(updated));
        return updated;
      }
      return current;
    } catch {
      return [];
    }
  },

  removeCustomColor(color: string): string[] {
    try {
      const current = this.getCustomColors();
      const updated = current.filter((c) => c !== color.toUpperCase());
      localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  // Calculate approximate storage usage in KB
  getStorageUsageKB(): number {
    try {
      const historyData = localStorage.getItem(HISTORY_KEY) || '';
      return Math.round((historyData.length * 2) / 1024 * 10) / 10;
    } catch {
      return 0;
    }
  },
};
