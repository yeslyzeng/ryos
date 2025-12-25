import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number; // in seconds
}

// Demo track for UI preview
const DEMO_TRACK: Track = {
  title: 'Weightless',
  artist: 'Marconi Union',
  album: 'Weightless (Ambient Transmissions Vol. 2)',
  albumArt: 'https://i.scdn.co/image/ab67616d0000b273b263c89adf6e2d0e2c7f8c6b',
  duration: 480,
};

interface SpotifyPlayerProps {
  className?: string;
  minimized?: boolean;
}

export function SpotifyPlayer({ className, minimized = false }: SpotifyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(120); // seconds
  const [volume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [track] = useState<Track>(DEMO_TRACK);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (progress / track.duration) * 100;

  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-center gap-3 p-2 rounded-2xl",
          "backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg",
          className
        )}
      >
        {/* Album art */}
        <img 
          src={track.albumArt} 
          alt={track.album}
          className="w-10 h-10 rounded-lg object-cover"
        />
        
        {/* Track info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {track.title}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {track.artist}
          </div>
        </div>
        
        {/* Play button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" fill="white" />
          ) : (
            <Play className="w-4 h-4 text-white" fill="white" />
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-[320px] rounded-3xl overflow-hidden",
        "backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl",
        className
      )}
    >
      {/* Album art */}
      <div className="relative">
        <img 
          src={track.albumArt} 
          alt={track.album}
          className="w-full aspect-square object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Spotify logo */}
        <div className="absolute top-4 right-4">
          <svg className="w-6 h-6 text-white/80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Track info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {track.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {track.artist}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-[#1DB954] rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">{formatTime(progress)}</span>
            <span className="text-xs text-gray-400">{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" fill="white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
            )}
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-400 rounded-full transition-all"
              style={{ width: isMuted ? '0%' : `${volume * 100}%` }}
            />
          </div>
        </div>

        {/* Connect hint */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Connect your Spotify account to control playback
          </p>
        </div>
      </div>
    </motion.div>
  );
}
