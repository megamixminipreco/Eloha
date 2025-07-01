import React, { useEffect, useState } from 'react';
import { Crown, Star, Sparkles, Heart } from 'lucide-react';

const FloatingElements: React.FC = () => {
  const [elements, setElements] = useState<Array<{
    id: number;
    type: 'crown' | 'star' | 'sparkle' | 'heart' | 'emoji';
    x: number;
    y: number;
    delay: number;
    duration: number;
    emoji?: string;
  }>>([]);

  useEffect(() => {
    const generateElements = () => {
      const newElements = [];
      
      // Generate floating elements
      for (let i = 0; i < 15; i++) {
        const elementTypes = ['crown', 'star', 'sparkle', 'heart', 'emoji'] as const;
        const emojis = ['❄️', '⭐', '✨', '💎', '🏰', '👑', '💫', '🌟'];
        
        const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
        
        newElements.push({
          id: i,
          type,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 8 + Math.random() * 4,
          emoji: type === 'emoji' ? emojis[Math.floor(Math.random() * emojis.length)] : undefined
        });
      }
      
      setElements(newElements);
    };

    generateElements();
  }, []);

  const renderElement = (element: typeof elements[0]) => {
    const baseClasses = "absolute pointer-events-none animate-float opacity-60 hover:opacity-100 transition-opacity duration-500";
    
    const style = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      animationDelay: `${element.delay}s`,
      animationDuration: `${element.duration}s`
    };

    switch (element.type) {
      case 'crown':
        return (
          <div
            key={element.id}
            className={`${baseClasses} text-yellow-300`}
            style={style}
          >
            <Crown className="w-6 h-6 animate-pulse crown-glow" />
          </div>
        );
      
      case 'star':
        return (
          <div
            key={element.id}
            className={`${baseClasses} text-cyan-300`}
            style={style}
          >
            <Star className="w-5 h-5 animate-twinkle" />
          </div>
        );
      
      case 'sparkle':
        return (
          <div
            key={element.id}
            className={`${baseClasses} text-white`}
            style={style}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        );
      
      case 'heart':
        return (
          <div
            key={element.id}
            className={`${baseClasses} text-pink-300`}
            style={style}
          >
            <Heart className="w-4 h-4 animate-pulse" />
          </div>
        );
      
      case 'emoji':
        return (
          <div
            key={element.id}
            className={`${baseClasses} text-2xl`}
            style={style}
          >
            {element.emoji}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {elements.map(renderElement)}
      
      {/* Additional magical particles */}
      <div className="absolute top-10 left-10 animate-magical-float">
        <div className="text-cyan-300 text-lg opacity-70">❄️</div>
      </div>
      
      <div className="absolute top-20 right-20 animate-magical-float delay-1000">
        <div className="text-white text-sm opacity-60">✨</div>
      </div>
      
      <div className="absolute bottom-20 left-20 animate-magical-float delay-2000">
        <div className="text-blue-300 text-xl opacity-50">❅</div>
      </div>
      
      <div className="absolute bottom-10 right-10 animate-magical-float delay-3000">
        <div className="text-purple-300 text-lg opacity-70">💫</div>
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-5 left-5 animate-pulse">
        <Crown className="w-8 h-8 text-yellow-400 opacity-40" />
      </div>
      
      <div className="absolute top-5 right-5 animate-pulse delay-500">
        <Crown className="w-8 h-8 text-yellow-400 opacity-40" />
      </div>
      
      <div className="absolute bottom-5 left-5 animate-twinkle">
        <Star className="w-6 h-6 text-cyan-400 opacity-50" />
      </div>
      
      <div className="absolute bottom-5 right-5 animate-twinkle delay-1000">
        <Star className="w-6 h-6 text-cyan-400 opacity-50" />
      </div>
    </div>
  );
};

export default FloatingElements;