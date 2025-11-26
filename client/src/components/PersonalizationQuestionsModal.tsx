import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type Question = {
  id: string;
  questionText: string;
  questionType: "text" | "textarea" | "multiple_choice" | "scale";
  options?: string[];
  isRequired: boolean;
};

type PersonalizationQuestionsModalProps = {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  experienceId: string;
  experienceTitle: string;
  questions: Question[];
};

export default function PersonalizationQuestionsModal({
  open,
  onClose,
  onComplete,
  experienceId,
  experienceTitle,
  questions,
}: PersonalizationQuestionsModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Handle empty questions - skip personalization
  useEffect(() => {
    if (open && questions.length === 0) {
      onComplete();
    }
  }, [open, questions.length, onComplete]);

  // Don't render if no questions
  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const saveAnswersMutation = useMutation({
    mutationFn: async (answers: Record<string, string>) => {
      return await apiRequest("POST", `/api/experiences/${experienceId}/personalization`, { answers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences", experienceId] });
      toast({
        title: "Personalization Complete!",
        description: "Your learning path has been customized for you.",
      });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your answers. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.id];
    
    if (currentQuestion.isRequired && !currentAnswer?.trim()) {
      toast({
        title: "Answer Required",
        description: "Please answer this question before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (isLastQuestion) {
      saveAnswersMutation.mutate(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const renderQuestionInput = () => {
    const value = answers[currentQuestion.id] || "";

    switch (currentQuestion.questionType) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer..."
            className="text-base"
            data-testid="input-personalization-answer"
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[120px] text-base"
            data-testid="textarea-personalization-answer"
          />
        );

      case "multiple_choice":
        return (
          <RadioGroup
            value={value}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  data-testid={`radio-option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="text-base font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-foreground">
              <span>Not confident</span>
              <span>Very confident</span>
            </div>
            <RadioGroup
              value={value}
              onValueChange={handleAnswerChange}
              className="flex justify-between"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={num} className="flex flex-col items-center gap-2">
                  <RadioGroupItem
                    value={String(num)}
                    id={`scale-${num}`}
                    data-testid={`radio-scale-${num}`}
                  />
                  <Label htmlFor={`scale-${num}`} className="cursor-pointer">
                    {num}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <DialogTitle className="text-2xl">Personalize Your Journey</DialogTitle>
          </div>
          <DialogDescription>
            Answer a few questions so we can tailor <strong>{experienceTitle}</strong> to your specific needs and goals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Progress value={progress} className="h-2" />
          
          <div className="text-sm text-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">
                {currentQuestion.questionText}
                {currentQuestion.isRequired && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </h3>

              {renderQuestionInput()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              data-testid="button-previous-question"
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={saveAnswersMutation.isPending}
              data-testid="button-next-question"
            >
              {saveAnswersMutation.isPending ? (
                "Saving..."
              ) : isLastQuestion ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
