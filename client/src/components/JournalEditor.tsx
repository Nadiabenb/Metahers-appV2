import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage } from "@/lib/storage";

interface JournalEditorProps {
  onStreakUpdate?: (streak: number) => void;
}

export function JournalEditor({ onStreakUpdate }: JournalEditorProps) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const initialContentRef = useRef<string>("");
  const isInitialLoadRef = useRef(true);
  const { toast} = useToast();

  useEffect(() => {
    const saved = LocalStorage.getJournalEntry();
    if (saved) {
      setContent(saved.content || "");
      setLastSaved(saved.lastSaved || null);
      initialContentRef.current = saved.content || "";
    }
    isInitialLoadRef.current = false;
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      return;
    }

    if (content === initialContentRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (content.trim() !== "") {
        saveJournal();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  const saveJournal = () => {
    if (content.trim() === "") return;
    if (content === initialContentRef.current) return;

    setIsSaving(true);
    
    const newStreak = LocalStorage.saveJournalWithStreak(content);
    const now = new Date().toISOString();
    
    setLastSaved(now);
    initialContentRef.current = content;
    onStreakUpdate?.(newStreak);
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        description: (
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-mint" />
            <span>Journal saved</span>
          </div>
        ),
        duration: 2000,
      });
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-8 shadow-md min-h-[500px]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today? Write your thoughts, reflections, and insights here..."
          className="w-full h-[450px] bg-transparent border-none outline-none resize-none text-base leading-relaxed text-foreground placeholder:text-muted-foreground"
          data-testid="textarea-journal"
        />
      </div>

      {lastSaved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end gap-2 text-sm text-muted-foreground"
        >
          {isSaving ? (
            <span className="text-mint">Saving...</span>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-mint" data-testid="indicator-saved" />
              <span>Last saved {new Date(lastSaved).toLocaleTimeString()}</span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
