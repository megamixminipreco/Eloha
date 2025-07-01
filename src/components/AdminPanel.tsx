import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Play, Pause, Volume2, VolumeX, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Trash2, Image, Video, FileText, MessageCircle, Phone, Save, Database, HardDrive } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  uploadDate: Date;
}

interface WhatsAppConfig {
  phoneNumber: string;
  message: string;
}

interface BackgroundImage {
  id: string;
  url: string;
  name: string;
  parallaxSpeed: number;
  zIndex: number;
  opacity: number;
  blendMode: string;
}

interface AdminPanelProps {
  onMediaUpdate: (media: MediaFile[]) => void;
  onMediaDelete: (id: string) => void;
  currentMedia: MediaFile[];
  whatsappConfig: WhatsAppConfig;
  onWhatsappUpdate: (config: WhatsAppConfig) => void;
  onClose: () => void;
  // NOVO: Props para gerenciar imagens de fundo
  backgroundImages: BackgroundImage[];
  onBackgroundImagesUpdate: (images: BackgroundImage[]) => void;
  BackgroundImageManager: React.ComponentType<{
    backgroundImages: BackgroundImage[];
    onImagesUpdate: (images: BackgroundImage[]) => void;
  }>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onMediaUpdate, 
  onMediaDelete,
  currentMedia, 
  whatsappConfig, 
  onWhatsappUpdate,
  onClose,
  // NOVO: Props para imagens de fundo
  backgroundImages,
  onBackgroundImagesUpdate,
  BackgroundImageManager
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'media' | 'whatsapp' | 'backgrounds'>('media');
  const [tempWhatsappConfig, setTempWhatsappConfig] = useState(whatsappConfig);
  const [whatsappSaveStatus, setWhatsappSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ADMIN_PASSWORD = 'frozen2025';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setErrorMessage('Senha incorreta');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
    const maxSize = 50 * 1024 * 1024; // Aumentado para 50MB

    if (!allowedTypes.includes(file.type)) {
      return 'Formato não suportado. Use apenas JPG, PNG, MP4 ou MOV.';
    }

    if (file.size > maxSize) {
      return 'Arquivo muito grande. Máximo 50MB.';
    }

    return null;
  };

  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileId = Date.now().toString();
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 5; // Upload mais rápido
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          const url = URL.createObjectURL(file);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
            resolve(url);
          }, 500);
        } else {
          setUploadProgress(prev => ({ ...prev, [fileId]: Math.floor(progress) }));
        }
      }, 100); // Intervalo menor para upload mais suave
    });
  };

  const handleFileUpload = async (files: FileList) => {
    setUploadStatus('uploading');
    setErrorMessage('');

    const newMedia: MediaFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);

      if (error) {
        setErrorMessage(error);
        setUploadStatus('error');
        return;
      }

      try {
        const url = await simulateUpload(file);
        const mediaFile: MediaFile = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url,
          size: file.size,
          uploadDate: new Date()
        };
        newMedia.push(mediaFile);
      } catch (error) {
        setErrorMessage('Erro no upload. Tente novamente.');
        setUploadStatus('error');
        return;
      }
    }

    const updatedMedia = [...currentMedia, ...newMedia];
    onMediaUpdate(updatedMedia);
    setUploadStatus('success');
    
    setTimeout(() => setUploadStatus('idle'), 2000);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const deleteMedia = (id: string) => {
    onMediaDelete(id);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleWhatsappSave = () => {
    setWhatsappSaveStatus('saving');
    
    setTimeout(() => {
      onWhatsappUpdate(tempWhatsappConfig);
      setWhatsappSaveStatus('saved');
      
      setTimeout(() => {
        setWhatsappSaveStatus('idle');
      }, 2000);
    }, 1000);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `+${numbers.slice(0, 2)} (${numbers.slice(2)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    const numbersOnly = e.target.value.replace(/\D/g, '');
    
    setTempWhatsappConfig(prev => ({
      ...prev,
      phoneNumber: numbersOnly
    }));
  };

  // Calcular estatísticas de armazenamento
  const totalSize = currentMedia.reduce((acc, media) => acc + media.size, 0);
  const imageCount = currentMedia.filter(m => m.type === 'image').length;
  const videoCount = currentMedia.filter(m => m.type === 'video').length;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 font-serif">Área Administrativa</h2>
            <p className="text-cyan-200">Acesso restrito ao administrador</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha de administrador"
                className="w-full px-4 py-4 bg-white/20 border-2 border-white/30 rounded-2xl text-white placeholder-cyan-200 focus:outline-none focus:border-cyan-300 focus:bg-white/30 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-200 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-red-300 bg-red-500/20 rounded-xl p-3 border border-red-400/30">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl"
            >
              <Lock className="w-5 h-5" />
              Entrar no Painel
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-cyan-300 hover:text-white transition-colors text-sm"
            >
              ← Voltar ao convite
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header do Painel */}
          <div className="bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border-2 border-white/50 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-serif">Painel Administrativo</h1>
                  <p className="text-cyan-200">Sistema de persistência avançado</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl border border-red-400/30 transition-all duration-300 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Sair
              </button>
            </div>

            {/* Estatísticas de Armazenamento */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <HardDrive className="w-6 h-6 text-cyan-300 mx-auto mb-2" />
                <div className="text-white font-bold text-lg">{formatFileSize(totalSize)}</div>
                <div className="text-cyan-200 text-sm">Armazenado</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Image className="w-6 h-6 text-green-300 mx-auto mb-2" />
                <div className="text-white font-bold text-lg">{imageCount}</div>
                <div className="text-cyan-200 text-sm">Imagens</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Video className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-white font-bold text-lg">{videoCount}</div>
                <div className="text-cyan-200 text-sm">Vídeos</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Database className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                <div className="text-white font-bold text-lg">{currentMedia.length}</div>
                <div className="text-cyan-200 text-sm">Total</div>
              </div>
            </div>
          </div>

          {/* Navegação por Abas - ATUALIZADA */}
          <div className="bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-3xl p-2 shadow-2xl border-2 border-white/50 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('media')}
                className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
                  activeTab === 'media'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-cyan-200 hover:bg-white/10'
                }`}
              >
                <Upload className="w-5 h-5" />
                Gerenciar Mídia
              </button>
              <button
                onClick={() => setActiveTab('backgrounds')}
                className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
                  activeTab === 'backgrounds'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'text-cyan-200 hover:bg-white/10'
                }`}
              >
                <Image className="w-5 h-5" />
                Imagens de Fundo
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
                  activeTab === 'whatsapp'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-cyan-200 hover:bg-white/10'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Configurar WhatsApp
              </button>
            </div>
          </div>

          {/* Conteúdo das Abas */}
          {activeTab === 'media' && (
            <>
              {/* Área de Upload */}
              <div className="bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50 mb-6">
                <h2 className="text-xl font-bold text-white mb-6 font-serif flex items-center gap-3">
                  <Upload className="w-6 h-6" />
                  Upload de Mídia com Persistência
                </h2>

                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
                  <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Sistema de Armazenamento
                  </h3>
                  <ul className="text-cyan-200 text-sm space-y-1">
                    <li>• <strong>IndexedDB:</strong> Armazenamento principal no navegador</li>
                    <li>• <strong>LocalStorage:</strong> Backup para configurações</li>
                    <li>• <strong>Persistência:</strong> Arquivos mantidos após recarregar</li>
                    <li>• <strong>Limite:</strong> Até 50MB por arquivo</li>
                  </ul>
                </div>

                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-cyan-300 bg-cyan-500/20' 
                      : 'border-white/40 hover:border-cyan-300/60 hover:bg-white/10'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-lg font-medium mb-2">
                        Arraste arquivos aqui ou clique para selecionar
                      </p>
                      <p className="text-cyan-200 text-sm">
                        Formatos aceitos: JPG, PNG, MP4, MOV (máx. 50MB)
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                    >
                      Selecionar Arquivos
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.mp4,.mov"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Barra de Progresso */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="mt-6 space-y-3">
                    {Object.entries(uploadProgress).map(([fileId, progress]) => (
                      <div key={fileId} className="bg-white/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm">Salvando no IndexedDB...</span>
                          <span className="text-cyan-300 text-sm font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Status Messages */}
                {uploadStatus === 'success' && (
                  <div className="mt-4 flex items-center gap-2 text-green-300 bg-green-500/20 rounded-xl p-3 border border-green-400/30">
                    <CheckCircle className="w-5 h-5" />
                    <span>Upload realizado com sucesso! Arquivos salvos permanentemente no navegador.</span>
                  </div>
                )}

                {uploadStatus === 'error' && errorMessage && (
                  <div className="mt-4 flex items-center gap-2 text-red-300 bg-red-500/20 rounded-xl p-3 border border-red-400/30">
                    <AlertCircle className="w-5 h-5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Lista de Mídia */}
              <div className="bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50">
                <h2 className="text-xl font-bold text-white mb-6 font-serif flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  Mídia Armazenada ({currentMedia.length})
                </h2>

                {currentMedia.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-cyan-300" />
                    </div>
                    <p className="text-cyan-200">Nenhuma mídia armazenada ainda</p>
                    <p className="text-cyan-300 text-sm mt-2">Faça upload de fotos e vídeos para personalizar o convite</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentMedia.map((media) => (
                      <div key={media.id} className="bg-white/20 rounded-2xl p-4 border border-white/30">
                        <div className="aspect-video bg-black/20 rounded-xl mb-3 overflow-hidden">
                          {media.type === 'image' ? (
                            <img 
                              src={media.url} 
                              alt={media.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video 
                              src={media.url}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {media.type === 'image' ? (
                              <Image className="w-4 h-4 text-cyan-300" />
                            ) : (
                              <Video className="w-4 h-4 text-purple-300" />
                            )}
                            <span className="text-white text-sm font-medium truncate">
                              {media.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-cyan-200">
                            <span>{formatFileSize(media.size)}</span>
                            <span>{media.uploadDate.toLocaleDateString()}</span>
                          </div>
                          
                          <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-2">
                            <div className="flex items-center gap-2 text-green-300 text-xs">
                              <Database className="w-3 h-3" />
                              <span>Salvo no IndexedDB</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteMedia(media.id)}
                            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 px-3 rounded-xl border border-red-400/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* NOVA ABA: Imagens de Fundo */}
          {activeTab === 'backgrounds' && (
            <div className="bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50">
              <BackgroundImageManager
                backgroundImages={backgroundImages}
                onImagesUpdate={onBackgroundImagesUpdate}
              />
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="bg-gradient-to-br from-white/30 to-cyan-100/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/50">
              <h2 className="text-xl font-bold text-white mb-6 font-serif flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                Configuração do WhatsApp
              </h2>

              <div className="space-y-6">
                {/* Número do WhatsApp */}
                <div>
                  <label className="block text-white font-medium mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Número do WhatsApp (com código do país)
                  </label>
                  <input
                    type="text"
                    value={formatPhoneNumber(tempWhatsappConfig.phoneNumber)}
                    onChange={handlePhoneChange}
                    placeholder="+55 (11) 99999-9999"
                    className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-cyan-200 focus:outline-none focus:border-cyan-300 focus:bg-white/30 transition-all duration-300"
                  />
                  <p className="text-cyan-200 text-sm mt-2">
                    Digite apenas números. Exemplo: 5511999999999
                  </p>
                </div>

                {/* Mensagem Personalizada */}
                <div>
                  <label className="block text-white font-medium mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Mensagem de Confirmação
                  </label>
                  <textarea
                    value={tempWhatsappConfig.message}
                    onChange={(e) => setTempWhatsappConfig(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Digite a mensagem que será enviada quando alguém confirmar presença..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-cyan-200 focus:outline-none focus:border-cyan-300 focus:bg-white/30 transition-all duration-300 resize-none"
                  />
                  <p className="text-cyan-200 text-sm mt-2">
                    Esta mensagem será enviada automaticamente quando alguém clicar em "Confirmar Presença"
                  </p>
                </div>

                {/* Preview da Mensagem */}
                <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                  <h3 className="text-green-300 font-medium mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview da Mensagem
                  </h3>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-white text-sm whitespace-pre-wrap">
                      {tempWhatsappConfig.message || 'Digite uma mensagem acima para ver o preview...'}
                    </p>
                  </div>
                </div>

                {/* Botão Salvar */}
                <button
                  onClick={handleWhatsappSave}
                  disabled={whatsappSaveStatus === 'saving'}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-400 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {whatsappSaveStatus === 'saving' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : whatsappSaveStatus === 'saved' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Configurações Salvas!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar Configurações
                    </>
                  )}
                </button>

                {/* Instruções */}
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                  <h3 className="text-blue-300 font-medium mb-2">📱 Como funciona:</h3>
                  <ul className="text-cyan-200 text-sm space-y-1">
                    <li>• Configure seu número do WhatsApp com código do país</li>
                    <li>• Personalize a mensagem de confirmação</li>
                    <li>• Quando alguém clicar em "Confirmar Presença", será redirecionado para seu WhatsApp</li>
                    <li>• A mensagem será preenchida automaticamente</li>
                    <li>• As configurações são salvas no localStorage do navegador</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Botão Voltar */}
          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-8 rounded-xl font-medium hover:from-purple-400 hover:to-pink-500 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Eye className="w-5 h-5" />
              Visualizar Convite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;