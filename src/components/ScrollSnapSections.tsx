import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, MessageCircle, Sparkles, Crown, Star } from 'lucide-react';
import Lottie from 'lottie-react';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSnapSectionsProps {
  onConfirmPresence: () => void;
}

const ScrollSnapSections: React.FC<ScrollSnapSectionsProps> = ({ onConfirmPresence }) => {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const rsvpButtonRef = useRef<HTMLButtonElement>(null);

  // Animação Lottie de Elsa (JSON placeholder)
  const elsaAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 90,
    w: 400,
    h: 400,
    nm: "Elsa Ice Magic",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Ice Particle",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
            { t: 90, s: [360] }
          ]},
          p: { a: 0, k: [200, 200, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0, 0, 100] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 45, s: [100, 100, 100] },
            { t: 90, s: [0, 0, 100] }
          ]}
        },
        ao: 0,
        shapes: [
          {
            ty: "el",
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [20, 20] }
          },
          {
            ty: "fl",
            c: { a: 0, k: [0.7, 0.9, 1, 1] },
            o: { a: 0, k: 100 }
          }
        ],
        ip: 0,
        op: 90,
        st: 0,
        bm: 0
      }
    ]
  };

  useEffect(() => {
    if (!sectionsRef.current) return;

    const sections = sectionsRef.current.querySelectorAll('.snap-section');

    // Configurar scroll-snap
    sections.forEach((section, index) => {
      // Animação de entrada para cada seção
      gsap.fromTo(section.querySelector('.section-content'), 
        {
          y: 100,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Efeito de clip-path em forma de cristal
      if (section.querySelector('.crystal-frame')) {
        gsap.fromTo(section.querySelector('.crystal-frame'),
          {
            clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)'
          },
          {
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Animação do botão RSVP quando o usuário para de rolar
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      
      // Remover brilho
      if (rsvpButtonRef.current) {
        rsvpButtonRef.current.classList.remove('pulse-glow-active');
      }

      scrollTimeout = setTimeout(() => {
        // Adicionar brilho após 2 segundos de inatividade
        if (rsvpButtonRef.current) {
          rsvpButtonRef.current.classList.add('pulse-glow-active');
        }
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionsRef} className="scroll-snap-container">
      {/* Seção 1: Data */}
      <section className="snap-section min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="section-content max-w-md mx-auto px-4 text-center">
          <div className="crystal-frame bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 font-serif">
                14 de Julho
              </h2>
              <p className="text-cyan-200 text-xl">2025 • 19h30</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/30">
              <p className="text-white text-lg font-medium mb-2">
                "O dia mais mágico do ano!"
              </p>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-300 animate-twinkle" />
                <span className="text-cyan-300">❄️ ✨ 👑 ✨ ❄️</span>
                <Star className="w-5 h-5 text-yellow-300 animate-twinkle" />
              </div>
            </div>
          </div>
        </div>

        {/* Partículas de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-cyan-300/30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${1 + Math.random() * 0.5}rem`
              }}
            >
              ❄️
            </div>
          ))}
        </div>
      </section>

      {/* Seção 2: Local */}
      <section className="snap-section min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="section-content max-w-md mx-auto px-4 text-center">
          <div className="crystal-frame bg-gradient-to-br from-white/30 to-purple-100/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 font-serif">
                Reino de Arendelle
              </h2>
              <p className="text-purple-200 text-xl">Castelo Real</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/30">
              <p className="text-white text-lg font-medium mb-2">
                "Onde a magia acontece!"
              </p>
              <p className="text-purple-200 text-sm italic">
                Um lugar encantado para uma festa real
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Crown className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-purple-300">🏰 ❄️ ✨ ❄️ 🏰</span>
                <Crown className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Animação Lottie de Elsa */}
        <div className="absolute top-10 right-10 w-32 h-32 opacity-60">
          <Lottie 
            animationData={elsaAnimation} 
            loop={true}
            className="w-full h-full"
          />
        </div>
      </section>

      {/* Seção 3: RSVP */}
      <section className="snap-section min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="section-content max-w-md mx-auto px-4 text-center">
          <div className="crystal-frame bg-gradient-to-br from-white/30 to-pink-100/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 font-serif">
                Confirme sua Presença
              </h2>
              <p className="text-pink-200 text-lg">
                "Venha celebrar conosco!"
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/30 mb-8">
              <p className="text-cyan-100 text-lg font-serif italic">
                "A magia do Frozen te espera no Reino de Arendelle!"
              </p>
            </div>
            
            <button 
              ref={rsvpButtonRef}
              onClick={onConfirmPresence}
              className="rsvp-button w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-6 px-10 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-green-500/60 transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-4 group relative overflow-hidden sparkle-button premium-button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-2xl relative z-10 group-hover:animate-bounce">📱</div>
              <span className="relative z-10">Confirmar no WhatsApp</span>
              <div className="relative z-10 flex items-center gap-2">
                <Crown className="w-7 h-7 group-hover:animate-spin" />
                <div className="text-2xl group-hover:animate-pulse">❄️</div>
              </div>
            </button>
          </div>
        </div>

        {/* Efeito de estilhaçamento na borda inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent">
          <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path 
              d="M0,100 L50,80 L100,90 L150,70 L200,85 L250,75 L300,80 L350,70 L400,85 L450,75 L500,80 L550,70 L600,85 L650,75 L700,80 L750,70 L800,85 L850,75 L900,80 L950,70 L1000,85 L1050,75 L1100,80 L1150,70 L1200,85 L1200,100 Z" 
              fill="rgba(255,255,255,0.1)"
              className="animate-pulse"
            />
          </svg>
        </div>
      </section>
    </div>
  );
};

export default ScrollSnapSections;