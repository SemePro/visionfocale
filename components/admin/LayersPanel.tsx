'use client';

import { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Copy, 
  Move, 
  Settings,
  Image as ImageIcon,
  Type,
  Square,
  Circle
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface Layer {
  id: string;
  name: string;
  opacity: number;
  blendMode: string;
  visible: boolean;
  locked: boolean;
  type: 'image' | 'text' | 'shape' | 'adjustment';
  imageData?: string;
  text?: string;
  shape?: 'rectangle' | 'circle' | 'star';
}

interface LayersPanelProps {
  layers: Layer[];
  activeLayer: number;
  onLayerChange: (layers: Layer[]) => void;
  onActiveLayerChange: (index: number) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayer,
  onLayerChange,
  onActiveLayerChange
}) => {
  const [isAddingLayer, setIsAddingLayer] = useState(false);
  const [newLayerType, setNewLayerType] = useState<'image' | 'text' | 'shape' | 'adjustment'>('image');

  const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light',
    'color-dodge', 'color-burn', 'darken', 'lighten', 'difference', 'exclusion'
  ];

  const addLayer = (type: Layer['type']) => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${layers.length + 1}`,
      opacity: 100,
      blendMode: 'normal',
      visible: true,
      locked: false,
      type,
      ...(type === 'text' && { text: 'Nouveau texte' }),
      ...(type === 'shape' && { shape: 'rectangle' })
    };

    onLayerChange([...layers, newLayer]);
    onActiveLayerChange(layers.length);
    setIsAddingLayer(false);
  };

  const deleteLayer = (index: number) => {
    if (layers.length <= 1) return; // Garder au moins un layer
    
    const newLayers = layers.filter((_, i) => i !== index);
    onLayerChange(newLayers);
    
    if (activeLayer >= newLayers.length) {
      onActiveLayerChange(newLayers.length - 1);
    }
  };

  const duplicateLayer = (index: number) => {
    const layerToDuplicate = layers[index];
    const duplicatedLayer: Layer = {
      ...layerToDuplicate,
      id: `layer-${Date.now()}`,
      name: `${layerToDuplicate.name} (copie)`
    };

    const newLayers = [...layers];
    newLayers.splice(index + 1, 0, duplicatedLayer);
    onLayerChange(newLayers);
    onActiveLayerChange(index + 1);
  };

  const moveLayer = (fromIndex: number, toIndex: number) => {
    const newLayers = [...layers];
    const [movedLayer] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, movedLayer);
    onLayerChange(newLayers);
    onActiveLayerChange(toIndex);
  };

  const updateLayer = (index: number, updates: Partial<Layer>) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], ...updates };
    onLayerChange(newLayers);
  };

  const toggleLayerVisibility = (index: number) => {
    updateLayer(index, { visible: !layers[index].visible });
  };

  const toggleLayerLock = (index: number) => {
    updateLayer(index, { locked: !layers[index].locked });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">📚 Layers</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingLayer(!isAddingLayer)}
          className="text-white hover:bg-white/10"
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Ajouter un layer */}
      {isAddingLayer && (
        <div className="bg-neutral-700 rounded-lg p-3 space-y-3">
          <h4 className="text-white text-sm font-medium">Ajouter un layer</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addLayer('image')}
              className="p-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white text-sm transition-colors"
            >
              <ImageIcon size={16} className="mx-auto mb-1" />
              Image
            </button>
            <button
              onClick={() => addLayer('text')}
              className="p-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white text-sm transition-colors"
            >
              <Type size={16} className="mx-auto mb-1" />
              Texte
            </button>
            <button
              onClick={() => addLayer('shape')}
              className="p-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white text-sm transition-colors"
            >
              <Square size={16} className="mx-auto mb-1" />
              Forme
            </button>
            <button
              onClick={() => addLayer('adjustment')}
              className="p-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white text-sm transition-colors"
            >
              <Settings size={16} className="mx-auto mb-1" />
              Ajustement
            </button>
          </div>
        </div>
      )}

      {/* Liste des layers */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`p-3 rounded-lg border transition-colors ${
              index === activeLayer
                ? 'bg-primary-500/20 border-primary-500'
                : 'bg-neutral-700 border-neutral-600 hover:bg-neutral-600'
            }`}
            onClick={() => onActiveLayerChange(index)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(index);
                    }}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerLock(index);
                    }}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                </div>
                <span className="text-white text-sm font-medium">{layer.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateLayer(index);
                  }}
                  className="text-neutral-400 hover:text-white transition-colors"
                  title="Dupliquer"
                >
                  <Copy size={14} />
                </button>
                {layers.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLayer(index);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Supprimer"
                  >
                    <Trash size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Contrôles du layer */}
            <div className="space-y-2">
              {/* Opacité */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-neutral-400 text-xs">Opacité</span>
                  <span className="text-neutral-400 text-xs">{layer.opacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={layer.opacity}
                  onChange={(e) => updateLayer(index, { opacity: Number(e.target.value) })}
                  className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer slider"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Mode de fusion */}
              <div>
                <select
                  value={layer.blendMode}
                  onChange={(e) => updateLayer(index, { blendMode: e.target.value })}
                  className="w-full px-2 py-1 bg-neutral-600 text-white text-xs rounded border-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {blendModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contenu spécifique au type */}
              {layer.type === 'text' && (
                <input
                  type="text"
                  value={layer.text || ''}
                  onChange={(e) => updateLayer(index, { text: e.target.value })}
                  className="w-full px-2 py-1 bg-neutral-600 text-white text-xs rounded border-none"
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Texte..."
                />
              )}

              {layer.type === 'shape' && (
                <select
                  value={layer.shape || 'rectangle'}
                  onChange={(e) => updateLayer(index, { shape: e.target.value as any })}
                  className="w-full px-2 py-1 bg-neutral-600 text-white text-xs rounded border-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Cercle</option>
                  <option value="star">Étoile</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-neutral-700/50 rounded-lg p-3">
        <h4 className="text-white text-sm font-medium mb-2">Instructions :</h4>
        <div className="text-xs text-neutral-300 space-y-1">
          <p>• Cliquez sur un layer pour le sélectionner</p>
          <p>• Utilisez les icônes pour contrôler la visibilité et le verrouillage</p>
          <p>• Ajustez l'opacité et le mode de fusion</p>
          <p>• Dupliquez ou supprimez les layers selon vos besoins</p>
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;

