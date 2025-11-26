import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type DailyCheckInProps = {
  dayNumber: number;
  onSubmit: (story: string) => void;
  isLoading?: boolean;
};

export function DailyCheckIn({ dayNumber, onSubmit, isLoading }: DailyCheckInProps) {
  const [accomplishment, setAccomplishment] = useState("");
  const [winsInsights, setWinsInsights] = useState("");
  const [challenges, setChallenges] = useState("");

  const handleSubmit = () => {
    // Combine all fields into a daily story
    const dailyStory = [
      accomplishment && `Today I worked on: ${accomplishment}`,
      winsInsights && `Wins/Insights: ${winsInsights}`,
      challenges && `Challenges: ${challenges}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    onSubmit(dailyStory);
  };

  const isComplete = accomplishment.trim().length > 20;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8"
    >
      <Card className="editorial-card border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-cormorant">Day {dayNumber} Check-In</CardTitle>
              <CardDescription className="mt-1">
                Share your wins, progress, and insights from today (takes 2-3 minutes)
              </CardDescription>
            </div>
            <Calendar className="w-10 h-10 text-primary" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Accomplishment - Required */}
          <div className="space-y-2">
            <Label htmlFor="accomplishment" className="text-base font-semibold">
              What did you accomplish or work on today? *
            </Label>
            <Textarea
              id="accomplishment"
              value={accomplishment}
              onChange={(e) => setAccomplishment(e.target.value)}
              placeholder="Example: Finished outlining my new workshop on AI productivity. Had a breakthrough conversation with a potential client about their automation needs. Made progress on my course content..."
              className="min-h-[120px] text-base"
              data-testid="input-accomplishment"
            />
            <p className="text-sm text-foreground">
              {accomplishment.length} / 20 characters minimum
            </p>
          </div>

          {/* Wins/Insights - Optional but encouraged */}
          <div className="space-y-2">
            <Label htmlFor="wins" className="text-base font-semibold">
              Any wins, insights, or breakthroughs? (Optional)
            </Label>
            <Textarea
              id="wins"
              value={winsInsights}
              onChange={(e) => setWinsInsights(e.target.value)}
              placeholder="Example: A client just shared amazing results from implementing my framework. I realized that X approach works better than Y. Got featured in a newsletter..."
              className="min-h-[100px] text-base"
              data-testid="input-wins"
            />
          </div>

          {/* Challenges - Optional */}
          <div className="space-y-2">
            <Label htmlFor="challenges" className="text-base font-semibold">
              Any challenges or lessons learned? (Optional)
            </Label>
            <Textarea
              id="challenges"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Example: Struggled with pricing my new offer. Learning to balance client work with content creation. Faced imposter syndrome but pushed through..."
              className="min-h-[100px] text-base"
              data-testid="input-challenges"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
              data-testid="button-generate-from-story"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Generating Your Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Day {dayNumber} Content
                </>
              )}
            </Button>
          </div>

          {/* Helpful Tips */}
          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong className="text-foreground">Building in Public:</strong> Share your real journey - wins AND challenges. Authenticity builds connection. Your audience wants to see the behind-the-scenes, not just the highlight reel.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
