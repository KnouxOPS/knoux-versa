import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

interface ProcessingModalProps {
  isOpen: boolean;
  progress: number;
  message: string;
}

const processingStages = [
  { en: "Analyzing your image...", ar: "تحليل صورتك..." },
  { en: "Understanding AI command...", ar: "فهم أمر الذكاء الاصطناعي..." },
  { en: "Generating transformation...", ar: "توليد التحويل..." },
  { en: "Applying AI magic...", ar: "تطبيق السحر الذكي..." },
  { en: "Enhancing details...", ar: "تحسين التفاصيل..." },
  { en: "Finalizing results...", ar: "وضع اللمسات الأخيرة..." }
];

export function ProcessingModal({ isOpen, progress, message }: ProcessingModalProps) {
  const { t, currentLanguage } = useLanguage();
  const [currentStage, setCurrentStage] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Update stage based on progress
      const stage = Math.min(Math.floor((progress / 100) * processingStages.length), processingStages.length - 1);
      setCurrentStage(stage);

      // Generate floating particles
      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-20), // Keep only last 20 particles
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: Math.random() * 0.8 + 0.2
          }
        ]);
      }, 200);

      return () => clearInterval(interval);
    } else {
      setParticles([]);
      setCurrentStage(0);
    }
  }, [isOpen, progress]);

  if (!isOpen) return null;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 processing-modal flex items-center justify-center z-50">
      <Card className="glass-strong rounded-2xl p-8 text-center max-w-md mx-4 relative overflow-hidden">
        
        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Progress Circle */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(0,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00FFFF" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06FFA5" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-brain text-3xl text-cyan-400 animate-pulse neon-text"></i>
          </div>
          
          {/* Progress Percentage */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <span className="text-sm font-bold text-cyan-400">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Processing Status */}
        <h3 className="text-2xl font-bold mb-4 neon-text text-cyan-400">
          {t("AI Processing...")}
        </h3>
        
        <p className="text-gray-300 mb-4">
          {processingStages[currentStage]?.[currentLanguage] || message}
        </p>

        {/* Processing Stages Indicator */}
        <div className="flex justify-center space-x-2 mb-6">
          {processingStages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStage 
                  ? 'bg-cyan-400 animate-pulse-glow' 
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>

        {/* Neural Network Animation */}
        <div className="absolute top-4 right-4 opacity-20">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <g className="animate-neural-flow">
              <circle cx="15" cy="15" r="2" fill="#00FFFF" />
              <circle cx="45" cy="15" r="2" fill="#8B5CF6" />
              <circle cx="30" cy="45" r="2" fill="#06FFA5" />
              <path d="M 15 15 L 45 15 L 30 45 Z" stroke="#00FFFF" strokeWidth="1" fill="none" opacity="0.5" />
            </g>
          </svg>
        </div>
      </Card>
    </div>
  );
}
