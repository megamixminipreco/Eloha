import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCw, Settings } from 'lucide-react';

interface EnhancedVideoPlayerProps {
  src?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  onVideoEnd?: () => void;
  initialVolume?: number;
  loop?: boolean;
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  src,
  autoplay = true,
  muted = false, // CORRIGIDO: Áudio habilitado por padrão
  controls = true,
  className = '',
  onVideoEnd,
  initialVolume = 0.7,
  loop = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // CORRIGIDO: Configurar volume inicial e áudio
    video.volume = initialVolume;
    video.muted = muted; // Usar o valor do prop
    video.loop = loop;

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      
      // CORRIGIDO: Tentar reproduzir com áudio se o usuário interagiu
      if (autoplay) {
        if (userInteracted) {
          // Se o usuário já interagiu, tentar com áudio
          video.muted = false;
          setIsMuted(false);
          video.play().catch(() => {
            // Se falhar, tentar sem áudio
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {
              setIsPlaying(false);
              setHasError(true);
            });
          });
        } else {
          // Primeira vez - Tenta iniciar com áudio
          video.muted = false;
          setIsMuted(false);
          video.play().catch(() => {
            // Se falhar (política do navegador), tenta iniciar sem áudio
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {
              setIsPlaying(false);
              setHasError(true);
            });
          });
        }
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
      }
      onVideoEnd?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleLoadedMetadata = () => {
      video.loop = loop;
    };

    // NOVO: Detectar primeira interação do usuário
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      const video = videoRef.current;
      if (video && video.muted) {
        video.muted = false;
        setIsMuted(false);
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('volumechange', handleVolumeChange);

    // Adicionar listeners para primeira interação
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('volumechange', handleVolumeChange);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [autoplay, onVideoEnd, initialVolume, muted, loop, userInteracted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    setUserInteracted(true); // Marcar que o usuário interagiu

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      // CORRIGIDO: Tentar ativar áudio ao reproduzir
      if (video.muted && userInteracted) {
        video.muted = false;
        setIsMuted(false);
      }
      
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setHasError(true);
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    setUserInteracted(true); // Marcar que o usuário interagiu
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    setUserInteracted(true); // Marcar que o usuário interagiu
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    // Se o volume for maior que 0, desmutar
    if (newVolume > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch(console.error);
    }
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      togglePlay();
    }
  };

  // NOVO: Ativar áudio manualmente
  const enableAudio = () => {
    const video = videoRef.current;
    if (!video) return;

    setUserInteracted(true);
    video.muted = false;
    setIsMuted(false);
    
    if (!isPlaying) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!src) {
    return (
      <div className={`relative bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center text-white p-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Play className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2 font-serif">Vídeo Convite</h3>
          <p className="text-cyan-200 mb-4">Aguardando upload do vídeo especial</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`relative bg-gradient-to-br from-red-900/50 via-red-800/50 to-red-700/50 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center text-white p-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-500/30 rounded-full flex items-center justify-center">
            <RotateCw className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Erro no Vídeo</h3>
          <p className="text-red-200 mb-4">Não foi possível carregar o vídeo</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowVolumeSlider(false);
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        playsInline
        loop={loop}
        className="w-full h-full object-cover rounded-2xl"
        onClick={togglePlay}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Carregando vídeo...</p>
          </div>
        </div>
      )}

      {/* NOVO: Indicador de áudio mutado */}
      {!isLoading && isMuted && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={enableAudio}
            className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
          >
            <VolumeX className="w-5 h-5" />
            <span>Ativar Som</span>
          </button>
        </div>
      )}

      {/* Loop Indicator */}
      {loop && !isLoading && (
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Loop ativo</span>
        </div>
      )}

      {/* Custom Controls */}
      {controls && !isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${progress}%, rgba(255,255,255,0.3) ${progress}%, rgba(255,255,255,0.3) 100%)`
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={restart}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                >
                  <RotateCw className="w-5 h-5 text-white" />
                </button>

                {/* Volume Controls */}
                <div className="relative">
                  <button
                    onClick={toggleMute}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>

                  {/* Volume Slider */}
                  {showVolumeSlider && (
                    <div className="absolute bottom-12 left-0 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer slider vertical-slider"
                        style={{
                          background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                        }}
                      />
                      <div className="text-white text-xs text-center mt-1">
                        {Math.round(volume * 100)}%
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-white text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* NOVO: Botão para ativar áudio */}
                {isMuted && (
                  <button
                    onClick={enableAudio}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg text-sm transition-all duration-300 flex items-center gap-1"
                  >
                    <Volume2 className="w-4 h-4" />
                    Ativar Áudio
                  </button>
                )}

                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                >
                  <Maximize className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPlayer;