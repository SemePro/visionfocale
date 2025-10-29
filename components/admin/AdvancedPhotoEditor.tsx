'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Eye,
  Heart,
  Palette,
  Zap,
  Droplets,
  Sun,
  Moon,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  Save,
  X,
  Lightbulb,
  Contrast,
  Undo,
  Redo,
  Crop,
  Layers,
  Brush,
  Eraser,
  Wand2,
  Target,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Settings,
  History,
  Copy,
  Scissors,
  Move,
  Type,
  Square,
  Circle,
  Star,
  Heart as HeartIcon,
  Smile,
  Camera,
  Monitor,
  Printer
} from 'lucide-react';
import RetouchingTools from './RetouchingTools';
import PassportPhotoTools from './PassportPhotoTools';
import CurvesAdjustment from './CurvesAdjustment';
import LayersPanel from './LayersPanel';
import PresetsPanel from './PresetsPanel';
import Button from '@/components/ui/Button';

interface AdvancedPhotoEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onClose: () => void;
  originalImageUrl?: string;
}

interface EditState {
  // Ajustements de base
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sharpen: number;
  rotation: number;
  scale: number;
  
  // Outils de portrait
  skinSmoothing: number;
  blemishRemoval: number;
  eyeBrightening: number;
  eyeWhitening: number;
  hairColorAdjustment: number;
  lipColorAdjustment: number;
  lightingCorrection: number;
  shadowAdjustment: number;
  
  // Fonctionnalités avancées
  curves: { r: number[]; g: number[]; b: number[] };
  hsl: { h: number; s: number; l: number };
  toneMapping: number;
  vignette: number;
  grain: number;
  texture: number;
  
  // Créatif et branding
  signature: string;
  signatureOpacity: number;
  signaturePosition: { x: number; y: number };
  textOverlay: string;
  textOpacity: number;
  textPosition: { x: number; y: number };
  backgroundBlur: number;
  artisticFilter: string;
  doubleExposure: number;
  blendingMode: string;
  
  // Layers
  layers: { id: string; name: string; opacity: number; blendMode: string; visible: boolean; locked: boolean; type: 'image' | 'text' | 'shape' | 'adjustment'; imageData?: string; text?: string; shape?: 'rectangle' | 'circle' | 'star'; }[];
  activeLayer: number;
  
  // Historique
  history: HistoryItem[];
  historyIndex: number;
}

interface HistoryItem {
  state: Omit<EditState, 'history'>;
  action: string;
  timestamp: number;
}

