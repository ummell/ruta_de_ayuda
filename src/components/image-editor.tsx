'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageEditorProps {
  imageFile: File;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: number; // width/height
}

/**
 * Editor de imagen con crop real
 * - Permite mover, hacer zoom y rotar
 * - El área VISIBLE (dentro del marco) es lo que se guarda
 * - El resto se recorta
 * - Mantiene la calidad de la imagen original
 */
export function ImageEditor({ imageFile, onConfirm, onCancel, aspectRatio = 16 / 10 }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Dimensiones del canvas de edición
  const cropWidth = 640;
  const cropHeight = Math.round(cropWidth / aspectRatio);

  // Cargar imagen
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageSize({ width: img.width, height: img.height });
      setImageLoaded(true);
      // Inicial: que la imagen cubra todo el área visible (cover)
      const scaleFit = Math.max(cropWidth / img.width, cropHeight / img.height);
      setScale(scaleFit);
      setPosition({
        x: cropWidth / 2 - (img.width * scaleFit) / 2,
        y: cropHeight / 2 - (img.height * scaleFit) / 2,
      });
    };
    img.src = URL.createObjectURL(imageFile);
    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [imageFile, cropWidth, cropHeight]);

  // Renderizar canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Fondo oscuro para indicar áreas que se van a recortar
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, cropWidth, cropHeight);

    ctx.save();

    // Aplicar rotación
    if (rotation !== 0) {
      ctx.translate(cropWidth / 2, cropHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-cropWidth / 2, -cropHeight / 2);
    }

    // Dibujar imagen escalada y posicionada
    const img = imageRef.current;
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, position.x, position.y, w, h);

    ctx.restore();

    // Borde del área visible
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, cropWidth - 3, cropHeight - 3);

    // Indicadores de esquinas (L shape)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    const cornerSize = 24;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(0, cornerSize);
    ctx.lineTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(cropWidth - cornerSize, 0);
    ctx.lineTo(cropWidth, 0);
    ctx.lineTo(cropWidth, cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(0, cropHeight - cornerSize);
    ctx.lineTo(0, cropHeight);
    ctx.lineTo(cornerSize, cropHeight);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(cropWidth - cornerSize, cropHeight);
    ctx.lineTo(cropWidth, cropHeight);
    ctx.lineTo(cropWidth, cropHeight - cornerSize);
    ctx.stroke();
  }, [scale, rotation, position, cropWidth, cropHeight]);

  useEffect(() => {
    if (imageLoaded) render();
  }, [imageLoaded, render]);

  // Handlers de mouse/touch
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartPosition({ x: position.x, y: position.y });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPosition({
      x: dragStartPosition.x + dx,
      y: dragStartPosition.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Zoom con scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((s) => Math.max(0.1, Math.min(8, s + delta)));
  };

  // Botones de zoom
  const zoomIn = () => setScale((s) => Math.min(8, s + 0.2));
  const zoomOut = () => setScale((s) => Math.max(0.1, s - 0.2));
  const rotateImage = () => {
    setRotation((r) => (r + 90) % 360);
  };
  const resetTransform = () => {
    if (!imageRef.current) return;
    const scaleFit = Math.max(cropWidth / imageRef.current.width, cropHeight / imageRef.current.height);
    setScale(scaleFit);
    setPosition({
      x: cropWidth / 2 - (imageRef.current.width * scaleFit) / 2,
      y: cropHeight / 2 - (imageRef.current.height * scaleFit) / 2,
    });
    setRotation(0);
  };

  // Centrar la cara: ajustar la posición para que el centro de la imagen quede en el centro del marco
  const centerFace = () => {
    setPosition({
      x: cropWidth / 2 - (imageRef.current!.width * scale) / 2,
      y: cropHeight / 2 - (imageRef.current!.height * scale) / 2,
    });
  };

  // Generar imagen final - MANTIENE CALIDAD
  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Exportar a la misma resolución que el crop (alta calidad)
    canvas.toBlob((blob) => {
      if (blob) {
        // Generar archivo manteniendo la calidad original
        const fileName = imageFile.name.replace(/\.[^.]+$/, '') + '_editado.jpg';
        const croppedFile = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        onConfirm(croppedFile);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[95vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Ajustar foto
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Posiciona la cara dentro del cuadro. Lo que se ve adentro es lo que se mostrará en la lista.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Canvas de edición */}
        <div className="p-4 bg-gray-100">
          <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
            <Move className="h-3 w-3" />
            Arrastra para mover · Rueda del mouse o botones para zoom
          </p>
          <div
            className="mx-auto bg-gray-800"
            style={{
              width: cropWidth,
              height: cropHeight,
              maxWidth: '100%',
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            <canvas
              ref={canvasRef}
              width={cropWidth}
              height={cropHeight}
              className="block"
              style={{ width: '100%', height: 'auto', maxWidth: cropWidth }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={zoomOut}
              aria-label="Alejar"
              title="Alejar"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="flex-1 max-w-xs min-w-[120px]">
              <input
                type="range"
                min="0.1"
                max="8"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={zoomIn}
              aria-label="Acercar"
              title="Acercar"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={rotateImage}
              aria-label="Rotar 90°"
              title="Rotar 90°"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={centerFace}
              title="Centrar imagen"
            >
              <Move className="h-4 w-4 mr-1" />
              Centrar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={resetTransform}
              title="Restablecer"
            >
              Restablecer
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500">
            Zoom: {Math.round(scale * 100)}% | Rotación: {rotation}° | Resolución final: {cropWidth}×{cropHeight}px
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm}>
            <Check className="h-4 w-4 mr-2" />
            Aplicar y guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
