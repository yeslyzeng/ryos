import { useState, useCallback } from 'react';
import { Globe } from './Globe';
import { TopicSidebar } from './TopicSidebar';
import { PinOverlay } from './PinOverlay';
import { PinEditor } from './PinEditor';
import { SpotifyPlayer } from '../widgets/SpotifyPlayer';
import { useGlobeStore } from '@/stores/useGlobeStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { GlobePin } from '@/types/globe';
import { 
  Globe2, 
  FolderOpen, 
  FileText, 
  Paintbrush, 
  Music,
  Settings,
  Plus,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobeViewProps {
  onLaunchApp?: (appId: string, initialData?: unknown) => void;
}

export function GlobeView({ onLaunchApp }: GlobeViewProps) {
  const { selectedPin, pins, setSelectedPin, isRotating, setIsRotating } = useGlobeStore();
  const [showSpotify, setShowSpotify] = useState(false);
  const [showPinEditor, setShowPinEditor] = useState(false);
  const [editingPin, setEditingPin] = useState<GlobePin | null>(null);
  const [hoveredDockItem, setHoveredDockItem] = useState<string | null>(null);

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
    } else if (onLaunchApp) {
      onLaunchApp(appId);
    }
  }, [onLaunchApp]);

  const handleOpenEditor = useCallback(() => {
    setEditingPin(null);
    setShowPinEditor(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowPinEditor(false);
    setEditingPin(null);
  }, []);

  // Dock items
  const dockItems = [
    { id: 'browser', icon: <Globe2 className="w-6 h-6" />, label: 'Browser' },
    { id: 'finder', icon: <FolderOpen className="w-6 h-6" />, label: 'Finder' },
    { id: 'textedit', icon: <FileText className="w-6 h-6" />, label: 'TextEdit' },
    { id: 'paint', icon: <Paintbrush className="w-6 h-6" />, label: 'Paint' },
    { id: 'spotify', icon: <Music className="w-6 h-6" />, label: 'Spotify' },
  ];

  const utilityItems = [
    { id: 'add-pin', icon: <Plus className="w-5 h-5" />, label: 'Add Pin', action: handleOpenEditor },
    { id: 'control-panels', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background gradient - nature inspired */}
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-end gap-3">
          {/* Main apps */}
          <div className="flex items-end gap-1 px-3 py-2 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl">
            {dockItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleOpenApp(item.id)}
                onMouseEnter={() => setHoveredDockItem(item.id)}
                onMouseLeave={() => setHoveredDockItem(null)}
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-xl transition-colors",
                  "text-gray-600 hover:text-gray-900",
                  hoveredDockItem === item.id && "bg-black/5"
                )}
                whileHover={{ scale: 1.15, y: -8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {item.icon}
                
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: hoveredDockItem === item.id ? 1 : 0, 
                    y: hoveredDockItem === item.id ? 0 : 10 
                  }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-gray-900 text-white text-xs whitespace-nowrap pointer-events-none"
                >
                  {item.label}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-white/30" />

          {/* Utility items */}
          <div className="flex items-end gap-1 px-2 py-2 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl">
            {utilityItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => item.action ? item.action() : handleOpenApp(item.id)}
                onMouseEnter={() => setHoveredDockItem(item.id)}
                onMouseLeave={() => setHoveredDockItem(null)}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                  "text-gray-600 hover:text-gray-900",
                  hoveredDockItem === item.id && "bg-black/5"
                )}
                whileHover={{ scale: 1.15, y: -8 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {item.icon}
                
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: hoveredDockItem === item.id ? 1 : 0, 
                    y: hoveredDockItem === item.id ? 0 : 10 
                  }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-gray-900 text-white text-xs whitespace-nowrap pointer-events-none"
                >
                  {item.label}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* Globe rotation toggle */}
          <motion.button
            onClick={() => setIsRotating(!isRotating)}
            onMouseEnter={() => setHoveredDockItem('rotate')}
            onMouseLeave={() => setHoveredDockItem(null)}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-2xl backdrop-blur-xl border shadow-lg transition-colors",
              isRotating 
                ? "bg-[#8B9A7B]/20 border-[#8B9A7B]/40 text-[#8B9A7B]" 
                : "bg-white/60 border-white/40 text-gray-600"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className={cn("w-5 h-5", isRotating && "animate-spin")} style={{ animationDuration: '3s' }} />
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: hoveredDockItem === 'rotate' ? 1 : 0, 
                y: hoveredDockItem === 'rotate' ? 0 : 10 
              }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-gray-900 text-white text-xs whitespace-nowrap pointer-events-none"
            >
              {isRotating ? 'Stop Rotation' : 'Auto Rotate'}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Branding */}
      <div className="fixed top-6 left-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/30"
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
          className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/30 text-sm text-gray-600"
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
