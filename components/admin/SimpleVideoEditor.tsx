'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Volume2,
  VolumeX,
  Upload,
  X,
  RotateCw,
  Scissors,
  FastForward,
  Rewind,
  Zap,
  Palette,
  Save
} from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useFFmpeg } from '@/hooks/useFFmpeg';

interface SimpleVideoEditorProps {
  onClose: () => void;
  onSave?: (data: any) => void;
}

export default function SimpleVideoEditor({ onClose, onSave }: SimpleVideoEditorProps) {
  const { isLoaded, isLoading, applyAllFilters } = useFFmpeg();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedSegmentStart, setSelectedSegmentStart] = useState<number | null>(null);
  const [selectedSegmentEnd, setSelectedSegmentEnd] = useState<number | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<boolean>(false);
  const [appliedBrightness, setAppliedBrightness] = useState(100);
  const [appliedContrast, setAppliedContrast] = useState(100);
  const [appliedSaturation, setAppliedSaturation] = useState(100);
  const [appliedRotation, setAppliedRotation] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasHiddenRef = useRef<HTMLCanvasElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setVideoFile(file);
        setVideoUrl(url);
        toast.success('Vidéo importée avec succès');
      } else {
        toast.error('Veuillez sélectionner un fichier vidéo');
      }
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Handle playback rate
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Mark segment start
  const markSegmentStart = () => {
    setSelectedSegmentStart(currentTime);
    toast.success('Début de segment marqué');
  };

  // Mark segment end
  const markSegmentEnd = () => {
    setSelectedSegmentEnd(currentTime);
    toast.success('Fin de segment marquée');
  };

  // Cut segment
  const handleCut = async () => {
    if (!videoFile || !selectedSegmentStart || !selectedSegmentEnd) {
      toast.error('Marquez d\'abord le début et la fin du segment');
      return;
    }

    // Note: Real cutting would require FFmpeg or similar
    toast.info('Découpage simulé (nécessite FFmpeg pour fonctionner réellement)');
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle time update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl]);

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle rotation
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Apply filters permanently
  const handleApplyFilters = () => {
    setAppliedBrightness(brightness);
    setAppliedContrast(contrast);
    setAppliedSaturation(saturation);
    setAppliedRotation(rotation);
    setAppliedFilters(true);
    
    // Save project with applied filters
    const projectData = {
      file: videoFile?.name,
      brightness: brightness,
      contrast: contrast,
      saturation: saturation,
      rotation: rotation,
      playbackRate,
      volume,
      segmentStart: selectedSegmentStart,
      segmentEnd: selectedSegmentEnd,
      savedAt: new Date().toISOString()
    };

    if (onSave) {
      onSave(projectData);
    }
    
    toast.success('Modifications appliquées et projet sauvegardé !');
  };

  // Handle download with FFmpeg
  const handleDownload = async () => {
    if (!videoFile || !videoRef.current) {
      toast.error('Aucune vidéo à télécharger');
      return;
    }

    // Check if filters need to be applied first
    if (!appliedFilters) {
      toast.error('Veuillez d\'abord appliquer les modifications avec le bouton "Appliquer"');
      return;
    }

    if (!isLoaded) {
      toast.error('FFmpeg n\'est pas encore chargé. Veuillez patienter...');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Export de la vidéo modifiée en cours...');

      // Apply all filters in one pass
      const processedBlob = await applyAllFilters(
        videoFile,
        appliedBrightness,
        appliedContrast,
        appliedSaturation,
        appliedRotation,
        playbackRate
      );

      if (processedBlob) {
        // Download the processed video
        const url = URL.createObjectURL(processedBlob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `${videoFile.name?.replace(/\.[^.]+$/, '') || 'visionfocale_video'}_edited_${timestamp}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Save project data
        const projectData = {
          file: videoFile.name,
          brightness: appliedBrightness,
          contrast: appliedContrast,
          saturation: appliedSaturation,
          rotation: appliedRotation,
          playbackRate,
          volume,
          segmentStart: selectedSegmentStart,
          segmentEnd: selectedSegmentEnd,
          savedAt: new Date().toISOString()
        };

        if (onSave) {
          onSave(projectData);
        }

        toast.success('Vidéo modifiée exportée avec succès !');
        toast.dismiss();
      } else {
        toast.error('Erreur lors du traitement de la vidéo');
        toast.dismiss();
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'export');
      toast.dismiss();
    } finally {
      setIsExporting(false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Video className="text-primary-500" size={24} />
          <h1 className="text-white text-xl font-bold">🎬 Éditeur Vidéo Simple</h1>
        </div>

        <div className="flex items-center gap-3">
          {videoFile && (
            <>
              <Button
                variant={appliedFilters ? "outline" : "primary"}
                size="sm"
                onClick={handleApplyFilters}
                leftIcon={<Save size={16} />}
                className={appliedFilters ? "bg-green-600/20 border-green-600 text-green-400" : ""}
              >
                {appliedFilters ? "✓ Appliquées" : "Appliquer"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownload}
                leftIcon={<Upload size={16} />}
                className="bg-green-600 hover:bg-green-700"
                disabled={!appliedFilters || !isLoaded || isExporting}
              >
                {isExporting ? 'Export en cours...' : 'Exporter Vidéo Modifiée'}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload size={16} />}
          >
            Importer
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            leftIcon={<X size={16} />}
          >
            Fermer
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {!videoUrl ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Video className="text-neutral-400 mx-auto mb-4" size={64} />
              <h2 className="text-white text-xl mb-2">Importez une vidéo</h2>
              <p className="text-neutral-400 mb-6">Pour commencer à éditer</p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload size={20} />}
              >
                Importer une Vidéo
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex gap-6 p-6 overflow-hidden">
            {/* Left Sidebar - Editing Tools */}
            <div className="w-80 flex-shrink-0 bg-neutral-800 rounded-lg p-6 overflow-y-auto">
              <h2 className="text-white text-lg font-bold mb-4">🎨 Outils d'Édition</h2>
              
              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="text-white text-sm font-medium mb-3">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                    className="w-full"
                    leftIcon={<RotateCw size={16} />}
                  >
                    Tourner
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                    className="w-full"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </Button>
                </div>
              </div>

              {/* Cutting Tools */}
              <div className="mb-6">
                <h3 className="text-white text-sm font-medium mb-3">✂️ Découpage</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markSegmentStart}
                    leftIcon={<Scissors size={16} />}
                    className="w-full"
                  >
                    Marquer Début
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markSegmentEnd}
                    leftIcon={<Scissors size={16} />}
                    className="w-full"
                  >
                    Marquer Fin
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCut}
                    disabled={!selectedSegmentStart || !selectedSegmentEnd}
                    className="w-full"
                  >
                    Découper
                  </Button>
                </div>
                {(selectedSegmentStart !== null || selectedSegmentEnd !== null) && (
                  <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-xs">
                      {selectedSegmentStart !== null && (
                        <span>Début: {formatTime(selectedSegmentStart)}</span>
                      )}
                      {selectedSegmentStart !== null && selectedSegmentEnd !== null && ' • '}
                      {selectedSegmentEnd !== null && (
                        <span>Fin: {formatTime(selectedSegmentEnd)}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Color Adjustments */}
              <div className="mb-6">
                <h3 className="text-white text-sm font-medium mb-3">🎨 Ajustements Visuels</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-neutral-400 text-sm">Luminosité</span>
                      <span className="text-white text-sm font-medium">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setBrightness(val);
                        if (videoRef.current) {
                          videoRef.current.style.filter = `brightness(${val}%) contrast(${contrast}%) saturate(${saturation}%)`;
                        }
                      }}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-neutral-400 text-sm">Contraste</span>
                      <span className="text-white text-sm font-medium">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setContrast(val);
                        if (videoRef.current) {
                          videoRef.current.style.filter = `brightness(${brightness}%) contrast(${val}%) saturate(${saturation}%)`;
                        }
                      }}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-neutral-400 text-sm">Saturation</span>
                      <span className="text-white text-sm font-medium">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSaturation(val);
                        if (videoRef.current) {
                          videoRef.current.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${val}%)`;
                        }
                      }}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Playback Speed */}
              <div className="mb-6">
                <h3 className="text-white text-sm font-medium mb-3">⚡ Vitesse</h3>
                <div className="grid grid-cols-5 gap-2">
                  <Button
                    variant={playbackRate === 0.25 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePlaybackRateChange(0.25)}
                    className="text-xs"
                  >
                    0.25x
                  </Button>
                  <Button
                    variant={playbackRate === 0.5 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePlaybackRateChange(0.5)}
                    className="text-xs"
                  >
                    0.5x
                  </Button>
                  <Button
                    variant={playbackRate === 1 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePlaybackRateChange(1)}
                    className="text-xs"
                  >
                    1x
                  </Button>
                  <Button
                    variant={playbackRate === 1.5 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePlaybackRateChange(1.5)}
                    className="text-xs"
                  >
                    1.5x
                  </Button>
                  <Button
                    variant={playbackRate === 2 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePlaybackRateChange(2)}
                    className="text-xs"
                  >
                    2x
                  </Button>
                </div>
              </div>

              {/* Note */}
              <div className="border-t border-neutral-700 pt-6">
                <div className={`border rounded-lg p-3 ${appliedFilters ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                  <p className={`text-xs ${appliedFilters ? 'text-green-400' : 'text-blue-400'}`}>
                    {appliedFilters ? (
                      '✓ Modifications appliquées ! Vous pouvez maintenant télécharger.'
                    ) : (
                      '💡 Ajustez les paramètres ci-dessus, puis cliquez sur "Appliquer" pour confirmer vos modifications avant de télécharger.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Video Player */}
            <div className="flex-1 flex flex-col">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-6 flex-1 flex items-center justify-center">
              <video
                ref={videoRef}
                src={videoUrl}
                className={`w-full h-full object-contain transform ${rotation === 90 || rotation === 270 ? 'rotate-90' : rotation === 180 ? 'rotate-180' : ''}`}
                style={{ transform: `rotate(${rotation}deg)` }}
              />

              {/* Overlay Controls */}
              <div 
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 cursor-pointer"
                onClick={togglePlay}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="rounded-full w-20 h-20"
                >
                  {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
                </Button>
              </div>

              {/* Info Overlay */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="text-white text-sm font-medium">{videoFile?.name}</p>
                <p className="text-neutral-300 text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>

              {/* Rotation Indicator */}
              {isPlaying && (
                <div className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-medium">EN LECTURE</span>
                </div>
              )}
            </div>

            {/* Playback Controls - Bottom */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>

                <div className="flex-1 flex items-center gap-2">
                  <span className="text-white text-sm w-12">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(currentTime / duration) * 100}%, #3f3f46 ${(currentTime / duration) * 100}%, #3f3f46 100%)`
                    }}
                  />
                  <span className="text-white text-sm w-12">{formatTime(duration)}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  title="Tourner la vidéo"
                >
                  <RotateCw size={20} />
                </Button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 mt-3">
                <Volume2 size={16} className="text-neutral-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #9333ea 0%, #9333ea ${volume * 100}%, #3f3f46 ${volume * 100}%, #3f3f46 100%)`
                  }}
                />
                <span className="text-white text-sm w-12">{Math.round(volume * 100)}%</span>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

