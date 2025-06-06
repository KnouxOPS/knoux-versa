import { StableDiffusionService } from './stableDiffusion';

interface ImageTransformRequest {
  originalImageUrl: string;
  prompt: string;
  service: string;
  selectionData?: string | undefined;
  quality: string;
  isVIP: boolean;
}

export async function processImageTransformation(request: ImageTransformRequest): Promise<string> {
  const sdService = new StableDiffusionService();
  
  try {
    const result = await sdService.transformImage({
      prompt: request.prompt,
      imageUrl: request.originalImageUrl,
      service: request.service,
      selectionData: request.selectionData,
      quality: request.quality,
      isVIP: request.isVIP
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Transformation failed');
    }
    
    return result.imageUrl;
  } catch (error) {
    console.error('Image processing error:', error);
    
    // Fallback: return original image if transformation fails
    // In production, you might want to implement more sophisticated error handling
    console.log('Transformation failed, returning original image as fallback');
    return request.originalImageUrl;
  }
}
