import React, { useEffect, useRef, useState, useCallback } from 'react';

interface AudioReactiveGlowProps {
  audioUrl?: string;
  className?: string;
}

const AudioReactiveGlow: React.FC<AudioReactiveGlowProps> = ({ 
  audioUrl = '/frozen-soundtrack.mp3', 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number>();
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API only once
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const initializeAudio = async () => {
      try {
        // Only create if not already created
        if (!audioContextRef.current) {
          // Create AudioContext
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioContext;
        }

        if (!sourceRef.current && audioContextRef.current) {
          // Create source and analyser
          const source = audioContextRef.current.createMediaElementSource(audio);
          sourceRef.current = source;
        }

        if (!analyserRef.current && audioContextRef.current) {
          const analyser = audioContextRef.current.createAnalyser();
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          analyserRef.current = analyser;
          dataArrayRef.current = dataArray;
        }

        // Connect the audio graph if not already connected
        if (sourceRef.current && analyserRef.current && audioContextRef.current) {
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }
      } catch (error) {
        console.error('Failed to initialize Web Audio API:', error);
      }
    };

    initializeAudio();

    // Cleanup function - only clean up animation and disconnect, don't nullify refs
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Disconnect but don't nullify refs to prevent re-creation
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []); // Empty dependency array - runs only once

  // Audio analysis function
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Extract specific frequencies for the glow
    const bassFreq = dataArrayRef.current.slice(0, 10); // Low frequencies
    const midFreq = dataArrayRef.current.slice(10, 50); // Mid frequencies
    const highFreq = dataArrayRef.current.slice(50, 100); // High frequencies

    const bassAvg = bassFreq.reduce((a, b) => a + b, 0) / bassFreq.length;
    const midAvg = midFreq.reduce((a, b) => a + b, 0) / midFreq.length;
    const highAvg = highFreq.reduce((a, b) => a + b, 0) / highFreq.length;

    setAudioData([bassAvg, midAvg, highAvg]);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [isPlaying]);

  // Handle playback state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = async () => {
      setIsPlaying(true);
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      analyzeAudio();
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [analyzeAudio]);

  // Calculate glow intensity based on audio
  const getGlowIntensity = () => {
    if (audioData.length === 0) return 0;
    
    const [bass, mid, high] = audioData;
    const average = (bass + mid + high) / 3;
    return Math.min(average / 255, 1); // Normalize to 0-1
  };

  const glowIntensity = getGlowIntensity();

  // Reactive colors based on frequencies
  const getReactiveColors = () => {
    if (audioData.length === 0) return { r: 56, g: 189, b: 248 };

    const [bass, mid, high] = audioData;
    
    return {
      r: Math.floor(56 + (bass / 255) * 100), // Blue to red
      g: Math.floor(189 + (mid / 255) * 66), // Cyan to white
      b: Math.floor(248 - (high / 255) * 100) // Blue to purple
    };
  };

  const colors = getReactiveColors();

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="none"
        style={{ display: 'none' }}
      />

      {/* Element with reactive glow */}
      <div
        className={`audio-reactive-glow ${className}`}
        style={{
          boxShadow: `
            0 0 ${20 + glowIntensity * 40}px rgba(${colors.r}, ${colors.g}, ${colors.b}, ${0.3 + glowIntensity * 0.4}),
            0 0 ${40 + glowIntensity * 80}px rgba(${colors.r}, ${colors.g}, ${colors.b}, ${0.2 + glowIntensity * 0.3}),
            0 0 ${60 + glowIntensity * 120}px rgba(${colors.r}, ${colors.g}, ${colors.b}, ${0.1 + glowIntensity * 0.2})
          `,
          borderColor: `rgba(${colors.r}, ${colors.g}, ${colors.b}, ${0.5 + glowIntensity * 0.5})`,
          transition: 'all 0.1s ease-out'
        }}
      >
        {/* Discrete audio controls */}
        <div className="absolute top-2 right-2 opacity-30 hover:opacity-100 transition-opacity">
          <button
            onClick={handlePlayPause}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            title={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>

        {/* Visual frequency indicator */}
        {isPlaying && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {audioData.map((freq, index) => (
              <div
                key={index}
                className="w-1 bg-white/60 rounded-full transition-all duration-100"
                style={{
                  height: `${4 + (freq / 255) * 16}px`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AudioReactiveGlow;