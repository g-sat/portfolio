import { useState, useRef, useEffect } from 'react';

const AudioPlayer = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [previousVolume, setPreviousVolume] = useState(0.35);
  const [, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Try to autoplay on mount
    const tryAutoplay = async () => {
      try {
        audio.muted = true;
        await audio.play();
        audio.muted = isMuted;
        audio.volume = volume;
        setIsPlaying(true);
      } catch {
        // Fallback: wait for user interaction
        const startOnUserAction = async () => {
          try {
            audio.muted = isMuted;
            audio.volume = volume;
            await audio.play();
            setIsPlaying(true);
          } catch { /* empty */ }
        };
        ['click', 'keydown', 'touchstart'].forEach(evt =>
          document.addEventListener(evt, startOnUserAction, { once: true })
        );
      }
    };

    tryAutoplay();

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
    // Only run once on mount
    // eslint-disable-next-line
  }, []);

  // Keep volume/mute in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        setVolume(previousVolume);
        setIsMuted(false);
      } else {
        setPreviousVolume(volume);
        setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black/80 backdrop-blur-xl border border-cyan-400/40 rounded-lg p-3 shadow-2xl">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src="/audios/cyberpunk-futuristic-city-music-323171.mp3"
          preload="metadata"
          loop
          autoPlay
        />
        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="w-10 h-10 bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/50 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            {isMuted ? (
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.414 0zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <div className="text-cyan-400 text-xs">VOL</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #00ffff ${volume * 100}%, #374151 ${volume * 100}%)`
              }}
            />
            <div className="text-cyan-400 text-xs w-8">{Math.round(volume * 100)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
