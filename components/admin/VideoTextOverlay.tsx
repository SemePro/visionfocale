'use client';

import { useState } from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import Button from '@/components/ui/Button';

interface VideoTextOverlayProps {
  onAddText: (textConfig: any) => void;
}

const VideoTextOverlay: React.FC<VideoTextOverlayProps> = ({ onAddText }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [color, setColor] = useState('#ffffff');
  const [align, setAlign] = useState('center');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black'
  ];

  const textPresets = [
    { label: 'Titre Principal', fontSize: 48, bold: true },
    { label: 'Sous-titre', fontSize: 32, italic: true },
    { label: 'Corps de texte', fontSize: 24, bold: false },
    { label: 'Légende', fontSize: 18, italic: true },
    { label: 'Watermark', fontSize: 14, bold: false }
  ];

  const handleAddText = () => {
    if (!text.trim()) return;

    onAddText({
      text,
      fontSize,
      fontFamily,
      color,
      align,
      bold,
      italic,
      underline,
      position: { x: 50, y: 50 }, // Centré par défaut
      animation: 'fade-in'
    });

    setText('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
        <Type size={16} />
        Texte & Titres
      </h3>

      {/* Presets */}
      <div>
        <label className="text-white text-xs mb-2 block">Presets Rapides</label>
        <div className="grid grid-cols-2 gap-2">
          {textPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setFontSize(preset.fontSize);
                setBold(preset.bold);
                setItalic(preset.italic);
              }}
              className="bg-neutral-700 text-white p-2 rounded hover:bg-neutral-600 transition-colors text-xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div>
        <label className="text-white text-xs mb-1 block">Texte</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Entrez votre texte..."
          className="w-full px-3 py-2 bg-neutral-700 text-white rounded resize-none"
          rows={3}
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="text-white text-xs mb-1 block">Police</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-700 text-white rounded"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-white text-xs mb-1 block">Taille: {fontSize}px</label>
        <input
          type="range"
          min="12"
          max="96"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Color */}
      <div>
        <label className="text-white text-xs mb-1 block">Couleur</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-24 px-2 bg-neutral-700 text-white rounded text-xs"
          />
        </div>
      </div>

      {/* Text Style */}
      <div>
        <label className="text-white text-xs mb-2 block">Style</label>
        <div className="flex gap-2">
          <Button
            variant={bold ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setBold(!bold)}
            className="flex-1"
          >
            <Bold size={16} />
          </Button>
          <Button
            variant={italic ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setItalic(!italic)}
            className="flex-1"
          >
            <Italic size={16} />
          </Button>
          <Button
            variant={underline ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setUnderline(!underline)}
            className="flex-1"
          >
            <Underline size={16} />
          </Button>
        </div>
      </div>

      {/* Alignment */}
      <div>
        <label className="text-white text-xs mb-2 block">Alignement</label>
        <div className="flex gap-2">
          <Button
            variant={align === 'left' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setAlign('left')}
            className="flex-1"
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            variant={align === 'center' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setAlign('center')}
            className="flex-1"
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            variant={align === 'right' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setAlign('right')}
            className="flex-1"
          >
            <AlignRight size={16} />
          </Button>
        </div>
      </div>

      {/* Animation */}
      <div>
        <label className="text-white text-xs mb-1 block">Animation d'entrée</label>
        <select className="w-full px-3 py-2 bg-neutral-700 text-white rounded text-sm">
          <option value="fade-in">Fondu</option>
          <option value="slide-up">Glissement haut</option>
          <option value="slide-down">Glissement bas</option>
          <option value="slide-left">Glissement gauche</option>
          <option value="slide-right">Glissement droite</option>
          <option value="zoom-in">Zoom avant</option>
          <option value="bounce">Rebond</option>
        </select>
      </div>

      {/* Add Button */}
      <Button
        variant="primary"
        size="md"
        onClick={handleAddText}
        disabled={!text.trim()}
        className="w-full"
      >
        Ajouter le Texte
      </Button>

      {/* Branding Presets */}
      <div className="pt-4 border-t border-neutral-700">
        <h4 className="text-white text-sm font-medium mb-2">Branding VisionFocale</h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setText('VisionFocale');
              setFontSize(36);
              setBold(true);
              setColor('#9333ea');
            }}
            className="w-full"
          >
            Logo Texte
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setText('📸 VisionFocale - Lomé, Togo');
              setFontSize(18);
              setColor('#ffffff');
            }}
            className="w-full"
          >
            Signature Complète
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setText('© VisionFocale 2025');
              setFontSize(14);
              setColor('#999999');
            }}
            className="w-full"
          >
            Copyright
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoTextOverlay;


