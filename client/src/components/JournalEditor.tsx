import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJournal } from "@/hooks/useJournal";

interface JournalEditorProps {
  onStreakUpdate?: (streak: number) => void;
}

export function JournalEditor({ onStreakUpdate }: JournalEditorProps) {
  const { content: savedContent, streak, saveJournal, isSaving, lastSaved } = useJournal();
  const [content, setContent] = useState("");
  const initialContentRef = useRef<string>("");
  const isInitialLoadRef = useRef(true);
  const { toast } = useToast();

  useEffect(() => {
    if (savedContent) {
      setContent(savedContent);
      initialContentRef.current = savedContent;
    }
    isInitialLoadRef.current = false;
  }, [savedContent]);

  useEffect(() => {
    if (onStreakUpdate && streak) {
      onStreakUpdate(streak);
    }
  }, [streak, onStreakUpdate]);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      return;
    }

    if (content === initialContentRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (content.trim() !== "") {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  const handleSave = async () => {
    if (content.trim() === "") return;
    if (content === initialContentRef.current) return;

    await saveJournal(content);
    initialContentRef.current = content;

    setTimeout(() => {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-[hsl(var(--aurora-teal))]" />
            <span>Journal saved</span>
          </div>
        ),
        duration: 2000,
      });
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="editorial-card p-8 min-h-[500px] relative overflow-hidden">
        <div className="absolute inset-0 gradient-violet-magenta opacity-5" />
        <div className="relative z-10">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Write your thoughts, reflections, and insights here..."
            className="w-full h-[450px] bg-transparent border-none outline-none resize-none text-base leading-relaxed text-foreground placeholder:text-muted-foreground"
            data-testid="textarea-journal"
          />
        </div>
      </div>

      {lastSaved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end gap-2 text-sm text-muted-foreground"
        >
          {isSaving ? (
            <span className="text-[hsl(var(--aurora-teal))]">Saving...</span>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--aurora-teal))]" data-testid="indicator-saved" />
              <span>Last saved {new Date(lastSaved).toLocaleTimeString()}</span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
