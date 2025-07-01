import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Gift, Heart, Sparkles, Crown, Star, Camera, Music, Zap, Award } from 'lucide-react';
import ScrollReveal from './components/ScrollReveal';
import ParallaxSection from './components/ParallaxSection';
import VideoHero from './components/VideoHero';
import HeroSection from './components/HeroSection';
import AnimatedCounter from './components/AnimatedCounter';
import FloatingElements from './components/FloatingElements';
import EnhancedGallery from './components/EnhancedGallery';
import MagicalCursor from './components/MagicalCursor';
import SoundManager from './components/SoundManager';
import LoadingScreen from './components/LoadingScreen';
import GlobalFallingEffects from './components/GlobalFallingEffects';
import ParallaxBackgroundSystem from './components/ParallaxBackgroundSystem';
import BackgroundImageManager from './components/BackgroundImageManager';
import ScrollSnapSections from './components/ScrollSnapSections';
import CursorSnowTrail from './components/CursorSnowTrail';
import ConfettiEffect from './components/ConfettiEffect';
import AudioReactiveGlow from './components/AudioReactiveGlow';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import EntryScreen from './components/EntryScreen'; // Importando a nova tela

interface BackgroundImage {
  id: string;
  url: string;
  name: string;
  parallaxSpeed: number;
  zIndex: number;
  opacity: number;
  blendMode: string;
}

