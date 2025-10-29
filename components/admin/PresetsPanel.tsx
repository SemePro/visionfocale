'use client';

import { useState } from 'react';
import { 
  Save, 
  Upload, 
  Download, 
  Copy, 
  Trash, 
  Star, 
  Settings, 
  Zap, 
  Image as ImageIcon,
  Palette,
  Sparkles,
  Camera,
  Film,
  Sun,
  Moon,
  Heart,
  Eye,
  Wand2
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface Preset {
  id: string;
  name: string;
  description: string;
  category: 'portrait' | 'landscape' | 'artistic' | 'branding' | 'custom';
  icon: React.ComponentType<any>;
  settings: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    skinSmoothing: number;
    eyeBrightening: number;
    vignette: number;
    grain: number;
    artisticFilter: string;
    signature: string;
    signatureOpacity: number;
  };
  isCustom: boolean;
}

interface PresetsPanelProps {
  onApplyPreset: (preset: Preset) => void;
  onSavePreset: (preset: Omit<Preset, 'id'>) => void;
  onDeletePreset: (presetId: string) => void;
  currentSettings: any;
}

const PresetsPanel: React.FC<PresetsPanelProps> = ({
  onApplyPreset,
  onSavePreset,
  onDeletePreset,
  currentSettings
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');

  const defaultPresets: Preset[] = [
    {
      id: 'cinematic',
      name: 'Cinématique',
      description: 'Look cinématique avec contraste élevé et tons sombres',
      category: 'artistic',
      icon: Film,
      settings: {
        brightness: -10,
        contrast: 30,
        saturation: -20,
        hue: 10,
        skinSmoothing: 0,
        eyeBrightening: 0,
        vignette: 30,
        grain: 15,
        artisticFilter: 'cinematic',
        signature: 'VisionFocale',
        signatureOpacity: 80
      },
      isCustom: false
    },
    {
      id: 'portrait-pro',
      name: 'Portrait Pro',
      description: 'Retouche professionnelle pour portraits',
      category: 'portrait',
      icon: Camera,
      settings: {
        brightness: 5,
        contrast: 15,
        saturation: -10,
        hue: 0,
        skinSmoothing: 25,
        eyeBrightening: 20,
        vignette: 15,
        grain: 5,
        artisticFilter: 'none',
        signature: 'VisionFocale',
        signatureOpacity: 70
      },
      isCustom: false
    },
    {
      id: 'vintage-film',
      name: 'Vintage Film',
      description: 'Effet vintage avec grain et tons chauds',
      category: 'artistic',
      icon: Sun,
      settings: {
        brightness: -5,
        contrast: 25,
        saturation: -40,
        hue: 30,
        skinSmoothing: 0,
        eyeBrightening: 0,
        vignette: 40,
        grain: 30,
        artisticFilter: 'vintage',
        signature: 'VisionFocale',
        signatureOpacity: 90
      },
      isCustom: false
    },
    {
      id: 'dramatic',
      name: 'Dramatique',
      description: 'Contraste fort et tons sombres pour un effet dramatique',
      category: 'artistic',
      icon: Moon,
      settings: {
        brightness: -20,
        contrast: 50,
        saturation: 10,
        hue: -10,
        skinSmoothing: 0,
        eyeBrightening: 0,
        vignette: 50,
        grain: 10,
        artisticFilter: 'dramatic',
        signature: 'VisionFocale',
        signatureOpacity: 85
      },
      isCustom: false
    },
    {
      id: 'branding',
      name: 'Branding VisionFocale',
      description: 'Présets optimisés pour le branding VisionFocale',
      category: 'branding',
      icon: Heart,
      settings: {
        brightness: 0,
        contrast: 20,
        saturation: 5,
        hue: 0,
        skinSmoothing: 0,
        eyeBrightening: 0,
        vignette: 20,
        grain: 5,
        artisticFilter: 'none',
        signature: 'VisionFocale',
        signatureOpacity: 80
      },
      isCustom: false
    },
    {
      id: 'landscape',
      name: 'Paysage',
      description: 'Optimisé pour les photos de paysage',
      category: 'landscape',
      icon: Eye,
      settings: {
        brightness: 10,
        contrast: 25,
        saturation: 15,
        hue: 0,
        skinSmoothing: 0,
        eyeBrightening: 0,
        vignette: 10,
        grain: 0,
        artisticFilter: 'none',
        signature: 'VisionFocale',
        signatureOpacity: 75
      },
      isCustom: false
    }
  ];

  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  const allPresets = [...defaultPresets, ...customPresets];

  const categories = [
    { id: 'all', label: 'Tous', icon: Settings },
    { id: 'portrait', label: 'Portrait', icon: Camera },
    { id: 'landscape', label: 'Paysage', icon: Eye },
    { id: 'artistic', label: 'Artistique', icon: Sparkles },
    { id: 'branding', label: 'Branding', icon: Heart },
    { id: 'custom', label: 'Personnalisés', icon: Star }
  ];

  const filteredPresets = selectedCategory === 'all' 
    ? allPresets 
    : allPresets.filter(preset => preset.category === selectedCategory);

  const handleCreatePreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: Preset = {
      id: `custom-${Date.now()}`,
      name: newPresetName,
      description: newPresetDescription,
      category: 'custom',
      icon: Star,
      settings: currentSettings,
      isCustom: true
    };

    setCustomPresets(prev => [...prev, newPreset]);
    setNewPresetName('');
    setNewPresetDescription('');
    setIsCreatingPreset(false);
  };

  const handleDeletePreset = (presetId: string) => {
    setCustomPresets(prev => prev.filter(p => p.id !== presetId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">⚡ Presets & Batch</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreatingPreset(!isCreatingPreset)}
          className="text-white hover:bg-white/10"
        >
          <Save size={16} />
        </Button>
      </div>

      {/* Créer un preset */}
      {isCreatingPreset && (
        <div className="bg-neutral-700 rounded-lg p-3 space-y-3">
          <h4 className="text-white text-sm font-medium">Créer un preset</h4>
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Nom du preset..."
            className="w-full px-3 py-2 bg-neutral-600 text-white rounded text-sm"
          />
          <input
            type="text"
            value={newPresetDescription}
            onChange={(e) => setNewPresetDescription(e.target.value)}
            placeholder="Description..."
            className="w-full px-3 py-2 bg-neutral-600 text-white rounded text-sm"
          />
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreatePreset}
              className="flex-1"
            >
              Créer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreatingPreset(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Catégories */}
      <div className="flex gap-1 overflow-x-auto">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              selectedCategory === id
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Liste des presets */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredPresets.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <div
              key={preset.id}
              className="p-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <IconComponent size={16} className="text-primary-400" />
                  <div>
                    <h4 className="text-white text-sm font-medium">{preset.name}</h4>
                    <p className="text-neutral-400 text-xs">{preset.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onApplyPreset(preset)}
                    className="text-white hover:bg-white/10"
                    title="Appliquer"
                  >
                    <Zap size={14} />
                  </Button>
                  {preset.isCustom && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePreset(preset.id)}
                      className="text-red-400 hover:text-red-300"
                      title="Supprimer"
                    >
                      <Trash size={14} />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Aperçu des réglages */}
              <div className="grid grid-cols-2 gap-1 text-xs text-neutral-400">
                <span>Luminosité: {preset.settings.brightness}</span>
                <span>Contraste: {preset.settings.contrast}</span>
                <span>Saturation: {preset.settings.saturation}</span>
                <span>Vignette: {preset.settings.vignette}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch Processing */}
      <div className="bg-neutral-700/50 rounded-lg p-3">
        <h4 className="text-white text-sm font-medium mb-2">🔄 Batch Processing</h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-white border-neutral-600 hover:bg-white/10"
          >
            <Upload size={16} className="mr-2" />
            Traiter plusieurs images
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-white border-neutral-600 hover:bg-white/10"
          >
            <Download size={16} className="mr-2" />
            Exporter en lot
          </Button>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          Fonctionnalité en cours de développement...
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-neutral-700/50 rounded-lg p-3">
        <h4 className="text-white text-sm font-medium mb-2">💡 Conseils :</h4>
        <div className="text-xs text-neutral-300 space-y-1">
          <p>• Cliquez sur ⚡ pour appliquer un preset instantanément</p>
          <p>• Créez vos propres presets à partir des réglages actuels</p>
          <p>• Les presets personnalisés peuvent être supprimés</p>
          <p>• Utilisez les catégories pour organiser vos presets</p>
        </div>
      </div>
    </div>
  );
};

export default PresetsPanel;

