import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GlobePin, Topic, GlobeState } from '@/types/globe';
import { DEFAULT_TOPICS, SAMPLE_PINS } from '@/types/globe';

interface GlobeStore extends GlobeState {
  // Data
  topics: Topic[];
  pins: GlobePin[];
  
  // Actions - State
  setActiveTopic: (topicId: string | null) => void;
  setSelectedPin: (pinId: string | null) => void;
  setCameraPosition: (position: { lat: number; lng: number; altitude: number }) => void;
  setIsRotating: (rotating: boolean) => void;
  
  // Actions - Topics
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  
  // Actions - Pins
  addPin: (pin: GlobePin) => void;
  updatePin: (id: string, updates: Partial<GlobePin>) => void;
  deletePin: (id: string) => void;
  getPinsByTopic: (topicId: string) => GlobePin[];
  
  // Utility
  resetToDefaults: () => void;
}

export const useGlobeStore = create<GlobeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTopic: null,
      selectedPin: null,
      cameraPosition: { lat: 20, lng: 0, altitude: 2.5 },
      isRotating: true,
      topics: DEFAULT_TOPICS,
      pins: SAMPLE_PINS,
      
      // State actions
      setActiveTopic: (topicId) => set({ activeTopic: topicId, selectedPin: null }),
      setSelectedPin: (pinId) => set({ selectedPin: pinId }),
      setCameraPosition: (position) => set({ cameraPosition: position }),
      setIsRotating: (rotating) => set({ isRotating: rotating }),
      
      // Topic actions
      addTopic: (topic) => set((state) => ({ 
        topics: [...state.topics, topic] 
      })),
      updateTopic: (id, updates) => set((state) => ({
        topics: state.topics.map((t) => 
          t.id === id ? { ...t, ...updates } : t
        ),
      })),
      deleteTopic: (id) => set((state) => ({
        topics: state.topics.filter((t) => t.id !== id),
        pins: state.pins.filter((p) => p.topicId !== id),
        activeTopic: state.activeTopic === id ? null : state.activeTopic,
      })),
      
      // Pin actions
      addPin: (pin) => set((state) => ({ 
        pins: [...state.pins, pin] 
      })),
      updatePin: (id, updates) => set((state) => ({
        pins: state.pins.map((p) => 
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        ),
      })),
      deletePin: (id) => set((state) => ({
        pins: state.pins.filter((p) => p.id !== id),
        selectedPin: state.selectedPin === id ? null : state.selectedPin,
      })),
      getPinsByTopic: (topicId) => {
        return get().pins.filter((p) => p.topicId === topicId);
      },
      
      // Reset
      resetToDefaults: () => set({
        topics: DEFAULT_TOPICS,
        pins: SAMPLE_PINS,
        activeTopic: null,
        selectedPin: null,
        cameraPosition: { lat: 20, lng: 0, altitude: 2.5 },
        isRotating: true,
      }),
    }),
    {
      name: 'globe-storage',
      partialize: (state) => ({
        topics: state.topics,
        pins: state.pins,
        cameraPosition: state.cameraPosition,
      }),
    }
  )
);
