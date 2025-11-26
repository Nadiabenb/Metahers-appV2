import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, ArrowRight, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type InteractiveQuizProps = {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
};

export default function InteractiveQuiz({ questions, onComplete }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowFeedback(true);

    if (isCorrect && !answeredQuestions[currentQuestionIndex]) {
      setScore(prev => prev + 1);
    }

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
      onComplete?.(score);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassing = percentage >= 70;

    return (
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${
                isPassing 
                  ? 'from-green-500 to-emerald-500' 
                  : 'from-orange-500 to-yellow-500'
              } flex items-center justify-center`}>
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-2">
                {isPassing ? 'Congratulations!' : 'Good Effort!'}
              </h3>
              <p className="text-xl text-foreground">
                You scored {score} out of {questions.length}
              </p>
              <Badge className="mt-2 text-lg px-4 py-2">
                {percentage}%
              </Badge>
            </div>

            {!isPassing && (
              <p className="text-sm text-foreground">
                Review the material and try again to improve your score!
              </p>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleRetry}
                data-testid="button-quiz-retry"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              {isPassing && (
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  data-testid="button-quiz-continue"
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <Badge variant="outline" className="gap-1">
              <Trophy className="w-3 h-3" />
              Score: {score}/{questions.length}
            </Badge>
          </div>

          <Progress value={progress} className="h-2" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold">
                {currentQuestion.question}
              </h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === currentQuestion.correctAnswer;
                  const showCorrect = showFeedback && isCorrectAnswer;
                  const showIncorrect = showFeedback && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                        showCorrect
                          ? 'border-green-500 bg-green-500/10'
                          : showIncorrect
                          ? 'border-destructive bg-destructive/10'
                          : isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover-elevate'
                      }`}
                      whileHover={!showFeedback ? { scale: 1.02 } : {}}
                      whileTap={!showFeedback ? { scale: 0.98 } : {}}
                      data-testid={`button-quiz-option-${index}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showCorrect
                          ? 'border-green-500 bg-green-500'
                          : showIncorrect
                          ? 'border-destructive bg-destructive'
                          : isSelected
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {showCorrect && <Check className="w-4 h-4 text-white" />}
                        {showIncorrect && <X className="w-4 h-4 text-white" />}
                      </div>
                      <span className={showFeedback && !isSelected && !isCorrectAnswer ? 'text-foreground' : ''}>
                        {option}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-orange-500 bg-orange-500/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {isCorrect ? 'Correct!' : 'Not quite right'}
                      </p>
                      <p className="text-sm text-foreground">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end gap-3">
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    data-testid="button-quiz-submit"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNext} data-testid="button-quiz-next">
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        View Results
                        <Trophy className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
