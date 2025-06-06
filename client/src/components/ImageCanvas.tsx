import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";

interface ImageCanvasProps {
  onImageUpload: (imageUrl: string) => void;
  onSelectionChange: (selectionData: string) => void;
  uploadedImage: string | null;
}

interface SelectionPoint {
  x: number;
  y: number;
}

export function ImageCanvas({ onImageUpload, onSelectionChange, uploadedImage }: ImageCanvasProps) {
  const { t } = useLanguage();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionTool, setSelectionTool] = useState<"brush" | "rectangle">("brush");
  const [selectionPath, setSelectionPath] = useState<SelectionPoint[]>([]);
  const [rectangleStart, setRectangleStart] = useState<SelectionPoint | null>(null);
  const [rectangleEnd, setRectangleEnd] = useState<SelectionPoint | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(t("Please upload a valid image file."));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(t("File size must be less than 10MB."));
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await apiRequest("POST", "/api/upload", formData);
      const result = await response.json();
      
      onImageUpload(result.imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(t("Failed to upload image. Please try again."));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image display
    const rect = image.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Clear and redraw selection
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSelection(ctx);
  }, [selectionPath, rectangleStart, rectangleEnd, selectionTool]);

  const drawSelection = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 10;

    if (selectionTool === "brush" && selectionPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(selectionPath[0].x, selectionPath[0].y);
      for (let i = 1; i < selectionPath.length; i++) {
        ctx.lineTo(selectionPath[i].x, selectionPath[i].y);
      }
      ctx.stroke();
    } else if (selectionTool === "rectangle" && rectangleStart && rectangleEnd) {
      const width = rectangleEnd.x - rectangleStart.x;
      const height = rectangleEnd.y - rectangleStart.y;
      
      ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
      ctx.fillRect(rectangleStart.x, rectangleStart.y, width, height);
      ctx.strokeRect(rectangleStart.x, rectangleStart.y, width, height);
    }
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!uploadedImage) return;
    
    setIsSelecting(true);
    const coords = getCanvasCoordinates(e);
    
    if (selectionTool === "brush") {
      setSelectionPath([coords]);
    } else if (selectionTool === "rectangle") {
      setRectangleStart(coords);
      setRectangleEnd(coords);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !uploadedImage) return;
    
    const coords = getCanvasCoordinates(e);
    
    if (selectionTool === "brush") {
      setSelectionPath(prev => [...prev, coords]);
    } else if (selectionTool === "rectangle") {
      setRectangleEnd(coords);
    }
    
    setupCanvas();
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    
    // Emit selection data
    let selectionData: any = {};
    
    if (selectionTool === "brush" && selectionPath.length > 0) {
      selectionData = {
        type: "brush",
        points: selectionPath
      };
    } else if (selectionTool === "rectangle" && rectangleStart && rectangleEnd) {
      selectionData = {
        type: "rectangle",
        x: rectangleStart.x,
        y: rectangleStart.y,
        width: rectangleEnd.x - rectangleStart.x,
        height: rectangleEnd.y - rectangleStart.y
      };
    }
    
    onSelectionChange(JSON.stringify(selectionData));
  };

  const clearSelection = () => {
    setSelectionPath([]);
    setRectangleStart(null);
    setRectangleEnd(null);
    onSelectionChange("");
    setupCanvas();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!uploadedImage && (
        <Card 
          className="selection-canvas rounded-2xl p-8 text-center min-h-[400px] flex flex-col justify-center items-center cursor-pointer transition-all duration-300 hover:border-cyan-400/80 hover:neon-glow"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            {isUploading ? (
              <>
                <div className="loading-spinner w-16 h-16 mx-auto mb-4"></div>
                <p className="text-xl font-semibold mb-2">{t("Uploading...")}</p>
              </>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt text-6xl text-cyan-400 mb-4 animate-bounce"></i>
                <p className="text-xl font-semibold mb-2 neon-text">
                  {t("Drop your image here or click to upload")}
                </p>
                <p className="text-gray-400">
                  {t("Supports JPG, PNG, WebP - Max 10MB")}
                </p>
                <Button className="mt-4 animate-energy-pulse">
                  <i className="fas fa-upload mr-2"></i>
                  {t("Choose Image")}
                </Button>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </Card>
      )}

      {/* Image Display with Selection */}
      {uploadedImage && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-cyan-400/30">
            <img
              ref={imageRef}
              src={uploadedImage}
              alt="Uploaded image"
              className="w-full max-h-96 object-contain"
              onLoad={setupCanvas}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Selection Tools */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={selectionTool === "brush" ? "default" : "outline"}
              onClick={() => setSelectionTool("brush")}
              className={selectionTool === "brush" ? "bg-cyan-400/20 border-cyan-400" : "glass border-cyan-400/30"}
            >
              <i className="fas fa-brush mr-2 text-cyan-400"></i>
              {t("Brush Select")}
            </Button>
            
            <Button
              variant={selectionTool === "rectangle" ? "default" : "outline"}
              onClick={() => setSelectionTool("rectangle")}
              className={selectionTool === "rectangle" ? "bg-purple-400/20 border-purple-400" : "glass border-purple-400/30"}
            >
              <i className="fas fa-vector-square mr-2 text-purple-400"></i>
              {t("Rectangle")}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearSelection}
              className="glass border-red-400/30 hover:bg-red-400/10"
            >
              <i className="fas fa-eraser mr-2 text-red-400"></i>
              {t("Clear")}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="glass border-green-400/30 hover:bg-green-400/10"
            >
              <i className="fas fa-plus mr-2 text-green-400"></i>
              {t("New Image")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
