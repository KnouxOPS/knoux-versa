import { useState } from "react";
import { NeuralBackground } from "@/components/NeuralBackground";
import { ImageCanvas } from "@/components/ImageCanvas";
import { ServiceSelector } from "@/components/ServiceSelector";
import { PromptNexus } from "@/components/PromptNexus";
import { ProcessingModal } from "@/components/ProcessingModal";
import { ResultsComparison } from "@/components/ResultsComparison";
import { VIPModal } from "@/components/VIPModal";
import { useLanguage } from "@/hooks/useLanguage";
import { useImageTransform } from "@/hooks/useImageTransform";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  const { t, currentLanguage, toggleLanguage } = useLanguage();
  const [selectedService, setSelectedService] = useState("magic-morph");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectionData, setSelectionData] = useState<string | null>(null);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [vipSession, setVipSession] = useState<string | null>(null);
  
  const {
    transform,
    isProcessing,
    result,
    progress,
    processingMessage,
    error,
    reset
  } = useImageTransform();

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    reset(); // Clear any previous results
  };

  const handleSelectionChange = (selection: string) => {
    setSelectionData(selection);
  };

  const handleTransform = async (prompt: string, quality: string) => {
    if (!uploadedImage || !prompt.trim()) {
      return;
    }

    const isVIP = selectedService === "vip-magic";
    if (isVIP && !vipSession) {
      setShowVIPModal(true);
      return;
    }

    await transform({
      originalImageUrl: uploadedImage,
      prompt,
      service: selectedService,
      selectionData,
      quality,
      isVIP,
      vipSession
    });
  };

  const handleVIPAccess = (sessionKey: string) => {
    setVipSession(sessionKey);
    setShowVIPModal(false);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <NeuralBackground />
      
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 animate-pulse-glow">
              <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-cyan-400 neon-text">K</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold neon-text text-cyan-400">KNOUX VERSA</h1>
              <p className="text-xs text-gray-400">{t("The Uncensored AI Nexus")}</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLanguage}
              className="glass border-cyan-400/30 hover:bg-cyan-400/10"
            >
              <i className="fas fa-globe mr-2"></i>
              {currentLanguage === "en" ? "العربية" : "English"}
            </Button>
            <Link href="/about">
              <Button variant="outline" size="sm" className="glass border-purple-400/30 hover:bg-purple-400/10">
                <i className="fas fa-info-circle mr-2"></i>
                {t("About")}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-responsive-xl font-bold mb-4 neon-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 animate-float">
              {t("Transform Images with AI Magic")}
            </h2>
            <p className="text-responsive-md text-gray-300 max-w-3xl mx-auto">
              {t("Select any area, write any command, and watch AI transform your vision into reality - without limits, without censorship.")}
            </p>
          </div>

          {/* Services Grid */}
          <ServiceSelector 
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            onVIPRequest={() => setShowVIPModal(true)}
          />

          {/* Main Workspace */}
          <Card className="glass-strong rounded-3xl p-8 mb-12 animate-float" style={{ animationDelay: "0.4s" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Image Upload & Selection */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold neon-text text-cyan-400">
                  {t("Upload & Select Area")}
                </h3>
                
                <ImageCanvas 
                  onImageUpload={handleImageUpload}
                  onSelectionChange={handleSelectionChange}
                  uploadedImage={uploadedImage}
                />
              </div>

              {/* AI Command Center */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold neon-text text-purple-400">
                  {t("AI Command Center")}
                </h3>
                
                <PromptNexus 
                  selectedService={selectedService}
                  onTransform={handleTransform}
                  disabled={!uploadedImage || isProcessing}
                />
              </div>
            </div>
          </Card>

          {/* Results Section */}
          {result && (
            <ResultsComparison 
              originalImage={uploadedImage!}
              transformedImage={result.transformedImageUrl}
              onNewTransform={reset}
            />
          )}

          {/* Error Display */}
          {error && (
            <Card className="glass rounded-2xl p-6 mb-12 border-red-500/50 error-glow">
              <div className="text-center text-red-400">
                <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <h3 className="text-xl font-bold mb-2">{t("Transformation Failed")}</h3>
                <p>{error}</p>
                <Button 
                  onClick={reset}
                  className="mt-4 bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                >
                  {t("Try Again")}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass mt-12 p-6">
        <div className="container mx-auto text-center">
          <div style={{ fontSize: "1.1em", color: "#999", marginTop: "24px" }}>
            <span>{t("Crafted with creativity by")}</span>{" "}
            <b style={{ color: "#00FFFF" }}>Sadek Elgazar</b> | © 2025 KNOUX VERSA.<br/>
            <span style={{ fontSize: "0.9em", color: "#88f" }}>
              {t("Support the creator on")}{" "}
              <a 
                href="https://buymeacoffee.com/knoux" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "#a8f" }}
                className="hover:text-yellow-300 transition-colors"
              >
                BuyMeACoffee
              </a> ✨
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProcessingModal 
        isOpen={isProcessing}
        progress={progress}
        message={processingMessage}
      />

      <VIPModal 
        isOpen={showVIPModal}
        onClose={() => setShowVIPModal(false)}
        onVIPAccess={handleVIPAccess}
      />
    </div>
  );
}
