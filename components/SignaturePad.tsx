import React, { useRef, useState, useEffect } from 'react';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
  onEnd: (dataUrl: string) => void;
  initialData?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onEnd, initialData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Initialize canvas with previous data if editing
  useEffect(() => {
    if (initialData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          setIsEmpty(false);
        };
        image.src = initialData;
      }
    }
  }, [initialData]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    setIsEmpty(false);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
        onEnd(canvasRef.current.toDataURL());
    }
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
        onEnd('');
      }
    }
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden relative bg-white">
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        className="w-full h-40 touch-none cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="absolute top-2 right-2">
        <button 
            type="button"
            onClick={clear} 
            className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-xs flex items-center gap-1 text-slate-600 transition-colors"
            title="Hapus Tanda Tangan"
        >
            <Eraser size={14} /> Clear
        </button>
      </div>
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 select-none">
          Tanda tangan disini
        </div>
      )}
    </div>
  );
};

export default SignaturePad;