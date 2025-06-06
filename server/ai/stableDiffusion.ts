import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs/promises';

interface StableDiffusionRequest {
  prompt: string;
  imageUrl: string;
  service: string;
  selectionData?: string;
  quality: string;
  isVIP: boolean;
}

interface StableDiffusionResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
}

export class StableDiffusionService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.STABILITY_API_KEY || process.env.HUGGINGFACE_API_KEY || 'demo-key';
    this.apiUrl = process.env.SD_API_URL || 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image';
  }

  async transformImage(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    try {
      // Different processing based on service type
      switch (request.service) {
        case 'magic-morph':
          return await this.magicMorph(request);
        case 'remove-replace':
          return await this.removeReplace(request);
        case 'style-transfer':
          return await this.styleTransfer(request);
        case 'background-replace':
          return await this.backgroundReplace(request);
        case 'object-recolor':
          return await this.objectRecolor(request);
        case 'text2image':
          return await this.text2ImageAdd(request);
        case 'ai-enhance':
          return await this.aiEnhance(request);
        case 'vip-magic':
          return await this.vipMagicMorph(request);
        default:
          throw new Error(`Unsupported service: ${request.service}`);
      }
    } catch (error) {
      console.error('Stable Diffusion API error:', error);
      return {
        imageUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async magicMorph(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    // For Magic Morph - unlimited transformation
    const enhancedPrompt = `${request.prompt}, highly detailed, photorealistic, 8k quality`;
    return await this.callStabilityAPI(request.imageUrl, enhancedPrompt, 0.8);
  }

  private async removeReplace(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    // For Remove & Replace - use inpainting
    const inpaintPrompt = `remove and replace: ${request.prompt}, seamless integration, natural lighting`;
    return await this.callStabilityInpaintAPI(request.imageUrl, inpaintPrompt, request.selectionData);
  }

  private async styleTransfer(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    // For Style Transfer
    const stylePrompt = `in the style of ${request.prompt}, artistic, masterpiece quality`;
    return await this.callStabilityAPI(request.imageUrl, stylePrompt, 0.6);
  }

  private async backgroundReplace(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    // For Background Replace
    const bgPrompt = `same subject with background: ${request.prompt}, professional photography`;
    return await this.callStabilityAPI(request.imageUrl, bgPrompt, 0.7);
  }

  private async objectRecolor(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    // For Object Recolor
    const colorPrompt = `recolor to ${request.prompt}, maintain texture and details, photorealistic`;
    return await this.callStabilityAPI(request.imageUrl, colorPrompt, 0.5);
  }

  private async text2ImageAdd(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    // For Text2Image Add
    const addPrompt = `add ${request.prompt} to the scene, seamless integration, realistic`;
    return await this.callStabilityAPI(request.imageUrl, addPrompt, 0.7);
  }

  private async aiEnhance(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    // For AI Enhance - use upscaling
    const enhancePrompt = `enhance quality, ${request.prompt}, ultra high definition, sharp details`;
    return await this.callStabilityUpscaleAPI(request.imageUrl, enhancePrompt);
  }

  private async vipMagicMorph(request: StableDiffusionRequest): Promise<StableDiffusionResponse> {
    // For VIP Magic Morph - maximum quality and capabilities
    const vipPrompt = `${request.prompt}, ultra premium quality, unlimited creativity, masterpiece, 8k, HDR`;
    return await this.callStabilityAPI(request.imageUrl, vipPrompt, 0.9, true);
  }

  private async callStabilityAPI(
    imageUrl: string, 
    prompt: string, 
    strength: number = 0.7,
    isVIP: boolean = false
  ): Promise<StableDiffusionResponse> {
    try {
      // Read the input image
      const imageBuffer = await this.downloadImage(imageUrl);
      
      const formData = new FormData();
      formData.append('init_image', imageBuffer, { filename: 'input.png' });
      formData.append('text_prompts[0][text]', prompt);
      formData.append('text_prompts[0][weight]', '1');
      formData.append('cfg_scale', isVIP ? '15' : '10');
      formData.append('image_strength', strength.toString());
      formData.append('steps', isVIP ? '50' : '30');
      formData.append('samples', '1');

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json() as any;
      
      if (result.artifacts && result.artifacts.length > 0) {
        const imageData = result.artifacts[0].base64;
        const outputPath = await this.saveBase64Image(imageData);
        
        return {
          imageUrl: outputPath,
          success: true
        };
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('Stability API call failed:', error);
      throw error;
    }
  }

  private async callStabilityInpaintAPI(
    imageUrl: string, 
    prompt: string, 
    selectionData?: string
  ): Promise<StableDiffusionResponse> {
    // For inpainting with mask
    try {
      const imageBuffer = await this.downloadImage(imageUrl);
      const maskBuffer = selectionData ? await this.createMaskFromSelection(selectionData) : null;
      
      const formData = new FormData();
      formData.append('init_image', imageBuffer, { filename: 'input.png' });
      if (maskBuffer) {
        formData.append('mask_image', maskBuffer, { filename: 'mask.png' });
      }
      formData.append('text_prompts[0][text]', prompt);
      formData.append('text_prompts[0][weight]', '1');
      formData.append('cfg_scale', '10');
      formData.append('steps', '30');

      const inpaintUrl = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image/masking';
      
      const response = await fetch(inpaintUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Inpaint API request failed: ${response.statusText}`);
      }

      const result = await response.json() as any;
      
      if (result.artifacts && result.artifacts.length > 0) {
        const imageData = result.artifacts[0].base64;
        const outputPath = await this.saveBase64Image(imageData);
        
        return {
          imageUrl: outputPath,
          success: true
        };
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('Inpaint API call failed:', error);
      throw error;
    }
  }

  private async callStabilityUpscaleAPI(
    imageUrl: string, 
    prompt: string
  ): Promise<StableDiffusionResponse> {
    // For upscaling
    try {
      const imageBuffer = await this.downloadImage(imageUrl);
      
      const formData = new FormData();
      formData.append('image', imageBuffer, { filename: 'input.png' });
      formData.append('prompt', prompt);
      formData.append('output_format', 'png');

      const upscaleUrl = 'https://api.stability.ai/v2beta/stable-image/upscale/creative';
      
      const response = await fetch(upscaleUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upscale API request failed: ${response.statusText}`);
      }

      const result = await response.json() as any;
      
      if (result.image) {
        const outputPath = await this.saveBase64Image(result.image);
        
        return {
          imageUrl: outputPath,
          success: true
        };
      } else {
        throw new Error('No upscaled image generated');
      }
    } catch (error) {
      console.error('Upscale API call failed:', error);
      throw error;
    }
  }

  private async downloadImage(imageUrl: string): Promise<Buffer> {
    // Handle local file paths
    if (imageUrl.startsWith('/uploads/')) {
      const localPath = imageUrl.replace('/uploads/', 'uploads/');
      return await fs.readFile(localPath);
    }
    
    // Handle remote URLs
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    return Buffer.from(await response.arrayBuffer());
  }

  private async saveBase64Image(base64Data: string): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `transformed_${Date.now()}.png`;
    const filepath = `uploads/${filename}`;
    
    await fs.writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  }

  private async createMaskFromSelection(selectionData: string): Promise<Buffer> {
    // Convert selection data to mask image
    // This is a simplified implementation - in production, you'd use a proper image library
    try {
      const selection = JSON.parse(selectionData);
      // Create a simple mask based on selection coordinates
      // For now, return a simple white mask
      const canvas = require('canvas');
      const maskCanvas = canvas.createCanvas(1024, 1024);
      const ctx = maskCanvas.getContext('2d');
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 1024, 1024);
      
      ctx.fillStyle = 'white';
      if (selection.type === 'rectangle') {
        ctx.fillRect(selection.x, selection.y, selection.width, selection.height);
      } else if (selection.type === 'brush' && selection.points) {
        ctx.beginPath();
        selection.points.forEach((point: any, index: number) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.fill();
      }
      
      return maskCanvas.toBuffer('image/png');
    } catch (error) {
      console.error('Error creating mask:', error);
      // Return default mask
      const canvas = require('canvas');
      const maskCanvas = canvas.createCanvas(1024, 1024);
      const ctx = maskCanvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 1024, 1024);
      return maskCanvas.toBuffer('image/png');
    }
  }
}
