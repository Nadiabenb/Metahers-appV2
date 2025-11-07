import { useState } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoSectionRendererProps {
  section: {
    content: string; // Video URL or embed code
  };
  onComplete: () => void;
  isCompleted: boolean;
  spaceColor: string;
}

export default function VideoSectionRenderer({
  section,
  onComplete,
  isCompleted,
  spaceColor,
}: VideoSectionRendererProps) {
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);

  // Extract video URL if it's a YouTube/Vimeo link
  const getEmbedUrl = (url: string): string | null => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    
    // Already an embed URL
    if (url.includes('embed')) {
      return url;
    }
    
    return null;
  };

  const embedUrl = getEmbedUrl(section.content);

  const handleVideoInteraction = () => {
    if (!hasWatchedVideo) {
      setHasWatchedVideo(true);
    }
  };

  return (
    <div className="space-y-6">
      {embedUrl ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-video rounded-xl overflow-hidden bg-black"
          onClick={handleVideoInteraction}
        >
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Learning video"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-video rounded-xl overflow-hidden bg-muted flex items-center justify-center"
        >
          <div className="text-center p-6">
            <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Video content will be available soon
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {section.content}
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-start gap-3">
            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${hasWatchedVideo ? 'text-[hsl(var(--aurora-teal))]' : 'text-muted-foreground'}`} />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">
                {hasWatchedVideo ? "Great! You've started watching" : "Watch the video to continue"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isCompleted ? "This section is complete!" : "Mark this section complete when you're ready."}
              </p>
            </div>
          </div>
        </div>

        {!isCompleted && hasWatchedVideo && (
          <Button
            onClick={onComplete}
            className="w-full sm:w-auto gap-2"
            data-testid="button-complete-video"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Video Complete
          </Button>
        )}
      </motion.div>
    </div>
  );
}
