import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Algorithmic Odyssey', artist: 'AI Gen-1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Neon Drive', artist: 'AI Gen-2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 3, title: 'Synthwave Dreams', artist: 'AI Gen-3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback failed (interaction needed?):", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  return (
    <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-sm flex flex-col w-full">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-lg flex items-center justify-center bg-gray-950 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
          <Disc3 className="w-8 h-8 text-fuchsia-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-cyan-400 truncate tracking-wide">
            {currentTrack.title}
          </h2>
          <p className="text-sm text-cyan-200/50 truncate uppercase tracking-widest mt-1">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-6 overflow-hidden border border-gray-700">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-1.5 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-gray-400 hover:text-cyan-400 transition-colors p-2"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-3 text-cyan-500 hover:text-cyan-300 hover:bg-cyan-950/50 rounded-full transition-all"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="p-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-full transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-3 text-cyan-500 hover:text-cyan-300 hover:bg-cyan-950/50 rounded-full transition-all"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>
    </div>
  );
}
