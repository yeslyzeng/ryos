import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGlobeStore } from '@/stores/useGlobeStore';
import { useState } from 'react';
import type { GlobePin } from '@/types/globe';

interface PinOverlayProps {
  pin: GlobePin | null;
  onClose: () => void;
}

export function PinOverlay({ pin, onClose }: PinOverlayProps) {
  const { topics } = useGlobeStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const topic = pin ? topics.find(t => t.id === pin.topicId) : null;
  const images = pin?.content.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {pin && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 w-[400px] max-h-[80vh] z-50"
        >
          {/* Glassmorphic container */}
          <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl">
            {/* Header */}
            <div className="relative p-6 pb-4">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Topic badge */}
              {topic && (
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3"
                  style={{ 
                    backgroundColor: `${topic.color}20`,
                    color: topic.color,
                  }}
                >
                  <span>{topic.icon}</span>
                  <span>{topic.name}</span>
                </div>
              )}
              
              {/* Title */}
              <h2 className="text-2xl font-semibold text-gray-900 pr-8">
                {pin.title}
              </h2>
              
              {/* Description */}
              {pin.description && (
                <p className="text-gray-500 mt-1 text-sm">
                  {pin.description}
                </p>
              )}
            </div>

            {/* Cover Image */}
            {pin.content.coverImage && (
              <div className="px-6">
                <div className="rounded-2xl overflow-hidden">
                  <img 
                    src={pin.content.coverImage} 
                    alt={pin.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="px-6 mt-4">
                <div className="relative rounded-2xl overflow-hidden">
                  <img 
                    src={images[currentImageIndex].url} 
                    alt={images[currentImageIndex].alt || pin.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Gallery navigation */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                      
                      {/* Dots indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Caption */}
                {images[currentImageIndex]?.caption && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {images[currentImageIndex].caption}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 pt-4">
              {/* Article text */}
              {pin.content.text && (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {pin.content.text}
                </p>
              )}

              {/* Links */}
              {pin.content.links && pin.content.links.length > 0 && (
                <div className="mt-4 space-y-2">
                  {pin.content.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-black/5 hover:bg-black/10 transition-colors group"
                    >
                      {link.favicon && (
                        <img src={link.favicon} alt="" className="w-4 h-4" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {link.title}
                        </div>
                        {link.description && (
                          <div className="text-xs text-gray-500 truncate">
                            {link.description}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </a>
                  ))}
                </div>
              )}

              {/* Embed */}
              {pin.content.embedUrl && (
                <div className="mt-4 rounded-xl overflow-hidden">
                  <iframe
                    src={pin.content.embedUrl}
                    className="w-full h-64 border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Location info */}
            <div className="px-6 pb-6">
              <div className="text-xs text-gray-400">
                📍 {pin.location.lat.toFixed(4)}°, {pin.location.lng.toFixed(4)}°
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
