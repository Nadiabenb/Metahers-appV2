import { useState } from "react";
import { CheckCircle2, Code, Lightbulb, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const GOLD = "#C9A96E";

interface HandsOnLabRendererProps {
  section: {
    content: string;
  };
  onComplete: () => void;
  isCompleted: boolean;
  spaceColor: string;
}

export default function HandsOnLabRenderer({
  section,
  onComplete,
  isCompleted,
}: HandsOnLabRendererProps) {
  const [userCode, setUserCode] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!userCode.trim() && !userNotes.trim()) {
      toast({
        title: "Please complete the lab",
        description: "Add your code or notes about what you built.",
        variant: "destructive",
      });
      return;
    }
    setHasSubmitted(true);
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Lab instructions */}
      <div
        className="p-5 rounded-lg"
        style={{ background: "#0D0B14", border: "1px solid #FFFFFF0F" }}
      >
        <div className="flex items-start gap-3">
          <Terminal className="w-4 h-4 shrink-0 mt-0.5 text-white/40" />
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
            {section.content}
          </p>
        </div>
      </div>

      {/* Work area */}
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="code" className="flex-1" data-testid="tab-code">
            <Code className="w-4 h-4 mr-2" />
            Your Code
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex-1" data-testid="tab-notes">
            <Lightbulb className="w-4 h-4 mr-2" />
            Lab Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-4">
          <Textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="// Your code here..."
            className="min-h-[240px] font-mono text-sm resize-none"
            disabled={hasSubmitted || isCompleted}
            data-testid="lab-code-textarea"
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="What did you build? What challenges did you face? What did you learn?"
            className="min-h-[240px] resize-none"
            disabled={hasSubmitted || isCompleted}
            data-testid="lab-notes-textarea"
          />
        </TabsContent>
      </Tabs>

      {hasSubmitted || isCompleted ? (
        <div
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{ background: "#C9A96E11", border: "1px solid #C9A96E33" }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
          <p className="text-sm text-white/70">Lab submitted. Section complete.</p>
        </div>
      ) : (
        <Button
          onClick={handleSubmit}
          className="gap-2 font-semibold"
          style={{ background: GOLD, color: "#1A1A2E" }}
          data-testid="button-submit-lab"
        >
          <CheckCircle2 className="w-4 h-4" />
          Submit Lab Work
        </Button>
      )}
    </div>
  );
}
