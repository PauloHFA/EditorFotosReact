import React, { useState, useRef, useEffect } from 'react';
import { X, Square, Circle, Triangle, Hexagon, Star, ZoomIn, ZoomOut, Download, Smile, Trash2 } from 'lucide-react';
import { PhotoAdjustmentModalProps, Shape } from '../types';

const SHAPES = [
  { id: 'square' as Shape, icon: Square, name: 'Square' },
  { id: 'circle' as Shape, icon: Circle, name: 'Circle' },
  { id: 'triangle' as Shape, icon: Triangle, name: 'Triangle' },
  { id: 'hexagon' as Shape, icon: Hexagon, name: 'Hexagon' },
  { id: 'star' as Shape, icon: Star, name: 'Star' },
];

const STICKERS = ['😊', '😍', '🥰', '😎', '🤩', '😇', '😋', '😌', '😉', '😜', '😝', '😛', '🤗', '🤔', '🤭', '🤫'];

const drawStar = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number) => {
  const spikes = 5;
  const outerRadius = size;
  const innerRadius = size * 0.4;

  let rot = Math.PI / 2 * 3;
  let x = centerX;
  let y = centerY;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = centerX + Math.cos(rot) * outerRadius;
    y = centerY + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = centerX + Math.cos(rot) * innerRadius;
    y = centerY + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(centerX, centerY - outerRadius);
  ctx.closePath();
}

export const PhotoAdjustmentModal: React.FC<PhotoAdjustmentModalProps> = ({
  file,
  onClose,
  onComplete,
}) => {
  const [selectedShape, setSelectedShape] = useState<Shape>('square');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [stickers, setStickers] = useState<Array<{ id: string; emoji: string; x: number; y: number; scale: number }>>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleAddSticker = (emoji: string) => {
    const newSticker = {
      id: Date.now().toString(),
      emoji,
      x: 0,
      y: 0,
      scale: 1,
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedSticker(newSticker.id);
    setShowStickers(false);
  };

  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.stopPropagation();
    setSelectedSticker(stickerId);
    const sticker = stickers.find(s => s.id === stickerId);
    if (sticker) {
      setDragStart({
        x: e.clientX - sticker.x,
        y: e.clientY - sticker.y,
      });
    }
  };

  const handleStickerMouseMove = (e: React.MouseEvent) => {
    if (!selectedSticker) return;
    const sticker = stickers.find(s => s.id === selectedSticker);
    if (sticker) {
      setStickers(prev =>
        prev.map(s =>
          s.id === selectedSticker
            ? {
                ...s,
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
              }
            : s
        )
      );
    }
  };

  const handleStickerMouseUp = () => {
    setSelectedSticker(null);
  };

  const handleStickerScale = (stickerId: string, increase: boolean) => {
    setStickers(prev =>
      prev.map(s =>
        s.id === stickerId
          ? {
              ...s,
              scale: Math.max(0.5, Math.min(2, s.scale + (increase ? 0.1 : -0.1))),
            }
          : s
      )
    );
  };

  const handleRemoveSticker = (stickerId: string) => {
    setStickers(prev => prev.filter(s => s.id !== stickerId));
    setSelectedSticker(null);
  };

  const handleDownload = () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    canvas.width = containerRef.current.offsetWidth;
    canvas.height = containerRef.current.offsetHeight;

    // Create a path for the selected shape
    ctx.beginPath();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) / 2;

    switch (selectedShape) {
      case 'circle':
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        break;
      case 'triangle':
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX - size, centerY + size);
        ctx.lineTo(centerX + size, centerY + size);
        ctx.closePath();
        break;
      case 'hexagon':
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          const x = centerX + size * Math.cos(angle);
          const y = centerY + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
      case 'star':
        drawStar(ctx, centerX, centerY, size);
        break;
      default: // square
        ctx.rect(centerX - size, centerY - size, size * 2, size * 2);
    }

    // Clip the context to the shape
    ctx.clip();

    // Draw the image with current transformations
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(position.x, position.y);
    ctx.drawImage(imageRef.current, -imageRef.current.width / 2, -imageRef.current.height / 2);
    ctx.restore();

    // Draw stickers
    stickers.forEach(sticker => {
      ctx.save();
      ctx.font = `${sticker.scale * 40}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(sticker.x + centerX, sticker.y + centerY);
      ctx.fillText(sticker.emoji, 0, 0);
      ctx.restore();
    });

    // Convert canvas to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onComplete(
          url,
          selectedShape,
          stickers.map(({ id, emoji, x, y, scale }) => ({ 
            id, 
            emoji, 
            position: { x, y },
            scale 
          }))
        );
        setIsSaved(true);
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Photo</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Shape Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Shape</h3>
            <div className="flex space-x-4">
              {SHAPES.map((shape) => {
                const Icon = shape.icon;
                return (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedShape(shape.id)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedShape === shape.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-gray-700" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Editor */}
          <div
            ref={containerRef}
            className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-6"
            onMouseMove={(e) => {
              handleMouseMove(e);
              handleStickerMouseMove(e);
            }}
            onMouseUp={() => {
              handleMouseUp();
              handleStickerMouseUp();
            }}
            onMouseLeave={() => {
              handleMouseUp();
              handleStickerMouseUp();
            }}
          >
            <img
              ref={imageRef}
              src={URL.createObjectURL(file)}
              alt="Uploaded photo"
              className={`absolute inset-0 w-full h-full object-cover cursor-move ${
                selectedShape === 'circle' ? 'clip-path-circle' :
                selectedShape === 'triangle' ? 'clip-path-triangle' :
                selectedShape === 'hexagon' ? 'clip-path-hexagon' :
                selectedShape === 'star' ? 'clip-path-star' : ''
              }`}
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center',
              }}
              onMouseDown={handleMouseDown}
            />
            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                className={`absolute cursor-move ${selectedSticker === sticker.id ? 'z-10' : ''}`}
                style={{
                  transform: `translate(${sticker.x}px, ${sticker.y}px) scale(${sticker.scale})`,
                  fontSize: '40px',
                }}
                onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
              >
                {sticker.emoji}
                {selectedSticker === sticker.id && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    <button
                      onClick={() => handleStickerScale(sticker.id, false)}
                      className="p-1 bg-white rounded-full shadow-md"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStickerScale(sticker.id, true)}
                      className="p-1 bg-white rounded-full shadow-md"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveSticker(sticker.id)}
                      className="p-1 bg-white rounded-full shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-lg border border-gray-200 hover:border-gray-300"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-lg border border-gray-200 hover:border-gray-300"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setShowStickers(!showStickers)}
                className="p-2 rounded-lg border border-gray-200 hover:border-gray-300"
              >
                <Smile className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>{isSaved ? 'Download' : 'Salvar Edição'}</span>
            </button>
          </div>

          {/* Stickers Panel */}
          {showStickers && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Stickers</h3>
              <div className="grid grid-cols-8 gap-2">
                {STICKERS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddSticker(emoji)}
                    className="p-2 text-2xl hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};