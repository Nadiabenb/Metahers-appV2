import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizSectionRendererProps {
  section: {
    content: string; // JSON string with quiz data
  };
  onComplete: () => void;
  isCompleted: boolean;
  spaceColor: string;
}

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

export default function QuizSectionRenderer({
  section,
  onComplete,
  isCompleted,
  spaceColor,
}: QuizSectionRendererProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Parse quiz data from content
  let quizData: { questions: QuizQuestion[] } = { questions: [] };
  try {
    quizData = JSON.parse(section.content);
  } catch (error) {
    // If parsing fails, create a default question
    quizData = {
      questions: [
        {
          question: "Ready to test your knowledge?",
          options: ["Yes, let's do this!", "I need to review first"],
          correctAnswer: 0,
          explanation: "Great! Taking quizzes helps reinforce your learning.",
        },
      ],
    };
  }

  const questions = quizData.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const correctAnswersCount = Object.entries(selectedAnswers).filter(
    ([index, answer]) => answer === questions[Number(index)]?.correctAnswer
  ).length;
  const score = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (!showResults) {
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const isAnswerCorrect = (questionIndex: number, answerIndex: number) => {
    return answerIndex === questions[questionIndex]?.correctAnswer;
  };

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center"
      >
        <div className={`p-8 rounded-2xl bg-gradient-to-br ${score >= 70 ? 'from-[hsl(var(--aurora-teal))]/20 to-[hsl(var(--liquid-gold))]/10 border-[hsl(var(--aurora-teal))]/30' : 'from-muted/50 to-muted/30 border-border'} border`}>
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${score >= 70 ? 'text-[hsl(var(--liquid-gold))]' : 'text-muted-foreground'}`} />
          <h3 className="font-serif text-3xl font-bold mb-2">
            {score >= 70 ? "Excellent Work!" : "Good Effort!"}
          </h3>
          <p className="text-5xl font-bold mb-4">{score}%</p>
          <p className="text-muted-foreground mb-6">
            You got {correctAnswersCount} out of {totalQuestions} questions correct
          </p>
          
          {score >= 70 ? (
            <p className="text-sm">
              You've demonstrated strong understanding of the material. Keep up the great work!
            </p>
          ) : (
            <p className="text-sm">
              Consider reviewing the material and trying again. Learning is a journey!
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleRetake}
            className="gap-2"
            data-testid="button-retake-quiz"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No quiz questions available.</p>
      </div>
    );
  }

  const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span>{Object.keys(selectedAnswers).length} answered</span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <h4 className="font-serif text-xl font-semibold">
              {currentQuestion.question}
            </h4>
          </div>

          {/* Options */}
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => handleAnswerSelect(Number(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const showFeedback = hasAnswered;
              const isCorrect = isAnswerCorrect(currentQuestionIndex, index);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Label
                    htmlFor={`option-${index}`}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover-elevate ${
                      showFeedback && isCorrect
                        ? 'border-[hsl(var(--aurora-teal))] bg-[hsl(var(--aurora-teal))]/10'
                        : showFeedback && isSelected && !isCorrect
                        ? 'border-destructive bg-destructive/10'
                        : isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background'
                    }`}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <span className="flex-1">{option}</span>
                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-[hsl(var(--aurora-teal))]" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </Label>
                </motion.div>
              );
            })}
          </RadioGroup>

          {/* Explanation */}
          {hasAnswered && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-lg bg-muted/50 border border-border"
            >
              <p className="text-sm text-muted-foreground">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </p>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              data-testid="button-next-question"
              className="gap-2"
            >
              {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "See Results"}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
