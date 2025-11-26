import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type BrandProfile = {
  brandExpertise: string;
  brandNiche: string;
  problemSolved: string;
  uniqueStory: string;
  currentGoals: string;
};

type BrandOnboardingProps = {
  onComplete: (profile: BrandProfile) => void;
  isLoading?: boolean;
};

export function BrandOnboarding({ onComplete, isLoading }: BrandOnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<BrandProfile>({
    brandExpertise: "",
    brandNiche: "",
    problemSolved: "",
    uniqueStory: "",
    currentGoals: "",
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return profile.brandExpertise.trim().length > 20;
      case 2:
        return profile.brandNiche.trim().length > 10;
      case 3:
        return profile.problemSolved.trim().length > 20;
      case 4:
        return profile.uniqueStory.trim().length > 30;
      case 5:
        return profile.currentGoals.trim().length > 20;
      default:
        return false;
    }
  };

  const steps = [
    {
      title: "Your Expertise",
      description: "What's your zone of genius? What do you know better than most?",
      field: "brandExpertise" as keyof BrandProfile,
      placeholder: "Example: I help solopreneurs build authentic personal brands using AI and no-code tools. I've built 3 successful online businesses and now teach others to do the same...",
      minLength: 20,
    },
    {
      title: "Your Niche",
      description: "What specific industry or audience do you serve?",
      field: "brandNiche" as keyof BrandProfile,
      placeholder: "Example: Women solopreneurs in wellness and coaching, specifically those transitioning from 9-5 to full-time entrepreneurship...",
      minLength: 10,
    },
    {
      title: "Problem You Solve",
      description: "What problem do you solve for your clients or audience?",
      field: "problemSolved" as keyof BrandProfile,
      placeholder: "Example: I help overwhelmed coaches reclaim 15+ hours per week by automating their content creation and client onboarding with AI...",
      minLength: 20,
    },
    {
      title: "Your Unique Story",
      description: "What's your journey? What makes your perspective unique?",
      field: "uniqueStory" as keyof BrandProfile,
      placeholder: "Example: I went from burned-out corporate marketer to 6-figure solopreneur by embracing AI early. I made every mistake so you don't have to...",
      minLength: 30,
    },
    {
      title: "Current Goals",
      description: "What are you working on now? What milestones are you chasing?",
      field: "currentGoals" as keyof BrandProfile,
      placeholder: "Example: Launching my signature course 'AI for Solopreneurs' in Q2. Currently building my email list to 5,000 subscribers and landing my first corporate speaking gig...",
      minLength: 20,
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <Card className="editorial-card border-2 border-primary/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-cormorant">Build Your Brand Story</CardTitle>
            <CardDescription className="text-lg mt-2">
              Let's craft your authentic personal brand that AI will weave into your daily content
            </CardDescription>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i + 1 <= step ? 'w-12 bg-primary' : 'w-8 bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-foreground mt-2">
              Step {step} of {totalSteps}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-cormorant font-bold text-foreground mb-2">
                    {currentStep.title}
                  </h3>
                  <p className="text-foreground">
                    {currentStep.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={currentStep.field}>Your Answer</Label>
                  <Textarea
                    id={currentStep.field}
                    value={profile[currentStep.field]}
                    onChange={(e) =>
                      setProfile({ ...profile, [currentStep.field]: e.target.value })
                    }
                    placeholder={currentStep.placeholder}
                    className="min-h-[200px] text-base"
                    data-testid={`input-${currentStep.field}`}
                  />
                  <p className="text-sm text-foreground">
                    {profile[currentStep.field].length} / {currentStep.minLength} characters minimum
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  data-testid="button-back"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!isStepComplete() || isLoading}
                className={`bg-primary hover:bg-primary/90 ${step === 1 ? 'w-full' : 'flex-1'}`}
                data-testid="button-next"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : step === totalSteps ? (
                  <>
                    Complete Setup
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Helpful Tips */}
            <div className="bg-primary/5 rounded-lg p-4 mt-6">
              <p className="text-sm text-foreground">
                <strong className="text-foreground">Pro Tip:</strong> Be specific and authentic. This becomes the foundation for AI to generate content that truly sounds like YOU. Think: What would you tell a friend over coffee?
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
