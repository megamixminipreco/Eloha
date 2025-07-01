import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface EntryScreenProps {
  onEnter: () => void;
}

const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black z-50 flex flex-col items-center justify-center text-white p-4 text-center">
      <div className="absolute inset-0 bg-[url('/media/backgrounds/img1.png')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-serif text-cyan-300 mb-4 text-shadow-lg animate-fade-in-down">
            Convite Mágico
          </h1>
          <p className="text-lg md:text-2xl text-white/80 animate-fade-in-up">
            Uma aventura congelante para o 6º aniversário da Eloha.
          </p>
        </div>

        <button
          onClick={onEnter}
          className="group relative flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl hover:shadow-cyan-400/50 transition-all duration-500 transform hover:scale-110 border-2 border-white/50 animate-pulse-slow"
        >
          <Sparkles className="w-6 h-6 mr-3 transition-transform group-hover:rotate-180" />
          Entrar no Reino de Gelo
          <Play className="w-6 h-6 ml-3 transition-transform group-hover:scale-125" />
        </button>
        <p className="mt-6 text-sm text-white/60 animate-fade-in">
          (Clique para iniciar com som e ter a melhor experiência)
        </p>
      </div>
    </div>
  );
};

export default EntryScreen;