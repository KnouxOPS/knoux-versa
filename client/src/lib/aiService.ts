interface AIServiceConfig {
  apiUrl: string;
  apiKey?: string;
}

interface TransformationRequest {
  imageUrl: string;
  prompt: string;
  service: string;
  selectionData?: string;
  quality: string;
  isVIP: boolean;
}

interface TransformationResult {
  success: boolean;
  transformedImageUrl?: string;
  error?: string;
  processingTime?: number;
}

export class AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async transformImage(request: TransformationRequest): Promise<TransformationResult> {
    const startTime = Date.now();
    
    try {
      // Validate request
      if (!request.imageUrl || !request.prompt || !request.service) {
        throw new Error("Missing required parameters");
      }

      // Different processing based on service type
      const serviceConfig = this.getServiceConfig(request.service);
      
      // Prepare API request body
      const requestBody = {
        image_url: request.imageUrl,
        prompt: this.enhancePrompt(request.prompt, request.service),
        service: request.service,
        quality: request.quality,
        selection_data: request.selectionData,
        is_vip: request.isVIP,
        ...serviceConfig
      };

      // Make API call to transformation service
      const response = await fetch(`${this.config.apiUrl}/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const result = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        transformedImageUrl: result.transformed_image_url,
        processingTime
      };
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  private getServiceConfig(service: string): Record<string, any> {
    const configs: Record<string, Record<string, any>> = {
      'magic-morph': {
        strength: 0.8,
        guidance_scale: 15,
        steps: 50,
        model: 'stable-diffusion-xl'
      },
      'remove-replace': {
        strength: 0.9,
        guidance_scale: 12,
        steps: 40,
        model: 'stable-diffusion-inpaint'
      },
      'style-transfer': {
        strength: 0.6,
        guidance_scale: 10,
        steps: 30,
        model: 'stable-diffusion-xl'
      },
      'background-replace': {
        strength: 0.7,
        guidance_scale: 12,
        steps: 35,
        model: 'stable-diffusion-xl'
      },
      'object-recolor': {
        strength: 0.5,
        guidance_scale: 8,
        steps: 25,
        model: 'stable-diffusion-xl'
      },
      'text2image': {
        strength: 0.7,
        guidance_scale: 12,
        steps: 40,
        model: 'stable-diffusion-xl'
      },
      'ai-enhance': {
        strength: 0.3,
        guidance_scale: 6,
        steps: 20,
        model: 'real-esrgan'
      },
      'vip-magic': {
        strength: 0.9,
        guidance_scale: 20,
        steps: 80,
        model: 'stable-diffusion-xl-refiner'
      }
    };

    return configs[service] || configs['magic-morph'];
  }

  private enhancePrompt(prompt: string, service: string): string {
    const enhancements: Record<string, string> = {
      'magic-morph': `${prompt}, highly detailed, photorealistic, 8k quality, professional photography`,
      'remove-replace': `${prompt}, seamless integration, natural lighting, photorealistic`,
      'style-transfer': `${prompt}, artistic masterpiece, high quality, detailed`,
      'background-replace': `${prompt}, professional photography, natural lighting, seamless composition`,
      'object-recolor': `${prompt}, maintain texture and details, photorealistic, natural appearance`,
      'text2image': `${prompt}, seamless integration, realistic, natural lighting, high quality`,
      'ai-enhance': `${prompt}, ultra high definition, sharp details, enhanced quality`,
      'vip-magic': `${prompt}, ultra premium quality, unlimited creativity, masterpiece, 8k, HDR, professional grade`
    };

    return enhancements[service] || `${prompt}, high quality, detailed`;
  }

  // Utility method to check service availability
  async checkServiceStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get estimated processing time for a service
  getEstimatedProcessingTime(service: string, quality: string): number {
    const baseTimes: Record<string, number> = {
      'magic-morph': 15000,
      'remove-replace': 12000,
      'style-transfer': 10000,
      'background-replace': 13000,
      'object-recolor': 8000,
      'text2image': 14000,
      'ai-enhance': 20000,
      'vip-magic': 30000
    };

    const qualityMultipliers: Record<string, number> = {
      'standard': 1,
      'high': 1.5,
      'ultra': 2.5
    };

    const baseTime = baseTimes[service] || 10000;
    const multiplier = qualityMultipliers[quality] || 1;
    
    return Math.round(baseTime * multiplier);
  }
}

// Create default AI service instance
const aiService = new AIService({
  apiUrl: '/api',
  apiKey: undefined // Will be handled by backend
});

export { aiService };
export default aiService;
