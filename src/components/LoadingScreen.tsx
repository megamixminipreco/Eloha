import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Star } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const loadingMessages = [
    "Preparando o Reino de Arendelle...",
    "Congelando os detalhes mágicos...",
    "Polvilhando flocos de neve...",
    "Ajustando a coroa real...",
    "Quase pronto para a festa!"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 flex items-center justify-center z-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating snowflakes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${0.8 + Math.random() * 0.8}rem`
            }}
          >
            ❄️
          </div>
        ))}
        
        {/* Floating stars */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-300/40 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              fontSize: `${0.6 + Math.random() * 0.6}rem`
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo/Crown */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow border-4 border-white/30">
            <Crown className="w-12 h-12 text-yellow-800" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">
            Reino de Arendelle
          </h1>
          <p className="text-cyan-200 text-lg italic">
            Preparando a magia...
          </p>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-white/20 to-cyan-100/10 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              <span className="text-white font-medium text-lg">
                {loadingMessages[currentMessage]}
              </span>
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
              </div>
            </div>
            
            {/* Progress Percentage */}
            <div className="mt-3 text-cyan-200 text-sm font-medium">
              {progress}% carregado
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-6">
          <Star className="w-6 h-6 text-yellow-300 animate-twinkle" />
          <div className="flex gap-2 text-2xl">
            <span className="animate-bounce">❄️</span>
            <span className="animate-bounce delay-100">✨</span>
            <span className="animate-bounce delay-200">🏰</span>
            <span className="animate-bounce delay-300">✨</span>
            <span className="animate-bounce delay-400">❄️</span>
          </div>
          <Star className="w-6 h-6 text-yellow-300 animate-twinkle delay-500" />
        </div>

        {/* Loading Quote */}
        <div className="mt-8">
          <p className="text-cyan-200 text-base italic font-serif opacity-80">
            "Let it go, let it go..."
          </p>
          <p className="text-white/60 text-sm mt-2">
            A magia está chegando! ❄️
          </p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 text-white/20 text-3xl animate-float">
        🏰
      </div>
      <div className="absolute top-8 right-8 text-white/20 text-3xl animate-float delay-1000">
        👑
      </div>
      <div className="absolute bottom-8 left-8 text-white/20 text-3xl animate-float delay-2000">
        ❄️
      </div>
      <div className="absolute bottom-8 right-8 text-white/20 text-3xl animate-float delay-3000">
        ⭐
      </div>
    </div>
  );
};

export default LoadingScreen;