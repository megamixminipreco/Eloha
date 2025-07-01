import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// Registrar plugin GSAP
gsap.registerPlugin(ScrollTrigger);

interface BackgroundImage {
  id: string;
  url: string;
  name: string;
  parallaxSpeed: number;
  zIndex: number;
  opacity: number;
  blendMode: string;
}

interface ParallaxBackgroundSystemProps {
  backgroundImages: BackgroundImage[];
  children: React.ReactNode;
}

const ParallaxBackgroundSystem: React.FC<ParallaxBackgroundSystemProps> = ({
  backgroundImages,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points[]>([]);

  // Inicializar WebGL/Three.js para partículas de neve
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // Configurar cena Three.js
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;

      // Criar múltiplas camadas de partículas de neve
      const createSnowLayer = (count: number, size: number, speed: number, depth: number) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 2000; // x
          positions[i + 1] = Math.random() * 2000; // y
          positions[i + 2] = (Math.random() - 0.5) * depth; // z

          velocities[i] = (Math.random() - 0.5) * 0.5; // vx
          velocities[i + 1] = -Math.random() * speed; // vy
          velocities[i + 2] = (Math.random() - 0.5) * 0.2; // vz
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const material = new THREE.PointsMaterial({
          color: 0xffffff,
          size: size,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          map: createSnowflakeTexture()
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current.push(particles);

        return particles;
      };

      // Criar textura de floco de neve
      const createSnowflakeTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;

        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
      };

      // Criar 3 camadas de neve com diferentes profundidades
      createSnowLayer(800, 2, 1, 400); // Camada frontal
      createSnowLayer(600, 1.5, 0.7, 800); // Camada média
      createSnowLayer(400, 1, 0.5, 1200); // Camada de fundo

      camera.position.z = 500;

      // Função de animação
      const animate = () => {
        requestAnimationFrame(animate);

        // Animar partículas
        particlesRef.current.forEach((particles, layerIndex) => {
          const positions = particles.geometry.attributes.position.array as Float32Array;
          const velocities = particles.geometry.attributes.velocity.array as Float32Array;

          for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i]; // x
            positions[i + 1] += velocities[i + 1]; // y
            positions[i + 2] += velocities[i + 2]; // z

            // Reset partículas que saíram da tela
            if (positions[i + 1] < -1000) {
              positions[i + 1] = 1000;
              positions[i] = (Math.random() - 0.5) * 2000;
            }

            // Movimento lateral suave
            if (positions[i] > 1000) positions[i] = -1000;
            if (positions[i] < -1000) positions[i] = 1000;
          }

          particles.geometry.attributes.position.needsUpdate = true;
          
          // Rotação suave das camadas
          particles.rotation.y += 0.001 * (layerIndex + 1);
        });

        renderer.render(scene, camera);
      };

      animate();

      // Redimensionamento
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        scene.clear();
      };

    } catch (error) {
      console.warn('WebGL não suportado, usando fallback CSS');
      setIsWebGLSupported(false);
    }
  }, []);

  // CORRIGIDO: Sistema de parallax que alterna entre as 3 imagens
  useEffect(() => {
    if (!containerRef.current || backgroundImages.length === 0) return;

    const container = containerRef.current;
    
    // Limpar triggers anteriores
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Aguardar um frame para garantir que os elementos estejam renderizados
    requestAnimationFrame(() => {
      const backgroundElements = container.querySelectorAll('.parallax-bg-layer');
      const sections = document.querySelectorAll('section');

      // NOVO: Sistema de alternância baseado em seções
      backgroundElements.forEach((element, index) => {
        const bgImage = backgroundImages[index];
        if (!bgImage) return;

        // Calcular qual seção cada imagem deve aparecer
        const sectionIndex = index % sections.length;
        const targetSection = sections[sectionIndex];

        if (targetSection) {
          // Configurar visibilidade baseada na seção
          gsap.set(element, {
            opacity: 0,
            scale: 1.2,
            yPercent: 20
          });

          // Animação de entrada quando a seção correspondente aparece
          gsap.to(element, {
            opacity: bgImage.opacity,
            scale: 1,
            yPercent: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: targetSection,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
              onEnter: () => {
                // Esconder outras imagens quando esta aparecer
                backgroundElements.forEach((otherElement, otherIndex) => {
                  if (otherIndex !== index) {
                    gsap.to(otherElement, {
                      opacity: 0,
                      scale: 1.1,
                      duration: 1,
                      ease: "power2.out"
                    });
                  }
                });
              }
            }
          });

          // Parallax suave durante o scroll
          gsap.to(element, {
            yPercent: -30 * bgImage.parallaxSpeed,
            scale: 1 + (bgImage.parallaxSpeed * 0.1),
            ease: "none",
            scrollTrigger: {
              trigger: targetSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          });

          // Efeito especial para a primeira imagem (vídeo hero)
          if (index === 0) {
            gsap.set(element, { opacity: bgImage.opacity }); // Sempre visível no início
            
            gsap.to(element, {
              scale: 0.8,
              yPercent: -50,
              rotationX: 3,
              transformPerspective: 1000,
              ease: "power2.out",
              scrollTrigger: {
                trigger: container,
                start: "top center",
                end: "50% center",
                scrub: 2
              }
            });
          }
        }
      });

      // NOVO: Sistema de transição suave entre imagens
      if (backgroundImages.length >= 3) {
        // Configurar transições específicas para cada seção
        sections.forEach((section, sectionIndex) => {
          const imageIndex = sectionIndex % backgroundImages.length;
          const currentImage = backgroundElements[imageIndex];
          
          if (currentImage) {
            ScrollTrigger.create({
              trigger: section,
              start: "top center",
              end: "bottom center",
              onEnter: () => {
                // Mostrar imagem atual
                gsap.to(currentImage, {
                  opacity: backgroundImages[imageIndex].opacity,
                  scale: 1,
                  duration: 1.5,
                  ease: "power2.out"
                });
                
                // Esconder outras imagens
                backgroundElements.forEach((otherElement, otherIndex) => {
                  if (otherIndex !== imageIndex) {
                    gsap.to(otherElement, {
                      opacity: 0,
                      scale: 1.2,
                      duration: 1.5,
                      ease: "power2.out"
                    });
                  }
                });
              },
              onLeave: () => {
                // Fade out suave ao sair da seção
                gsap.to(currentImage, {
                  opacity: backgroundImages[imageIndex].opacity * 0.7,
                  duration: 1,
                  ease: "power2.out"
                });
              },
              onEnterBack: () => {
                // Reaparecer ao voltar
                gsap.to(currentImage, {
                  opacity: backgroundImages[imageIndex].opacity,
                  scale: 1,
                  duration: 1,
                  ease: "power2.out"
                });
              }
            });
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [backgroundImages]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Canvas WebGL para partículas de neve */}
      {isWebGLSupported && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[5]"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* CORRIGIDO: Sistema de camadas que alterna corretamente */}
      <div className="fixed inset-0 z-0">
        {backgroundImages
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((bgImage, index) => (
            <div
              key={bgImage.id}
              className="parallax-bg-layer absolute inset-0 will-change-transform"
              style={{
                zIndex: bgImage.zIndex,
                opacity: 0, // Começar invisível - será controlado pelo GSAP
                mixBlendMode: bgImage.blendMode as any,
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Container da imagem otimizado */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${bgImage.url})`,
                  backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll', // Fixed apenas em desktop
                  filter: `blur(${index * 0.2}px) brightness(${1 - index * 0.03})`,
                  transform: `scale(${1.1 + index * 0.01})`,
                  top: `${-5 - index * 2}%`,
                  left: `${-2}%`,
                  width: `${104 + index * 2}%`,
                  height: `${110 + index * 5}%`
                }}
              />
              
              {/* Overlay gradiente para profundidade */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, 
                    rgba(0,0,0,${0.02 + index * 0.02}) 0%, 
                    transparent 25%, 
                    transparent 75%,
                    rgba(0,0,0,${0.05 + index * 0.03}) 100%)`
                }}
              />

              {/* Indicador de camada (apenas para debug - remover em produção) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Camada {index + 1}: {bgImage.name}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Fallback CSS para navegadores sem WebGL */}
      {!isWebGLSupported && (
        <div className="fixed inset-0 pointer-events-none z-[5]">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/40 animate-float"
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
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Overlay sutil para melhor legibilidade */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none z-[8]" />
    </div>
  );
};

export default ParallaxBackgroundSystem;