import { motion } from 'framer-motion';
import { useGlobeStore } from '@/stores/useGlobeStore';
import { cn } from '@/lib/utils';

export function TopicSidebar() {
  const { topics, activeTopic, setActiveTopic, pins } = useGlobeStore();

  const getPinCount = (topicId: string) => {
    return pins.filter(p => p.topicId === topicId).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="flex flex-col gap-2">
        {topics.map((topic) => {
          const isActive = activeTopic === topic.id;
          const pinCount = getPinCount(topic.id);
          
          return (
            <motion.button
              key={topic.id}
              onClick={() => setActiveTopic(isActive ? null : topic.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                "backdrop-blur-xl border shadow-lg",
                isActive 
                  ? "bg-white/80 border-white/60" 
                  : "bg-white/40 border-white/30 hover:bg-white/60"
              )}
              style={{
                boxShadow: isActive 
                  ? `0 8px 32px ${topic.color}30, 0 4px 12px rgba(0,0,0,0.1)`
                  : '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                  style={{ backgroundColor: topic.color }}
                />
              )}
              
              {/* Icon */}
              <span className="text-2xl">{topic.icon}</span>
              
              {/* Content */}
              <div className="flex flex-col items-start">
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-gray-900" : "text-gray-700"
                )}>
                  {topic.name}
                </span>
                <span className="text-xs text-gray-400">
                  {pinCount} {pinCount === 1 ? 'pin' : 'pins'}
                </span>
              </div>

              {/* Color dot */}
              <div 
                className={cn(
                  "w-2 h-2 rounded-full ml-auto transition-opacity",
                  isActive ? "opacity-100" : "opacity-50"
                )}
                style={{ backgroundColor: topic.color }}
              />
            </motion.button>
          );
        })}

        {/* All topics button */}
        <motion.button
          onClick={() => setActiveTopic(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
            "backdrop-blur-xl border shadow-lg mt-2",
            !activeTopic 
              ? "bg-white/80 border-white/60" 
              : "bg-white/40 border-white/30 hover:bg-white/60"
          )}
        >
          <span className="text-2xl">🌍</span>
          <span className={cn(
            "text-sm font-medium",
            !activeTopic ? "text-gray-900" : "text-gray-700"
          )}>
            Overview
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
