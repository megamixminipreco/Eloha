import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

const SoundManager: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Frozen-themed background music URL (placeholder)
  const backgroundMusicUrl = 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;
    audio.loop = true;

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      console.log('Audio failed to load - using silent mode');
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
        setIsMuted(false);
      }
    } catch (error) {
      console.log('Audio playback failed - browser policy or missing file');
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="none"
        style={{ display: 'none' }}
      >
        <source src={backgroundMusicUrl} type="audio/wav" />
        {/* Fallback for browsers that don't support the audio element */}
      </audio>

      {/* Floating Sound Control */}
      <div 
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className={`transition-all duration-300 ${showControls ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}`}>
          {/* Main Control Button */}
          <div className="relative">
            <button
              onClick={togglePlay}
              className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 border-2 border-white/30 backdrop-blur-sm"
              title={isPlaying ? 'Pausar música' : 'Tocar música de fundo'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>

            {/* Animated rings when playing */}
            {isPlaying && (
              <>
                <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 border border-white rounded-full animate-pulse"></div>
              </>
            )}

            {/* Music note indicator */}
            {isPlaying && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Music className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Extended Controls Panel */}
          {showControls && (
            <div className="absolute bottom-16 right-0 bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border-2 border-white/50 min-w-[200px]">
              <div className="space-y-4">
                {/* Title */}
                <div className="text-center">
                  <h3 className="text-white font-bold text-sm mb-1">🎵 Música Mágica</h3>
                  <p className="text-cyan-200 text-xs">Trilha sonora do Reino</p>
                </div>

                {/* Play/Pause Control */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="space-y-2">
                  <label className="text-white text-xs font-medium flex items-center gap-2">
                    <Volume2 className="w-3 h-3" />
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                </div>

                {/* Status Indicator */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                    isPlaying 
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                      : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    {isPlaying ? 'Tocando' : 'Pausado'}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center text-xs text-cyan-200 italic">
                  "Let the music flow like magic" ✨
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating musical notes when playing */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 -left-4 text-cyan-300 text-lg animate-float opacity-70">♪</div>
            <div className="absolute -top-6 -right-6 text-white text-sm animate-float delay-500 opacity-60">♫</div>
            <div className="absolute -bottom-4 -left-6 text-blue-300 text-base animate-float delay-1000 opacity-50">♪</div>
            <div className="absolute -bottom-6 -right-4 text-purple-300 text-sm animate-float delay-1500 opacity-60">♫</div>
          </div>
        )}
      </div>
    </>
  );
};

export default SoundManager;