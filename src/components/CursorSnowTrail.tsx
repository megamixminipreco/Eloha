import React, { useEffect, useState, useRef } from 'react';

interface SnowParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const CursorSnowTrail: React.FC = () => {
  const [particles, setParticles] = useState<SnowParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Shader-like effect para o rastro de neve
    const createSnowShader = (x: number, y: number, intensity: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30 * intensity);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 * intensity})`);
      gradient.addColorStop(0.3, `rgba(200, 230, 255, ${0.6 * intensity})`);
      gradient.addColorStop(0.6, `rgba(150, 200, 255, ${0.3 * intensity})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      return gradient;
    };

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atualizar e desenhar partículas
      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // Gravidade
            life: particle.life - 1,
            size: particle.size * 0.995 // Diminuir gradualmente
          }))
          .filter(particle => particle.life > 0);

        // Desenhar partículas
        updatedParticles.forEach(particle => {
          const alpha = particle.life / particle.maxLife;
          const intensity = alpha * (particle.size / 3);

          // Efeito shader
          ctx.fillStyle = createSnowShader(particle.x, particle.y, intensity);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Partícula central
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // Brilho interno
          ctx.fillStyle = `rgba(200, 230, 255, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        return updatedParticles;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Rastrear movimento do mouse
  useEffect(() => {
    let lastMousePos = { x: 0, y: 0 };
    let mouseVelocity = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      
      // Calcular velocidade
      mouseVelocity = {
        x: newPos.x - lastMousePos.x,
        y: newPos.y - lastMousePos.y
      };

      setMousePos(newPos);
      lastMousePos = newPos;

      // Criar partículas baseadas na velocidade
      const speed = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2);
      const intensity = Math.min(speed / 10, 3); // Normalizar velocidade

      if (intensity > 0.5) {
        // Criar múltiplas partículas para rastro mais denso
        const particleCount = Math.floor(intensity * 2) + 1;
        
        for (let i = 0; i < particleCount; i++) {
          const newParticle: SnowParticle = {
            id: particleIdRef.current++,
            x: newPos.x + (Math.random() - 0.5) * 20,
            y: newPos.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2 - mouseVelocity.x * 0.1,
            vy: (Math.random() - 0.5) * 2 - mouseVelocity.y * 0.1,
            life: 60 + Math.random() * 40, // 1-1.5 segundos a 60fps
            maxLife: 60 + Math.random() * 40,
            size: 1 + Math.random() * 2 + intensity * 0.5
          };

          setParticles(prev => [...prev.slice(-50), newParticle]); // Limitar a 50 partículas
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorSnowTrail;