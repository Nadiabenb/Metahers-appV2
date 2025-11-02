import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Rocket, Target, Sparkles, Check, ArrowRight, Download, Share2, TrendingUp, Code2, Briefcase, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Question {
  id: string;
  question: string;
  type: "radio" | "textarea";
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "current_role",
    question: "What's your current professional situation?",
    type: "radio",
    options: [
      "Student / Recent Graduate",
      "Career Switcher (Currently in non-tech)",
      "Tech Professional (Want to upskill in AI/Web3)",
      "Entrepreneur / Founder",
      "Taking a Career Break"
    ]
  },
  {
    id: "interest_area",
    question: "Which area interests you most?",
    type: "radio",
    options: [
      "AI & Machine Learning",
      "Web3 & Blockchain",
      "Both AI and Web3",
      "AI Product Management",
      "Technical Writing & Education"
    ]
  },
  {
    id: "experience_level",
    question: "How would you describe your tech experience?",
    type: "radio",
    options: [
      "Complete Beginner (New to tech)",
      "Familiar (Understand basics)",
      "Intermediate (Can build simple projects)",
      "Advanced (Professional experience)",
      "Expert (Leading projects/teams)"
    ]
  },
  {
    id: "timeline",
    question: "What's your timeline for transition?",
    type: "radio",
    options: [
      "3 months (Intensive)",
      "6 months (Steady pace)",
      "12 months (Gradual transition)",
      "Flexible (Learning at my own pace)"
    ]
  },
  {
    id: "goals",
    question: "What are your specific career goals? (Be as detailed as you'd like)",
    type: "textarea"
  }
];

interface CareerPath {
  title: string;
  overview: string;
  phase1: { title: string; goals: string[]; resources: string[] };
  phase2: { title: string; goals: string[]; resources: string[] };
  phase3: { title: string; goals: string[]; resources: string[] };
  nextSteps: string[];
}

export default function CareerPathGeneratorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [careerPath, setCareerPath] = useState<CareerPath | null>(null);
  const { toast } = useToast();

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast({
        title: "Answer Required",
        description: "Please answer the current question to continue.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateCareerPath();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateCareerPath = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch("/api/career-path/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to generate career path");
      }

      const data = await res.json();
      setCareerPath(data.careerPath);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate career path. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setCareerPath(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My AI/Web3 Career Path",
        text: `Check out my personalized career roadmap from MetaHers Mind Spa!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share this link to show your career path"
      });
    }
  };

  if (careerPath) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Your AI/Web3 Career Path - MetaHers Mind Spa"
          description="Your personalized career roadmap for transitioning into AI and Web3. Generated by MetaHers Mind Spa's AI-powered career guidance."
          keywords="AI career path, Web3 career roadmap, tech career transition, career planning"
          type="website"
        />

        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-[#00D9FF] to-[#B565D8] text-white border-0 px-4 py-2" data-testid="badge-success">
              <Rocket className="w-4 h-4 mr-2" />
              Your Personalized Career Path
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gradient-violet mb-4">
              {careerPath.title}
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {careerPath.overview}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button onClick={handleShare} variant="outline" className="gap-2" data-testid="button-share">
              <Share2 className="w-4 h-4" />
              Share Your Path
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="gap-2" data-testid="button-download">
              <Download className="w-4 h-4" />
              Download as PDF
            </Button>
            <Button onClick={handleRestart} variant="ghost" className="gap-2" data-testid="button-restart">
              Restart Assessment
            </Button>
          </div>

          {/* Roadmap Phases */}
          <div className="space-y-8 mb-12">
            {/* Phase 1 */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#00D9FF] to-[#B565D8] bg-opacity-10">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{careerPath.phase1.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Goals:</h4>
                  <ul className="space-y-2">
                    {careerPath.phase1.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Resources & Actions:</h4>
                  <ul className="space-y-2">
                    {careerPath.phase1.resources.map((resource, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF00FF] to-[#E935C1] bg-opacity-10">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{careerPath.phase2.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Goals:</h4>
                  <ul className="space-y-2">
                    {careerPath.phase2.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Resources & Actions:</h4>
                  <ul className="space-y-2">
                    {careerPath.phase2.resources.map((resource, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#B565D8] to-[#FF00FF] bg-opacity-10">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{careerPath.phase3.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Goals:</h4>
                  <ul className="space-y-2">
                    {careerPath.phase3.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Resources & Actions:</h4>
                  <ul className="space-y-2">
                    {careerPath.phase3.resources.map((resource, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="bg-gradient-to-br from-[#B565D8]/10 via-[#FF00FF]/5 to-[#E935C1]/10 border-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-gradient-violet flex items-center gap-2">
                <Target className="w-6 h-6" />
                Your Immediate Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {careerPath.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-foreground/80 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Upgrade CTA */}
          <Card className="bg-gradient-to-br from-[#B565D8]/10 via-[#FF00FF]/5 to-[#E935C1]/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif text-gradient-violet">
                Ready to Start Your Journey?
              </CardTitle>
              <CardDescription className="text-base">
                Join MetaHers Mind Spa for guided learning, AI coaching, and a community of women transforming their careers
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-signup-cta">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/upgrade">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-upgrade-cta">
                  View All Programs
                  <Sparkles className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Career Path Generator - MetaHers Mind Spa"
        description="Get a personalized AI/Web3 career roadmap tailored to your experience, goals, and timeline. Free career planning tool powered by AI."
        keywords="AI career path, Web3 career planning, tech career transition, career roadmap, AI career guidance"
        type="website"
      />

      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#00D9FF] to-[#B565D8] text-white border-0 px-4 py-2" data-testid="badge-generator">
            <Rocket className="w-4 h-4 mr-2" />
            AI Career Path Generator
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-violet mb-6">
            Your Personalized AI/Web3 Career Roadmap
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Answer a few questions and get a detailed, AI-generated career path with specific goals, resources, and timelines tailored to your experience.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground/70">
              Question {currentStep + 1} of {QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === "radio" && currentQuestion.options ? (
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswer}
              >
                {currentQuestion.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg hover-elevate active-elevate-2">
                    <RadioGroupItem value={option} id={`option-${idx}`} data-testid={`radio-option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Share your specific career goals, interests, and what you hope to achieve..."
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="min-h-[150px] text-base"
                data-testid="textarea-goals"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="outline"
            className="gap-2"
            data-testid="button-back"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || isGenerating}
            className="gap-2"
            data-testid="button-next"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Generating Your Path...
              </>
            ) : currentStep === QUESTIONS.length - 1 ? (
              <>
                Generate My Career Path
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
