import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Lightbulb, Rocket, Zap, Copy, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const EXAMPLE_PROMPTS = [
  {
    category: "Career Planning",
    icon: Rocket,
    prompt: "Create a 30-day learning plan for me to transition into an AI Product Manager role. Include specific skills, resources, and milestones.",
    color: "from-[#B565D8] to-[#FF00FF]"
  },
  {
    category: "Content Creation",
    icon: Lightbulb,
    prompt: "Write a LinkedIn post about how AI is democratizing access to technology education for women in STEM fields. Make it inspiring and authentic.",
    color: "from-[#FF00FF] to-[#E935C1]"
  },
  {
    category: "Web3 Learning",
    icon: Zap,
    prompt: "Explain blockchain technology and NFTs to someone with zero technical background. Use everyday analogies and make it relatable.",
    color: "from-[#00D9FF] to-[#B565D8]"
  },
  {
    category: "Personal Branding",
    icon: Wand2,
    prompt: "Help me craft a compelling personal brand statement that positions me as a thought leader in AI ethics and responsible innovation.",
    color: "from-[#FFD700] to-[#FF00FF]"
  }
];

export default function PromptPlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleRunPrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to try the AI playground.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/playground/run-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to run prompt");
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to run prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const useExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setResponse("");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Prompt Playground - MetaHers Mind Spa"
        description="Try AI prompts in real-time and see instant results. Learn prompt engineering techniques to unlock AI's full potential for your career and personal growth."
        keywords="AI playground, prompt engineering, ChatGPT prompts, AI learning, prompt templates, AI for beginners"
        type="website"
      />

      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#B565D8] to-[#FF00FF] text-white border-0 px-4 py-2" data-testid="badge-playground">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Prompt Playground
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-violet mb-6">
            Try AI Prompts in Real-Time
          </h1>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto mb-4">
            Experiment with AI prompts and see instant results. Learn how to craft powerful prompts that unlock AI's potential for your career, content creation, and personal growth.
          </p>
          <p className="text-sm text-foreground/50">
            No login required • Powered by OpenAI GPT-4
          </p>
        </div>

        {/* Example Prompts */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
            Try These Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXAMPLE_PROMPTS.map((example, index) => {
              const Icon = example.icon;
              return (
                <Card
                  key={index}
                  className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                  onClick={() => useExamplePrompt(example.prompt)}
                  data-testid={`card-example-${index}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${example.color} bg-opacity-10`}>
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{example.category}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {example.prompt}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Your Prompt
              </CardTitle>
              <CardDescription>
                Write your prompt or try one of the examples above
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="E.g., Write a compelling LinkedIn post about how AI is transforming the tech industry for women..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] text-base"
                data-testid="input-prompt"
              />
              <Button
                onClick={handleRunPrompt}
                disabled={isLoading || !prompt.trim()}
                className="w-full gap-2"
                size="lg"
                data-testid="button-run-prompt"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run Prompt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Response
                </CardTitle>
                {response && (
                  <Button
                    onClick={handleCopyResponse}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    data-testid="button-copy-response"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
              <CardDescription>
                See how AI responds to your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="min-h-[200px] p-4 bg-muted/30 rounded-md text-sm whitespace-pre-wrap"
                data-testid="text-ai-response"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
                      <p className="text-foreground/50 text-sm">AI is thinking...</p>
                    </div>
                  </div>
                ) : response ? (
                  response
                ) : (
                  <p className="text-foreground/40 italic">
                    Your AI-generated response will appear here...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade CTA */}
        <Card className="bg-gradient-to-br from-[#B565D8]/10 via-[#FF00FF]/5 to-[#E935C1]/10 border-primary/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-serif text-gradient-violet">
              Ready to Master AI & Web3?
            </CardTitle>
            <CardDescription className="text-base">
              Join MetaHers Mind Spa for guided learning rituals, AI coaching, and a supportive community of women in tech
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
                View All Tiers
                <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
            Prompt Engineering Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Be Specific</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">
                  Include details about context, audience, tone, and desired outcome. The more specific you are, the better the results.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Provide Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">
                  Give AI background information about your goals, expertise level, and what success looks like for your use case.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Iterate & Refine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">
                  Start with a basic prompt, then refine based on the results. Experiment with different phrasings and approaches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
