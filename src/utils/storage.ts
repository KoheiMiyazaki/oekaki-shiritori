// Storage helper for Shiritori drawings and custom colors

export interface DrawingRecord {
  id: string;
  turn: number;
  timestamp: number;
  thumbnail: string; // Compact low-resolution WebP/JPEG data URL (~8-15KB)
  title?: string;
  artistNote?: string;
}

export const MAX_HISTORY_ITEMS = 100;

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

  safeSaveHistory(items: DrawingRecord[]): void {
    let toSave = items;
    while (toSave.length > 0) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(toSave));
        return;
      } catch (e) {
        // If quota exceeded, silently drop the oldest item and retry
        if (toSave.length > 1) {
          toSave = toSave.slice(1);
        } else {
          console.error('Storage quota exceeded, unable to save', e);
          break;
        }
      }
    }
  },

  saveDrawing(record: DrawingRecord): DrawingRecord[] {
    try {
      const current = this.getHistory();
      let updated = [...current, record];
      // Limit to 100 items: automatically prune oldest items silently
      if (updated.length > MAX_HISTORY_ITEMS) {
        updated = updated.slice(updated.length - MAX_HISTORY_ITEMS);
      }
      // Re-index sequentially 1..N in chronological order
      const sorted = [...updated].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      const reindexed = sorted.map((item, idx) => ({
        ...item,
        turn: idx + 1,
      }));
      this.safeSaveHistory(reindexed);
      this.setCurrentTurn(reindexed.length + 1);
      return reindexed;
    } catch (e) {
      console.error('Failed to save drawing', e);
      return this.getHistory();
    }
  },

  deleteDrawing(id: string): DrawingRecord[] {
    try {
      const current = this.getHistory();
      const filtered = current.filter((item) => item.id !== id);
      // Re-index sequentially 1..N in chronological order
      const sorted = [...filtered].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      const reindexed = sorted.map((item, idx) => ({
        ...item,
        turn: idx + 1,
      }));
      this.safeSaveHistory(reindexed);
      const nextTurn = reindexed.length + 1;
      this.setCurrentTurn(nextTurn);
      return reindexed;
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
