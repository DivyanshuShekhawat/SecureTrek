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

    // Simple QR code generation using a basic algorithm
    generateQRCode(canvasRef.current, value, size);
  }, [value, size]);

  const generateQRCode = (canvas: HTMLCanvasElement, text: string, size: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Simple QR-like pattern (for demo purposes)
    const modules = 25;
    const moduleSize = size / modules;
    
    ctx.fillStyle = '#000000';
    
    // Generate a simple pattern based on the text
    const hash = simpleHash(text);
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        const shouldFill = (hash + i * j) % 3 === 0;
        if (shouldFill) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add corner squares (QR code style)
    const cornerSize = moduleSize * 7;
    
    // Top-left corner
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(moduleSize, moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(moduleSize * 2, moduleSize * 2, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);

    // Top-right corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size - cornerSize + moduleSize, moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - cornerSize + moduleSize * 2, moduleSize * 2, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);

    // Bottom-left corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(moduleSize, size - cornerSize + moduleSize, cornerSize - 2 * moduleSize, cornerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(moduleSize * 2, size - cornerSize + moduleSize * 2, cornerSize - 4 * moduleSize, cornerSize - 4 * moduleSize);
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
    link.download = `qr-code-${value}.png`;
    link.href = canvasRef.current.toDataURL();
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