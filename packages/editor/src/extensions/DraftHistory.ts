import { Extension } from '@tiptap/core';

export interface DraftHistoryOptions {
  onHistoryChange?: (history: any[]) => void;
}

export const DraftHistory = Extension.create<DraftHistoryOptions>({
  name: 'draftHistory',

  addOptions() {
    return {
      onHistoryChange: () => {},
    };
  },

  addStorage() {
    return {
      history: [],
      currentIndex: -1,
    };
  },

  onTransaction({ transaction, editor }) {
    if (!transaction.docChanged) return;
    
    // Only save history if it's not an undo/redo transaction
    if (transaction.getMeta('addToHistory') === false) return;

    const content = editor.getHTML();
    const timestamp = new Date().toISOString();
    
    // Truncate future history if we're not at the end
    if (this.storage.currentIndex < this.storage.history.length - 1) {
      this.storage.history = this.storage.history.slice(0, this.storage.currentIndex + 1);
    }
    
    this.storage.history.push({ content, timestamp });
    this.storage.currentIndex = this.storage.history.length - 1;
    
    this.options.onHistoryChange?.(this.storage.history);
  },
});
