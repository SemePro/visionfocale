'use client';

import { useState, useEffect } from 'react';
import { 
  Circle, 
  Square, 
  Ruler,
  Download,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface PassportPhotoToolsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onApply: () => void;
}

const PassportPhotoTools: React.FC<PassportPhotoToolsProps> = ({
  canvasRef,
  onApply
}) => {
  const [photoSize, setPhotoSize] = useState<'35x45' | '50x50' | 'custom'>('35x45');
  const [customWidth, setCustomWidth] = useState(35);
  const [customHeight, setCustomHeight] = useState(45);
  const [unit, setUnit] = useState<'mm' | 'inches'>('mm');
  const [showGrid, setShowGrid] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [headPosition, setHeadPosition] = useState(70); // Position de la tête en pourcentage (norme: 70-80%)

  // Debug: log when background color changes
  useEffect(() => {
    console.log('PassportPhotoTools: Background color changed to:', backgroundColor);
  }, [backgroundColor]);

  // Dimensions standards en mm
  const standardSizes = {
    '35x45': { width: 35, height: 45, name: '35mm x 45mm' },
    '50x50': { width: 50, height: 50, name: '50mm x 50mm' },
  };

  const handleCropToSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculer les dimensions cibles en pixels (300 DPI)
    const dpi = 300;
    let targetWidth, targetHeight;

    if (photoSize === 'custom') {
      const sizeInMm = unit === 'mm' ? 1 : 25.4;
      targetWidth = (customWidth * sizeInMm / 25.4) * dpi;
      targetHeight = (customHeight * sizeInMm / 25.4) * dpi;
    } else {
      const size = standardSizes[photoSize];
      targetWidth = (size.width / 25.4) * dpi;
      targetHeight = (size.height / 25.4) * dpi;
    }

    // Créer un canvas temporaire pour le redimensionnement
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return;

    // Fond blanc/coloré - Remplir le fond AVANT de dessiner l'image
    tempCtx.fillStyle = backgroundColor;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Calculer le ratio de redimensionnement
    const scale = Math.min(
      targetWidth / canvas.width,
      targetHeight / canvas.height
    );

    // Centrer l'image
    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    const xOffset = (targetWidth - scaledWidth) / 2;
    const yOffset = (targetHeight - scaledHeight) / 2;

    // Dessiner l'image redimensionnée
    tempCtx.drawImage(
      canvas,
      xOffset,
      yOffset,
      scaledWidth,
      scaledHeight
    );

    // Copier le résultat vers le canvas principal
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    onApply();
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Réinitialiser aux valeurs par défaut
    setPhotoSize('35x45');
    setCustomWidth(35);
    setCustomHeight(45);
    setUnit('mm');
    setBackgroundColor('#ffffff');
    setHeadPosition(70);
    setShowGrid(true);
  };

  return (
    <div className="space-y-4 p-4 bg-neutral-800 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Circle size={20} className="text-blue-400" />
        <h3 className="text-white text-lg font-semibold">Photo Passeport/Visa</h3>
      </div>

      {/* Dimensions standards */}
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Dimensions standards
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPhotoSize('35x45')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              photoSize === '35x45'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            35×45mm
          </button>
          <button
            onClick={() => setPhotoSize('50x50')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              photoSize === '50x50'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            50×50mm
          </button>
        </div>
      </div>

      {/* Dimensions personnalisées */}
      <div>
        <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
          <Ruler size={14} />
          Dimensions personnalisées
        </label>
        <button
          onClick={() => setPhotoSize('custom')}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
            photoSize === 'custom'
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          Personnaliser
        </button>

        {photoSize === 'custom' && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(Number(e.target.value))}
              placeholder="L"
              className="px-2 py-1 bg-neutral-700 text-white rounded text-sm"
            />
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(Number(e.target.value))}
              placeholder="H"
              className="px-2 py-1 bg-neutral-700 text-white rounded text-sm"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'mm' | 'inches')}
              className="px-2 py-1 bg-neutral-700 text-white rounded text-sm"
            >
              <option value="mm">mm</option>
              <option value="inches">inches</option>
            </select>
          </div>
        )}
      </div>

      {/* Couleur de fond */}
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Couleur de fond
        </label>
        
        {/* Aperçu de la couleur sélectionnée */}
        <div className="mb-3 p-4 rounded-lg border-2 border-neutral-600" style={{ backgroundColor: backgroundColor }}>
          <p className="text-xs text-center font-medium" style={{ color: backgroundColor === '#000000' || backgroundColor === '#333333' ? '#ffffff' : '#000000' }}>
            Aperçu du fond
          </p>
        </div>
        
        <div className="grid grid-cols-6 gap-2">
          {['#ffffff', '#f0f0f0', '#e6e6e6', '#cccccc', '#333333', '#000000'].map((color) => (
            <button
              key={color}
              onClick={() => setBackgroundColor(color)}
              className={`w-full h-10 rounded-lg border-2 transition-all ${
                backgroundColor === color
                  ? 'border-white ring-2 ring-offset-2 ring-offset-neutral-800 ring-white'
                  : 'border-neutral-600 hover:border-neutral-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-full h-10 mt-2 bg-neutral-700 rounded-lg cursor-pointer"
        />
      </div>

      {/* Aide visuelle */}
      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <HelpCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-200">
          <p className="font-medium mb-1">Recommandations:</p>
          <ul className="space-y-1 text-blue-300/80">
            <li>• Fond uniforme (blanc ou clair de préférence)</li>
            <li>• Expression neutre, bouche fermée</li>
            <li>• Regard droit vers l'objectif</li>
            <li>• Tête centrée dans le cadre</li>
            <li>• Visage dégagé, cheveux tirés en arrière</li>
          </ul>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="primary"
          onClick={handleCropToSize}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <Download size={16} className="mr-2" />
          Appliquer
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1"
        >
          <RefreshCw size={16} className="mr-2" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default PassportPhotoTools;

