import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface InteractiveSectionRendererProps {
  section: {
    content: string; // Exercise instructions
  };
  onComplete: () => void;
  isCompleted: boolean;
  spaceColor: string;
}

export default function InteractiveSectionRenderer({
  section,
  onComplete,
  isCompleted,
  spaceColor,
}: InteractiveSectionRendererProps) {
  const [userResponse, setUserResponse] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!userResponse.trim()) {
      toast({
        title: "Please add your thoughts",
        description: "Share your insights to continue learning.",
        variant: "destructive",
      });
      return;
    }

    setHasSubmitted(true);
    onComplete(); // Mark section as complete
    toast({
      title: "Excellent work! 🎉",
      description: "Your reflection has been saved. This section is now complete!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-serif text-lg font-semibold mb-2">Interactive Exercise</h4>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        </div>
      </div>

      {/* Response Area */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Your Response
          </label>
          <Textarea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Take your time to reflect and share your thoughts here..."
            className="min-h-[200px] resize-none"
            disabled={hasSubmitted}
            data-testid="interactive-response-textarea"
          />
        </div>

        {!hasSubmitted ? (
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto gap-2"
            data-testid="button-submit-response"
          >
            <Sparkles className="w-4 h-4" />
            Submit Response
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-[hsl(var(--aurora-teal))]/10 border border-[hsl(var(--aurora-teal))]/30"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[hsl(var(--aurora-teal))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[hsl(var(--aurora-teal))] mb-1">
                  Response Submitted!
                </p>
                <p className="text-sm text-foreground">
                  Great reflection! This hands-on practice helps solidify your learning.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg bg-muted/30 border border-border"
      >
        <p className="text-sm text-foreground text-center italic">
          "The only way to learn is by doing. Your active participation is transforming knowledge into wisdom."
        </p>
      </motion.div>
    </div>
  );
}
