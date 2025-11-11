import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { trackCTAClick } from "@/lib/analytics";

type ShareButtonProps = {
  title: string;
  text: string;
  url: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function ShareButton({ 
  title, 
  text, 
  url,
  variant = "outline",
  size = "default",
  className = ""
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareData = {
    title,
    text,
    url: window.location.origin + url,
  };

  const canShare = typeof navigator !== 'undefined' && navigator.share;

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share(shareData);
        trackCTAClick('share_native', url);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
      trackCTAClick('share_copy', url);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const socialShares = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.url)}`,
      color: "text-[#1DA1F2]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      color: "text-[#1877F2]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
      color: "text-[#0A66C2]",
    },
  ];

  if (canShare) {
    return (
      <Button
        onClick={handleShare}
        variant={variant}
        size={size}
        className={className}
        data-testid="button-share"
      >
        <Share2 className="w-4 h-4" />
        {size !== "icon" && <span className="ml-2">Share</span>}
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          data-testid="button-share"
        >
          <Share2 className="w-4 h-4" />
          {size !== "icon" && <span className="ml-2">Share</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 bg-card/95 backdrop-blur-xl border-primary/20">
        <div className="space-y-3">
          <h4 className="font-medium text-foreground mb-3">Share this</h4>

          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full justify-start gap-2"
            data-testid="button-copy-link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </Button>

          <div className="border-t border-border/50 pt-3">
            <p className="text-xs text-muted-foreground mb-2">Share on social media</p>
            <div className="flex gap-2">
              {socialShares.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTAClick(`share_${social.name.toLowerCase()}`, url)}
                  className="flex-1"
                  data-testid={`link-share-${social.name.toLowerCase()}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <social.icon className={`w-4 h-4 ${social.color}`} />
                    <span className="hidden sm:inline">{social.name}</span>
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
