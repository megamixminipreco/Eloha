import React, { useEffect, useState } from 'react';

interface FallingElement {
  id: number;
  type: 'snowflake' | 'star' | 'particle';
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  horizontalMovement: number;
  zigzagIntensity?: number;
  lateralMovement?: number;
}

const GlobalFallingEffects: React.FC = () => {
  const [elements, setElements] = useState<FallingElement[]>([]);

  useEffect(() => {
    const generateElements = () => {
      const newElements: FallingElement[] = [];
      
      // Snowflakes - mais abundantes
      for (let i = 0; i < 25; i++) {
        const snowflakeEmojis = ['❄️', '❅', '❆', '🌨️'];
        newElements.push({
          id: i,
          type: 'snowflake',
          x: Math.random() * 100,
          size: 0.8 + Math.random() * 0.8, // 0.8rem to 1.6rem
          duration: 8 + Math.random() * 6, // 8-14 seconds
          delay: Math.random() * 10,
          emoji: snowflakeEmojis[Math.floor(Math.random() * snowflakeEmojis.length)],
          horizontalMovement: (Math.random() - 0.5) * 100, // -50px to 50px
        });
      }

      // Stars - menos frequentes, mais elegantes
      for (let i = 25; i < 35; i++) {
        const starEmojis = ['⭐', '🌟', '✨', '💫'];
        newElements.push({
          id: i,
          type: 'star',
          x: Math.random() * 100,
          size: 0.6 + Math.random() * 0.6, // 0.6rem to 1.2rem
          duration: 12 + Math.random() * 8, // 12-20 seconds (mais lento)
          delay: Math.random() * 15,
          emoji: starEmojis[Math.floor(Math.random() * starEmojis.length)],
          horizontalMovement: 0,
          zigzagIntensity: 20 + Math.random() * 40, // 20-60px zigzag
        });
      }

      // Magical particles - pequenas e rápidas
      for (let i = 35; i < 50; i++) {
        const particleEmojis = ['✨', '💎', '🔮', '💫', '🌠'];
        newElements.push({
          id: i,
          type: 'particle',
          x: Math.random() * 100,
          size: 0.4 + Math.random() * 0.4, // 0.4rem to 0.8rem
          duration: 6 + Math.random() * 4, // 6-10 seconds (mais rápido)
          delay: Math.random() * 8,
          emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
          horizontalMovement: 0,
          lateralMovement: (Math.random() - 0.5) * 60, // -30px to 30px
        });
      }

      setElements(newElements);
    };

    generateElements();

    // Regenerar elementos periodicamente para manter o efeito contínuo
    const interval = setInterval(generateElements, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const renderElement = (element: FallingElement) => {
    const baseClasses = "global-falling-element fixed pointer-events-none select-none z-[1000]";
    
    const style: React.CSSProperties = {
      left: `${element.x}%`,
      fontSize: `${element.size}rem`,
      animationDuration: `${element.duration}s`,
      animationDelay: `${element.delay}s`,
      animationFillMode: 'both',
      animationIterationCount: 'infinite',
      willChange: 'transform',
      // CSS custom properties para as animações
      '--horizontal-movement': `${element.horizontalMovement}px`,
      '--zigzag-intensity': element.zigzagIntensity ? `${element.zigzagIntensity}px` : '0px',
      '--lateral-movement': element.lateralMovement ? `${element.lateralMovement}px` : '0px',
    } as React.CSSProperties;

    let animationClass = '';
    let elementClass = '';

    switch (element.type) {
      case 'snowflake':
        animationClass = 'global-snowflake';
        elementClass = 'global-snowflake';
        break;
      case 'star':
        animationClass = 'global-star';
        elementClass = 'global-star';
        break;
      case 'particle':
        animationClass = 'global-particle';
        elementClass = 'global-particle';
        break;
    }

    return (
      <div
        key={element.id}
        className={`${baseClasses} ${elementClass}`}
        style={style}
      >
        {element.emoji}
      </div>
    );
  };

  return (
    <div className="global-falling-effects-container fixed inset-0 pointer-events-none overflow-hidden z-[1000]">
      {elements.map(renderElement)}
    </div>
  );
};

export default GlobalFallingEffects;