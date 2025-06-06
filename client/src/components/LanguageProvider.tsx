import { createContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  currentLanguage: "en" | "ar";
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation & Header
    "The Uncensored AI Nexus": "The Uncensored AI Nexus",
    "About": "About",
    "Back to App": "Back to App",
    
    // Hero Section
    "Transform Images with AI Magic": "Transform Images with AI Magic",
    "Select any area, write any command, and watch AI transform your vision into reality - without limits, without censorship.": "Select any area, write any command, and watch AI transform your vision into reality - without limits, without censorship.",
    
    // Services
    "Magic Morph": "Magic Morph",
    "Select & transform anything with unlimited AI power": "Select & transform anything with unlimited AI power",
    "Uncensored": "Uncensored",
    "Remove & Replace": "Remove & Replace",
    "Erase objects and fill with intelligent context": "Erase objects and fill with intelligent context",
    "Style Transfer": "Style Transfer",
    "Transform to any artistic style (Anime, 3D, Van Gogh...)": "Transform to any artistic style (Anime, 3D, Van Gogh...)",
    "Background Replace": "Background Replace",
    "Generate or replace backgrounds with AI": "Generate or replace backgrounds with AI",
    "Object Recolor": "Object Recolor",
    "Change colors of any object intelligently": "Change colors of any object intelligently",
    "Text2Image Add": "Text2Image Add",
    "Add new objects with text descriptions": "Add new objects with text descriptions",
    "AI Enhance": "AI Enhance",
    "Upscale and enhance to Ultra HD quality": "Upscale and enhance to Ultra HD quality",
    "VIP Magic Morph": "VIP Magic Morph",
    "Ultra-advanced AI for complex transformations (Owner Only)": "Ultra-advanced AI for complex transformations (Owner Only)",
    "Sadek Elgazar Exclusive": "Sadek Elgazar Exclusive",
    
    // Image Upload
    "Upload & Select Area": "Upload & Select Area",
    "Drop your image here or click to upload": "Drop your image here or click to upload",
    "Supports JPG, PNG, WebP - Max 10MB": "Supports JPG, PNG, WebP - Max 10MB",
    "Choose Image": "Choose Image",
    "Uploading...": "Uploading...",
    "Please upload a valid image file.": "Please upload a valid image file.",
    "File size must be less than 10MB.": "File size must be less than 10MB.",
    "Failed to upload image. Please try again.": "Failed to upload image. Please try again.",
    
    // Selection Tools
    "Brush Select": "Brush Select",
    "Rectangle": "Rectangle",
    "Clear": "Clear",
    "New Image": "New Image",
    
    // AI Command Center
    "AI Command Center": "AI Command Center",
    "Selected Service": "Selected Service",
    "Output Quality": "Output Quality",
    "Standard (Fast)": "Standard (Fast)",
    "High Quality": "High Quality",
    "Ultra HD (Slow)": "Ultra HD (Slow)",
    "AI Command (The Prompt Nexus)": "AI Command (The Prompt Nexus)",
    "AI Suggestions": "AI Suggestions",
    "🚀 Start AI Transformation": "🚀 Start AI Transformation",
    "Processing...": "Processing...",
    "VIP Exclusive Service - Requires special access key": "VIP Exclusive Service - Requires special access key",
    
    // Processing
    "AI Processing...": "AI Processing...",
    "Analyzing your image...": "Analyzing your image...",
    "Understanding AI command...": "Understanding AI command...",
    "Generating transformation...": "Generating transformation...",
    "Applying AI magic...": "Applying AI magic...",
    "Enhancing details...": "Enhancing details...",
    "Finalizing results...": "Finalizing results...",
    
    // Results
    "AI Transformation Results": "AI Transformation Results",
    "Before": "Before",
    "After": "After",
    "Drag to compare": "Drag to compare",
    "Download Result": "Download Result",
    "Download Original": "Download Original",
    "Share": "Share",
    "New Transform": "New Transform",
    "Transformation completed successfully • No watermarks • Full quality preserved": "Transformation completed successfully • No watermarks • Full quality preserved",
    "Link copied to clipboard!": "Link copied to clipboard!",
    
    // VIP Modal
    "VIP Exclusive Service": "VIP Exclusive Service",
    "This service is exclusive to the owner: Sadek Elgazar, and requires a VIP key.": "This service is exclusive to the owner: Sadek Elgazar, and requires a VIP key.",
    "Enter VIP Key...": "Enter VIP Key...",
    "Please enter a VIP key": "Please enter a VIP key",
    "Invalid VIP key": "Invalid VIP key",
    "Authentication failed. Please try again.": "Authentication failed. Please try again.",
    "Access VIP": "Access VIP",
    "Cancel": "Cancel",
    "Verifying...": "Verifying...",
    "VIP Magic Morph Features": "VIP Magic Morph Features",
    "Unlimited transformation complexity": "Unlimited transformation complexity",
    "Sequential command processing": "Sequential command processing",
    "Ultra-premium quality output": "Ultra-premium quality output",
    "Priority processing queue": "Priority processing queue",
    "Exclusive Sadek Elgazar signature option": "Exclusive Sadek Elgazar signature option",
    "This service is exclusively reserved for the project owner: Sadek Elgazar": "This service is exclusively reserved for the project owner: Sadek Elgazar",
    
    // Error States
    "Transformation Failed": "Transformation Failed",
    "Try Again": "Try Again",
    
    // About Page
    "About KNOUX VERSA": "About KNOUX VERSA",
    "Revolutionary AI-powered image transformation platform": "Revolutionary AI-powered image transformation platform",
    "Developer: Sadek Elgazar (KNOUX)": "Developer: Sadek Elgazar (KNOUX)",
    "AI Engineer and modern software developer with authentic Arabic flavor. Creator of advanced systems, automation enthusiast, and programming artist who leaves his mark on every project.": "AI Engineer and modern software developer with authentic Arabic flavor. Creator of advanced systems, automation enthusiast, and programming artist who leaves his mark on every project.",
    "From Abu Dhabi, UAE — to the whole world, with an entrepreneurial spirit that combines precision, creativity, and brand luxury!": "From Abu Dhabi, UAE — to the whole world, with an entrepreneurial spirit that combines precision, creativity, and brand luxury!",
    "What is KNOUX VERSA?": "What is KNOUX VERSA?",
    "is an advanced AI platform that automatically edits your images with text commands, without limits or restrictions — 'Select, Write, Be Amazed!'": "is an advanced AI platform that automatically edits your images with text commands, without limits or restrictions — 'Select, Write, Be Amazed!'",
    "It uses the latest AI technologies (Image Generation/Transformation), and a futuristic luxury user interface that supports Arabic and English.": "It uses the latest AI technologies (Image Generation/Transformation), and a futuristic luxury user interface that supports Arabic and English.",
    "Why KNOUX VERSA?": "Why KNOUX VERSA?",
    "Fastest & Strongest": "Fastest & Strongest",
    "Edit images in moments without needing Photoshop or Adobe expertise.": "Edit images in moments without needing Photoshop or Adobe expertise.",
    "AI that speaks your language": "AI that speaks your language",
    "Arabic and English, human text commands, and easy integration.": "Arabic and English, human text commands, and easy integration.",
    "Uncompromising privacy": "Uncompromising privacy",
    "Everything happens on your device, or on encrypted and secure servers.": "Everything happens on your device, or on encrypted and secure servers.",
    "Modern interface": "Modern interface",
    "Glass/neon design (Glassmorphism + Neon), full support for all devices.": "Glass/neon design (Glassmorphism + Neon), full support for all devices.",
    "Exclusive Features": "Exclusive Features",
    "Edit clothes, backgrounds, elements... with just a text command!": "Edit clothes, backgrounds, elements... with just a text command!",
    "Instant preview and save in Ultra HD quality.": "Instant preview and save in Ultra HD quality.",
    "Bilingual support with simplified explanations for beginners.": "Bilingual support with simplified explanations for beginners.",
    "VIP Premium Service (Magic Morph):": "VIP Premium Service (Magic Morph):",
    "Sequential commands with creative results — available only to the project owner (Sadek Elgazar)!": "Sequential commands with creative results — available only to the project owner (Sadek Elgazar)!",
    "Back to Transform Images": "Back to Transform Images",
    
    // Footer
    "Crafted with creativity by": "Crafted with creativity by",
    "© 2025 KNOUX VERSA — Where imagination meets artificial intelligence.": "© 2025 KNOUX VERSA — Where imagination meets artificial intelligence.",
    "Support the creator on": "Support the creator on"
  },
  ar: {
    // Navigation & Header  
    "The Uncensored AI Nexus": "مركز الذكاء الاصطناعي بلا قيود",
    "About": "حول",
    "Back to App": "العودة للتطبيق",
    
    // Hero Section
    "Transform Images with AI Magic": "حوّل الصور بسحر الذكاء الاصطناعي",
    "Select any area, write any command, and watch AI transform your vision into reality - without limits, without censorship.": "ظلّل أي منطقة، اكتب أي أمر، وشاهد الذكاء الاصطناعي يحوّل رؤيتك إلى واقع - بلا حدود، بلا قيود.",
    
    // Services
    "Magic Morph": "التحويل السحري",
    "Select & transform anything with unlimited AI power": "ظلّل وحوّل أي شيء بقوة الذكاء الاصطناعي اللامحدودة",
    "Uncensored": "بلا قيود",
    "Remove & Replace": "إزالة واستبدال",
    "Erase objects and fill with intelligent context": "امحي العناصر واملأ المنطقة بذكاء سياقي",
    "Style Transfer": "تحويل الأسلوب",
    "Transform to any artistic style (Anime, 3D, Van Gogh...)": "حوّل لأي ستايل فني (أنمي، ثلاثي الأبعاد، فان جوخ...)",
    "Background Replace": "تغيير الخلفية",
    "Generate or replace backgrounds with AI": "ولّد أو استبدل الخلفيات بالذكاء الاصطناعي",
    "Object Recolor": "إعادة تلوين العناصر",
    "Change colors of any object intelligently": "غيّر ألوان أي عنصر بذكاء",
    "Text2Image Add": "إضافة نص لصورة",
    "Add new objects with text descriptions": "أضف عناصر جديدة بالوصف النصي",
    "AI Enhance": "تحسين ذكي",
    "Upscale and enhance to Ultra HD quality": "كبّر وحسّن لجودة فائقة الوضوح",
    "VIP Magic Morph": "التحويل السحري VIP",
    "Ultra-advanced AI for complex transformations (Owner Only)": "ذكاء اصطناعي فائق للتحولات المعقدة (المالك فقط)",
    "Sadek Elgazar Exclusive": "حصري لصادق الجزار",
    
    // Image Upload
    "Upload & Select Area": "ارفع واختر المنطقة",
    "Drop your image here or click to upload": "اسحب صورتك هنا أو اضغط للرفع",
    "Supports JPG, PNG, WebP - Max 10MB": "يدعم JPG, PNG, WebP - حد أقصى 10 ميجا",
    "Choose Image": "اختر صورة",
    "Uploading...": "جاري الرفع...",
    "Please upload a valid image file.": "يرجى رفع ملف صورة صحيح.",
    "File size must be less than 10MB.": "يجب أن يكون حجم الملف أقل من 10 ميجا.",
    "Failed to upload image. Please try again.": "فشل رفع الصورة. يرجى المحاولة مرة أخرى.",
    
    // Selection Tools
    "Brush Select": "فرشاة التحديد",
    "Rectangle": "مستطيل",
    "Clear": "مسح",
    "New Image": "صورة جديدة",
    
    // AI Command Center
    "AI Command Center": "مركز أوامر الذكاء الاصطناعي",
    "Selected Service": "الخدمة المختارة",
    "Output Quality": "جودة المخرجات",
    "Standard (Fast)": "عادية (سريعة)",
    "High Quality": "جودة عالية",
    "Ultra HD (Slow)": "فائقة الوضوح (بطيئة)",
    "AI Command (The Prompt Nexus)": "أمر الذكاء الاصطناعي (مركز الأوامر)",
    "AI Suggestions": "اقتراحات الذكاء الاصطناعي",
    "🚀 Start AI Transformation": "🚀 ابدأ التحويل الذكي",
    "Processing...": "معالجة...",
    "VIP Exclusive Service - Requires special access key": "خدمة VIP حصرية - تتطلب مفتاح وصول خاص",
    
    // Processing
    "AI Processing...": "معالجة ذكية...",
    "Analyzing your image...": "تحليل صورتك...",
    "Understanding AI command...": "فهم أمر الذكاء الاصطناعي...",
    "Generating transformation...": "توليد التحويل...",
    "Applying AI magic...": "تطبيق السحر الذكي...",
    "Enhancing details...": "تحسين التفاصيل...",
    "Finalizing results...": "وضع اللمسات الأخيرة...",
    
    // Results
    "AI Transformation Results": "نتائج التحويل الذكي",
    "Before": "قبل",
    "After": "بعد",
    "Drag to compare": "اسحب للمقارنة",
    "Download Result": "تحميل النتيجة",
    "Download Original": "تحميل الأصلي",
    "Share": "مشاركة",
    "New Transform": "تحويل جديد",
    "Transformation completed successfully • No watermarks • Full quality preserved": "تم التحويل بنجاح • بلا علامات مائية • جودة كاملة محفوظة",
    "Link copied to clipboard!": "تم نسخ الرابط!",
    
    // VIP Modal
    "VIP Exclusive Service": "خدمة VIP حصرية",
    "This service is exclusive to the owner: Sadek Elgazar, and requires a VIP key.": "هذه الخدمة حصرية للمالك: صادق الجزار، وتتطلب مفتاح VIP.",
    "Enter VIP Key...": "أدخل مفتاح VIP...",
    "Please enter a VIP key": "يرجى إدخال مفتاح VIP",
    "Invalid VIP key": "مفتاح VIP غير صحيح",
    "Authentication failed. Please try again.": "فشل التحقق. يرجى المحاولة مرة أخرى.",
    "Access VIP": "دخول VIP",
    "Cancel": "إلغاء",
    "Verifying...": "جاري التحقق...",
    "VIP Magic Morph Features": "ميزات التحويل السحري VIP",
    "Unlimited transformation complexity": "تعقيد تحويل لامحدود",
    "Sequential command processing": "معالجة أوامر متسلسلة",
    "Ultra-premium quality output": "مخرجات فائقة الجودة",
    "Priority processing queue": "أولوية في طابور المعالجة",
    "Exclusive Sadek Elgazar signature option": "خيار توقيع صادق الجزار الحصري",
    "This service is exclusively reserved for the project owner: Sadek Elgazar": "هذه الخدمة محفوظة حصرياً لمالك المشروع: صادق الجزار",
    
    // Error States
    "Transformation Failed": "فشل التحويل",
    "Try Again": "حاول مرة أخرى",
    
    // About Page
    "About KNOUX VERSA": "حول KNOUX VERSA",
    "Revolutionary AI-powered image transformation platform": "منصة ثورية لتحويل الصور بالذكاء الاصطناعي",
    "Developer: Sadek Elgazar (KNOUX)": "المطور: صادق الجزار (KNOUX)",
    "AI Engineer and modern software developer with authentic Arabic flavor. Creator of advanced systems, automation enthusiast, and programming artist who leaves his mark on every project.": "مهندس ذكاء اصطناعي ومطور برمجيات عصري بنكهة عربية أصلية. صانع الأنظمة المتطورة، العاشق للأتمتة، وفنان البرمجة الذي يضع بصمته في كل مشروع.",
    "From Abu Dhabi, UAE — to the whole world, with an entrepreneurial spirit that combines precision, creativity, and brand luxury!": "من أبوظبي، الإمارات — إلى العالم كله، بروح ريادية تجمع بين الدقة، الإبداع، وفخامة البراند!",
    "What is KNOUX VERSA?": "ما هو KNOUX VERSA؟",
    "is an advanced AI platform that automatically edits your images with text commands, without limits or restrictions — 'Select, Write, Be Amazed!'": "منصة ذكاء صناعي متقدمة تعدّل صورك أوتوماتيكياً بأوامر نصية، بدون حدود أو قيود — 'ظلّل، اكتب، انبهر!'",
    "It uses the latest AI technologies (Image Generation/Transformation), and a futuristic luxury user interface that supports Arabic and English.": "يستخدم أحدث تقنيات الذكاء الاصطناعي (توليد/تحويل الصور)، وواجهة مستخدم مستقبلية فاخرة تدعم العربية والإنجليزية.",
    "Why KNOUX VERSA?": "لماذا KNOUX VERSA؟",
    "Fastest & Strongest": "الأسرع والأقوى",
    "Edit images in moments without needing Photoshop or Adobe expertise.": "عدّل الصور في لحظات بدون الحاجة لخبرة فوتوشوب أو أدوبي.",
    "AI that speaks your language": "ذكاء اصطناعي يتكلم لغتك",
    "Arabic and English, human text commands, and easy integration.": "عربي وإنجليزي، أوامر نصية بشرية، وتكامل سهل.",
    "Uncompromising privacy": "خصوصية لا مساومة فيها",
    "Everything happens on your device, or on encrypted and secure servers.": "كل شيء يتم عندك، أو على خوادم مشفّرة وآمنة.",
    "Modern interface": "واجهة عصرية",
    "Glass/neon design (Glassmorphism + Neon), full support for all devices.": "تصميم زجاجي/نيون (Glassmorphism + Neon)، دعم كامل لكل الأجهزة.",
    "Exclusive Features": "ميزات حصرية",
    "Edit clothes, backgrounds, elements... with just a text command!": "عدّل ملابس، خلفيات، عناصر... بأمر نصي فقط!",
    "Instant preview and save in Ultra HD quality.": "معاينة فورية وحفظ بجودة Ultra HD.",
    "Bilingual support with simplified explanations for beginners.": "دعم لغتين وشرح مبسط للمبتدئين.",
    "VIP Premium Service (Magic Morph):": "خدمة بريميوم VIP (Magic Morph):",
    "Sequential commands with creative results — available only to the project owner (Sadek Elgazar)!": "أوامر متسلسلة مع نتائج إبداعية — متاحة فقط لصاحب المشروع (صادق الجزار)!",
    "Back to Transform Images": "العودة لتحويل الصور",
    
    // Footer
    "Crafted with creativity by": "صُنع بإبداع بواسطة",
    "© 2025 KNOUX VERSA — Where imagination meets artificial intelligence.": "© 2025 KNOUX VERSA — حيث يلتقي الخيال بالذكاء الاصطناعي.",
    "Support the creator on": "ادعم المطور على"
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ar">("en");

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("knoux-versa-language");
    if (savedLanguage === "ar" || savedLanguage === "en") {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Update document direction and save preference
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
    localStorage.setItem("knoux-versa-language", currentLanguage);
  }, [currentLanguage]);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === "en" ? "ar" : "en");
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageContext };
