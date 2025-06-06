import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { NeuralBackground } from "@/components/NeuralBackground";

export default function About() {
  const { t, currentLanguage, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <NeuralBackground />
      
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
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
          </Link>
          
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
            <Link href="/">
              <Button variant="outline" size="sm" className="glass border-purple-400/30 hover:bg-purple-400/10">
                <i className="fas fa-arrow-left mr-2"></i>
                {t("Back to App")}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <i className="fas fa-info-circle text-6xl text-cyan-400 mb-6 animate-pulse-glow"></i>
            <h2 className="text-4xl font-bold neon-text text-cyan-400 mb-4">
              {t("About KNOUX VERSA")}
            </h2>
            <p className="text-xl text-gray-300">
              {t("Revolutionary AI-powered image transformation platform")}
            </p>
          </div>

          {/* Developer Section */}
          <Card className="glass-strong rounded-2xl p-8 mb-8 animate-float">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 p-1 mx-auto mb-4">
                <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                  <i className="fas fa-user-astronaut text-3xl text-cyan-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-cyan-400 neon-text mb-2">
                {t("Developer: Sadek Elgazar (KNOUX)")}
              </h3>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed">
                {t("AI Engineer and modern software developer with authentic Arabic flavor. Creator of advanced systems, automation enthusiast, and programming artist who leaves his mark on every project.")}
              </p>
              <p className="text-md">
                {t("From Abu Dhabi, UAE — to the whole world, with an entrepreneurial spirit that combines precision, creativity, and brand luxury!")}
              </p>
            </div>
          </Card>

          {/* Project Description */}
          <Card className="glass-strong rounded-2xl p-8 mb-8 animate-float" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-2xl font-bold text-purple-400 neon-text mb-4">
              {t("What is KNOUX VERSA?")}
            </h3>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed">
                <strong className="text-purple-400">KNOUX VERSA</strong> {" "}
                {t("is an advanced AI platform that automatically edits your images with text commands, without limits or restrictions — 'Select, Write, Be Amazed!'")}
              </p>
              <p>
                {t("It uses the latest AI technologies (Image Generation/Transformation), and a futuristic luxury user interface that supports Arabic and English.")}
              </p>
            </div>
          </Card>

          {/* Features */}
          <Card className="glass-strong rounded-2xl p-8 mb-8 animate-float" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-2xl font-bold text-green-400 neon-text mb-6">
              {t("Why KNOUX VERSA?")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-rocket text-cyan-400 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-cyan-400">{t("Fastest & Strongest")}</h4>
                    <p className="text-gray-300 text-sm">{t("Edit images in moments without needing Photoshop or Adobe expertise.")}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <i className="fas fa-brain text-purple-400 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-purple-400">{t("AI that speaks your language")}</h4>
                    <p className="text-gray-300 text-sm">{t("Arabic and English, human text commands, and easy integration.")}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-shield-alt text-green-400 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-green-400">{t("Uncompromising privacy")}</h4>
                    <p className="text-gray-300 text-sm">{t("Everything happens on your device, or on encrypted and secure servers.")}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <i className="fas fa-palette text-yellow-400 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-yellow-400">{t("Modern interface")}</h4>
                    <p className="text-gray-300 text-sm">{t("Glass/neon design (Glassmorphism + Neon), full support for all devices.")}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Exclusive Features */}
          <Card className="glass-strong rounded-2xl p-8 mb-8 animate-float border-yellow-500/50 vip-exclusive" style={{ animationDelay: "0.6s" }}>
            <h3 className="text-2xl font-bold text-yellow-400 neon-text mb-6">
              {t("Exclusive Features")}
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <i className="fas fa-magic text-cyan-400 mt-1"></i>
                <p>{t("Edit clothes, backgrounds, elements... with just a text command!")}</p>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-eye text-purple-400 mt-1"></i>
                <p>{t("Instant preview and save in Ultra HD quality.")}</p>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-language text-green-400 mt-1"></i>
                <p>{t("Bilingual support with simplified explanations for beginners.")}</p>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-crown text-yellow-400 mt-1"></i>
                <p>
                  <strong className="text-yellow-400">{t("VIP Premium Service (Magic Morph):")}</strong> {" "}
                  {t("Sequential commands with creative results — available only to the project owner (Sadek Elgazar)!")}
                </p>
              </div>
            </div>
          </Card>

          {/* Developer Signature */}
          <Card className="glass-strong rounded-2xl p-8 text-center animate-float" style={{ animationDelay: "0.8s" }}>
            <div className="border-l-4 border-cyan-400 pl-6 text-left max-w-2xl mx-auto">
              <p className="text-lg italic text-gray-300 mb-4">
                "{t("Crafted with creativity by Sadek Elgazar")}<br />
                {t("© 2025 KNOUX VERSA — Where imagination meets artificial intelligence.")}"
              </p>
              <div className="flex items-center justify-between">
                <div className="text-cyan-400 font-bold">
                  - Sadek Elgazar (KNOUX)
                </div>
                <div className="text-sm text-gray-400">
                  Abu Dhabi, UAE 🇦🇪
                </div>
              </div>
            </div>
          </Card>

          {/* Back to App */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button className="transform-button px-8 py-4 text-lg font-bold rounded-xl">
                <i className="fas fa-arrow-left mr-3"></i>
                {t("Back to Transform Images")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
