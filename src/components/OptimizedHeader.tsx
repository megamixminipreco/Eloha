import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Star, Settings } from 'lucide-react';

interface OptimizedHeaderProps {
  onAdminClick: () => void;
}

const OptimizedHeader: React.FC<OptimizedHeaderProps> = ({ onAdminClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="relative z-20 pt-6 pb-4">
      {/* Fundo mágico do header */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
      
      <div className="relative">
        {/* Logo principal */}
        <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-purple-500/30 backdrop-blur-md rounded-full px-8 py-4 border-2 border-white/40 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 group">
            {/* Coroa esquerda */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full flex items-center justify-center animate-pulse shadow-xl border-2 border-white/30 group-hover:animate-bounce transition-all duration-300">
                <Crown className="w-6 h-6 text-yellow-800" />
              </div>
              {/* Brilho da coroa */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
            </div>
            
            {/* Texto principal */}
            <div className="text-center">
              <h1 className="text-white font-bold text-xl md:text-2xl tracking-wider font-serif title-glow">
                CONVITE REAL
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent w-8"></div>
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent w-8"></div>
              </div>
            </div>
            
            {/* Coroa direita */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full flex items-center justify-center animate-pulse shadow-xl border-2 border-white/30 group-hover:animate-bounce transition-all duration-300 delay-100">
                <Crown className="w-6 h-6 text-yellow-800" />
              </div>
              {/* Brilho da coroa */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75 delay-500"></div>
            </div>
          </div>
        </div>

        {/* Subtítulo mágico */}
        <div className={`text-center mt-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <p className="text-cyan-200 text-lg italic font-serif flex items-center justify-center gap-2">
            <Star className="w-4 h-4 animate-twinkle" />
            "Reino de Arendelle te convida"
            <Star className="w-4 h-4 animate-twinkle delay-500" />
          </p>
        </div>

        {/* Decorações flutuantes */}
        <div className={`absolute -top-4 left-1/4 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          <div className="text-2xl text-cyan-300/70 animate-float">❄</div>
        </div>
        <div className={`absolute -top-2 right-1/4 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          <div className="text-xl text-white/60 animate-float delay-1000">❅</div>
        </div>
        <div className={`absolute -bottom-2 left-1/3 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          <div className="text-lg text-blue-300/70 animate-pulse">❆</div>
        </div>

        {/* Botão de admin discreto */}
        <div 
          className="absolute top-2 right-2"
          onMouseEnter={() => setShowAdminHint(true)}
          onMouseLeave={() => setShowAdminHint(false)}
        >
          <button
            onClick={onAdminClick}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 opacity-30 hover:opacity-100"
          >
            <Settings className="w-4 h-4 text-white" />
          </button>
          
          {showAdminHint && (
            <div className="absolute top-10 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Painel Admin
            </div>
          )}
        </div>

        {/* Efeitos de partículas no header */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
              }}
            ></div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default OptimizedHeader;