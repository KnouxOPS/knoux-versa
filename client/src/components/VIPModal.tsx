import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";

interface VIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVIPAccess: (sessionKey: string) => void;
}

export function VIPModal({ isOpen, onClose, onVIPAccess }: VIPModalProps) {
  const { t } = useLanguage();
  const [vipKey, setVipKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleVIPSubmit = async () => {
    if (!vipKey.trim()) {
      setError(t("Please enter a VIP key"));
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await apiRequest("POST", "/api/vip/authenticate", { vipKey });
      const result = await response.json();
      
      if (result.success) {
        onVIPAccess(result.sessionKey);
        setVipKey("");
        setError("");
      } else {
        setError(result.error || t("Invalid VIP key"));
      }
    } catch (error) {
      console.error("VIP authentication failed:", error);
      setError(t("Authentication failed. Please try again."));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setVipKey("");
    setError("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVIPSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="glass-strong rounded-2xl p-8 max-w-md mx-4 border-yellow-500/50 relative overflow-hidden">
        
        {/* VIP Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-amber-500/5 pointer-events-none"></div>
        
        <div className="relative text-center">
          {/* VIP Crown Icon */}
          <div className="mb-6">
            <i className="fas fa-crown text-6xl text-yellow-400 animate-pulse-glow"></i>
          </div>

          {/* VIP Title */}
          <h3 className="text-2xl font-bold mb-4 text-yellow-400 neon-text">
            {t("VIP Exclusive Service")}
          </h3>

          {/* VIP Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {t("This service is exclusive to the owner: Sadek Elgazar, and requires a VIP key.")}
          </p>

          {/* VIP Key Input */}
          <div className="space-y-4">
            <Input
              type="password"
              value={vipKey}
              onChange={(e) => setVipKey(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("Enter VIP Key...")}
              className="glass bg-black/30 border-yellow-400/50 focus:border-yellow-400 text-white placeholder-gray-400"
              disabled={isVerifying}
            />

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                <p className="text-sm text-red-300">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleVIPSubmit}
                disabled={isVerifying || !vipKey.trim()}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold"
              >
                {isVerifying ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2 border-black"></div>
                    {t("Verifying...")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-key mr-2"></i>
                    {t("Access VIP")}
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 glass border-gray-400/30 hover:bg-gray-400/10"
                disabled={isVerifying}
              >
                {t("Cancel")}
              </Button>
            </div>
          </div>

          {/* VIP Information */}
          <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <h4 className="font-semibold text-yellow-400 mb-2">
              <i className="fas fa-star mr-2"></i>
              {t("VIP Magic Morph Features")}:
            </h4>
            <ul className="text-sm text-gray-300 space-y-1 text-left">
              <li>• {t("Unlimited transformation complexity")}</li>
              <li>• {t("Sequential command processing")}</li>
              <li>• {t("Ultra-premium quality output")}</li>
              <li>• {t("Priority processing queue")}</li>
              <li>• {t("Exclusive Sadek Elgazar signature option")}</li>
            </ul>
          </div>

          {/* Owner Notice */}
          <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
            <p className="text-xs text-red-300">
              <i className="fas fa-shield-alt mr-1"></i>
              {t("This service is exclusively reserved for the project owner: Sadek Elgazar")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
