import React, { memo } from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import EnhancedVideoPlayer from './EnhancedVideoPlayer';

interface VideoHeroProps {
  videoSrc?: string;
  onAdminClick: () => void;
  playWithSound?: boolean; // Nova propriedade
}

const VideoHero: React.FC<VideoHeroProps> = ({ 
  videoSrc, 
  onAdminClick, 
  playWithSound = false // Valor padrão
}) => {
  const scrollToContent = () => {
    const heroHeight = window.innerHeight;
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <EnhancedVideoPlayer
          src={videoSrc}
          autoplay={playWithSound} // Controlado pelo estado
          muted={!playWithSound}  // Controlado pelo estado
          controls={true}
          loop={true}
          className="w-full h-full"
        />
      </div>

      {/* Overlay gradients for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>

      {/* Admin Button - Positioned in top right */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onAdminClick}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 opacity-50 hover:opacity-100 border border-white/20"
          title="Painel Administrativo"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* NOVO: Indicador de Scroll - Animado e Chamativo */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center">
          {/* Texto indicativo */}
          <div className="mb-4 text-center">
            <p className="text-white text-lg font-bold mb-2 text-shadow-lg">
              ✨ Veja o convite completo ✨
            </p>
            <p className="text-cyan-200 text-sm font-medium">
              Role para baixo para mais detalhes
            </p>
          </div>
          
          {/* Botão de scroll animado */}
          <button
            onClick={scrollToContent}
            className="group bg-gradient-to-br from-cyan-500/80 via-blue-600/80 to-purple-600/80 backdrop-blur-sm text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 hover:scale-110 border-2 border-white/30"
            title="Rolar para ver o convite"
          >
            <ChevronDown className="w-8 h-8 group-hover:animate-pulse" />
          </button>
          
          {/* Indicadores visuais adicionais */}
          <div className="mt-3 flex gap-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400/80 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-400"></div>
          </div>
          
          {/* Seta adicional para reforçar */}
          <div className="mt-2 text-white/70 text-2xl animate-bounce delay-500">
            ⬇️
          </div>
        </div>
      </div>

      {/* NOVO: Indicador lateral de scroll (discreto) */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-1 h-16 bg-white/30 rounded-full overflow-hidden">
            <div className="w-full h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-white/70 text-xs font-medium transform -rotate-90 whitespace-nowrap">
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
};

export default memo(VideoHero);