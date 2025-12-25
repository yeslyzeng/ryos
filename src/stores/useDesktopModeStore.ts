import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DesktopMode = 'classic' | 'globe';

interface DesktopModeStore {
  mode: DesktopMode;
  setMode: (mode: DesktopMode) => void;
  toggleMode: () => void;
}

export const useDesktopModeStore = create<DesktopModeStore>()(
  persist(
    (set, get) => ({
      mode: 'globe', // Default to globe mode for the new design
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'classic' ? 'globe' : 'classic' }),
    }),
    {
      name: 'desktop-mode-storage',
    }
  )
);
