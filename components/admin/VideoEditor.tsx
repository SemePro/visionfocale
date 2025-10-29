'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Scissors, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Save,
  Undo,
  Redo,
  Plus,
  Trash2,
  Copy,
  Settings,
  Film,
  Music,
  Image as ImageIcon,
  Type,
  Layers,
  Palette,
  Zap,
  Grid,
  Move,
  RotateCw,
  Crop,
  Sliders,
  Sparkles,
  Clock,
  FastForward,
  Rewind,
  Split,
  Merge,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import VideoEffects from './VideoEffects';
import VideoTextOverlay from './VideoTextOverlay';
import { useFFmpeg } from '@/hooks/useFFmpeg';

interface VideoClip {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'audio' | 'image';
  duration: number;
  startTime: number;
  endTime: number;
  trimStart: number;
  trimEnd: number;
  track: number;
  volume: number;
  speed: number;
  effects: {
    crop?: { x: number; y: number; width: number; height: number };
    rotation?: number;
    scale?: number;
    opacity?: number;
    chromaKey?: { color: string; threshold: number };
    colorGrading?: {
      brightness: number;
      contrast: number;
      saturation: number;
      temperature: number;
      tint: number;
    };
  };
  transitions?: {
    in?: string;
    out?: string;
  };
}

interface VideoEditorProps {
  onSave: (project: any) => void;
  onClose: () => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ onSave, onClose }) => {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'effects' | 'audio' | 'text' | 'export'>('basic');
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [exportFormat, setExportFormat] = useState<'mp4' | 'webm' | 'avi' | 'mov'>('mp4');
  const [exportQuality, setExportQuality] = useState('1080p');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // FFmpeg hook
  const ffmpeg = useFFmpeg();

  // Importer des médias
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      
      let type: 'video' | 'audio' | 'image' = 'video';
      if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type.startsWith('image/')) type = 'image';

      // Obtenir la durée pour les vidéos et audios
      let duration = 5; // Durée par défaut pour les images
      if (type === 'video' || type === 'audio') {
        const media = document.createElement(type);
        media.src = url;
        await new Promise((resolve) => {
          media.onloadedmetadata = () => {
            duration = media.duration;
            resolve(true);
          };
        });
      }

      const newClip: VideoClip = {
        id: `clip-${Date.now()}-${i}`,
        name: file.name,
        url,
        type,
        duration,
        startTime: clips.length > 0 ? clips[clips.length - 1].endTime : 0,
        endTime: clips.length > 0 ? clips[clips.length - 1].endTime + duration : duration,
        trimStart: 0,
        trimEnd: duration,
        track: 0,
        volume: 100,
        speed: 1,
        effects: {},
        transitions: {}
      };

      const updatedClips = [...clips, newClip];
      setClips(updatedClips);
      saveToHistory(updatedClips);
      
      // Définir la première vidéo comme preview
      if (type === 'video' && !previewUrl) {
        console.log('[Import] Setting preview URL:', url);
        console.log('[Import] File name:', file.name);
        console.log('[Import] File type:', file.type);
        console.log('[Import] File size:', file.size);
        setIsVideoLoading(true);
        setPreviewUrl(url);
        setCurrentFile(file); // Sauvegarder le fichier original
        // Auto-sélectionner le premier clip
        setSelectedClip(newClip.id);
        console.log('[Import] Preview URL set, video should load now');
      }
    }

    if (files.length > 0) {
      toast.success(`${files.length} fichier(s) importé(s)`);
    }
  };

  // Sauvegarder dans l'historique
  const saveToHistory = (newClips: VideoClip[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ clips: newClips, timestamp: Date.now() });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Annuler
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setClips(history[historyIndex - 1].clips);
    }
  };

  // Rétablir
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setClips(history[historyIndex + 1].clips);
    }
  };

  // Découper un clip
  const splitClip = (clipId: string, splitTime: number) => {
    const clipIndex = clips.findIndex(c => c.id === clipId);
    if (clipIndex === -1) return;

    const clip = clips[clipIndex];
    const relativeTime = splitTime - clip.startTime;

    const clip1: VideoClip = {
      ...clip,
      id: `${clip.id}-part1`,
      endTime: clip.startTime + relativeTime,
      trimEnd: clip.trimStart + relativeTime
    };

    const clip2: VideoClip = {
      ...clip,
      id: `${clip.id}-part2`,
      startTime: clip.startTime + relativeTime,
      trimStart: clip.trimStart + relativeTime
    };

    const newClips = [
      ...clips.slice(0, clipIndex),
      clip1,
      clip2,
      ...clips.slice(clipIndex + 1)
    ];

    setClips(newClips);
    saveToHistory(newClips);
    toast.success('Clip découpé');
  };

  // Supprimer un clip
  const deleteClip = (clipId: string) => {
    const newClips = clips.filter(c => c.id !== clipId);
    setClips(newClips);
    saveToHistory(newClips);
    toast.success('Clip supprimé');
  };

  // Dupliquer un clip
  const duplicateClip = (clipId: string) => {
    const clip = clips.find(c => c.id === clipId);
    if (!clip) return;

    const newClip: VideoClip = {
      ...clip,
      id: `${clip.id}-copy-${Date.now()}`,
      startTime: clip.endTime,
      endTime: clip.endTime + (clip.endTime - clip.startTime)
    };

    setClips([...clips, newClip]);
    saveToHistory([...clips, newClip]);
    toast.success('Clip dupliqué');
  };

  // Fusionner des clips
  const mergeClips = (clipIds: string[]) => {
    if (clipIds.length < 2) {
      toast.error('Sélectionnez au moins 2 clips');
      return;
    }

    const selectedClips = clips.filter(c => clipIds.includes(c.id)).sort((a, b) => a.startTime - b.startTime);
    
    const mergedClip: VideoClip = {
      ...selectedClips[0],
      id: `merged-${Date.now()}`,
      name: `Merged ${selectedClips.length} clips`,
      endTime: selectedClips[selectedClips.length - 1].endTime,
      duration: selectedClips.reduce((sum, c) => sum + c.duration, 0)
    };

    const newClips = clips.filter(c => !clipIds.includes(c.id));
    newClips.push(mergedClip);
    newClips.sort((a, b) => a.startTime - b.startTime);

    setClips(newClips);
    saveToHistory(newClips);
    toast.success('Clips fusionnés');
  };

  // Changer la vitesse
  const changeSpeed = (clipId: string, speed: number) => {
    const newClips = clips.map(c => 
      c.id === clipId ? { ...c, speed, duration: c.duration / speed } : c
    );
    setClips(newClips);
    saveToHistory(newClips);
  };

  // Appliquer un effet de chroma key
  const applyChromaKey = (clipId: string, color: string, threshold: number) => {
    const newClips = clips.map(c => 
      c.id === clipId 
        ? { ...c, effects: { ...c.effects, chromaKey: { color, threshold } } }
        : c
    );
    setClips(newClips);
    saveToHistory(newClips);
    toast.success('Chroma key appliqué');
  };

  // Appliquer un recadrage
  const applyCrop = (clipId: string, crop: { x: number; y: number; width: number; height: number }) => {
    const newClips = clips.map(c => 
      c.id === clipId 
        ? { ...c, effects: { ...c.effects, crop } }
        : c
    );
    setClips(newClips);
    saveToHistory(newClips);
  };

  // Appliquer une rotation
  const applyRotation = (clipId: string, rotation: number) => {
    const newClips = clips.map(c => 
      c.id === clipId 
        ? { ...c, effects: { ...c.effects, rotation } }
        : c
    );
    setClips(newClips);
    saveToHistory(newClips);
  };

  // Appliquer un effet
  const handleApplyEffect = (clipId: string, effect: any) => {
    const newClips = clips.map(c => {
      if (c.id === clipId) {
        const updatedEffects = { ...c.effects };
        
        if (effect.type === 'brightness') {
          updatedEffects.colorGrading = {
            ...updatedEffects.colorGrading,
            brightness: effect.value,
            contrast: updatedEffects.colorGrading?.contrast || 0,
            saturation: updatedEffects.colorGrading?.saturation || 0,
            temperature: updatedEffects.colorGrading?.temperature || 0,
            tint: updatedEffects.colorGrading?.tint || 0
          };
        } else if (effect.type === 'contrast') {
          updatedEffects.colorGrading = {
            ...updatedEffects.colorGrading,
            brightness: updatedEffects.colorGrading?.brightness || 0,
            contrast: effect.value,
            saturation: updatedEffects.colorGrading?.saturation || 0,
            temperature: updatedEffects.colorGrading?.temperature || 0,
            tint: updatedEffects.colorGrading?.tint || 0
          };
        } else if (effect.type === 'saturation') {
          updatedEffects.colorGrading = {
            ...updatedEffects.colorGrading,
            brightness: updatedEffects.colorGrading?.brightness || 0,
            contrast: updatedEffects.colorGrading?.contrast || 0,
            saturation: effect.value,
            temperature: updatedEffects.colorGrading?.temperature || 0,
            tint: updatedEffects.colorGrading?.tint || 0
          };
        } else if (effect.type === 'temperature') {
          updatedEffects.colorGrading = {
            ...updatedEffects.colorGrading,
            brightness: updatedEffects.colorGrading?.brightness || 0,
            contrast: updatedEffects.colorGrading?.contrast || 0,
            saturation: updatedEffects.colorGrading?.saturation || 0,
            temperature: effect.value,
            tint: updatedEffects.colorGrading?.tint || 0
          };
        }
        
        return { ...c, effects: updatedEffects };
      }
      return c;
    });
    
    setClips(newClips);
    saveToHistory(newClips);
    toast.success('Effet appliqué');
  };

  // Ajouter du texte
  const handleAddText = (textConfig: any) => {
    toast.success('Texte ajouté à la timeline');
    // Logique pour ajouter le texte comme overlay
  };

  // Exporter le projet
  const handleExport = async (format: string, quality: string) => {
    if (!currentFile) {
      toast.error('Aucune vidéo à exporter');
      return;
    }

    if (!ffmpeg.isLoaded) {
      toast.error('FFmpeg n\'est pas encore chargé. Veuillez patienter...');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingMessage('Export en cours...');

      // Convertir au format demandé
      const outputFormat = format as 'mp4' | 'webm' | 'avi' | 'mov';
      const blob = await ffmpeg.convertFormat(currentFile, outputFormat);

      if (blob) {
        // Télécharger le fichier
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visionfocale_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success(`Vidéo exportée en ${format} (${quality}) !`);
        
        onSave({
          clips,
          format,
          quality,
          duration: clips.reduce((max, c) => Math.max(max, c.endTime), 0),
          exportDate: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export de la vidéo');
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  // Calculer la durée totale
  useEffect(() => {
    const totalDuration = clips.reduce((max, clip) => Math.max(max, clip.endTime), 0);
    setDuration(totalDuration);
  }, [clips]);

  // Synchroniser le lecteur vidéo avec le currentTime
  useEffect(() => {
    if (videoRef.current && previewUrl) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, previewUrl]);

  // Gérer la lecture/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => console.error('Erreur de lecture:', err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Mettre à jour currentTime pendant la lecture
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadedMetadata = () => {
      console.log('Video loaded, duration:', video.duration);
      setDuration(video.duration);
      setIsVideoLoading(false);
      toast.success('Vidéo prête à être éditée !');
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setIsVideoLoading(false);
      toast.error('Erreur lors du chargement de la vidéo');
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [previewUrl]);

  // Mettre à jour le volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Mettre à jour le mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Barre d'espace pour play/pause
      if (e.code === 'Space' && previewUrl) {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
      // Flèche gauche pour reculer
      if (e.code === 'ArrowLeft' && previewUrl) {
        e.preventDefault();
        setCurrentTime(Math.max(0, currentTime - 5));
      }
      // Flèche droite pour avancer
      if (e.code === 'ArrowRight' && previewUrl) {
        e.preventDefault();
        setCurrentTime(Math.min(duration, currentTime + 5));
      }
      // M pour mute/unmute
      if (e.code === 'KeyM' && previewUrl) {
        e.preventDefault();
        setIsMuted(!isMuted);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [previewUrl, isPlaying, currentTime, duration, isMuted]);

  return (
    <div className={`fixed inset-0 z-50 bg-neutral-900 flex flex-col ${isFullscreen ? 'p-0' : 'p-4'}`}>
      {/* Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className="text-primary-500" size={24} />
            <h1 className="text-white text-xl font-bold">🎬 Éditeur Vidéo Pro</h1>
          </div>
          
          {/* FFmpeg Status */}
          {ffmpeg.isLoading && (
            <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
              <span className="text-blue-400 text-xs">Chargement de l'éditeur...</span>
            </div>
          )}
          
          {ffmpeg.isLoaded && (
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-green-400 text-xs">Éditeur prêt</span>
            </div>
          )}
          
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

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload size={16} />}
          >
            Importer
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('export')}
            leftIcon={<Download size={16} />}
            className="bg-green-600 hover:bg-green-700"
          >
            Exporter
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Tools */}
        <div className="w-80 bg-neutral-800 border-r border-neutral-700 overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-4">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'basic', label: 'Basique', icon: Scissors },
                { id: 'advanced', label: 'Avancé', icon: Layers },
                { id: 'effects', label: 'Effets', icon: Sparkles },
                { id: 'audio', label: 'Audio', icon: Music },
                { id: 'text', label: 'Texte', icon: Type },
                { id: 'export', label: 'Export', icon: Download }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* Tool Content */}
            <div className="space-y-4">
              {clips.length === 0 && (
                <div className="bg-neutral-700 rounded-lg p-4 text-center">
                  <Upload size={32} className="mx-auto mb-2 text-neutral-400" />
                  <p className="text-white text-sm font-medium mb-1">Aucune vidéo importée</p>
                  <p className="text-neutral-400 text-xs mb-3">Importez une vidéo pour commencer l'édition</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload size={14} />}
                    className="w-full"
                  >
                    Importer une Vidéo
                  </Button>
                </div>
              )}

              {clips.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-white font-medium text-sm">📁 Clips Importés ({clips.length})</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {clips.map((clip) => (
                      <button
                        key={clip.id}
                        onClick={() => setSelectedClip(clip.id)}
                        className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                          selectedClip === clip.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {clip.type === 'video' && <Film size={12} />}
                          {clip.type === 'audio' && <Music size={12} />}
                          {clip.type === 'image' && <ImageIcon size={12} />}
                          <span className="truncate flex-1">{clip.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {clips.length > 0 && !selectedClip && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-xs">
                    💡 Cliquez sur un clip ci-dessus ou dans la timeline pour le sélectionner
                  </p>
                </div>
              )}

              {activeTab === 'basic' && clips.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-medium">🎬 Outils de Base</h3>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedClip && splitClip(selectedClip, currentTime)}
                    disabled={!selectedClip}
                    leftIcon={<Split size={16} />}
                    className="w-full"
                  >
                    Découper
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedClip && deleteClip(selectedClip)}
                    disabled={!selectedClip}
                    leftIcon={<Trash2 size={16} />}
                    className="w-full"
                  >
                    Supprimer
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedClip && duplicateClip(selectedClip)}
                    disabled={!selectedClip}
                    leftIcon={<Copy size={16} />}
                    className="w-full"
                  >
                    Dupliquer
                  </Button>

                  {selectedClip && (
                    <div className="space-y-2 mt-4">
                      <label className="text-white text-sm">Vitesse</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => changeSpeed(selectedClip, 0.5)}
                        >
                          0.5x
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => changeSpeed(selectedClip, 1)}
                        >
                          1x
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => changeSpeed(selectedClip, 2)}
                        >
                          2x
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'advanced' && clips.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-medium">⚡ Outils Avancés</h3>
                  
                  {selectedClip && (
                    <>
                      <div>
                        <label className="text-white text-sm mb-2 block">Rotation</label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyRotation(selectedClip, 90)}
                          >
                            90°
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyRotation(selectedClip, 180)}
                          >
                            180°
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyRotation(selectedClip, 270)}
                          >
                            270°
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-white text-sm mb-2 block">Chroma Key (Fond Vert)</label>
                        <div className="space-y-2">
                          <input
                            type="color"
                            defaultValue="#00ff00"
                            onChange={(e) => applyChromaKey(selectedClip, e.target.value, 30)}
                            className="w-full h-10 rounded cursor-pointer"
                          />
                          <p className="text-xs text-neutral-400">Sélectionnez la couleur à supprimer</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'effects' && selectedClip && (
                <VideoEffects
                  clipId={selectedClip}
                  onApplyEffect={handleApplyEffect}
                />
              )}

              {activeTab === 'text' && (
                <VideoTextOverlay onAddText={handleAddText} />
              )}

              {activeTab === 'export' && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium">📤 Exporter</h3>
                  
                  {!currentFile && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <p className="text-yellow-400 text-xs">
                        ⚠️ Importez une vidéo pour pouvoir l'exporter
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-white text-sm mb-2 block">Format</label>
                    <select 
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-primary-500 focus:outline-none"
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as any)}
                    >
                      <option value="mp4">MP4 (H.264) - Recommandé</option>
                      <option value="webm">WebM - Pour le web</option>
                      <option value="mov">MOV - Pour Mac</option>
                      <option value="avi">AVI - Compatibilité</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white text-sm mb-2 block">Qualité</label>
                    <select 
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-primary-500 focus:outline-none"
                      value={exportQuality}
                      onChange={(e) => setExportQuality(e.target.value)}
                    >
                      <option value="4k">4K (3840x2160) - Ultra HD</option>
                      <option value="1080p">Full HD (1920x1080) - Recommandé</option>
                      <option value="720p">HD (1280x720) - Rapide</option>
                      <option value="480p">SD (854x480) - Léger</option>
                    </select>
                  </div>

                  <div className="bg-neutral-800 rounded-lg p-3 space-y-2">
                    <h4 className="text-white text-sm font-medium">Informations</h4>
                    <div className="text-neutral-400 text-xs space-y-1">
                      <p>• Format: {exportFormat.toUpperCase()}</p>
                      <p>• Qualité: {exportQuality}</p>
                      <p>• Durée: {Math.floor(duration)}s</p>
                      <p>• Clips: {clips.length}</p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleExport(exportFormat, exportQuality)}
                    leftIcon={<Download size={16} />}
                    disabled={!currentFile || !ffmpeg.isLoaded}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!ffmpeg.isLoaded ? 'Chargement...' : 'Exporter la Vidéo'}
                  </Button>

                  {ffmpeg.isLoading && (
                    <p className="text-neutral-400 text-xs text-center">
                      Chargement de l'éditeur vidéo...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col bg-neutral-900">
          {/* Video Preview */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden group">
              {previewUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="w-full h-full object-contain"
                    onClick={() => !isVideoLoading && setIsPlaying(!isPlaying)}
                    onLoadedMetadata={() => {
                      console.log('[Video] Metadata loaded, duration:', videoRef.current?.duration);
                      setIsVideoLoading(false);
                    }}
                    onLoadStart={() => {
                      console.log('[Video] Load start, src:', previewUrl);
                      setIsVideoLoading(true);
                    }}
                    onError={(e) => {
                      console.error('[Video] Error loading video:', e);
                      setIsVideoLoading(false);
                      toast.error('Erreur lors du chargement de la vidéo');
                    }}
                  />
                  
                  {/* Loading Indicator */}
          {isVideoLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mb-4" />
              <p className="text-white text-sm">Chargement de la vidéo...</p>
            </div>
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
              <div className="bg-neutral-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
                  <h3 className="text-white text-lg font-semibold">{processingMessage}</h3>
                </div>
                
                {/* Progress Bar */}
                {ffmpeg.progress > 0 && (
                  <div className="space-y-2">
                    <div className="w-full bg-neutral-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 rounded-full"
                        style={{ width: `${ffmpeg.progress}%` }}
                      />
                    </div>
                    <p className="text-neutral-400 text-sm text-center">{ffmpeg.progress}%</p>
                  </div>
                )}
                
                <p className="text-neutral-400 text-sm mt-4 text-center">
                  Veuillez patienter, cela peut prendre quelques instants...
                </p>
              </div>
            </div>
          )}
                  
                  {/* Overlay Controls */}
                  {!isVideoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="rounded-full w-20 h-20 pointer-events-auto shadow-2xl"
                      >
                        {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
                      </Button>
                    </div>
                  )}

                  {/* Video Info Overlay */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <p className="text-white text-sm font-medium">
                      {selectedClip && clips.find(c => c.id === selectedClip)?.name}
                    </p>
                    <p className="text-neutral-300 text-xs">
                      {Math.floor(currentTime)}s / {Math.floor(duration)}s
                    </p>
                  </div>

                  {/* Playing Indicator */}
                  {isPlaying && (
                    <div className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-medium">EN LECTURE</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                  <Film size={64} className="mb-4" />
                  <p className="text-lg">Importez des médias pour commencer</p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload size={20} />}
                    className="mt-4"
                  >
                    Importer des Fichiers
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-neutral-800 border-t border-neutral-700 p-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
                disabled={!previewUrl || isVideoLoading}
                className="text-white hover:bg-white/10 disabled:opacity-30"
                title="Reculer de 5 secondes"
              >
                <SkipBack size={20} />
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!previewUrl || isVideoLoading}
                className="rounded-full w-14 h-14 disabled:opacity-50"
                title={isVideoLoading ? "Chargement..." : isPlaying ? "Pause" : "Lecture"}
              >
                {isVideoLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                ) : isPlaying ? (
                  <Pause size={28} />
                ) : (
                  <Play size={28} className="ml-1" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentTime(Math.min(duration, currentTime + 5))}
                disabled={!previewUrl || isVideoLoading}
                className="text-white hover:bg-white/10 disabled:opacity-30"
                title="Avancer de 5 secondes"
              >
                <SkipForward size={20} />
              </Button>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={!previewUrl || isVideoLoading}
                  className="text-white hover:bg-white/10 disabled:opacity-30"
                  title={isMuted ? "Activer le son" : "Couper le son"}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  disabled={!previewUrl || isVideoLoading}
                  className="w-24 disabled:opacity-30"
                  title={`Volume: ${volume}%`}
                />
                <span className="text-white text-xs w-10">{volume}%</span>
              </div>

              <div className="ml-auto text-white text-sm font-mono">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative bg-neutral-700 rounded h-32 overflow-x-auto" ref={timelineRef}>
              <div className="absolute top-0 left-0 right-0 h-8 bg-neutral-800 flex items-center px-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    className="text-white hover:bg-white/10"
                  >
                    -
                  </Button>
                  <span className="text-white text-xs">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                    className="text-white hover:bg-white/10"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="pt-8 p-2 min-w-full" style={{ width: `${duration * zoom * 50}px` }}>
                {clips.map((clip, index) => (
                  <div
                    key={clip.id}
                    onClick={() => setSelectedClip(clip.id)}
                    className={`absolute h-16 rounded cursor-pointer transition-all ${
                      selectedClip === clip.id
                        ? 'ring-2 ring-primary-500 bg-primary-600'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                    style={{
                      left: `${clip.startTime * zoom * 50}px`,
                      width: `${(clip.endTime - clip.startTime) * zoom * 50}px`,
                      top: `${40 + clip.track * 20}px`
                    }}
                  >
                    <div className="p-2 text-white text-xs truncate">
                      {clip.name}
                    </div>
                  </div>
                ))}

                {/* Playhead */}
                <div
                  className="absolute top-8 bottom-0 w-0.5 bg-red-500 pointer-events-none"
                  style={{ left: `${currentTime * zoom * 50}px` }}
                >
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*,image/*"
        multiple
        onChange={handleFileImport}
        className="hidden"
      />
    </div>
  );
};

export default VideoEditor;

