import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";

interface PromptNexusProps {
  selectedService: string;
  onTransform: (prompt: string, quality: string) => void;
  disabled?: boolean;
}

const qualityOptions = [
  { value: "standard", labelKey: "Standard (Fast)", icon: "fas fa-bolt" },
  { value: "high", labelKey: "High Quality", icon: "fas fa-star" },
  { value: "ultra", labelKey: "Ultra HD (Slow)", icon: "fas fa-crown" }
];

const serviceSuggestions: Record<string, string[]> = {
  "magic-morph": [
    "Transform into superhero",
    "Cyberpunk style",
    "Fantasy character",
    "Futuristic outfit",
    "Medieval armor"
  ],
  "remove-replace": [
    "Remove person, add flowers",
    "Remove car, add fountain",
    "Remove background objects",
    "Replace with empty space",
    "Remove and fill naturally"
  ],
  "style-transfer": [
    "Anime style",
    "Oil painting",
    "Van Gogh style",
    "3D render",
    "Watercolor",
    "Pixel art"
  ],
  "background-replace": [
    "Starry night sky",
    "Beach sunset",
    "Forest landscape",
    "Futuristic city",
    "Mountain vista",
    "Space nebula"
  ],
  "object-recolor": [
    "Metallic blue",
    "Rose gold",
    "Neon green",
    "Pure white",
    "Deep red",
    "Chrome finish"
  ],
  "text2image": [
    "Add flying dragon",
    "Add sports car",
    "Add rainbow",
    "Add magical portal",
    "Add futuristic buildings"
  ],
  "ai-enhance": [
    "Enhance to 4K quality",
    "Sharpen details",
    "Improve lighting",
    "Reduce noise",
    "Upscale resolution"
  ],
  "vip-magic": [
    "Ultimate transformation",
    "Complex multi-step edit",
    "Professional retouch",
    "Creative masterpiece",
    "Impossible made possible"
  ]
};

export function PromptNexus({ selectedService, onTransform, disabled = false }: PromptNexusProps) {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [quality, setQuality] = useState("high");

  const suggestions = serviceSuggestions[selectedService] || [];
  const maxLength = 500;

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleTransform = () => {
    if (prompt.trim()) {
      onTransform(prompt, quality);
    }
  };

  const isPromptValid = prompt.trim().length > 0 && prompt.length <= maxLength;

  return (
    <div className="space-y-6">
      {/* Service Selection Display */}
      <Card className="glass p-4 border-cyan-400/30">
        <div className="flex items-center space-x-3">
          <i className="fas fa-cog text-cyan-400"></i>
          <div>
            <p className="text-sm text-gray-400">{t("Selected Service")}:</p>
            <p className="font-semibold text-cyan-400">{t(getServiceTitle(selectedService))}</p>
          </div>
        </div>
      </Card>

      {/* Quality Settings */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          {t("Output Quality")}:
        </label>
        <Select value={quality} onValueChange={setQuality}>
          <SelectTrigger className="glass bg-black/30 border-cyan-400/30 focus:border-cyan-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass bg-gray-900 border-cyan-400/30">
            {qualityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-cyan-400/20">
                <div className="flex items-center space-x-2">
                  <i className={`${option.icon} text-cyan-400`}></i>
                  <span>{t(option.labelKey)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* The Prompt Nexus */}
      <div className="prompt-nexus rounded-xl p-6">
        <div className="flex items-center mb-4">
          <i className="fas fa-brain text-purple-400 mr-3 text-2xl animate-pulse"></i>
          <h4 className="text-xl font-bold neon-text text-purple-400">
            {t("AI Command (The Prompt Nexus)")}
          </h4>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholderForService(selectedService)}
            className="w-full bg-transparent border border-cyan-400/30 rounded-lg p-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none font-mono min-h-[120px] transition-all duration-300"
            maxLength={maxLength}
            disabled={disabled}
          />
          <div className={`absolute bottom-2 right-2 text-xs ${prompt.length > maxLength * 0.9 ? 'text-red-400' : 'text-gray-400'}`}>
            {prompt.length}/{maxLength}
          </div>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              {t("AI Suggestions")}:
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="glass border-purple-400/30 hover:bg-purple-400/20 text-sm transition-all duration-300"
                  disabled={disabled}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Transform Button */}
        <Button
          onClick={handleTransform}
          disabled={disabled || !isPromptValid}
          className="w-full mt-6 transform-button p-4 text-xl font-bold rounded-xl relative overflow-hidden group animate-energy-pulse"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center">
            <i className="fas fa-rocket mr-3 text-2xl"></i>
            {disabled ? (
              <span>{t("Processing...")}</span>
            ) : (
              <span>{t("🚀 Start AI Transformation")}</span>
            )}
          </div>
        </Button>

        {/* Warning for VIP */}
        {selectedService === "vip-magic" && (
          <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <div className="flex items-center text-yellow-400">
              <i className="fas fa-crown mr-2"></i>
              <span className="text-sm">
                {t("VIP Exclusive Service - Requires special access key")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getServiceTitle(service: string): string {
  const titles: Record<string, string> = {
    "magic-morph": "Magic Morph",
    "remove-replace": "Remove & Replace",
    "style-transfer": "Style Transfer",
    "background-replace": "Background Replace",
    "object-recolor": "Object Recolor",
    "text2image": "Text2Image Add",
    "ai-enhance": "AI Enhance",
    "vip-magic": "VIP Magic Morph"
  };
  return titles[service] || service;
}

function getPlaceholderForService(service: string): string {
  const placeholders: Record<string, string> = {
    "magic-morph": "Transform anything without limits... (e.g., 'Change this person into a superhero', 'Turn the building into a castle')",
    "remove-replace": "Describe what to remove and what to replace it with... (e.g., 'Remove the car and replace with flowers')",
    "style-transfer": "Choose an artistic style... (e.g., 'Make it look like anime', 'Van Gogh painting style', '3D render')",
    "background-replace": "Describe the new background... (e.g., 'Starry night sky', 'Beach sunset', 'Futuristic city')",
    "object-recolor": "Describe the color change... (e.g., 'Change the car to metallic blue', 'Make the shirt bright red')",
    "text2image": "Describe what to add... (e.g., 'Add a flying dragon in the sky', 'Add a sports car in the driveway')",
    "ai-enhance": "Describe enhancement needs... (e.g., 'Enhance to 4K quality', 'Sharpen details and improve lighting')",
    "vip-magic": "Ultimate transformation command... (unlimited creativity, complex multi-step edits, professional results)"
  };
  return placeholders[service] || "Describe your transformation...";
}
