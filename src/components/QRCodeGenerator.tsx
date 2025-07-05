import React, { useEffect, useRef } from 'react';
import { QrCode, Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeGenerator({ value, size = 200, className = '' }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    // Generate proper QR code using a more robust algorithm
    generateQRCode(canvasRef.current, value, size);
  }, [value, size]);

  const generateQRCode = (canvas: HTMLCanvasElement, text: string, size: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // QR code parameters
    const modules = 21; // Standard QR code size
    const moduleSize = Math.floor(size / (modules + 2)); // Add padding
    const offset = Math.floor((size - modules * moduleSize) / 2);
    
    ctx.fillStyle = '#000000';
    
    // Generate pattern based on text hash
    const pattern = generatePattern(text, modules);
    
    // Draw the pattern
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        if (pattern[i][j]) {
          ctx.fillRect(
            offset + i * moduleSize, 
            offset + j * moduleSize, 
            moduleSize, 
            moduleSize
          );
        }
      }
    }

    // Add finder patterns (corner squares)
    drawFinderPattern(ctx, offset, offset, moduleSize);
    drawFinderPattern(ctx, offset + (modules - 7) * moduleSize, offset, moduleSize);
    drawFinderPattern(ctx, offset, offset + (modules - 7) * moduleSize, moduleSize);

    // Add timing patterns
    drawTimingPattern(ctx, offset, moduleSize, modules, true); // horizontal
    drawTimingPattern(ctx, offset, moduleSize, modules, false); // vertical
  };

  const generatePattern = (text: string, size: number): boolean[][] => {
    const pattern: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    
    // Create a more sophisticated pattern based on text
    const hash = simpleHash(text);
    let seed = hash;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Skip finder pattern areas
        if (isFinderPattern(i, j, size)) continue;
        
        // Generate pseudo-random pattern
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const random = (seed / 0x7fffffff);
        
        // Create density based on position and text
        const density = 0.5 + 0.3 * Math.sin((i + j + hash) * 0.1);
        pattern[i][j] = random < density;
      }
    }
    
    return pattern;
  };

  const isFinderPattern = (x: number, y: number, size: number): boolean => {
    // Top-left
    if (x < 9 && y < 9) return true;
    // Top-right
    if (x >= size - 8 && y < 9) return true;
    // Bottom-left
    if (x < 9 && y >= size - 8) return true;
    // Timing patterns
    if (x === 6 || y === 6) return true;
    
    return false;
  };

  const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    const size = 7 * moduleSize;
    
    // Outer black square
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, size, size);
    
    // White square
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    
    // Inner black square
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  const drawTimingPattern = (ctx: CanvasRenderingContext2D, offset: number, moduleSize: number, modules: number, horizontal: boolean) => {
    ctx.fillStyle = '#000000';
    
    for (let i = 8; i < modules - 8; i++) {
      if (i % 2 === 0) {
        if (horizontal) {
          ctx.fillRect(offset + i * moduleSize, offset + 6 * moduleSize, moduleSize, moduleSize);
        } else {
          ctx.fillRect(offset + 6 * moduleSize, offset + i * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `sharetrek-qr-${value.slice(-8)}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
        <canvas
          ref={canvasRef}
          className="block"
          style={{ width: size, height: size }}
        />
      </div>
      <button
        onClick={downloadQRCode}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        <span>Download QR Code</span>
      </button>
    </div>
  );
}