interface WhatsAppConfig {
  phoneNumber: string;
  message: string;
}

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userHasEntered, setUserHasEntered] = useState(false); // Novo estado
  
  // Scroll animation hook
  const { scrollY, isScrolling } = useScrollAnimation();
  
  // Persistência com localStorage para configurações
  const [whatsappConfig, setWhatsappConfig] = useLocalStorage<WhatsAppConfig>('whatsapp-config', {
    phoneNumber: '557381028782',
    message: '🎉 Olá! Confirmo minha presença no aniversário de 6 anos da Eloha! ❄️✨ Estarei lá na Rua Nova, 33 - Joaquim Romão! 👑'
  });

  // NOVO: Persistência para imagens de fundo
  const [backgroundImages, setBackgroundImages] = useLocalStorage<BackgroundImage[]>('background-images', []);

  // Refs para seções
  const heroRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
      setTimeout(() => setIsLoaded(true), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Definindo caminhos estáticos para mídias
  const mainVideo = "/media/videos/video.mp4";
  
  const galleryPhotos = [
    "/media/albums/ft1.jpg",
    "/media/albums/ft2.png",
    "/media/albums/ft3.png",
    "/media/albums/ft4.jpeg",
    "/media/albums/ft5.jpeg",
    "/media/albums/ft6.jpeg",
    "/media/albums/ft7.jpeg",
    "/media/albums/ft8.png",
    "/media/albums/ft9.jpeg",
    "/media/albums/ft10.jpeg",
    "/media/albums/ft11.jpeg",
    "/media/albums/ft12.jpeg",
    "/media/albums/ft13.jpeg",
  ];

  const staticBackgroundImages = [
    { id: 'bg1', url: '/media/backgrounds/img1.png', name: 'Background 1', parallaxSpeed: 0.5, zIndex: -1, opacity: 1, blendMode: 'normal' },
    { id: 'bg2', url: '/media/backgrounds/img2.jpg', name: 'Background 2', parallaxSpeed: 0.6, zIndex: -2, opacity: 1, blendMode: 'normal' },
    { id: 'bg3', url: '/media/backgrounds/img3.jpg', name: 'Background 3', parallaxSpeed: 0.7, zIndex: -3, opacity: 1, blendMode: 'normal' },
  ];
  
  // Usar as imagens de fundo estáticas
  useEffect(() => {
    setBackgroundImages(staticBackgroundImages);
  }, []);
  
  // uploadedCount não é mais relevante para arquivos estáticos
  const uploadedImagesCount = galleryPhotos.length;

  // Função para confirmar presença via WhatsApp
  const handleConfirmPresence = () => {
    const { phoneNumber, message } = whatsappConfig;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Disparar confetti antes de abrir WhatsApp
    setShowConfetti(true);
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setShowConfetti(false);
    }, 1000);
  };

  const handleEnter = () => {
    setUserHasEntered(true);
  };

  if (showLoading) {
    return <LoadingScreen />;
  }

  if (!userHasEntered) {
    return <EntryScreen onEnter={handleEnter} />;
  }

  return (
    <div className="main-invitation relative overflow-hidden">
      {/* SISTEMA GLOBAL DE FLOCOS DE NEVE E ESTRELAS */}
      <GlobalFallingEffects />
      
      {/* NOVO: Sistema de Parallax com Imagens de Fundo */}
      <ParallaxBackgroundSystem backgroundImages={backgroundImages}>
        {/* NOVO: Rastro de neve que segue o cursor */}
        <CursorSnowTrail />
        
        {/* Magical Cursor - Only on main invitation */}
        <MagicalCursor />
        
        {/* Sound Manager */}
        <SoundManager />
        
        {/* Floating Elements */}
        <FloatingElements />

        {/* Video Hero Section - MANTIDO INTACTO */}
        <VideoHero 
          videoSrc={mainVideo}
          onAdminClick={() => setShowAdmin(true)}
          playWithSound={userHasEntered} // Passando a propriedade
        />

        {/* NOVO: Seções Harmoniosas após o vídeo */}
        <div className="relative z-20">
          <HeroSection />

          {/* Seção 2: Galeria de Fotos */}
          <section className="min-h-screen flex items-center justify-center relative py-20 bg-gradient-to-br from-slate-900/70 to-blue-950/70 backdrop-blur-lg">
            <div className="w-full">
              
                <EnhancedGallery 
                  photos={galleryPhotos}
                  uploadedCount={uploadedImagesCount}
                />
              
            </div>
          </section>

          {/* Seção 3: Confirmação de Presença */}
          <section className="min-h-screen flex items-center justify-center relative py-20 bg-gradient-to-br from-slate-900/70 to-purple-950/70 backdrop-blur-lg">
            <div className="max-w-md mx-auto px-4 text-center">
              <ScrollReveal delay={400}>
                <div className="bg-gradient-to-br from-slate-900/80 to-purple-950/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border-2 border-white/50 ice-crystal-effect frozen-frame group hover:scale-105 transition-all duration-500">
                  <div className="mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
                      <Crown className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4 font-serif">
                      Confirme sua Presença
                    </h2>
                    <p className="text-pink-200 text-lg mb-6">
                      "Venha celebrar conosco no Reino de Arendelle!"
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/30 mb-8">
                    <p className="text-cyan-100 text-lg font-serif italic">
                      "A magia do Frozen te espera!"
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleConfirmPresence}
                    className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-6 px-10 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-green-500/60 transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-4 group relative overflow-hidden sparkle-button premium-button"
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
              </ScrollReveal>
            </div>
          </section>

          {/* Footer com Audio Reactive Glow */}
          <ScrollReveal delay={600}>
            <footer className="relative text-center p-8 border-t-2 border-white/30 bg-gradient-to-br from-slate-900 to-blue-900">
              <AudioReactiveGlow className="absolute inset-0 rounded-none" />
              <div className="relative z-10 bg-gradient-to-r from-white/20 to-cyan-100/15 backdrop-blur-md rounded-3xl p-6 max-w-sm mx-auto border border-white/40 shadow-xl hover:scale-105 transition-all duration-500 group">
                <p className="text-cyan-200 text-xl font-serif mb-3 group-hover:text-white transition-colors duration-300">Com amor real,</p>
                <p className="text-white font-bold text-2xl mb-4 font-serif group-hover:scale-105 transition-transform duration-300">Família Ribeiro Silva</p>
                <div className="flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5 text-pink-300 animate-pulse hover:scale-125 transition-transform duration-300" />
                  <span className="text-cyan-300 text-xl hover:scale-110 transition-transform duration-300 cursor-default">💙 ❄️ 👑 ❄️ 💙</span>
                  <Heart className="w-5 h-5 text-pink-300 animate-pulse hover:scale-125 transition-transform duration-300" />
                </div>
                <div className="mt-4 text-cyan-200 text-sm italic font-serif group-hover:text-white transition-colors duration-300">
                  "O amor descongelará tudo" 💕
                </div>
              </div>
            </footer>
          </ScrollReveal>
        </div>
      </ParallaxBackgroundSystem>

      {/* NOVO: Efeito de Confetti */}
      <ConfettiEffect 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </div>
  );
}

export default App;