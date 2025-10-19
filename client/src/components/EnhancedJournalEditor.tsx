import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Sparkles, MessageCircle, X, Plus, Tag as TagIcon, Heart, Smile, Meh, Frown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJournal } from "@/hooks/useJournal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MOODS = [
  { value: "joyful", label: "Joyful", icon: Heart, color: "text-[hsl(var(--magenta-quartz))]" },
  { value: "peaceful", label: "Peaceful", icon: Smile, color: "text-[hsl(var(--aurora-teal))]" },
  { value: "reflective", label: "Reflective", icon: Meh, color: "text-[hsl(var(--hyper-violet))]" },
  { value: "challenged", label: "Challenged", icon: Frown, color: "text-amber-500" },
  { value: "energized", label: "Energized", icon: Zap, color: "text-[hsl(var(--liquid-gold))]" },
];

export function EnhancedJournalEditor() {
  const { 
    content: savedContent, 
    mood: savedMood, 
    tags: savedTags, 
    wordCount: savedWordCount,
    aiInsights: savedAiInsights,
    aiPrompt: savedAiPrompt,
    streak, 
    saveJournal, 
    isSaving, 
    lastSaved 
  } = useJournal();
  
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [aiPrompt, setAiPrompt] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [showAiCoach, setShowAiCoach] = useState(false);
  const [coachMessage, setCoachMessage] = useState("");
  const [coachHistory, setCoachHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const initialContentRef = useRef<string>("");
  const initialMoodRef = useRef<string | null>(null);
  const initialTagsRef = useRef<string[]>([]);
  const isInitialLoadRef = useRef(true);
  const { toast } = useToast();

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;

  // Load AI prompt on mount
  const { data: promptData } = useQuery<{ prompt: string }>({
    queryKey: ['/api/journal/prompt'],
    staleTime: 300000, // 5 minutes
  });

  useEffect(() => {
    if (promptData?.prompt && !aiPrompt) {
      setAiPrompt(promptData.prompt);
    }
  }, [promptData, aiPrompt]);

  // Hydrate saved data on mount
  useEffect(() => {
    if (savedContent) {
      setContent(savedContent);
      initialContentRef.current = savedContent;
    }
    if (savedMood) {
      setMood(savedMood);
      initialMoodRef.current = savedMood;
    }
    if (savedTags && savedTags.length > 0) {
      setTags(savedTags);
      initialTagsRef.current = savedTags;
    }
    if (savedAiInsights) {
      setAiInsights(savedAiInsights);
    }
    if (savedAiPrompt) {
      setAiPrompt(savedAiPrompt);
    }
    isInitialLoadRef.current = false;
  }, [savedContent, savedMood, savedTags, savedAiInsights, savedAiPrompt]);

  // Auto-save with debounce (triggers on content, mood, or tags change)
  useEffect(() => {
    if (isInitialLoadRef.current) {
      return;
    }

    const contentChanged = content !== initialContentRef.current;
    const moodChanged = mood !== initialMoodRef.current;
    const tagsChanged = JSON.stringify(tags) !== JSON.stringify(initialTagsRef.current);

    if (!contentChanged && !moodChanged && !tagsChanged) {
      return;
    }

    const timer = setTimeout(() => {
      handleSave();
    }, 1500);

    return () => clearTimeout(timer);
  }, [content, mood, tags]);

  const handleSave = async () => {
    // Allow saving even with empty content if there's mood/tags data
    const contentChanged = content !== initialContentRef.current;
    const moodChanged = mood !== initialMoodRef.current;
    const tagsChanged = JSON.stringify(tags) !== JSON.stringify(initialTagsRef.current);

    if (!contentChanged && !moodChanged && !tagsChanged) {
      return;
    }

    await saveJournal(content, streak, mood, tags, aiPrompt || undefined);
    initialContentRef.current = content;
    initialMoodRef.current = mood;
    initialTagsRef.current = tags;

    // Get AI insights for substantial content
    if (content.trim().length > 50) {
      try {
        const res = await apiRequest('POST', '/api/journal/analyze', { content });
        const insights = await res.json();
        setAiInsights(insights);
      } catch (error) {
        console.error("Error getting AI insights:", error);
      }
    }

    toast({
      description: (
        <div className="flex items-center gap-2">
          <Save className="w-4 h-4 text-[hsl(var(--aurora-teal))]" />
          <span>Journal saved</span>
        </div>
      ),
      duration: 2000,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSendCoachMessage = async () => {
    if (!coachMessage.trim()) return;
    
    const userMessage = coachMessage;
    setCoachMessage("");
    setCoachHistory([...coachHistory, { role: "user", content: userMessage }]);
    setIsCoachLoading(true);

    try {
      const res = await apiRequest('POST', '/api/journal/chat', { message: userMessage });
      const result = await res.json() as { response: string };
      
      setCoachHistory(prev => [...prev, { role: "assistant", content: result.response }]);
    } catch (error) {
      console.error("Error chatting with coach:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI coach",
        variant: "destructive",
      });
    } finally {
      setIsCoachLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mood Selector */}
      <Card className="p-4 bg-background/50 backdrop-blur-md border-border/40">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/70 uppercase tracking-wide">
            <Heart className="w-4 h-4" />
            <span>How are you feeling?</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <Button
                key={m.value}
                size="sm"
                variant={mood === m.value ? "default" : "outline"}
                onClick={() => setMood(mood === m.value ? null : m.value)}
                className={`toggle-elevate ${mood === m.value ? 'toggle-elevated' : ''}`}
                data-testid={`button-mood-${m.value}`}
              >
                <m.icon className={`w-3 h-3 mr-1 ${mood === m.value ? '' : m.color}`} />
                {m.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Prompt Suggestion */}
      {aiPrompt && !content && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="editorial-card p-4 border-[hsl(var(--liquid-gold))]/30 bg-gradient-to-r from-[hsl(var(--liquid-gold))]/5 to-[hsl(var(--cyber-fuchsia))]/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-teal-gold opacity-5" />
          <div className="relative z-10 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground/90 mb-1">AI Prompt</p>
              <p className="text-sm text-foreground/70 italic">{aiPrompt}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Editor */}
      <div className="relative">
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-md min-h-[400px] border border-border/40">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Write your thoughts, reflections, and insights here..."
            className="w-full h-[350px] bg-transparent border-none outline-none resize-none text-base leading-relaxed text-foreground placeholder:text-muted-foreground"
            data-testid="textarea-journal"
          />
        </div>

        {/* Word Count & Actions Bar */}
        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground" data-testid="text-word-count">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            {isSaving && (
              <span className="text-[hsl(var(--aurora-teal))] flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-teal))] animate-pulse" />
                Saving...
              </span>
            )}
            {lastSaved && !isSaving && (
              <span className="text-muted-foreground flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-teal))]" data-testid="indicator-saved" />
                Saved {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAiCoach(!showAiCoach)}
            className="hover-elevate"
            data-testid="button-ai-coach"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            AI Coach
          </Button>
        </div>
      </div>

      {/* Tags */}
      <Card className="p-4 bg-background/50 backdrop-blur-md border-border/40">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/70 uppercase tracking-wide">
            <TagIcon className="w-4 h-4" />
            <span>Tags</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="pl-3 pr-1 hover-elevate"
                data-testid={`badge-tag-${tag}`}
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                  data-testid={`button-remove-tag-${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {tags.length < 5 && (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag..."
                  className="w-24 px-2 py-1 text-sm bg-transparent border border-border/40 rounded-md outline-none focus:border-mint"
                  data-testid="input-new-tag"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleAddTag}
                  className="h-6 w-6"
                  data-testid="button-add-tag"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* AI Insights */}
      {aiInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-mint/5 to-mint/10 border-mint/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-mint" />
                <h3 className="font-semibold text-foreground">AI Insights</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground/70 mb-1">Summary</p>
                  <p className="text-sm text-foreground">{aiInsights.summary}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-foreground/70 mb-1">Sentiment</p>
                  <Badge variant="secondary" className="capitalize">
                    {aiInsights.sentiment}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-foreground/70 mb-1">Key Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {aiInsights.themes?.map((theme: string) => (
                      <Badge key={theme} variant="outline">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border/40">
                  <p className="text-sm text-foreground/80 italic">
                    "{aiInsights.encouragement}"
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* AI Coach Sidebar */}
      <AnimatePresence>
        {showAiCoach && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background/95 backdrop-blur-md shadow-2xl border-l border-border z-50"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-mint" />
                  <h3 className="font-semibold">AI Journal Coach</h3>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowAiCoach(false)}
                  data-testid="button-close-coach"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {coachHistory.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-mint mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about your journal entries or get guidance on your learning journey.
                    </p>
                  </div>
                )}

                {coachHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isCoachLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-pulse delay-100" />
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-pulse delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coachMessage}
                    onChange={(e) => setCoachMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isCoachLoading && handleSendCoachMessage()}
                    placeholder="Ask your coach..."
                    className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg outline-none focus:border-mint text-sm"
                    data-testid="input-coach-message"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendCoachMessage}
                    disabled={!coachMessage.trim() || isCoachLoading}
                    data-testid="button-send-coach-message"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
