import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Terminal, CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface HandsOnLabRendererProps {
  section: {
    content: string; // Lab instructions
  };
  onComplete: () => void;
  isCompleted: boolean;
  spaceColor: string;
}

export default function HandsOnLabRenderer({
  section,
  onComplete,
  isCompleted,
  spaceColor,
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
    onComplete(); // Mark section as complete
    toast({
      title: "Lab Completed! 🎉",
      description: "Excellent hands-on work. This section is now complete!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))]/10 to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--cyber-fuchsia))]/20">
        <div className="flex items-start gap-3 mb-4">
          <Terminal className="w-6 h-6 text-[hsl(var(--cyber-fuchsia))] flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-serif text-lg font-semibold mb-2">Hands-On Lab</h4>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Work Area */}
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
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Paste your code or implementation here
            </label>
            <Textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="// Your code here..."
              className="min-h-[300px] font-mono text-sm resize-none"
              disabled={hasSubmitted}
              data-testid="lab-code-textarea"
            />
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Document your learning and observations
            </label>
            <Textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="What did you build? What challenges did you face? What did you learn?"
              className="min-h-[300px] resize-none"
              disabled={hasSubmitted}
              data-testid="lab-notes-textarea"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Submit */}
      {!hasSubmitted ? (
        <Button
          onClick={handleSubmit}
          className="w-full sm:w-auto gap-2"
          data-testid="button-submit-lab"
        >
          <CheckCircle2 className="w-4 h-4" />
          Submit Lab Work
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl bg-gradient-to-br from-[hsl(var(--aurora-teal))]/20 to-[hsl(var(--liquid-gold))]/10 border border-[hsl(var(--aurora-teal))]/30"
        >
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-[hsl(var(--aurora-teal))] flex-shrink-0" />
            <div>
              <p className="font-serif text-lg font-semibold text-[hsl(var(--aurora-teal))] mb-2">
                Lab Completed!
              </p>
              <p className="text-sm text-muted-foreground">
                You've completed the hands-on portion. This practical experience is invaluable for mastering the concepts. Well done!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg bg-muted/30 border border-border"
      >
        <p className="text-sm text-muted-foreground text-center italic">
          "Building with your own hands is how you transform from learner to creator."
        </p>
      </motion.div>
    </div>
  );
}
