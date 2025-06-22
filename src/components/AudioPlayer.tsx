import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface AudioPlayerProps {
  audioBlob: Blob;
  autoPlay?: boolean;
  className?: string;
  onEnded?: () => void;
  onError?: () => void;
}

export interface AudioPlayerRef {
  pause: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ audioBlob, autoPlay = false, className = '', onEnded, onError }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioUrlRef = useRef<string | null>(null);

    // Expose pause method to parent via ref
    useImperativeHandle(ref, () => ({
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          console.debug('⏸️ Audio playback paused');
        }
      },
    }));

    useEffect(() => {
      if (audioBlob) {
        // Clean up previous URL
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }

        // Create new URL for blob
        audioUrlRef.current = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrlRef.current;
          audioRef.current.load();

          if (autoPlay) {
            audioRef.current.play().catch(error => {
              console.error('❌ Auto-play error:', error);
              toast('🔊 Click to play response', {
                style: { background: '#fefcbf', color: '#b45309' },
              });
              if (onError) onError();
            });
          }
        }
      }

      return () => {
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
      };
    }, [audioBlob, autoPlay, onError]);

    const togglePlayPause = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(error => {
            console.error('❌ Play error:', error);
            toast('🔊 Unable to play audio', {
              style: { background: '#fefcbf', color: '#b45309' },
            });
            if (onError) onError();
          });
        }
      }
    };

    const toggleMute = () => {
      if (audioRef.current) {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
        if (newVolume === 0) {
          setIsMuted(true);
        } else if (isMuted) {
          setIsMuted(false);
        }
      }
    };

    const resetAudio = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        if (isPlaying) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <div className={`bg-slate-800/50 backdrop-blur rounded-lg p-4 ${className}`}>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            console.debug('🔊 Audio playback ended');
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
          onError={() => {
            console.warn('⚠️ Audio element error');
            if (onError) onError();
          }}
        />

        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <motion.button
            onClick={togglePlayPause}
            className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.button>

          {/* Progress Bar */}
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Seek audio"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              aria-label="Adjust volume"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={resetAudio}
            className="text-slate-400 hover:text-white transition-colors"
            title="Recommencer"
            aria-label="Reset audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;