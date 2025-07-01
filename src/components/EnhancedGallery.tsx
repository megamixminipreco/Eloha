import React, { useState, useEffect, useRef } from 'react';
import { Camera, Star, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw, Download, Heart } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface EnhancedGalleryProps {
  photos: string[];
  onPhotoSelect?: (index: number) => void;
  uploadedCount?: number;
}

const EnhancedGallery: React.FC<EnhancedGalleryProps> = ({
  photos,
  onPhotoSelect,
  uploadedCount
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>(photos.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}));
  const [hasError, setHasError] = useState<{ [key: number]: boolean }>({});
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const imageRef = useRef<HTMLImageElement>(null);
  
  // New states for modal image loading/error
  const [modalImageLoading, setModalImageLoading] = useState(true);
  const [modalImageError, setModalImageError] = useState(false);
  
  const photosPerPage = 6;
  const totalPages = Math.ceil(photos.length / photosPerPage);
  const currentPhotos = photos.slice(
    currentPage * photosPerPage, 
    (currentPage + 1) * photosPerPage
  );

  // Lazy loading para imagens
  const handleImageLoad = (index: number) => {
    setIsLoading(prev => ({ ...prev, [index]: false }));
    setHasError(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setIsLoading(prev => ({ ...prev, [index]: false }));
    setHasError(prev => ({ ...prev, [index]: true }));
  };

  // Controles do modal
  const openModal = (index: number) => {
    const globalIndex = currentPage * photosPerPage + index;
    setSelectedPhoto(globalIndex);
    setZoom(1);
    setRotation(0);
    setModalImageLoading(true);
    setModalImageError(false);
    onPhotoSelect?.(globalIndex);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setZoom(1);
    setRotation(0);
  };

  const nextPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const prevPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
      setZoom(1);
      setRotation(0);
    }
  };

  // Controles de zoom e rotação
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  // Favoritar foto
  const toggleFavorite = (index: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(index)) {
        newFavorites.delete(index);
      } else {
        newFavorites.add(index);
      }
      return newFavorites;
    });
  };

  // Download da imagem
  const downloadImage = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `foto-frozen-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
    }
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedPhoto === null) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevPhoto();
          break;
        case 'ArrowRight':
          nextPhoto();
          break;
        case 'Escape':
          closeModal();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case 'r':
        case 'R':
          rotate();
          break;
      }
    };

    if (selectedPhoto !== null) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedPhoto]);

  return (
    <section className="relative z-10 p-4 pb-8">
      <div className="max-w-md mx-auto">
        {/* Header da Galeria */}
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent mb-6 font-serif flex items-center justify-center gap-4 text-ice">
            <Camera className="w-10 h-10 text-cyan-300" />
            Galeria Real
            <div className="text-3xl">📸</div>
          </h2>
          <p className="text-cyan-200 text-lg italic font-serif">Momentos mágicos capturados no reino</p>
          
          {/* Contador de páginas */}
          {totalPages > 1 && (
            <div className="mt-4 text-cyan-200 text-sm">
              Página {currentPage + 1} de {totalPages} • {photos.length} fotos
            </div>
          )}
        </div>
        
        {/* Grid de Fotos */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {currentPhotos.map((photo, index) => {
            const globalIndex = currentPage * photosPerPage + index;
            const isFavorite = favorites.has(globalIndex);
            
            return (
              <div
                  key={globalIndex}
                  className="aspect-square relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-110 hover:rotate-2 transition-all duration-500 shadow-xl hover:shadow-cyan-500/60 group border-2 border-white/30"
                  onClick={() => openModal(index)}
                >
                  {/* Loading placeholder */}
                  {isLoading[globalIndex] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {hasError[globalIndex] ? (
                    <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center text-white text-center p-2">
                      Erro ao carregar imagem
                    </div>
                  ) : (
                    <img
                      src={photo}
                      alt={`Momento mágico ${globalIndex + 1}`}
                      className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                      onLoad={() => handleImageLoad(globalIndex)}
                      onError={() => handleImageError(globalIndex)}
                      loading="lazy"
                    />
                  )}
                  
                  {/* Overlay de hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 via-transparent to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Ícone de zoom */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                      <ZoomIn className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Indicadores */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-300/70 rounded-2xl transition-all duration-500"></div>
                  <div className="absolute top-2 right-2 text-white/60 text-sm group-hover:text-white transition-colors">❄</div>
                  
                  {/* Indicador de favorito */}
                  {isFavorite && (
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </div>
            );
          })}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === currentPage 
                      ? 'bg-cyan-400 scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Modal da Foto */}
      {selectedPhoto !== null && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="max-w-4xl w-full h-full flex flex-col">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-4 text-white">
              <div className="flex items-center gap-4">
                <span className="text-lg font-medium">
                  {selectedPhoto + 1} de {photos.length}
                </span>
                {selectedPhoto < uploadedCount && (
                  <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm">Especial</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Controles de zoom e rotação */}
                <button
                  onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                
                <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
                
                <button
                  onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); rotate(); }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(selectedPhoto); }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    favorites.has(selectedPhoto)
                      ? 'bg-pink-500 hover:bg-pink-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.has(selectedPhoto) ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); downloadImage(photos[selectedPhoto], selectedPhoto); }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Imagem Principal */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              {modalImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {modalImageError ? (
                <div className="text-white text-center text-xl">
                  Não foi possível carregar a imagem.
                </div>
              ) : (
                <img
                  ref={imageRef}
                  src={photos[selectedPhoto]}
                  alt={`Momento mágico ${selectedPhoto + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-300"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`
                  }}
                  onLoad={() => setModalImageLoading(false)}
                  onError={() => { setModalImageLoading(false); setModalImageError(true); }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              
              {/* Navegação */}
              {selectedPhoto > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              
              {selectedPhoto < photos.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
            
            {/* Footer com instruções */}
            <div className="p-4 text-center text-white/70 text-sm">
              Use as setas ← → para navegar • ESC para fechar • + - para zoom • R para rotacionar
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EnhancedGallery;