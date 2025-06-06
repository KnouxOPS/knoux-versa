import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Transformation } from "@shared/schema";

interface TransformRequest {
  originalImageUrl: string;
  prompt: string;
  service: string;
  selectionData?: string | null;
  quality: string;
  isVIP: boolean;
  vipSession?: string | null;
}

interface TransformResponse {
  success: boolean;
  transformation?: Transformation;
  error?: string;
}

export function useImageTransform() {
  const [progress, setProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");
  const [result, setResult] = useState<Transformation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transformMutation = useMutation({
    mutationFn: async (request: TransformRequest): Promise<TransformResponse> => {
      try {
        setProgress(0);
        setProcessingMessage("Initializing AI transformation...");
        
        // Simulate realistic progress updates
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const increment = Math.random() * 15 + 5; // 5-20% increments
            const newProgress = Math.min(prev + increment, 95);
            
            // Update messages based on progress
            if (newProgress < 20) {
              setProcessingMessage("Analyzing image structure...");
            } else if (newProgress < 40) {
              setProcessingMessage("Understanding transformation request...");
            } else if (newProgress < 60) {
              setProcessingMessage("Generating AI transformation...");
            } else if (newProgress < 80) {
              setProcessingMessage("Applying advanced AI processing...");
            } else {
              setProcessingMessage("Finalizing high-quality output...");
            }
            
            return newProgress;
          });
        }, 800);

        // Prepare headers
        const headers: Record<string, string> = {};
        if (request.isVIP && request.vipSession) {
          headers['x-vip-key'] = request.vipSession;
        }

        // Make the actual API request
        const response = await apiRequest("POST", "/api/transform", {
          originalImageUrl: request.originalImageUrl,
          prompt: request.prompt,
          service: request.service,
          selectionData: request.selectionData,
          quality: request.quality,
          isVIP: request.isVIP
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: response.statusText }));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const transformation = await response.json();
        
        // Complete the progress
        clearInterval(progressInterval);
        setProgress(100);
        setProcessingMessage("Transformation completed!");
        
        return { success: true, transformation };
      } catch (error) {
        console.error("Transform error:", error);
        const errorMessage = error instanceof Error ? error.message : "Transformation failed";
        return { success: false, error: errorMessage };
      }
    },
    onSuccess: (response) => {
      if (response.success && response.transformation) {
        setResult(response.transformation);
        setError(null);
      } else {
        setError(response.error || "Unknown error occurred");
        setResult(null);
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      setError(error instanceof Error ? error.message : "Network error occurred");
      setResult(null);
      setProgress(0);
    }
  });

  const transform = async (request: TransformRequest) => {
    setError(null);
    setResult(null);
    return transformMutation.mutateAsync(request);
  };

  const reset = () => {
    setProgress(0);
    setProcessingMessage("");
    setResult(null);
    setError(null);
    transformMutation.reset();
  };

  return {
    transform,
    isProcessing: transformMutation.isPending,
    result,
    progress,
    processingMessage,
    error,
    reset
  };
}
