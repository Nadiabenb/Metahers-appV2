
import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Download, RotateCcw, Sparkles, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

const FILTERS = [
  { id: "none", name: "Original", effect: "none" },
  { id: "vintage", name: "Vintage", effect: "sepia(0.5) contrast(1.2)" },
  { id: "polaroid", name: "Polaroid", effect: "contrast(1.1) brightness(1.1) saturate(1.3)" },
  { id: "noir", name: "Noir", effect: "grayscale(1) contrast(1.3)" },
  { id: "sunset", name: "Sunset", effect: "sepia(0.3) saturate(1.4) hue-rotate(-10deg)" },
  { id: "dreamy", name: "Dreamy", effect: "brightness(1.1) saturate(0.8) blur(0.5px)" },
  { id: "film", name: "Film", effect: "contrast(1.15) saturate(1.2) brightness(0.95)" },
  { id: "retro", name: "Retro", effect: "sepia(0.4) saturate(1.5) contrast(1.1)" },
];

export default function RetroCameraPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const toggleCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }, [stopCamera]);

  useEffect(() => {
    if (facingMode && !capturedImage) {
      startCamera();
    }
  }, [facingMode, startCamera, capturedImage]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Apply filter
        context.filter = selectedFilter.effect;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [selectedFilter, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const downloadPhoto = useCallback(() => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = `metahers-retro-${Date.now()}.png`;
      link.click();
    }
  }, [capturedImage]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Retro Camera - MetaHers Mind Spa"
        description="Capture moments with vintage filters and retro effects"
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-serif text-4xl font-bold mb-2">
                Retro Camera
              </h1>
              <p className="text-muted-foreground">
                Capture your MetaHers moments with vintage vibes
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-1" />
              Member Feature
            </Badge>
          </div>
        </motion.div>

        {/* Camera Card */}
        <Card className="overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {capturedImage ? "Your Retro Photo" : "Live Camera"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Camera/Image View */}
            <div className="relative bg-black aspect-[4/3] overflow-hidden">
              <AnimatePresence mode="wait">
                {capturedImage ? (
                  <motion.img
                    key="captured"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <motion.video
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ filter: selectedFilter.effect }}
                  />
                )}
              </AnimatePresence>

              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Retro Camera Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
                <div className="absolute top-8 left-8 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Filter Selection */}
            {!capturedImage && (
              <div className="p-4 bg-muted/50 border-t border-border">
                <p className="text-sm font-semibold mb-3">Choose Filter:</p>
                <div className="grid grid-cols-4 gap-2">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedFilter.id === filter.id
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-6 bg-gradient-to-b from-background to-muted/30">
              {capturedImage ? (
                <div className="flex gap-3 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={retakePhoto}
                    className="flex-1 max-w-xs"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Retake
                  </Button>
                  <Button
                    size="lg"
                    onClick={downloadPhoto}
                    className="flex-1 max-w-xs bg-primary hover:bg-primary/90"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={toggleCamera}
                    className="w-16 h-16 rounded-full p-0"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={capturePhoto}
                    disabled={!isCameraActive}
                    className="w-20 h-20 rounded-full p-0 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <Camera className="w-8 h-8" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 bg-muted/50 rounded-xl border border-border"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Try different filters to match your vibe</li>
            <li>• Use the flip camera button to switch between front and back</li>
            <li>• Natural lighting works best for vintage aesthetics</li>
            <li>• Download your photos to share on social media</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