const AdvancedPhotoEditor: React.FC<AdvancedPhotoEditorProps> = ({
  imageUrl,
  originalImageUrl,
  onSave,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'adjust' | 'portrait' | 'advanced' | 'creative' | 'layers' | 'presets' | 'history' | 'passport'>('adjust');
  const [selectedTool, setSelectedTool] = useState<'brush' | 'eraser' | 'clone' | 'heal' | 'select' | 'move'>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [brushOpacity, setBrushOpacity] = useState(100);

  const [editState, setEditState] = useState<EditState>({
    // Ajustements de base
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    sharpen: 0,
    rotation: 0,
    scale: 1,
    
    // Outils de portrait
    skinSmoothing: 0,
    blemishRemoval: 0,
    eyeBrightening: 0,
    eyeWhitening: 0,
    hairColorAdjustment: 0,
    lipColorAdjustment: 0,
    lightingCorrection: 0,
    shadowAdjustment: 0,
    
    // Fonctionnalités avancées
    curves: { r: [], g: [], b: [], master: [] },
    hsl: { h: 0, s: 0, l: 0 },
    toneMapping: 0,
    vignette: 0,
    grain: 0,
    texture: 0,
    
    // Créatif et branding
    signature: 'VisionFocale',
    signatureOpacity: 100,
    signaturePosition: { x: 50, y: 90 },
    textOverlay: '',
    textOpacity: 100,
    textPosition: { x: 50, y: 50 },
    backgroundBlur: 0,
    artisticFilter: 'none',
    doubleExposure: 0,
    blendingMode: 'normal',
    
    // Layers
    layers: [{ id: 'base', name: 'Image de base', imageUrl: imageUrl, opacity: 100, blendMode: 'normal', visible: true, locked: false, type: 'image' }],
    activeLayer: 0,
    
    // Historique
    history: [],
    historyIndex: -1,
  });

  // Charger l'image
  useEffect(() => {
    if (imageUrl) {
      console.log('Chargement de l\'image:', imageUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('Image chargée avec succès:', img.naturalWidth, 'x', img.naturalHeight);
        imageRef.current = img;
        setIsLoading(false);
        applyFilters();
      };
      img.onerror = (error) => {
        console.error('Erreur lors du chargement de l\'image:', error);
        setIsLoading(false);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Sauvegarder l'état dans l'historique
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newHistoryItem: HistoryItem = {
      state: { ...editState },
      canvasData: canvas.toDataURL(),
      timestamp: Date.now()
    };

    const newHistory = editState.history.slice(0, editState.historyIndex + 1);
    newHistory.push(newHistoryItem);
    
    setEditState(prev => ({
      ...prev,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }));
  };

  // Appliquer les filtres
  const applyFilters = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) {
      console.log('Canvas ou image non disponible:', { canvas: !!canvas, img: !!img });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('Mode plein écran:', isFullscreen, 'Dimensions image:', img.naturalWidth, 'x', img.naturalHeight);

    // Dimensions de base pour l'affichage
    const baseWidth = 600;
    const baseHeight = 400;
    
    let displayWidth = img.naturalWidth;
    let displayHeight = img.naturalHeight;
    
    console.log('Dimensions canvas calculées:', displayWidth, 'x', displayHeight);
    
    // Redimensionner pour s'adapter à l'espace disponible
    const maxWidth = isFullscreen ? 1200 : baseWidth;
    const maxHeight = isFullscreen ? 800 : baseHeight;
    
    if (displayWidth > maxWidth || displayHeight > maxHeight) {
      const ratio = Math.min(maxWidth / displayWidth, maxHeight / displayHeight);
      displayWidth = displayWidth * ratio;
      displayHeight = displayHeight * ratio;
    }
    
    // Appliquer le zoom
    displayWidth *= editState.scale;
    displayHeight *= editState.scale;

    // Définir les dimensions du canvas
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    // Définir les styles CSS pour l'affichage
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    
    console.log('Canvas configuré:', {
      width: canvas.width,
      height: canvas.height,
      styleWidth: canvas.style.width,
      styleHeight: canvas.style.height,
      visible: canvas.offsetWidth > 0 && canvas.offsetHeight > 0
    });

    ctx.save();

    // Appliquer la rotation
    if (editState.rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Dessiner l'image
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

    // Appliquer les filtres CSS combinés
    const filters = [
      `brightness(${100 + editState.brightness}%)`,
      `contrast(${100 + editState.contrast}%)`,
      `saturate(${100 + editState.saturation}%)`,
      `hue-rotate(${editState.hue}deg)`,
      `blur(${editState.blur}px)`,
      `sepia(${editState.grain}%)`,
    ].join(' ');

    ctx.filter = filters;
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

    // Appliquer les effets de portrait
    applyPortraitEffects(ctx, img, displayWidth, displayHeight);
    
    // Appliquer les effets créatifs
    applyCreativeEffects(ctx, img, displayWidth, displayHeight);

    ctx.restore();
  };

  // Appliquer les effets de portrait
  const applyPortraitEffects = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, displayWidth: number, displayHeight: number) => {
    // Lissage de peau avec blur overlay
    if (editState.skinSmoothing > 0) {
      ctx.save();
      // Créer un canvas temporaire pour le blur
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = displayWidth;
      tempCanvas.height = displayHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.filter = `blur(${editState.skinSmoothing * 0.3}px)`;
        tempCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
        ctx.globalAlpha = editState.skinSmoothing / 250;
        ctx.globalCompositeOperation = 'soft-light';
        ctx.drawImage(tempCanvas, 0, 0);
      }
      ctx.restore();
    }

    // Éclaircissement des yeux
    if (editState.eyeBrightening > 0) {
      ctx.save();
      ctx.globalAlpha = editState.eyeBrightening / 280;
      ctx.filter = `brightness(${100 + editState.eyeBrightening}%)`;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
      ctx.restore();
    }

    // Blanchiment des yeux
    if (editState.eyeWhitening > 0) {
      ctx.save();
      ctx.globalAlpha = editState.eyeWhitening / 380;
      ctx.filter = 'brightness(140%) contrast(110%)';
      ctx.globalCompositeOperation = 'lighten';
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
      ctx.restore();
    }

    // Ajustement des lèvres
    if (editState.lipColorAdjustment > 0) {
      ctx.save();
      ctx.globalAlpha = editState.lipColorAdjustment / 320;
      ctx.filter = `saturate(${100 + editState.lipColorAdjustment}%) hue-rotate(5deg)`;
      ctx.globalCompositeOperation = 'color';
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
      ctx.restore();
    }

    // Correction de l'éclairage
    if (editState.lightingCorrection > 0) {
      ctx.save();
      ctx.globalAlpha = editState.lightingCorrection / 300;
      ctx.filter = `brightness(${100 + editState.lightingCorrection * 0.5}%)`;
      ctx.globalCompositeOperation = 'overlay';
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
      ctx.restore();
    }
  };

  // Appliquer les effets créatifs
  const applyCreativeEffects = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, displayWidth: number, displayHeight: number) => {
    // Signature
    if (editState.signature && editState.signatureOpacity > 0) {
      ctx.font = '24px Arial';
      ctx.fillStyle = `rgba(255,255,255,${editState.signatureOpacity / 100})`;
      ctx.textAlign = 'center';
      ctx.fillText(
        editState.signature, 
        (displayWidth * editState.signaturePosition.x) / 100,
        (displayHeight * editState.signaturePosition.y) / 100
      );
    }

    // Text overlay
    if (editState.textOverlay && editState.textOpacity > 0) {
      ctx.font = '32px Arial';
      ctx.fillStyle = `rgba(255,255,255,${editState.textOpacity / 100})`;
      ctx.textAlign = 'center';
      ctx.fillText(
        editState.textOverlay, 
        (displayWidth * editState.textPosition.x) / 100,
        (displayHeight * editState.textPosition.y) / 100
      );
    }
  };

  // Mettre à jour les filtres
  useEffect(() => {
    if (!isLoading) {
      applyFilters();
    }
  }, [editState, isLoading, isFullscreen]);

  // Redimensionner automatiquement quand la fenêtre change
  useEffect(() => {
    const handleResize = () => {
      if (!isLoading) {
        applyFilters();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoading]);

  // Undo/Redo
  const undo = () => {
    if (editState.historyIndex > 0) {
      const prevState = editState.history[editState.historyIndex - 1];
      setEditState(prev => ({
        ...prev,
        ...prevState.state,
        historyIndex: prev.historyIndex - 1
      }));
    }
  };

  const redo = () => {
    if (editState.historyIndex < editState.history.length - 1) {
      const nextState = editState.history[editState.historyIndex + 1];
      setEditState(prev => ({
        ...prev,
        ...nextState.state,
        historyIndex: prev.historyIndex + 1
      }));
    }
  };

  // Sauvegarder
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const editedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      onSave(editedImageUrl);
    }
  };

  // Appliquer un preset artistique
  const applyArtisticPreset = (presetId: string) => {
    const presets = {
      cinematic: { brightness: 10, contrast: 20, saturation: -10, vignette: 30 },
      film: { brightness: 5, contrast: 15, saturation: -5, grain: 20 },
      vintage: { brightness: -5, contrast: 10, saturation: -20, hue: 30 },
      dramatic: { brightness: -10, contrast: 30, saturation: 10, vignette: 50 }
    };
    
    const preset = presets[presetId as keyof typeof presets];
    if (preset) {
      setEditState(prev => ({ ...prev, ...preset }));
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white text-xl">Chargement de l'éditeur...</div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-50 ${
          isFullscreen ? 'flex flex-col' : 'flex flex-row'
        } overflow-hidden`}
      >
        {isFullscreen ? (
          <>
            {/* Header en mode plein écran */}
            <div className="bg-neutral-900 border-b border-neutral-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-white text-xl font-semibold">🎨 Éditeur Photo Professionnel</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={undo}
                    disabled={editState.historyIndex <= 0}
                    className="text-white hover:bg-white/10"
                  >
                    <Undo size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={redo}
                    disabled={editState.historyIndex >= editState.history.length - 1}
                    className="text-white hover:bg-white/10"
                  >
                    <Redo size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save size={16} className="mr-2" />
                  Sauvegarder
                </Button>
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

            {/* Sidebar en mode plein écran */}
            <div className="w-full h-auto bg-neutral-800 border-b border-neutral-700">
              {/* Tabs */}
              <div className="flex border-b border-neutral-700 overflow-x-auto">
                {[
                  { id: 'adjust', label: 'Ajustements', icon: Settings },
                  { id: 'portrait', label: 'Portrait', icon: Smile },
                  { id: 'advanced', label: 'Avancé', icon: Wand2 },
                  { id: 'creative', label: 'Créatif', icon: Sparkles },
                  { id: 'passport', label: 'Passport', icon: Camera, disabled: true },
                  { id: 'layers', label: 'Layers', icon: Layers },
                  { id: 'presets', label: 'Presets', icon: Star },
                  { id: 'history', label: 'Historique', icon: History }
                ].map(({ id, label, icon: Icon, disabled }) => (
                  <button
                    key={id}
                    onClick={(e) => {
                      if (disabled) {
                        e.preventDefault();
                        return;
                      }
                      setActiveTab(id as any);
                    }}
                    disabled={disabled}
                    className={`flex-shrink-0 flex items-center gap-2 py-3 px-5 text-sm font-medium transition-colors whitespace-nowrap ${
                      disabled
                        ? 'text-neutral-500 cursor-not-allowed opacity-50'
                        : activeTab === id
                        ? 'text-primary-400 bg-primary-400/10 border-b-2 border-primary-400'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Contenu des tabs */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {activeTab === 'adjust' && (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Luminosité */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sun size={14} className="text-yellow-400" />
                        <span className="text-white text-xs font-medium">Luminosité</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.brightness}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={editState.brightness}
                        onChange={(e) => setEditState(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Contraste */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-blue-400" />
                        <span className="text-white text-xs font-medium">Contraste</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.contrast}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={editState.contrast}
                        onChange={(e) => setEditState(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Saturation */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets size={14} className="text-green-400" />
                        <span className="text-white text-xs font-medium">Saturation</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.saturation}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={editState.saturation}
                        onChange={(e) => setEditState(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Zoom */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ZoomIn size={14} className="text-green-400" />
                        <span className="text-white text-xs font-medium">Zoom</span>
                        <span className="text-neutral-400 text-xs ml-auto">{Math.round(editState.scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={editState.scale}
                        onChange={(e) => setEditState(prev => ({ ...prev, scale: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'portrait' && (
                  <div className="grid grid-cols-1 gap-3">
                    {/* Lissage de peau */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-pink-400" />
                        <span className="text-white text-xs font-medium">Lissage peau</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.skinSmoothing}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.skinSmoothing}
                        onChange={(e) => setEditState(prev => ({ ...prev, skinSmoothing: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Éclaircissement des yeux */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={14} className="text-blue-400" />
                        <span className="text-white text-xs font-medium">Yeux éclaircis</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.eyeBrightening}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.eyeBrightening}
                        onChange={(e) => setEditState(prev => ({ ...prev, eyeBrightening: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Blanchiment des yeux */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={14} className="text-white" />
                        <span className="text-white text-xs font-medium">Yeux blancs</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.eyeWhitening}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.eyeWhitening}
                        onChange={(e) => setEditState(prev => ({ ...prev, eyeWhitening: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Couleur lèvres */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Palette size={14} className="text-red-400" />
                        <span className="text-white text-xs font-medium">Couleur lèvres</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.lipColorAdjustment}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={editState.lipColorAdjustment}
                        onChange={(e) => setEditState(prev => ({ ...prev, lipColorAdjustment: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Éclairage */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sun size={14} className="text-yellow-400" />
                        <span className="text-white text-xs font-medium">Éclairage</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.lightingCorrection}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={editState.lightingCorrection}
                        onChange={(e) => setEditState(prev => ({ ...prev, lightingCorrection: Number(e.target.value) }))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'creative' && (
                  <div className="space-y-4">
                    {/* Signature */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Type size={14} className="text-white" />
                        <span className="text-white text-xs font-medium">Signature</span>
                      </div>
                      <input
                        type="text"
                        value={editState.signature}
                        onChange={(e) => setEditState(prev => ({ ...prev, signature: e.target.value }))}
                        className="w-full px-2 py-1 bg-neutral-700 text-white rounded text-xs"
                        placeholder="VisionFocale"
                      />
                    </div>

                    {/* Filtres artistiques */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-white text-xs font-medium">Filtres</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { id: 'cinematic', label: 'Ciné', color: 'bg-red-500' },
                          { id: 'film', label: 'Film', color: 'bg-amber-500' },
                          { id: 'vintage', label: 'Vintage', color: 'bg-orange-500' },
                          { id: 'dramatic', label: 'Drama', color: 'bg-purple-500' }
                        ].map(({ id, label, color }) => (
                          <button
                            key={id}
                            onClick={() => applyArtisticPreset(id)}
                            className={`${color} text-white p-1 rounded text-xs font-medium hover:opacity-80 transition-opacity`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-3">
                    <RetouchingTools
                      canvasRef={canvasRef}
                      selectedTool={selectedTool}
                      onToolChange={setSelectedTool}
                      brushSize={brushSize}
                      onBrushSizeChange={setBrushSize}
                      brushOpacity={brushOpacity}
                      onBrushOpacityChange={setBrushOpacity}
                    />
                  </div>
                )}

                {activeTab === 'passport' && (
                  <PassportPhotoTools 
                    canvasRef={canvasRef}
                    onApply={() => applyFilters()}
                  />
                )}

                {activeTab === 'layers' && (
                  <div className="space-y-3">
                    <LayersPanel
                      layers={editState.layers}
                      activeLayer={editState.activeLayer}
                      onLayerChange={(layers) => setEditState(prev => ({ ...prev, layers }))}
                      onActiveLayerChange={(activeLayer) => setEditState(prev => ({ ...prev, activeLayer }))}
                    />
                  </div>
                )}

                {activeTab === 'presets' && (
                  <div className="space-y-3">
                    <PresetsPanel
                      onApplyPreset={(preset) => {
                        setEditState(prev => ({ ...prev, ...preset }));
                      }}
                    />
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-3">
                    <div className="text-white text-sm">
                      <p className="mb-2">Historique : {editState.historyIndex + 1} / {editState.history.length}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={undo}
                          disabled={editState.historyIndex <= 0}
                        >
                          <Undo size={14} className="mr-1" />
                          Annuler
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={redo}
                          disabled={editState.historyIndex >= editState.history.length - 1}
                        >
                          <Redo size={14} className="mr-1" />
                          Rétablir
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Canvas Area en mode plein écran */}
            <div className="flex-1 flex items-center justify-center bg-neutral-900 p-4 overflow-auto min-h-0">
              <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
                <canvas
                  ref={canvasRef}
                  className="border border-neutral-700 rounded-lg shadow-2xl bg-white"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    minWidth: '300px',
                    minHeight: '200px'
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Sidebar */}
            <div className="w-96 h-full flex-shrink-0 bg-neutral-800 border-r border-neutral-700 flex flex-col">
              {/* Header de la sidebar */}
              <div className="bg-neutral-900 border-b border-neutral-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white text-lg font-semibold">🎨 Éditeur</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="text-white hover:bg-white/10"
                    >
                      <Maximize2 size={16} />
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
                
                {/* Bouton de sauvegarde */}
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  <Save size={18} className="mr-2" />
                  Sauvegarder les modifications
                </Button>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-neutral-700 overflow-x-auto">
                {[
                  { id: 'adjust', label: 'Ajustements', icon: Settings },
                  { id: 'portrait', label: 'Portrait', icon: Smile },
                  { id: 'advanced', label: 'Avancé', icon: Wand2 },
                  { id: 'creative', label: 'Créatif', icon: Sparkles },
                  { id: 'passport', label: 'Passport', icon: Camera, disabled: true },
                  { id: 'layers', label: 'Layers', icon: Layers },
                  { id: 'presets', label: 'Presets', icon: Star },
                  { id: 'history', label: 'Historique', icon: History }
                ].map(({ id, label, icon: Icon, disabled }) => (
                  <button
                    key={id}
                    onClick={(e) => {
                      if (disabled) {
                        e.preventDefault();
                        return;
                      }
                      setActiveTab(id as any);
                    }}
                    disabled={disabled}
                    className={`flex-shrink-0 flex items-center gap-2 py-3 px-5 text-sm font-medium transition-colors whitespace-nowrap ${
                      disabled
                        ? 'text-neutral-500 cursor-not-allowed opacity-50'
                        : activeTab === id
                        ? 'text-primary-400 bg-primary-400/10 border-b-2 border-primary-400'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
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
                        <Zap size={16} className="text-blue-400" />
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

                    {/* Vignette */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Circle size={16} className="text-orange-400" />
                        <span className="text-white text-sm font-medium">Vignette</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.vignette}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.vignette}
                        onChange={(e) => setEditState(prev => ({ ...prev, vignette: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Grain */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon size={16} className="text-gray-400" />
                        <span className="text-white text-sm font-medium">Grain</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.grain}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.grain}
                        onChange={(e) => setEditState(prev => ({ ...prev, grain: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Rotation */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <RotateCw size={16} className="text-blue-400" />
                        <span className="text-white text-sm font-medium">Rotation</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={editState.rotation}
                        onChange={(e) => setEditState(prev => ({ ...prev, rotation: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Zoom */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ZoomIn size={16} className="text-green-400" />
                        <span className="text-white text-sm font-medium">Zoom</span>
                        <span className="text-neutral-400 text-xs ml-auto">{Math.round(editState.scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={editState.scale}
                        onChange={(e) => setEditState(prev => ({ ...prev, scale: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'portrait' && (
                  <div className="space-y-6">
                    <h3 className="text-white font-medium mb-4">🖼️ Outils de Portrait</h3>
                    
                    {/* Lissage de peau */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-pink-400" />
                        <span className="text-white text-sm font-medium">Lissage de peau</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.skinSmoothing}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.skinSmoothing}
                        onChange={(e) => setEditState(prev => ({ ...prev, skinSmoothing: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Suppression d'imperfections */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target size={16} className="text-red-400" />
                        <span className="text-white text-sm font-medium">Suppression d'imperfections</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.blemishRemoval}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.blemishRemoval}
                        onChange={(e) => setEditState(prev => ({ ...prev, blemishRemoval: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Éclaircissement des yeux */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Eye size={16} className="text-blue-400" />
                        <span className="text-white text-sm font-medium">Éclaircissement des yeux</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.eyeBrightening}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.eyeBrightening}
                        onChange={(e) => setEditState(prev => ({ ...prev, eyeBrightening: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Blanchiment des yeux */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Moon size={16} className="text-white" />
                        <span className="text-white text-sm font-medium">Blanchiment des yeux</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.eyeWhitening}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.eyeWhitening}
                        onChange={(e) => setEditState(prev => ({ ...prev, eyeWhitening: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Ajustement couleur cheveux */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Palette size={16} className="text-brown-400" />
                        <span className="text-white text-sm font-medium">Couleur cheveux</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.hairColorAdjustment}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={editState.hairColorAdjustment}
                        onChange={(e) => setEditState(prev => ({ ...prev, hairColorAdjustment: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Ajustement couleur lèvres */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <HeartIcon size={16} className="text-red-400" />
                        <span className="text-white text-sm font-medium">Couleur lèvres</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.lipColorAdjustment}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={editState.lipColorAdjustment}
                        onChange={(e) => setEditState(prev => ({ ...prev, lipColorAdjustment: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Correction d'éclairage */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sun size={16} className="text-yellow-400" />
                        <span className="text-white text-sm font-medium">Correction d'éclairage</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.lightingCorrection}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={editState.lightingCorrection}
                        onChange={(e) => setEditState(prev => ({ ...prev, lightingCorrection: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Ajustement des ombres */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Moon size={16} className="text-gray-400" />
                        <span className="text-white text-sm font-medium">Ajustement des ombres</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.shadowAdjustment}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={editState.shadowAdjustment}
                        onChange={(e) => setEditState(prev => ({ ...prev, shadowAdjustment: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'creative' && (
                  <div className="space-y-6">
                    <h3 className="text-white font-medium mb-4">🎨 Outils Créatifs</h3>
                    
                    {/* Signature */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Type size={16} className="text-white" />
                        <span className="text-white text-sm font-medium">Signature</span>
                      </div>
                      <input
                        type="text"
                        value={editState.signature}
                        onChange={(e) => setEditState(prev => ({ ...prev, signature: e.target.value }))}
                        className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg text-sm"
                        placeholder="VisionFocale"
                      />
                      <div className="mt-2">
                        <span className="text-white text-xs">Opacité: {editState.signatureOpacity}%</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editState.signatureOpacity}
                          onChange={(e) => setEditState(prev => ({ ...prev, signatureOpacity: Number(e.target.value) }))}
                          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider mt-1"
                        />
                      </div>
                    </div>

                    {/* Text Overlay */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Type size={16} className="text-blue-400" />
                        <span className="text-white text-sm font-medium">Texte</span>
                      </div>
                      <input
                        type="text"
                        value={editState.textOverlay}
                        onChange={(e) => setEditState(prev => ({ ...prev, textOverlay: e.target.value }))}
                        className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg text-sm"
                        placeholder="Ajouter du texte..."
                      />
                      <div className="mt-2">
                        <span className="text-white text-xs">Opacité: {editState.textOpacity}%</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editState.textOpacity}
                          onChange={(e) => setEditState(prev => ({ ...prev, textOpacity: Number(e.target.value) }))}
                          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider mt-1"
                        />
                      </div>
                    </div>

                    {/* Filtres artistiques */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-purple-400" />
                        <span className="text-white text-sm font-medium">Filtres Artistiques</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'cinematic', label: 'Cinématique', color: 'bg-red-500' },
                          { id: 'film', label: 'Film', color: 'bg-amber-500' },
                          { id: 'vintage', label: 'Vintage', color: 'bg-orange-500' },
                          { id: 'dramatic', label: 'Dramatique', color: 'bg-purple-500' }
                        ].map(({ id, label, color }) => (
                          <button
                            key={id}
                            onClick={() => applyArtisticPreset(id)}
                            className={`${color} text-white p-2 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Double exposition */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Layers size={16} className="text-green-400" />
                        <span className="text-white text-sm font-medium">Double exposition</span>
                        <span className="text-neutral-400 text-xs ml-auto">{editState.doubleExposure}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editState.doubleExposure}
                        onChange={(e) => setEditState(prev => ({ ...prev, doubleExposure: Number(e.target.value) }))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-4">
                    <h3 className="text-white font-medium mb-4">🛠️ Outils Avancés</h3>
                    
                    {/* Outils de retouche */}
                    <RetouchingTools
                      canvasRef={canvasRef}
                      selectedTool={selectedTool}
                      onToolChange={setSelectedTool}
                      brushSize={brushSize}
                      onBrushSizeChange={setBrushSize}
                      brushOpacity={brushOpacity}
                      onBrushOpacityChange={setBrushOpacity}
                    />

                    {/* Courbes et ajustements */}
                    <CurvesAdjustment
                      curves={editState.curves}
                      onCurvesChange={(curves) => setEditState(prev => ({ ...prev, curves }))}
                      hsl={editState.hsl}
                      onHslChange={(hsl) => setEditState(prev => ({ ...prev, hsl }))}
                      toneMapping={editState.toneMapping}
                      onToneMappingChange={(value) => setEditState(prev => ({ ...prev, toneMapping: value }))}
                    />
                  </div>
                )}

                {activeTab === 'passport' && (
                  <PassportPhotoTools 
                    canvasRef={canvasRef}
                    onApply={() => applyFilters()}
                  />
                )}

                {activeTab === 'layers' && (
                  <LayersPanel
                    layers={editState.layers}
                    activeLayer={editState.activeLayer}
                    onLayerChange={(layers) => setEditState(prev => ({ ...prev, layers }))}
                    onActiveLayerChange={(index) => setEditState(prev => ({ ...prev, activeLayer: index }))}
                  />
                )}

                {activeTab === 'presets' && (
                  <PresetsPanel
                    onApplyPreset={(preset) => {
                      setEditState(prev => ({
                        ...prev,
                        ...preset.settings,
                        signature: preset.settings.signature,
                        signatureOpacity: preset.settings.signatureOpacity
                      }));
                    }}
                    onSavePreset={(preset) => {
                      // Sauvegarder le preset personnalisé
                      console.log('Saving preset:', preset);
                    }}
                    onDeletePreset={(presetId) => {
                      // Supprimer le preset personnalisé
                      console.log('Deleting preset:', presetId);
                    }}
                    currentSettings={{
                      brightness: editState.brightness,
                      contrast: editState.contrast,
                      saturation: editState.saturation,
                      hue: editState.hue,
                      skinSmoothing: editState.skinSmoothing,
                      eyeBrightening: editState.eyeBrightening,
                      vignette: editState.vignette,
                      grain: editState.grain,
                      artisticFilter: editState.artisticFilter,
                      signature: editState.signature,
                      signatureOpacity: editState.signatureOpacity
                    }}
                  />
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <h3 className="text-white font-medium mb-4">📜 Historique</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {editState.history.map((item, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg cursor-pointer transition-colors ${
                            index === editState.historyIndex
                              ? 'bg-primary-500/20 border border-primary-500'
                              : 'bg-neutral-700 hover:bg-neutral-600'
                          }`}
                          onClick={() => {
                            setEditState(prev => ({
                              ...prev,
                              ...item.state,
                              historyIndex: index
                            }));
                          }}
                        >
                          <div className="text-white text-sm">
                            Modification {index + 1}
                          </div>
                          <div className="text-neutral-400 text-xs">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center bg-neutral-900 p-4 overflow-auto min-h-0">
              <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
                <canvas
                  ref={canvasRef}
                  className="border border-neutral-700 rounded-lg shadow-2xl bg-white"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    minWidth: '300px',
                    minHeight: '200px'
                  }}
                />
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AdvancedPhotoEditor;