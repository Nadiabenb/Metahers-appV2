import { useState } from "react";
import { CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const GOLD = "#C9A96E";

interface InteractiveSectionRendererProps {
  section: {
    content: string;
  };
  onComplete: () => void;
  isCompleted: boolean;
  spaceColor: string;
}

export default function InteractiveSectionRenderer({
  section,
  onComplete,
  isCompleted,
}: InteractiveSectionRendererProps) {
  const [userResponse, setUserResponse] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!userResponse.trim()) {
      toast({
        title: "Please add your thoughts",
        description: "Share your insights to continue.",
        variant: "destructive",
      });
      return;
    }
    setHasSubmitted(true);
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Exercise prompt */}
      <div
        className="p-5 rounded-lg"
        style={{ background: "#0D0B14", border: "1px solid #C9A96E22" }}
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
            {section.content}
          </p>
        </div>
      </div>

      {/* Response */}
      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-widest font-medium text-white/40">
          Your Response
        </label>
        <Textarea
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          placeholder="Take your time to reflect and share your thoughts..."
          className="min-h-[160px] resize-none"
          disabled={hasSubmitted || isCompleted}
          data-testid="interactive-response-textarea"
        />
      </div>

      {hasSubmitted || isCompleted ? (
        <div
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{ background: "#C9A96E11", border: "1px solid #C9A96E33" }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
          <p className="text-sm text-white/70">Response submitted. Section complete.</p>
        </div>
      ) : (
        <Button
          onClick={handleSubmit}
          className="gap-2 font-semibold"
          style={{ background: GOLD, color: "#1A1A2E" }}
          data-testid="button-submit-response"
        >
          Submit Response
        </Button>
      )}
    </div>
  );
}
