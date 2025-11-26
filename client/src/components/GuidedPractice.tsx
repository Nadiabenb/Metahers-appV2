import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lightbulb, Sparkles, Edit2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { CurriculumDay } from "@shared/curriculum";

type GuidedPracticeProps = {
  curriculumDay: CurriculumDay;
  onSubmit: (reflection: string) => void;
  isLoading: boolean;
  existingReflection?: string;
};

export function GuidedPractice({ curriculumDay, onSubmit, isLoading, existingReflection }: GuidedPracticeProps) {
  const [reflection, setReflection] = useState(existingReflection || "");
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = !!existingReflection;

  // Sync local state when existingReflection or curriculumDay changes
  useEffect(() => {
    setReflection(existingReflection || "");
    setIsEditing(false);
  }, [existingReflection, curriculumDay.day]);

  const handleSubmit = () => {
    if (reflection.trim()) {
      onSubmit(reflection);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setReflection(existingReflection || "");
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      <Card className="editorial-card border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2">
                  Guided Practice · Day {curriculumDay.day}
                </Badge>
                <CardTitle className="font-cormorant text-2xl text-foreground" data-testid="text-practice-prompt">
                  {curriculumDay.practice.prompt}
                </CardTitle>
              </div>
            </div>
            {isCompleted && (
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Practice Complete
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-foreground mb-3">Reflect on these questions:</h4>
              <ul className="space-y-2">
                {curriculumDay.practice.guidingQuestions.map((question, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                    data-testid={`text-question-${index}`}
                  >
                    <span className="text-primary mt-0.5">•</span>
                    {question}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-accent/50 border border-accent-border">
              <h4 className="font-medium text-sm text-foreground mb-2">Success looks like:</h4>
              <p className="text-sm text-foreground" data-testid="text-success-criteria">
                {curriculumDay.practice.successCriteria}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="reflection" className="block text-sm font-medium text-foreground">
              Your Reflection
            </label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Take a few minutes to reflect deeply on these questions. Your answers will help generate personalized content that truly sounds like you..."
              className="min-h-[200px] text-base"
              disabled={isCompleted && !isEditing}
              data-testid="input-reflection"
            />
            <p className="text-xs text-foreground">
              {reflection.length} characters · Be authentic and specific
            </p>
          </div>

          {!isCompleted && (
            <Button
              onClick={handleSubmit}
              size="lg"
              disabled={!reflection.trim() || isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              data-testid="button-submit-practice"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Your Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Practice & Generate Content
                </>
              )}
            </Button>
          )}

          {isCompleted && !isEditing && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex-1">
                <p className="text-sm text-foreground/90">
                  Your practice reflection has been saved. Your personalized content is ready below.
                </p>
              </div>
              <Button
                onClick={handleEdit}
                variant="outline"
                size="lg"
                className="gap-2"
                data-testid="button-edit-reflection"
              >
                <Edit2 className="w-4 h-4" />
                Edit Reflection
              </Button>
            </div>
          )}

          {isCompleted && isEditing && (
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={handleSubmit}
                size="lg"
                disabled={!reflection.trim() || isLoading}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-regenerate-content"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Regenerating Content...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Save & Regenerate Content
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="lg"
                disabled={isLoading}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
