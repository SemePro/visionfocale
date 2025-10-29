'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Sun, 
  Moon, 
  Droplets,
  Zap,
  Film,
  Eye,
  Contrast,
  Sliders
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface VideoEffectsProps {
  clipId: string;
  onApplyEffect: (clipId: string, effect: any) => void;
}

const VideoEffects: React.FC<VideoEffectsProps> = ({ clipId, onApplyEffect }) => {
  const [selectedEffect, setSelectedEffect] = useState<string>('');

  const effects = [
    { id: 'blur', label: 'Flou', icon: Droplets, color: 'bg-blue-500' },
    { id: 'sharpen', label: 'Netteté', icon: Eye, color: 'bg-green-500' },
    { id: 'vintage', label: 'Vintage', icon: Film, color: 'bg-amber-500' },
    { id: 'cinematic', label: 'Cinéma', icon: Sparkles, color: 'bg-purple-500' },
    { id: 'bw', label: 'N&B', icon: Contrast, color: 'bg-neutral-500' },
    { id: 'warm', label: 'Chaud', icon: Sun, color: 'bg-orange-500' },
    { id: 'cool', label: 'Froid', icon: Moon, color: 'bg-cyan-500' },
    { id: 'dramatic', label: 'Dramatique', icon: Zap, color: 'bg-red-500' }
  ];

  const transitions = [
    { id: 'fade', label: 'Fondu' },
    { id: 'dissolve', label: 'Dissolution' },
    { id: 'wipe', label: 'Balayage' },
    { id: 'slide', label: 'Glissement' },
    { id: 'zoom', label: 'Zoom' },
    { id: 'spin', label: 'Rotation' }
  ];

  const handleApplyEffect = (effectId: string) => {
    setSelectedEffect(effectId);
    onApplyEffect(clipId, { type: 'filter', value: effectId });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Sparkles size={16} />
          Effets Visuels
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {effects.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => handleApplyEffect(id)}
              className={`${color} text-white p-3 rounded-lg hover:opacity-80 transition-opacity flex flex-col items-center gap-1`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Zap size={16} />
          Transitions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {transitions.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onApplyEffect(clipId, { type: 'transition', value: id })}
              className="bg-neutral-700 text-white p-2 rounded hover:bg-neutral-600 transition-colors text-sm"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Palette size={16} />
          Correction Colorimétrique
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-white text-xs mb-1 block">Luminosité</label>
            <input
              type="range"
              min="-50"
              max="50"
              defaultValue="0"
              onChange={(e) => onApplyEffect(clipId, { type: 'brightness', value: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-white text-xs mb-1 block">Contraste</label>
            <input
              type="range"
              min="-50"
              max="50"
              defaultValue="0"
              onChange={(e) => onApplyEffect(clipId, { type: 'contrast', value: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-white text-xs mb-1 block">Saturation</label>
            <input
              type="range"
              min="-50"
              max="50"
              defaultValue="0"
              onChange={(e) => onApplyEffect(clipId, { type: 'saturation', value: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-white text-xs mb-1 block">Température</label>
            <input
              type="range"
              min="-50"
              max="50"
              defaultValue="0"
              onChange={(e) => onApplyEffect(clipId, { type: 'temperature', value: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Sliders size={16} />
          LUTs Cinématiques
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {['Film Look', 'Teal & Orange', 'Noir & Blanc', 'Vintage', 'Moody', 'Bright'].map((lut) => (
            <button
              key={lut}
              onClick={() => onApplyEffect(clipId, { type: 'lut', value: lut })}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded hover:opacity-80 transition-opacity text-xs font-medium"
            >
              {lut}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoEffects;


