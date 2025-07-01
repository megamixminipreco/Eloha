import React, { useEffect, useRef } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  life: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
}

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ trigger, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationRef = useRef<number>();

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const createParticle = (x: number, y: number): ConfettiParticle => {
    const shapes: ConfettiParticle['shape'][] = ['circle', 'square', 'triangle', 'star'];
    
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 15,
      vy: Math.random() * -15 - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      life: 180, // 3 segundos a 60fps
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: ConfettiParticle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life / 180;

    switch (particle.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'square':
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -particle.size / 2);
        ctx.lineTo(-particle.size / 2, particle.size / 2);
        ctx.lineTo(particle.size / 2, particle.size / 2);
        ctx.closePath();
        ctx.fill();
        break;

      case 'star':
        const spikes = 5;
        const outerRadius = particle.size / 2;
        const innerRadius = outerRadius * 0.5;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar partículas
    particlesRef.current = particlesRef.current
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.3, // Gravidade
        rotation: particle.rotation + particle.rotationSpeed,
        life: particle.life - 1
      }))
      .filter(particle => particle.life > 0 && particle.y < canvas.height + 50);

    // Desenhar partículas
    particlesRef.current.forEach(particle => {
      drawParticle(ctx, particle);
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Configurar canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Criar explosão de confetti
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Criar múltiplas ondas de confetti
    for (let wave = 0; wave < 3; wave++) {
      setTimeout(() => {
        for (let i = 0; i < 50; i++) {
          const angle = (Math.PI * 2 * i) / 50;
          const distance = Math.random() * 100 + 50;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          particlesRef.current.push(createParticle(x, y));
        }
      }, wave * 200);
    }

    // Iniciar animação
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ display: trigger ? 'block' : 'none' }}
    />
  );
};

export default ConfettiEffect;