import { motion } from 'framer-motion';
import { 
  Globe2, 
  FolderOpen, 
  FileText, 
  Paintbrush, 
  Music,
  Settings,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface UtilityDockProps {
  onOpenApp: (appId: string) => void;
  onOpenEditor?: () => void;
}

export function UtilityDock({ onOpenApp, onOpenEditor }: UtilityDockProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const dockItems: DockItem[] = [
    {
      id: 'browser',
      icon: <Globe2 className="w-6 h-6" />,
      label: 'Browser',
      onClick: () => onOpenApp('browser'),
    },
    {
      id: 'finder',
      icon: <FolderOpen className="w-6 h-6" />,
      label: 'Finder',
      onClick: () => onOpenApp('finder'),
    },
    {
      id: 'textedit',
      icon: <FileText className="w-6 h-6" />,
      label: 'TextEdit',
      onClick: () => onOpenApp('textedit'),
    },
    {
      id: 'paint',
      icon: <Paintbrush className="w-6 h-6" />,
      label: 'Paint',
      onClick: () => onOpenApp('paint'),
    },
    {
      id: 'spotify',
      icon: <Music className="w-6 h-6" />,
      label: 'Spotify',
      onClick: () => onOpenApp('spotify'),
    },
  ];

  const utilityItems: DockItem[] = [
    {
      id: 'add-pin',
      icon: <Plus className="w-5 h-5" />,
      label: 'Add Pin',
      onClick: onOpenEditor,
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      onClick: () => onOpenApp('control-panels'),
    },
  ];

  return (
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
            <DockIcon
              key={item.id}
              item={item}
              isHovered={hoveredItem === item.id}
              onHover={() => setHoveredItem(item.id)}
              onLeave={() => setHoveredItem(null)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-white/30" />

        {/* Utility items */}
        <div className="flex items-end gap-1 px-2 py-2 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl">
          {utilityItems.map((item) => (
            <DockIcon
              key={item.id}
              item={item}
              isHovered={hoveredItem === item.id}
              onHover={() => setHoveredItem(item.id)}
              onLeave={() => setHoveredItem(null)}
              small
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface DockIconProps {
  item: DockItem;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  small?: boolean;
}

function DockIcon({ item, isHovered, onHover, onLeave, small }: DockIconProps) {
  return (
    <motion.button
      onClick={item.onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "relative flex items-center justify-center rounded-xl transition-colors",
        "text-gray-600 hover:text-gray-900",
        small ? "w-10 h-10" : "w-12 h-12",
        isHovered && "bg-black/5"
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
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : 10 
        }}
        className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-gray-900 text-white text-xs whitespace-nowrap pointer-events-none"
      >
        {item.label}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </motion.div>
    </motion.button>
  );
}
