
import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Download, RotateCcw, Sparkles, X, Image as ImageIcon, Heart, Trash2, Send, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

type Photo = {
  id: string;
  userId: string;
  imageUrl: string;
  filterName: string;
  caption: string | null;
  likeCount: number;
  isPublic: boolean;
  createdAt: string;
  userFirstName: string | null;
  userLastName: string | null;
};

export default function RetroCameraPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [caption, setCaption] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printedPhoto, setPrintedPhoto] = useState<string | null>(null);

  // Fetch photo feed
  const { data: photoFeed = [] } = useQuery<Photo[]>({
    queryKey: ['/api/retro-camera/feed'],
    refetchInterval: 30000,
  });

  // Fetch user's own photos
  const { data: myPhotos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/retro-camera/my-photos'],
    enabled: !!user,
  });

  // Post photo mutation
  const postPhotoMutation = useMutation({
    mutationFn: async (data: { imageUrl: string; filterName: string; caption: string; isPublic: boolean }) => {
      const response = await fetch('/api/retro-camera/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to post photo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/retro-camera/feed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/retro-camera/my-photos'] });
      toast({
        title: "Photo Posted!",
        description: "Your retro photo has been shared with the community.",
      });
      setShowPostDialog(false);
      setCaption("");
    },
    onError: () => {
      toast({
        title: "Post Failed",
        description: "Unable to post your photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const response = await fetch(`/api/retro-camera/photos/${photoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete photo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/retro-camera/feed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/retro-camera/my-photos'] });
      toast({
        title: "Photo Deleted",
        description: "Your photo has been removed.",
      });
    },
  });

  // Like photo mutation
  const likePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const response = await fetch(`/api/retro-camera/photos/${photoId}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to like photo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/retro-camera/feed'] });
    },
  });

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
    if (facingMode && !capturedImage && !printedPhoto) {
      startCamera();
    }
  }, [facingMode, startCamera, capturedImage, printedPhoto]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.filter = selectedFilter.effect;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        setIsPrinting(true);
        stopCamera();

        // Simulate Polaroid printing animation
        setTimeout(() => {
          setPrintedPhoto(imageData);
          setIsPrinting(false);
        }, 2000);
      }
    }
  }, [selectedFilter, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setPrintedPhoto(null);
    setIsPrinting(false);
    startCamera();
  }, [startCamera]);

  const downloadPhoto = useCallback(() => {
    if (printedPhoto) {
      const link = document.createElement("a");
      link.href = printedPhoto;
      link.download = `metahers-polaroid-${Date.now()}.png`;
      link.click();
    }
  }, [printedPhoto]);

  const handlePostPhoto = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to post photos to the community feed.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    if (printedPhoto) {
      setShowPostDialog(true);
    }
  };

  const confirmPost = () => {
    if (printedPhoto) {
      postPhotoMutation.mutate({
        imageUrl: printedPhoto,
        filterName: selectedFilter.name,
        caption,
        isPublic,
      });
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <SEO
        title="Retro Camera - MetaHers Mind Spa"
        description="Capture moments with vintage filters and share with the community"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Polaroid Camera Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-serif text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Polaroid Camera
                  </h1>
                  <p className="text-muted-foreground">
                    📸 Capture & share your MetaHers moments
                  </p>
                </div>
                <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/20">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Vintage Vibes
                </Badge>
              </div>
            </motion.div>

            {/* Instax Mini 12 Camera Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              {/* Main Camera Body - Instax Mini 12 Style */}
              <div className="relative w-96 h-96 mx-auto">
                {/* Camera Body - Pink rounded rectangle */}
                <div className="relative w-full h-full bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 rounded-3xl shadow-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(236, 72, 153, 0.3)' }}>
                  
                  {/* Top Section - Controls */}
                  <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
                    {/* Left: Flash indicator and small lens */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-6 bg-white/70 rounded-lg border-2 border-pink-300 shadow-md" />
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/70 animate-pulse" />
                        <span className="text-pink-700 text-[9px] font-bold">ON</span>
                      </div>
                    </div>
                    
                    {/* Right: Instax branding and flip camera */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <h2 className="font-bold text-lg text-pink-700 tracking-wide" style={{ fontFamily: 'cursive' }}>
                          instax
                        </h2>
                        <p className="text-pink-600 text-[10px] font-semibold -mt-1">mini 12</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleCamera}
                        className="text-pink-700 hover:bg-pink-300/50 rounded-full h-9 w-9 p-0 flex-shrink-0"
                        data-testid="button-flip-camera"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Main Circular Lens - Center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {/* Lens outer ring - darker */}
                    <div className="relative w-56 h-56 rounded-full bg-gray-900 shadow-2xl" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)' }}>
                      
                      {/* Lens middle ring */}
                      <div className="absolute inset-3 rounded-full border-4 border-gray-800/80 bg-black/20" />
                      
                      {/* Live camera feed inside */}
                      <div className="absolute inset-4 rounded-full overflow-hidden bg-black border-2 border-gray-700/50">
                        <AnimatePresence mode="wait">
                          {!capturedImage && !printedPhoto ? (
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
                          ) : (
                            <motion.div
                              key="preview"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="w-full h-full flex items-center justify-center bg-gray-900"
                            >
                              <Camera className="w-16 h-16 text-pink-300/30" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <canvas ref={canvasRef} className="hidden" />
                      </div>

                      {/* Glossy lens effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />
                    </div>

                    {/* Focus ring detail below lens */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-3 rounded-full bg-pink-400 shadow-lg opacity-80" />
                  </div>

                  {/* Bottom section - Photo ejection slot */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {/* Ejection slot */}
                    <div className="relative h-3 bg-gray-800/50 rounded-sm overflow-hidden">
                      {/* Photo slides out here */}
                      <AnimatePresence>
                        {(isPrinting || printedPhoto) && (
                          <motion.div
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 80, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }}
                            transition={{ duration: isPrinting ? 2.5 : 0.6, ease: "easeOut" }}
                            className="absolute left-1/2 -translate-x-1/2 z-20 w-48"
                          >
                            {/* Instax Photo Frame - slides out bottom */}
                            <div className="bg-white p-2 pb-16 shadow-2xl rounded-sm border-2 border-gray-100">
                              <div className="bg-gray-200 aspect-square rounded-sm overflow-hidden">
                                {printedPhoto && (
                                  <motion.img
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 1.5 }}
                                    src={printedPhoto}
                                    alt="Instax"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                {isPrinting && !printedPhoto && (
                                  <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-400 animate-pulse" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Shutter Button - Right side */}
                  {!capturedImage && !printedPhoto && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={capturePhoto}
                        disabled={!isCameraActive}
                        className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 shadow-xl border-4 border-pink-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all group focus:outline-none focus:ring-4 focus:ring-pink-400/50"
                        data-testid="button-capture-photo"
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 to-transparent" />
                        <div className="relative">
                          <Camera className="w-8 h-8 text-pink-600" />
                        </div>
                        
                        {/* Shutter Label */}
                        <div className="absolute -left-20 top-1/2 -translate-y-1/2 whitespace-nowrap">
                          <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            SHUTTER
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  )}

                  {/* Self-timer indicator */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-70" />
                    <span className="text-pink-700 text-xs font-semibold opacity-70">SELF-TIMER</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Below Camera */}
              {printedPhoto && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex gap-3 justify-center flex-wrap"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={retakePhoto}
                    className="flex-1 max-w-xs border-pink-300 hover:bg-pink-50"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Retake
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={downloadPhoto}
                    className="flex-1 max-w-xs border-pink-300 hover:bg-pink-50"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePostPhoto}
                    className="flex-1 max-w-xs bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Post to Feed
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Photo Feed Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="font-serif text-3xl font-bold mb-2">
                Community Feed
              </h2>
              <p className="text-muted-foreground">
                See what others are capturing
              </p>
            </motion.div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {photoFeed.map((photo) => {
                const isMyPhoto = photo.userId === user?.id;
                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="overflow-hidden border-2 border-pink-100">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                              {(photo.userFirstName?.[0] || 'M').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {photo.userFirstName || 'MetaHers'} {photo.userLastName?.[0] || ''}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(photo.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {isMyPhoto && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deletePhotoMutation.mutate(photo.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Polaroid-style photo display */}
                        <div className="bg-white p-3 pb-12 shadow-lg rounded-sm mb-3">
                          <img
                            src={photo.imageUrl}
                            alt={photo.caption || 'Polaroid photo'}
                            className="w-full aspect-square object-cover rounded-sm"
                          />
                        </div>

                        {photo.caption && (
                          <p className="text-sm mb-3">{photo.caption}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700">
                            {photo.filterName} Filter
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => likePhotoMutation.mutate(photo.id)}
                            className="gap-2 hover:text-pink-600"
                          >
                            <Heart className="w-4 h-4" />
                            {photo.likeCount}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}

              {photoFeed.length === 0 && (
                <Card className="p-8 text-center border-2 border-pink-100">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-pink-300" />
                  <p className="text-muted-foreground">
                    No photos yet. Be the first to share!
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Polaroid</DialogTitle>
            <DialogDescription>
              Add a caption and choose who can see your photo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={200}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPublic ? (
                  <>
                    <Globe className="w-4 h-4 text-primary" />
                    <Label htmlFor="public">Public</Label>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="public">Private</Label>
                  </>
                )}
              </div>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPostDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPost}
                disabled={postPhotoMutation.isPending}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
              >
                {postPhotoMutation.isPending ? "Posting..." : "Post Photo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
