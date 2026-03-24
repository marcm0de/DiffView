import { create } from 'zustand';

export type ViewMode = 'side-by-side' | 'inline';
export type Theme = 'dark' | 'light';

interface DiffState {
  original: string;
  modified: string;
  viewMode: ViewMode;
  theme: Theme;
  syntaxHighlight: boolean;
  setOriginal: (text: string) => void;
  setModified: (text: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTheme: () => void;
  toggleSyntaxHighlight: () => void;
  swapSides: () => void;
  clear: () => void;
}

export const useDiffStore = create<DiffState>((set) => ({
  original: '',
  modified: '',
  viewMode: 'side-by-side',
  theme: 'dark',
  syntaxHighlight: true,
  setOriginal: (text) => set({ original: text }),
  setModified: (text) => set({ modified: text }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleSyntaxHighlight: () => set((state) => ({ syntaxHighlight: !state.syntaxHighlight })),
  swapSides: () => set((state) => ({ original: state.modified, modified: state.original })),
  clear: () => set({ original: '', modified: '' }),
}));
