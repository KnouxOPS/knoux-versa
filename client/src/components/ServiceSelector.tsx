import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

interface ServiceSelectorProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
  onVIPRequest: () => void;
}

const services = [
  {
    id: "magic-morph",
    icon: "fas fa-magic",
    color: "text-cyan-400",
    bgColor: "from-cyan-400/20 to-blue-500/20",
    titleKey: "Magic Morph",
    descKey: "Select & transform anything with unlimited AI power",
    badge: "Uncensored"
  },
  {
    id: "remove-replace",
    icon: "fas fa-eraser",
    color: "text-purple-400",
    bgColor: "from-purple-400/20 to-pink-500/20",
    titleKey: "Remove & Replace",
    descKey: "Erase objects and fill with intelligent context"
  },
  {
    id: "style-transfer",
    icon: "fas fa-palette",
    color: "text-pink-400",
    bgColor: "from-pink-400/20 to-red-500/20",
    titleKey: "Style Transfer",
    descKey: "Transform to any artistic style (Anime, 3D, Van Gogh...)"
  },
  {
    id: "background-replace",
    icon: "fas fa-image",
    color: "text-green-400",
    bgColor: "from-green-400/20 to-emerald-500/20",
    titleKey: "Background Replace",
    descKey: "Generate or replace backgrounds with AI"
  },
  {
    id: "object-recolor",
    icon: "fas fa-paint-brush",
    color: "text-yellow-400",
    bgColor: "from-yellow-400/20 to-orange-500/20",
    titleKey: "Object Recolor",
    descKey: "Change colors of any object intelligently"
  },
  {
    id: "text2image",
    icon: "fas fa-plus-circle",
    color: "text-orange-400",
    bgColor: "from-orange-400/20 to-red-500/20",
    titleKey: "Text2Image Add",
    descKey: "Add new objects with text descriptions"
  },
  {
    id: "ai-enhance",
    icon: "fas fa-sparkles",
    color: "text-emerald-400",
    bgColor: "from-emerald-400/20 to-green-500/20",
    titleKey: "AI Enhance",
    descKey: "Upscale and enhance to Ultra HD quality"
  },
  {
    id: "vip-magic",
    icon: "fas fa-crown",
    color: "text-yellow-400",
    bgColor: "from-yellow-400/20 to-amber-500/20",
    titleKey: "VIP Magic Morph",
    descKey: "Ultra-advanced AI for complex transformations (Owner Only)",
    isVIP: true,
    badge: "Sadek Elgazar Exclusive"
  }
];

export function ServiceSelector({ selectedService, onServiceSelect, onVIPRequest }: ServiceSelectorProps) {
  const { t } = useLanguage();

  const handleServiceClick = (serviceId: string, isVIP?: boolean) => {
    if (isVIP) {
      onVIPRequest();
    } else {
      onServiceSelect(serviceId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {services.map((service, index) => (
        <Card
          key={service.id}
          className={`
            service-card glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl animate-float
            ${selectedService === service.id ? "border-cyan-400 bg-cyan-400/10 neon-glow" : "hover:border-cyan-400/50"}
            ${service.isVIP ? "vip-exclusive border-yellow-500/50" : ""}
          `}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => handleServiceClick(service.id, service.isVIP)}
        >
          {/* Service Icon */}
          <div className={`w-16 h-16 rounded-lg mb-4 bg-gradient-to-br ${service.bgColor} flex items-center justify-center`}>
            <i className={`${service.icon} text-2xl ${service.color}`}></i>
          </div>

          {/* Service Title */}
          <h3 className={`text-xl font-bold mb-2 ${service.color} neon-text`}>
            {t(service.titleKey)}
          </h3>

          {/* Service Description */}
          <p className="text-gray-300 text-sm mb-4">
            {t(service.descKey)}
          </p>

          {/* Service Badge */}
          {service.badge && (
            <div className={`flex items-center ${service.isVIP ? 'text-yellow-400' : 'text-green-400'}`}>
              <i className={`${service.isVIP ? 'fas fa-crown' : 'fas fa-check-circle'} mr-2`}></i>
              <span className="text-xs font-semibold">{t(service.badge)}</span>
            </div>
          )}

          {/* Active Indicator */}
          {selectedService === service.id && (
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse-glow"></div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
