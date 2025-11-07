import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AppAtelierChatProps {
  userProfile?: {
    name?: string;
    experience?: string;
    goals?: string;
  };
}

export function AppAtelierChat({ userProfile }: AppAtelierChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm your AI coding coach at App Atelier. Whether you're totally new to coding or ready to ship your first app, I'm here to guide you! What brings you here today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/app-atelier/chat", {
        message: userMessage,
        conversationHistory: messages,
        userProfile
      });

      const data = await response.json();
      
      // Add assistant response
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Oops! I had trouble responding. Can you try that again?" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starterPrompts = [
    "How do I get started with AI coding?",
    "What can I build as a beginner?",
    "Help me choose my first app idea",
    "Explain React like I'm 5"
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          height: isMinimized ? "60px" : "600px"
        }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-2xl bg-background/95 border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-foreground">App Atelier AI Coach</h3>
              <p className="text-xs text-foreground/60">Your coding companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              data-testid="button-minimize-chat"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div
              ref={chatContainerRef}
              className="h-[440px] overflow-y-auto p-6 space-y-4"
              style={{ scrollbarGutter: "stable" }}
            >
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] text-white"
                          : "backdrop-blur-xl bg-white/5 border border-white/10 text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-[hsl(var(--cyber-fuchsia))] rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[hsl(var(--cyber-fuchsia))] rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[hsl(var(--cyber-fuchsia))] rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Starter Prompts - Show only at beginning */}
              {messages.length === 1 && (
                <div className="pt-4">
                  <p className="text-xs text-foreground/60 mb-3">Try asking:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {starterPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(prompt);
                        }}
                        className="text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs text-foreground/80 hover:text-foreground"
                        data-testid={`starter-prompt-${index}`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-4 bg-gradient-to-t from-background/50 to-transparent backdrop-blur-xl">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about building your app..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border-white/20 focus:border-[hsl(var(--cyber-fuchsia))] transition-colors"
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] hover:opacity-90 transition-opacity"
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
