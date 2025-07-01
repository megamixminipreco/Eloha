import React, { useEffect, useState, useCallback } from 'react';

const MagicalCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  // Otimização: usar useCallback para evitar re-renders desnecessários
  const updateCursor = useCallback((e: MouseEvent) => {
    const newPosition = { x: e.clientX, y: e.clientY };
    setPosition(newPosition);
    setIsVisible(true);

    // Otimização: reduzir trail para melhor performance
    setTrail(prev => {
      const newTrail = [...prev, { ...newPosition, id: Date.now() }];
      // Manter apenas os últimos 5 pontos (reduzido de 8)
      return newTrail.slice(-5);
    });
  }, []);

  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);

  useEffect(() => {
    // Otimização: usar throttling para melhor performance
    let animationFrame: number;
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps

    const throttledUpdateCursor = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime >= throttleDelay) {
        updateCursor(e);
        lastTime = now;
      }
    };

    document.addEventListener('mousemove', throttledUpdateCursor, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    return () => {
      document.removeEventListener('mousemove', throttledUpdateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [updateCursor, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseEnter]);

  // Otimização: limpar trail com menos frequência
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 200); // Aumentado de 100ms para 200ms

    return () => clearInterval(interval);
  }, []);

  // Otimização: não renderizar se não estiver visível
  if (!isVisible) return null;

  return (
    <>
      {/* Trail particles - Reduzido para melhor performance */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9999] transition-opacity duration-200"
          style={{
            left: point.x - 1,
            top: point.y - 1,
            opacity: (index + 1) / trail.length * 0.4, // Reduzida opacidade
            transform: `scale(${(index + 1) / trail.length * 0.8})`, // Reduzido scale
          }}
        >
          <div className="w-1 h-1 bg-cyan-400 rounded-full">
            <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50"></div>
          </div>
        </div>
      ))}

      {/* Main cursor - Simplificado */}
      <div
        className={`fixed pointer-events-none z-[9999] transition-transform duration-100 ${
          isClicking ? 'scale-75' : 'scale-100'
        }`}
        style={{
          left: position.x - 8,
          top: position.y - 8,
        }}
      >
        {/* Outer ring - Simplificado */}
        <div className="w-4 h-4 border border-cyan-400 rounded-full">
          <div className="absolute inset-0 border border-white/30 rounded-full"></div>
        </div>

        {/* Inner dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-400 rounded-full">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50"></div>
        </div>

        {/* Sparkles - Reduzido para 2 elementos */}
        <div className="absolute -top-1 -left-1 w-6 h-6">
          <div className="absolute top-0 right-0 text-xs text-cyan-300 opacity-60">✨</div>
          <div className="absolute bottom-0 left-0 text-xs text-white opacity-40">❄️</div>
        </div>
      </div>

      {/* Click effect - Simplificado */}
      {isClicking && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: position.x - 12,
            top: position.y - 12,
          }}
        >
          <div className="w-6 h-6 border border-cyan-400 rounded-full animate-ping opacity-60"></div>
        </div>
      )}
    </>
  );
};

export default MagicalCursor;