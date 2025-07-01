import React, { useState, useEffect, memo } from 'react';
import { Crown, Sparkles, Star, Calendar, Clock, MapPin, Heart } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700">
      <div className="max-w-md mx-auto px-4 text-center">
        {/* Main Title */}
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 eloha-title" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.7)' }}>
              ELOHA
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Crown className="w-8 h-8 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold six-years-title" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
                6 ANOS
              </h2>
              <Crown className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-cyan-200 text-xl italic font-serif mb-2" style={{ textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}>
              "Você quer brincar na neve?"
            </p>
            <h3 className="text-2xl md:text-3xl font-bold convite-text mb-6" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.6)' }}>
              CONVITE
            </h3>
            <p className="text-cyan-300 text-lg font-serif" style={{ textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}>Rua Nova, 33 - Joaquim Romão</p>
          </div>
        </div>

        {/* Event Details Card */}
        <div className={`transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gradient-to-br from-black/50 to-indigo-900/50 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border-2 border-white/50 mb-8 ice-crystal-effect frozen-frame group hover:scale-105 transition-all duration-500">
            {/* Date and Time */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-cyan-300" />
                <h4 className="text-white font-bold text-xl" style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.7)' }}>14 de Julho de 2025</h4>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-6 h-6 text-cyan-300" />
                <p className="text-cyan-200 text-lg" style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.7)' }}>19h30 • Rua Nova, 33 - Joaquim Romão</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="mb-6">
              <AnimatedCounter targetDate="2025-07-14T19:30:00" />
            </div>

            {/* Location */}
            <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-4 border border-white/30">
              <div className="flex items-center justify-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-cyan-300" />
                <span className="text-white font-medium" style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.7)' }}>Local da Festa</span>
              </div>
              <p className="text-cyan-200 text-sm italic" style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.7)' }}>
                "Espero você no meu aniversário!"
              </p>
              <p className="text-cyan-300 text-xs mt-1" style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.7)' }}>Reino de Arendelle te espera!</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={`transition-opacity duration-1000 delay-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          <div className="flex items-center justify-center gap-4">
            <Star className="w-6 h-6 text-yellow-300 animate-twinkle" />
            <div className="flex gap-2 text-2xl">
              <span className="hover:animate-bounce cursor-pointer">❄️</span>
              <span className="hover:animate-bounce cursor-pointer delay-100">✨</span>
              <span className="hover:animate-bounce cursor-pointer delay-200">🏰</span>
              <span className="hover:animate-bounce cursor-pointer delay-300">✨</span>
              <span className="hover:animate-bounce cursor-pointer delay-400">❄️</span>
            </div>
            <Star className="w-6 h-6 text-yellow-300 animate-twinkle delay-500" />
          </div>
        </div>

        {/* Magic Quote */}
        <div className={`transition-opacity duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mt-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl p-6 border border-white/30">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-pink-300 animate-pulse" />
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              <Heart className="w-5 h-5 text-pink-300 animate-pulse" />
            </div>
            <p className="text-white text-lg italic font-serif" style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.7)' }}>
              "Que a magia do Frozen torne este dia inesquecível!"
            </p>
            <p className="text-cyan-200 text-sm mt-2" style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.7)' }}>
              Uma celebração real no Reino de Arendelle ❄️
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);