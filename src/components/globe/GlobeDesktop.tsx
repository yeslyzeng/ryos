import { useState, useCallback } from 'react';
import { Globe } from './Globe';
import { TopicSidebar } from './TopicSidebar';
import { PinOverlay } from './PinOverlay';
import { UtilityDock } from './UtilityDock';
import { SpotifyPlayer } from '../widgets/SpotifyPlayer';
import { useGlobeStore } from '@/stores/useGlobeStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { GlobePin } from '@/types/globe';
import { PinEditor } from './PinEditor';

interface GlobeDesktopProps {
  onOpenApp: (appId: string) => void;
}

export function GlobeDesktop({ onOpenApp }: GlobeDesktopProps) {
  const { selectedPin, pins, setSelectedPin } = useGlobeStore();
  const [showSpotify, setShowSpotify] = useState(false);
  const [showPinEditor, setShowPinEditor] = useState(false);
  const [editingPin, setEditingPin] = useState<GlobePin | null>(null);

  // Get the selected pin object
  const selectedPinData = selectedPin 
    ? pins.find(p => p.id === selectedPin) || null
    : null;

  const handlePinClick = useCallback((pin: GlobePin) => {
    setSelectedPin(pin.id);
  }, [setSelectedPin]);

  const handleCloseOverlay = useCallback(() => {
    setSelectedPin(null);
  }, [setSelectedPin]);

  const handleOpenApp = useCallback((appId: string) => {
    if (appId === 'spotify') {
      setShowSpotify(prev => !prev);
    } else {
      onOpenApp(appId);
    }
  }, [onOpenApp]);

  const handleOpenEditor = useCallback(() => {
    setEditingPin(null);
    setShowPinEditor(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowPinEditor(false);
    setEditingPin(null);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #f5f7f0 0%, #e8ede3 50%, #dce4d5 100%)',
        }}
      />

      {/* Globe */}
      <div className="absolute inset-0 z-10">
        <Globe onPinClick={handlePinClick} />
      </div>

      {/* Topic Sidebar */}
      <TopicSidebar />

      {/* Pin Overlay */}
      <PinOverlay 
        pin={selectedPinData} 
        onClose={handleCloseOverlay} 
      />

      {/* Spotify Player */}
      <AnimatePresence>
        {showSpotify && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <SpotifyPlayer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Utility Dock */}
      <UtilityDock 
        onOpenApp={handleOpenApp}
        onOpenEditor={handleOpenEditor}
      />

      {/* Branding */}
      <div className="fixed top-6 left-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🌍</span>
          <span className="text-lg font-medium text-gray-700">watsdis</span>
        </motion.div>
      </div>

      {/* Time/Date */}
      <div className="fixed top-6 right-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500"
        >
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </motion.div>
      </div>

      {/* Pin Editor */}
      <PinEditor
        isOpen={showPinEditor}
        onClose={handleCloseEditor}
        editingPin={editingPin}
      />
    </div>
  );
}
