interface ImageDimensions {
  width: number;
  height: number;
}

interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class ImageUtils {
  /**
   * Load an image from URL and return HTMLImageElement
   */
  static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Calculate optimal dimensions for image display
   */
  static calculateImageDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): ImageDimensions {
    let { width, height } = { width: originalWidth, height: originalHeight };
    
    // Scale down if wider than max width
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    // Scale down if taller than max height
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Resize image using canvas
   */
  static resizeImage(
    image: HTMLImageElement,
    options: ResizeOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const {
          maxWidth = 1920,
          maxHeight = 1080,
          quality = 0.8,
          format = 'jpeg'
        } = options;

        const dimensions = this.calculateImageDimensions(
          image.width,
          image.height,
          maxWidth,
          maxHeight
        );

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);

        const mimeType = `image/${format}`;
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Convert file to data URL
   */
  static fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File, maxSize: number = 10 * 1024 * 1024): boolean {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB.`);
    }

    return true;
  }

  /**
   * Create selection mask from selection data
   */
  static createSelectionMask(
    selectionData: string,
    canvasWidth: number,
    canvasHeight: number
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    try {
      const selection = JSON.parse(selectionData);
      
      // Fill canvas with black (masked area)
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw white selection area (unmasked)
      ctx.fillStyle = 'white';
      
      if (selection.type === 'rectangle') {
        ctx.fillRect(
          selection.x,
          selection.y,
          selection.width,
          selection.height
        );
      } else if (selection.type === 'brush' && selection.points) {
        ctx.beginPath();
        selection.points.forEach((point: any, index: number) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.closePath();
        ctx.fill();
      }
    } catch (error) {
      console.error('Error creating selection mask:', error);
      // Return white canvas (no mask) on error
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    return canvas;
  }

  /**
   * Get selection bounds from selection data
   */
  static getSelectionBounds(selectionData: string): SelectionBounds | null {
    try {
      const selection = JSON.parse(selectionData);
      
      if (selection.type === 'rectangle') {
        return {
          x: Math.min(selection.x, selection.x + selection.width),
          y: Math.min(selection.y, selection.y + selection.height),
          width: Math.abs(selection.width),
          height: Math.abs(selection.height)
        };
      } else if (selection.type === 'brush' && selection.points) {
        const xs = selection.points.map((p: any) => p.x);
        const ys = selection.points.map((p: any) => p.y);
        
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
      }
    } catch (error) {
      console.error('Error parsing selection data:', error);
    }
    
    return null;
  }

  /**
   * Download image from URL
   */
  static downloadImage(url: string, filename: string = 'image.png'): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Convert canvas to blob
   */
  static canvasToBlob(
    canvas: HTMLCanvasElement,
    type: string = 'image/png',
    quality?: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        type,
        quality
      );
    });
  }

  /**
   * Create image thumbnail
   */
  static createThumbnail(
    image: HTMLImageElement,
    size: number = 150
  ): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Calculate square thumbnail dimensions
    const minDimension = Math.min(image.width, image.height);
    const scale = size / minDimension;
    
    canvas.width = size;
    canvas.height = size;

    // Center and crop the image
    const sourceX = (image.width - minDimension) / 2;
    const sourceY = (image.height - minDimension) / 2;
    
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      minDimension,
      minDimension,
      0,
      0,
      size,
      size
    );

    return canvas.toDataURL('image/jpeg', 0.8);
  }

  /**
   * Get image metadata
   */
  static async getImageMetadata(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
    lastModified: number;
  }> {
    const dataUrl = await this.fileToDataUrl(file);
    const image = await this.loadImage(dataUrl);
    
    return {
      width: image.width,
      height: image.height,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
  }
}

export default ImageUtils;
