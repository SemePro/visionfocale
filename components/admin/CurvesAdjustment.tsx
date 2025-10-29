'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Palette, 
  Zap, 
  Sun, 
  Moon, 
  Droplets,
  RotateCcw,
  Settings,
  Target,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface CurvesAdjustmentProps {
  curves: { r: number[]; g: number[]; b: number[] };
  onCurvesChange: (curves: { r: number[]; g: number[]; b: number[] }) => void;
  hsl: { h: number; s: number; l: number };
  onHslChange: (hsl: { h: number; s: number; l: number }) => void;
  toneMapping: number;
  onToneMappingChange: (value: number) => void;
}

const CurvesAdjustment: React.FC<CurvesAdjustmentProps> = ({
  curves,
  onCurvesChange,
  hsl,
  onHslChange,
  toneMapping,
  onToneMappingChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeChannel, setActiveChannel] = useState<'r' | 'g' | 'b' | 'rgb'>('rgb');
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);

  const channels = [
    { id: 'rgb', label: 'RGB', color: '#ffffff' },
    { id: 'r', label: 'Rouge', color: '#ff0000' },
    { id: 'g', label: 'Vert', color: '#00ff00' },
    { id: 'b', label: 'Bleu', color: '#0000ff' }
  ];

  const drawCurve = useCallback((ctx: CanvasRenderingContext2D, points: number[], color: string, width: number, height: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    points.forEach((point, index) => {
      const x = (width / (points.length - 1)) * index;
      const y = height - (point / 255) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, []);

  const drawCurves = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner la grille
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    
    // Lignes verticales
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Lignes horizontales
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dessiner les courbes
    if (activeChannel === 'rgb') {
      // Dessiner les 3 courbes RGB
      ['r', 'g', 'b'].forEach((channel, index) => {
        const color = ['#ff0000', '#00ff00', '#0000ff'][index];
        drawCurve(ctx, curves[channel as keyof typeof curves], color, width, height);
      });
    } else {
      // Dessiner la courbe du canal sélectionné
      const color = channels.find(c => c.id === activeChannel)?.color || '#ffffff';
      drawCurve(ctx, curves[activeChannel], color, width, height);
    }

    // Dessiner les points de contrôle
    const currentCurve = activeChannel === 'rgb' ? curves.r : curves[activeChannel];
    const color = activeChannel === 'rgb' ? '#ffffff' : channels.find(c => c.id === activeChannel)?.color || '#ffffff';
    
    ctx.fillStyle = color;
    currentCurve.forEach((point, index) => {
      const x = (width / (currentCurve.length - 1)) * index;
      const y = height - (point / 255) * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [curves, activeChannel, channels, drawCurve]);

  useEffect(() => {
    drawCurves();
  }, [drawCurves]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pointIndex = Math.round((x / canvas.width) * (curves.r.length - 1));
    const pointValue = Math.round(255 - (y / canvas.height) * 255);

    const newCurves = { ...curves };
    
    // Si le canal actif est 'rgb', modifier tous les canaux
    if (activeChannel === 'rgb') {
      newCurves.r = [...newCurves.r];
      newCurves.g = [...newCurves.g];
      newCurves.b = [...newCurves.b];
      newCurves.r[pointIndex] = Math.max(0, Math.min(255, pointValue));
      newCurves.g[pointIndex] = Math.max(0, Math.min(255, pointValue));
      newCurves.b[pointIndex] = Math.max(0, Math.min(255, pointValue));
    } else {
      // Sinon, modifier uniquement le canal actif
      newCurves[activeChannel] = [...newCurves[activeChannel]];
      newCurves[activeChannel][pointIndex] = Math.max(0, Math.min(255, pointValue));
    }

    onCurvesChange(newCurves);
  };

  const resetCurves = () => {
    const defaultCurves = {
      r: Array.from({ length: 11 }, (_, i) => Math.round((i / 10) * 255)),
      g: Array.from({ length: 11 }, (_, i) => Math.round((i / 10) * 255)),
      b: Array.from({ length: 11 }, (_, i) => Math.round((i / 10) * 255))
    };
    onCurvesChange(defaultCurves);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium mb-4">📈 Courbes et Ajustements Avancés</h3>
      
      {/* Sélection du canal */}
      <div>
        <div className="flex gap-2 mb-3">
          {channels.map(({ id, label, color }) => (
            <button
              key={id}
              onClick={() => setActiveChannel(id as any)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeChannel === id
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
              style={{ color: activeChannel === id ? 'white' : color }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas des courbes */}
      <div className="bg-neutral-700 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          className="w-full h-48 border border-neutral-600 rounded cursor-crosshair"
          onClick={handleCanvasClick}
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-neutral-400">Entrée</span>
          <span className="text-xs text-neutral-400">Sortie</span>
        </div>
      </div>

      {/* Contrôles HSL */}
      <div className="space-y-3">
        <h4 className="text-white text-sm font-medium">Ajustements HSL</h4>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Palette size={16} className="text-red-400" />
            <span className="text-white text-sm">Teinte</span>
            <span className="text-neutral-400 text-xs ml-auto">{hsl.h}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={hsl.h}
            onChange={(e) => onHslChange({ ...hsl, h: Number(e.target.value) })}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={16} className="text-green-400" />
            <span className="text-white text-sm">Saturation</span>
            <span className="text-neutral-400 text-xs ml-auto">{hsl.s}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={hsl.s}
            onChange={(e) => onHslChange({ ...hsl, s: Number(e.target.value) })}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sun size={16} className="text-yellow-400" />
            <span className="text-white text-sm">Luminosité</span>
            <span className="text-neutral-400 text-xs ml-auto">{hsl.l}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={hsl.l}
            onChange={(e) => onHslChange({ ...hsl, l: Number(e.target.value) })}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Tone Mapping */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-purple-400" />
          <span className="text-white text-sm">Tone Mapping</span>
          <span className="text-neutral-400 text-xs ml-auto">{toneMapping}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={toneMapping}
          onChange={(e) => onToneMappingChange(Number(e.target.value))}
          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Boutons de contrôle */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetCurves}
          className="text-white border-neutral-600 hover:bg-white/10"
        >
          <RotateCcw size={16} className="mr-2" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default CurvesAdjustment;
