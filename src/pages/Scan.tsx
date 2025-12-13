import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  Recycle, 
  Leaf, 
  Scale,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  wasteType: string;
  confidence: number;
  description: string;
  recyclable: boolean;
  estimatedWeight: string;
  tips: string[];
  environmentalImpact: string;
}

const wasteTypeIcons: Record<string, string> = {
  plastics: "🧴",
  "e-waste": "📱",
  metals: "🔧",
  organic: "🍂",
  "sea-waste": "🌊",
  paper: "📄",
  glass: "🫙",
  textiles: "👕",
  mixed: "🗑️",
  unknown: "❓",
};

const wasteTypeColors: Record<string, string> = {
  plastics: "from-blue-500 to-blue-600",
  "e-waste": "from-amber-500 to-orange-600",
  metals: "from-slate-500 to-slate-600",
  organic: "from-green-500 to-emerald-600",
  "sea-waste": "from-cyan-500 to-teal-600",
  paper: "from-yellow-500 to-amber-500",
  glass: "from-purple-500 to-violet-600",
  textiles: "from-pink-500 to-rose-600",
  mixed: "from-gray-500 to-gray-600",
  unknown: "from-gray-400 to-gray-500",
};

const Scan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setImagePreview(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWaste = async () => {
    if (!imagePreview) return;

    setAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-waste", {
        body: { imageBase64: imagePreview },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Identified: ${data.wasteType}`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resetScan = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSchedulePickup = () => {
    if (result) {
      navigate("/booking", { state: { wasteType: result.wasteType } });
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="gradient-hero px-4 pt-4 pb-8 safe-top">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary-foreground"
        >
          Scan Waste
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-foreground/80 text-sm mt-1"
        >
          AI-powered waste identification
        </motion.p>
      </header>

      <div className="px-4 -mt-4 pb-6">
        <AnimatePresence mode="wait">
          {/* Camera View */}
          {showCamera && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl overflow-hidden shadow-card"
            >
              <div className="relative aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-primary/50 rounded-lg m-8 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </div>
              </div>
              <div className="p-4 flex gap-3">
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-medium flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
                >
                  <Camera size={20} />
                  Capture
                </button>
              </div>
            </motion.div>
          )}

          {/* Upload/Preview Area */}
          {!showCamera && !result && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden"
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <button
                    onClick={resetScan}
                    className="absolute top-3 right-3 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                  >
                    <X size={20} className="text-foreground" />
                  </button>
                </div>
              ) : (
                <div className="aspect-[4/3] flex flex-col items-center justify-center p-8 bg-muted/30">
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
                    <Camera size={40} className="text-primary" />
                  </div>
                  <p className="text-foreground font-medium text-center mb-2">
                    Capture or upload waste image
                  </p>
                  <p className="text-muted-foreground text-sm text-center">
                    Our AI will identify the waste type
                  </p>
                </div>
              )}

              <div className="p-4 space-y-3">
                {!imagePreview ? (
                  <>
                    <button
                      onClick={startCamera}
                      className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
                    >
                      <Camera size={20} />
                      Open Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-medium flex items-center justify-center gap-2"
                    >
                      <Upload size={20} />
                      Upload Photo
                    </button>
                  </>
                ) : (
                  <button
                    onClick={analyzeWaste}
                    disabled={analyzing}
                    className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Recycle size={20} />
                        Analyze Waste
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Result Card */}
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                {imagePreview && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Analyzed"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                )}
                
                <div className="p-5 -mt-12 relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${wasteTypeColors[result.wasteType] || wasteTypeColors.unknown} flex items-center justify-center text-3xl shadow-lg mb-4`}>
                    {wasteTypeIcons[result.wasteType] || "❓"}
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-foreground capitalize">
                        {result.wasteType.replace("-", " ")}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {result.description}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      result.recyclable 
                        ? "bg-success/10 text-success" 
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {result.recyclable ? "Recyclable" : "Non-recyclable"}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-accent/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <CheckCircle size={16} />
                        <span className="text-xs font-medium">Confidence</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{result.confidence}%</p>
                    </div>
                    <div className="bg-accent/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <Scale size={16} />
                        <span className="text-xs font-medium">Est. Weight</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{result.estimatedWeight} kg</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Leaf className="text-success" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Environmental Impact</h3>
                    <p className="text-sm text-muted-foreground">{result.environmentalImpact}</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-card rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="text-warning" size={20} />
                  <h3 className="font-semibold text-foreground">Recycling Tips</h3>
                </div>
                <div className="space-y-3">
                  {result.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetScan}
                  className="flex-1 py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-medium"
                >
                  Scan Again
                </button>
                <button
                  onClick={handleSchedulePickup}
                  className="flex-1 py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
                >
                  Schedule Pickup
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden Elements */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </AppLayout>
  );
};

export default Scan;
