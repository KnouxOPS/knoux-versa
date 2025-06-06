import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

interface ResultsComparisonProps {
  originalImage: string;
  transformedImage: string;
  onNewTransform: () => void;
}

export function ResultsComparison({ originalImage, transformedImage, onNewTransform }: ResultsComparisonProps) {
  const { t } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.click();
  };

  const shareImage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KNOUX VERSA AI Transformation',
          text: 'Check out this AI transformation I created!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t('Link copied to clipboard!'));
    }
  };

  return (
    <Card className="glass-strong rounded-3xl p-8 mb-12 animate-float success-glow">
      <h3 className="text-2xl font-bold neon-text text-green-400 mb-6 text-center">
        {t("AI Transformation Results")}
      </h3>

      {/* Before/After Comparison */}
      <div 
        ref={containerRef}
        className="comparison-slider rounded-2xl overflow-hidden relative bg-black/50 min-h-[400px] mb-6 cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Before Image (Full) */}
        <div className="absolute inset-0">
          <img 
            src={originalImage} 
            alt="Original" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-sm font-semibold">
            <span className="text-red-400">{t("Before")}</span>
          </div>
        </div>

        {/* After Image (Clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ 
            clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)` 
          }}
        >
          <img 
            src={transformedImage} 
            alt="Transformed" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-sm font-semibold">
            <span className="text-green-400">{t("After")}</span>
          </div>
        </div>

        {/* Comparison Handle */}
        <div 
          className="comparison-handle"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center cursor-ew-resize">
            <i className="fas fa-arrows-alt-h text-black text-sm"></i>
          </div>
        </div>

        {/* Slider Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-full text-sm text-gray-300">
          <i className="fas fa-hand-pointer mr-2"></i>
          {t("Drag to compare")}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={() => downloadImage(transformedImage, 'knoux-versa-transformed.png')}
          className="glass border-green-400/50 hover:bg-green-400/20 text-green-400"
        >
          <i className="fas fa-download mr-2"></i>
          {t("Download Result")}
        </Button>

        <Button 
          onClick={() => downloadImage(originalImage, 'knoux-versa-original.png')}
          className="glass border-blue-400/50 hover:bg-blue-400/20 text-blue-400"
        >
          <i className="fas fa-download mr-2"></i>
          {t("Download Original")}
        </Button>

        <Button 
          onClick={shareImage}
          className="glass border-purple-400/50 hover:bg-purple-400/20 text-purple-400"
        >
          <i className="fas fa-share-alt mr-2"></i>
          {t("Share")}
        </Button>

        <Button 
          onClick={onNewTransform}
          className="glass border-cyan-400/50 hover:bg-cyan-400/20 text-cyan-400"
        >
          <i className="fas fa-plus mr-2"></i>
          {t("New Transform")}
        </Button>
      </div>

      {/* Quality Information */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          <i className="fas fa-check-circle text-green-400 mr-2"></i>
          {t("Transformation completed successfully • No watermarks • Full quality preserved")}
        </p>
      </div>
    </Card>
  );
}
