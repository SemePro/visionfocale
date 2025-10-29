'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Save, 
  Undo, 
  Redo,
  Crop,
  Palette,
  Sun,
  Contrast,
  Droplets,
  Sparkles,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface PhotoEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onClose: () => void;
  originalImageUrl?: string;
}

interface EditState {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sharpen: number;
  rotation: number;
  scale: number;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface HistoryItem {
  state: EditState;
  canvasData: string;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ 
  imageUrl, 
  onSave, 
  onClose, 
  originalImageUrl 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'crop'>('adjust');
  
  const [editState, setEditState] = useState<EditState>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    sharpen: 0,
    rotation: 0,
    scale: 1,
    crop: { x: 0, y: 0, width: 100, height: 100 }
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Sauvegarder dans l'historique
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newHistoryItem: HistoryItem = {
      state: { ...editState },
      canvasData: canvas.toDataURL()
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryItem);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [editState, history, historyIndex]);

  // Appliquer les filtres
  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Définir la taille du canvas
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Sauvegarder le contexte
    ctx.save();

    // Appliquer la rotation
    if (editState.rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Appliquer le scale
    if (editState.scale !== 1) {
      ctx.scale(editState.scale, editState.scale);
    }

    // Dessiner l'image
    ctx.drawImage(img, 0, 0);

    // Appliquer les filtres CSS
    const filters = [
      `brightness(${100 + editState.brightness}%)`,
      `contrast(${100 + editState.contrast}%)`,
      `saturate(${100 + editState.saturation}%)`,
      `hue-rotate(${editState.hue}deg)`,
      `blur(${editState.blur}px)`,
    ].join(' ');

    ctx.filter = filters;
    ctx.drawImage(img, 0, 0);

    // Restaurer le contexte
    ctx.restore();
  }, [editState]);

  // Charger l'image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setIsLoading(false);
      applyFilters();
      saveToHistory();
    };
    img.src = imageUrl;
  }, [imageUrl, applyFilters, saveToHistory]);

  // Mettre à jour les filtres quand l'état change
  useEffect(() => {
    if (!isLoading) {
      applyFilters();
    }
  }, [editState, isLoading, applyFilters]);

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setEditState(prevState.state);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setEditState(nextState.state);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Sauvegarder l'image éditée
  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convertir en blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.9);
      });

      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('file', blob, 'edited-photo.jpg');

      // Upload vers Cloudinary
      const response = await fetch('/api/upload-edited', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.url);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Réinitialiser
  const reset = () => {
    setEditState({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      blur: 0,
      sharpen: 0,
      rotation: 0,
      scale: 1,
      crop: { x: 0, y: 0, width: 100, height: 100 }
    });
  };

  // Appliquer un filtre prédéfini
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'vintage':
        setEditState(prev => ({
          ...prev,
          brightness: -10,
          contrast: 20,
          saturation: -30,
          hue: 30
        }));
        break;
      case 'blackwhite':
        setEditState(prev => ({
          ...prev,
          saturation: -100
        }));
        break;
      case 'dramatic':
        setEditState(prev => ({
          ...prev,
          brightness: -20,
          contrast: 40,
          saturation: 20
        }));
        break;
      case 'warm':
        setEditState(prev => ({
          ...prev,
          brightness: 10,
          saturation: 20,
          hue: 20
        }));
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement de l'éditeur...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex ${
          isFullscreen ? 'flex-col' : 'flex-row'
        }`}
      >
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-xl font-semibold">Éditeur Photo</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="text-white hover:bg-white/10"
              >
                <Undo size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="text-white hover:bg-white/10"
              >
                <Redo size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`bg-neutral-800 border-r border-neutral-700 ${
          isFullscreen ? 'w-full h-auto' : 'w-80 h-full'
        }`}>
          {/* Tabs */}
          <div className="flex border-b border-neutral-700">
            {[
              { id: 'adjust', label: 'Ajustements', icon: Palette },
              { id: 'filters', label: 'Filtres', icon: Sparkles },
              { id: 'crop', label: 'Recadrage', icon: Crop }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'text-primary-400 bg-primary-400/10 border-b-2 border-primary-400'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Contenu des tabs */}
          <div className="p-4 h-full overflow-y-auto">
            {activeTab === 'adjust' && (
              <div className="space-y-6">
                {/* Luminosité */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sun size={16} className="text-yellow-400" />
                    <span className="text-white text-sm font-medium">Luminosité</span>
                    <span className="text-neutral-400 text-xs ml-auto">{editState.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={editState.brightness}
                    onChange={(e) => setEditState(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Contraste */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Contrast size={16} className="text-blue-400" />
                    <span className="text-white text-sm font-medium">Contraste</span>
                    <span className="text-neutral-400 text-xs ml-auto">{editState.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={editState.contrast}
                    onChange={(e) => setEditState(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets size={16} className="text-green-400" />
                    <span className="text-white text-sm font-medium">Saturation</span>
                    <span className="text-neutral-400 text-xs ml-auto">{editState.saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={editState.saturation}
                    onChange={(e) => setEditState(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Teinte */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Palette size={16} className="text-purple-400" />
                    <span className="text-white text-sm font-medium">Teinte</span>
                    <span className="text-neutral-400 text-xs ml-auto">{editState.hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={editState.hue}
                    onChange={(e) => setEditState(prev => ({ ...prev, hue: Number(e.target.value) }))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <RotateCw size={16} className="text-orange-400" />
                    <span className="text-white text-sm font-medium">Rotation</span>
                    <span className="text-neutral-400 text-xs ml-auto">{editState.rotation}°</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditState(prev => ({ ...prev, rotation: prev.rotation - 90 }))}
                      className="text-white hover:bg-white/10"
                    >
                      <RotateCcw size={16} />
                    </Button>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={editState.rotation}
                      onChange={(e) => setEditState(prev => ({ ...prev, rotation: Number(e.target.value) }))}
                      className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditState(prev => ({ ...prev, rotation: prev.rotation + 90 }))}
                      className="text-white hover:bg-white/10"
                    >
                      <RotateCw size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="space-y-4">
                <h3 className="text-white font-medium mb-4">Filtres Prédéfinis</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'vintage', label: 'Vintage', color: 'bg-amber-500' },
                    { id: 'blackwhite', label: 'N&B', color: 'bg-gray-500' },
                    { id: 'dramatic', label: 'Dramatique', color: 'bg-red-500' },
                    { id: 'warm', label: 'Chaud', color: 'bg-orange-500' }
                  ].map(({ id, label, color }) => (
                    <button
                      key={id}
                      onClick={() => applyPreset(id)}
                      className={`${color} text-white p-3 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'crop' && (
              <div className="space-y-4">
                <h3 className="text-white font-medium mb-4">Recadrage</h3>
                <p className="text-neutral-400 text-sm">
                  Fonctionnalité de recadrage en cours de développement...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-neutral-900 p-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full border border-neutral-700 rounded-lg shadow-2xl"
              style={{ maxHeight: isFullscreen ? 'calc(100vh - 200px)' : 'calc(100vh - 120px)' }}
            />
            
            {/* Overlay de chargement */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="bg-neutral-900 border-t border-neutral-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={reset}
              className="text-white hover:bg-white/10"
            >
              <RotateCcw size={16} className="mr-2" />
              Réinitialiser
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-white border-neutral-600 hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <Save size={16} className="mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoEditor;
