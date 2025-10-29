'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Brush, 
  Eraser, 
  Copy, 
  Scissors, 
  Target, 
  Move, 
  Square, 
  Circle, 
  Star,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Settings,
  Palette,
  Wand2,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface RetouchingToolsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedTool: string;
  onToolChange: (tool: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  brushOpacity: number;
  onBrushOpacityChange: (opacity: number) => void;
}

const RetouchingTools: React.FC<RetouchingToolsProps> = ({
  canvasRef,
  selectedTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  brushOpacity,
  onBrushOpacityChange
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [sourcePoint, setSourcePoint] = useState<{ x: number; y: number } | null>(null);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [eraserColor, setEraserColor] = useState('#ffffff');
  const [eraserMode, setEraserMode] = useState<'transparent' | 'color'>('transparent');
  const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const selectionImageDataRef = useRef<ImageData | null>(null);

  const tools = [
    { id: 'brush', label: 'Pinceau', icon: Brush, color: 'text-blue-400' },
    { id: 'eraser', label: 'Gomme', icon: Eraser, color: 'text-red-400' },
    { id: 'clone', label: 'Tampon', icon: Copy, color: 'text-green-400' },
    { id: 'heal', label: 'Réparation', icon: Target, color: 'text-purple-400' },
    { id: 'select', label: 'Sélection', icon: Square, color: 'text-orange-400' },
    { id: 'move', label: 'Déplacer', icon: Move, color: 'text-gray-400' }
  ];

  // Sauvegarder l'image originale pour les outils de clonage et réparation
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        imageDataRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [canvasRef]);

  // Attacher les événements au canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown as any);
    canvas.addEventListener('mousemove', handleMouseMove as any);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown as any);
      canvas.removeEventListener('mousemove', handleMouseMove as any);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [selectedTool, brushSize, brushOpacity, isDrawing, lastPoint, sourcePoint, brushColor, eraserColor, eraserMode, selection, selectionStart]);

  const getCanvasCoordinates = (e: MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const { x, y } = getCanvasCoordinates(e);
    
    setIsDrawing(true);
    setLastPoint({ x, y });

    // Pour l'outil tampon, Alt+Click définit le point source
    if (selectedTool === 'clone' && e.altKey) {
      setSourcePoint({ x, y });
      return;
    }

    // Pour l'outil de sélection, commencer une nouvelle sélection
    if (selectedTool === 'select') {
      setSelectionStart({ x, y });
      setSelection(null);
      return;
    }

    draw(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    draw(e);
  };

  const handleMouseUp = () => {
    if (!canvasRef.current) return;
    
    // Pour l'outil de sélection, finaliser la sélection
    if (selectedTool === 'select' && selectionStart && lastPoint) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const width = lastPoint.x - selectionStart.x;
        const height = lastPoint.y - selectionStart.y;
        
        // Vérifier que la sélection a une taille minimale (au moins 5px)
        if (Math.abs(width) < 5 || Math.abs(height) < 5) {
          setSelectionStart(null);
          setIsDrawing(false);
          setLastPoint(null);
          return;
        }
        
        // Calculer les coordonnées normalisées
        const x = width < 0 ? lastPoint.x : selectionStart.x;
        const y = height < 0 ? lastPoint.y : selectionStart.y;
        const absWidth = Math.abs(width);
        const absHeight = Math.abs(height);
        
        // Sauvegarder la zone sélectionnée
        try {
          const imageData = ctx.getImageData(x, y, absWidth, absHeight);
          selectionImageDataRef.current = imageData;
          
          setSelection({
            x,
            y,
            width: absWidth,
            height: absHeight
          });
        } catch (error) {
          console.error('Erreur lors de la création de la sélection:', error);
        }
      }
      setSelectionStart(null);
    }
    
    setIsDrawing(false);
    setLastPoint(null);
  };

  const draw = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    ctx.save();
    ctx.globalAlpha = brushOpacity / 100;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (selectedTool) {
      case 'brush':
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = brushColor;
        
        if (lastPoint) {
          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;

      case 'eraser':
        if (eraserMode === 'transparent') {
          // Mode effacement transparent
          ctx.globalCompositeOperation = 'destination-out';
          
          if (lastPoint) {
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(x, y);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            ctx.fill();
          }
        } else {
          // Mode effacement avec couleur
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = eraserColor;
          ctx.fillStyle = eraserColor;
          
          if (lastPoint) {
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(x, y);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
        break;

      case 'clone':
        if (sourcePoint) {
          ctx.globalCompositeOperation = 'source-over';
          
          // Calculer l'offset entre le point actuel et le dernier point
          const offsetX = lastPoint ? x - lastPoint.x : 0;
          const offsetY = lastPoint ? y - lastPoint.y : 0;
          
          // Mettre à jour le point source pour suivre le mouvement
          const currentSourceX = sourcePoint.x + offsetX;
          const currentSourceY = sourcePoint.y + offsetY;
          
          // Cloner la zone source vers la position actuelle
          try {
            ctx.beginPath();
            ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            ctx.clip();
            
            ctx.drawImage(
              canvasRef.current!,
              currentSourceX - brushSize/2, 
              currentSourceY - brushSize/2, 
              brushSize, 
              brushSize,
              x - brushSize/2, 
              y - brushSize/2, 
              brushSize, 
              brushSize
            );
          } catch (error) {
            console.error('Erreur de clonage:', error);
          }
        }
        break;

      case 'select':
        if (selectionStart) {
          // Dessiner le rectangle de sélection
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          
          const width = x - selectionStart.x;
          const height = y - selectionStart.y;
          
          ctx.strokeRect(selectionStart.x, selectionStart.y, width, height);
          ctx.setLineDash([]);
        }
        break;

      case 'move':
        if (selection && selectionImageDataRef.current && lastPoint) {
          // Effacer l'ancienne position
          ctx.clearRect(selection.x, selection.y, selection.width, selection.height);
          
          // Calculer la nouvelle position
          const deltaX = x - lastPoint.x;
          const deltaY = y - lastPoint.y;
          
          const newX = selection.x + deltaX;
          const newY = selection.y + deltaY;
          
          // Dessiner à la nouvelle position
          ctx.putImageData(selectionImageDataRef.current, newX, newY);
          
          // Mettre à jour la sélection
          setSelection({ ...selection, x: newX, y: newY });
        }
        break;

      case 'heal':
        if (imageDataRef.current) {
          ctx.globalCompositeOperation = 'source-over';
          
          // Algorithme de réparation : mélanger les pixels environnants
          const radius = brushSize / 2;
          const imageData = ctx.getImageData(x - radius, y - radius, brushSize, brushSize);
          const data = imageData.data;
          
          // Appliquer un flou gaussien simple
          for (let i = 0; i < data.length; i += 4) {
            const neighbors = [];
            const px = (i / 4) % brushSize;
            const py = Math.floor((i / 4) / brushSize);
            
            // Collecter les pixels voisins
            for (let dy = -2; dy <= 2; dy++) {
              for (let dx = -2; dx <= 2; dx++) {
                const nx = px + dx;
                const ny = py + dy;
                if (nx >= 0 && nx < brushSize && ny >= 0 && ny < brushSize) {
                  const idx = (ny * brushSize + nx) * 4;
                  neighbors.push({
                    r: data[idx],
                    g: data[idx + 1],
                    b: data[idx + 2]
                  });
                }
              }
            }
            
            // Moyenne des voisins
            if (neighbors.length > 0) {
              const avg = neighbors.reduce((acc, n) => ({
                r: acc.r + n.r,
                g: acc.g + n.g,
                b: acc.b + n.b
              }), { r: 0, g: 0, b: 0 });
              
              data[i] = avg.r / neighbors.length;
              data[i + 1] = avg.g / neighbors.length;
              data[i + 2] = avg.b / neighbors.length;
            }
          }
          
          ctx.putImageData(imageData, x - radius, y - radius);
        }
        break;
    }

    ctx.restore();
    setLastPoint({ x, y });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium mb-4">🛠️ Outils de Retouche</h3>
      
      {/* Outils */}
      <div className="grid grid-cols-3 gap-2">
        {tools.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => onToolChange(id)}
            className={`p-3 rounded-lg text-center transition-colors ${
              selectedTool === id
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
            title={label}
          >
            <Icon size={20} className={`mx-auto mb-1 ${selectedTool === id ? 'text-white' : color}`} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Contrôles du pinceau */}
      <div className="space-y-3">
        {selectedTool === 'brush' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Palette size={16} className="text-white" />
              <span className="text-white text-sm font-medium">Couleur du pinceau</span>
            </div>
            <div className="space-y-2">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
              
              {/* Couleurs de base */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Couleurs de base</p>
                <div className="flex gap-1 flex-wrap">
                  {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(color => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={`w-8 h-8 rounded border-2 transition-colors ${
                        brushColor === color ? 'border-white' : 'border-neutral-600 hover:border-white'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Tons de peau */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Tons de peau</p>
                <div className="flex gap-1 flex-wrap">
                  {[
                    '#8D5524', // Peau foncée
                    '#C68642', // Peau foncée moyenne
                    '#E0AC69', // Peau moyenne
                    '#F1C27D', // Peau claire moyenne
                    '#FFDBAC', // Peau claire
                    '#FFE7D1', // Peau très claire
                    '#FFF0E1', // Peau très très claire
                    '#D4A574', // Ton chaud
                    '#E8B796', // Ton rosé
                    '#F4C2A0', // Ton beige
                    '#FFDFC4', // Ton pêche
                    '#FFE4C4'  // Ton bisque
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={`w-8 h-8 rounded border-2 transition-colors ${
                        brushColor === color ? 'border-white' : 'border-neutral-600 hover:border-white'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Couleurs naturelles */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Couleurs naturelles</p>
                <div className="flex gap-1 flex-wrap">
                  {[
                    '#8B4513', // Marron
                    '#A0522D', // Sienna
                    '#CD853F', // Peru
                    '#DEB887', // Burlywood
                    '#F5DEB3', // Wheat
                    '#FFE4B5', // Moccasin
                    '#FAEBD7', // Antique white
                    '#FFF8DC'  // Cornsilk
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={`w-8 h-8 rounded border-2 transition-colors ${
                        brushColor === color ? 'border-white' : 'border-neutral-600 hover:border-white'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTool === 'eraser' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eraser size={16} className="text-white" />
              <span className="text-white text-sm font-medium">Mode de gomme</span>
            </div>
            <div className="space-y-2">
              {/* Mode de gomme */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEraserMode('transparent')}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                    eraserMode === 'transparent'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  Transparent
                </button>
                <button
                  onClick={() => setEraserMode('color')}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                    eraserMode === 'color'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  Couleur
                </button>
              </div>

              {/* Sélecteur de couleur pour la gomme */}
              {eraserMode === 'color' && (
                <>
                  <input
                    type="color"
                    value={eraserColor}
                    onChange={(e) => setEraserColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                  
                  {/* Couleurs rapides pour la gomme */}
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">Couleurs rapides</p>
                    <div className="flex gap-1 flex-wrap">
                      {['#ffffff', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#000000'].map(color => (
                        <button
                          key={color}
                          onClick={() => setEraserColor(color)}
                          className={`w-8 h-8 rounded border-2 transition-colors ${
                            eraserColor === color ? 'border-white' : 'border-neutral-600 hover:border-white'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brush size={16} className="text-white" />
            <span className="text-white text-sm font-medium">Taille du pinceau</span>
            <span className="text-neutral-400 text-xs ml-auto">{brushSize}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings size={16} className="text-white" />
            <span className="text-white text-sm font-medium">Opacité</span>
            <span className="text-neutral-400 text-xs ml-auto">{brushOpacity}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={brushOpacity}
            onChange={(e) => onBrushOpacityChange(Number(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-neutral-700/50 rounded-lg p-3">
        <h4 className="text-white text-sm font-medium mb-2">💡 Instructions :</h4>
        <div className="text-xs text-neutral-300 space-y-1">
          {selectedTool === 'brush' && (
            <>
              <p>✓ Cliquez et glissez pour peindre</p>
              <p>✓ Ajustez la couleur, taille et opacité</p>
              <p className="text-neutral-400 mt-1">Parfait pour ajouter des détails ou des effets créatifs</p>
            </>
          )}
          {selectedTool === 'eraser' && (
            <>
              <p>✓ Cliquez et glissez pour effacer</p>
              <p>✓ Mode <strong>Transparent</strong> : efface complètement</p>
              <p>✓ Mode <strong>Couleur</strong> : remplace par une couleur</p>
              <p className="text-neutral-400 mt-1">Parfait pour corriger ou remplacer des zones</p>
            </>
          )}
          {selectedTool === 'clone' && (
            <>
              <p>✓ <strong>Alt + Clic</strong> pour définir le point source</p>
              <p>✓ Cliquez et glissez pour cloner</p>
              <p className="text-neutral-400 mt-1">Parfait pour dupliquer des zones de l'image</p>
              {sourcePoint && (
                <p className="text-green-400 mt-1">✓ Point source défini !</p>
              )}
            </>
          )}
          {selectedTool === 'heal' && (
            <>
              <p>✓ Cliquez et glissez pour réparer</p>
              <p>✓ L'algorithme mélange les pixels environnants</p>
              <p className="text-neutral-400 mt-1">Idéal pour corriger les imperfections de la peau</p>
            </>
          )}
          {selectedTool === 'select' && (
            <>
              <p>✓ Cliquez et glissez pour créer une sélection rectangulaire</p>
              <p>✓ La zone sélectionnée apparaîtra en vert</p>
              <p>✓ Utilisez l'outil <strong>Déplacer</strong> pour bouger la sélection</p>
              {selection && (
                <p className="text-green-400 mt-1">✓ Sélection active : {Math.round(selection.width)}x{Math.round(selection.height)}px</p>
              )}
            </>
          )}
          {selectedTool === 'move' && (
            <>
              {selection ? (
                <>
                  <p>✓ Cliquez et glissez pour déplacer la sélection</p>
                  <p>✓ La zone sélectionnée se déplacera avec votre souris</p>
                  <p className="text-green-400 mt-1">✓ Sélection active : {Math.round(selection.width)}x{Math.round(selection.height)}px</p>
                </>
              ) : (
                <>
                  <p className="text-orange-400">⚠ Aucune sélection active</p>
                  <p>✓ Utilisez d'abord l'outil <strong>Sélection</strong></p>
                  <p className="text-neutral-400 mt-1">Créez une sélection avant de la déplacer</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetouchingTools;
