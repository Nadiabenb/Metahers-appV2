import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Send, MessageCircle, Search } from "lucide-react";
import { motion } from "framer-motion";
import type { WomenProfileDB } from "@shared/schema";

export default function CircleMessagingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");

  const { data: profiles = [] } = useQuery<WomenProfileDB[]>({
    queryKey: ["/api/circle/profiles"],
  });

  const filteredProfiles = profiles.filter(p => 
    !searchTerm || p.headline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!selectedUserId || !messageText.trim()) return;

    try {
      const response = await fetch("/api/circle/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: selectedUserId, message: messageText }),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Your message has been delivered",
        });
        setMessageText("");
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending your message",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEO 
        title="Messaging | MetaHers Circle"
        description="Direct messaging with women professionals in the MetaHers Circle community"
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-[hsl(var(--magenta-quartz))]/5 to-white">
        <div className="max-w-6xl mx-auto h-screen flex flex-col">
          {/* Header */}
          <div className="border-b border-[hsl(var(--hyper-violet))]/20 p-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/circle")}
              className="gap-2 mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Circle
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Direct Messages</h1>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden gap-4 p-4">
            {/* Contacts List */}
            <div className="w-full sm:w-80 flex flex-col bg-gradient-to-br from-white to-[hsl(var(--hyper-violet))]/5 border border-[hsl(var(--hyper-violet))]/20 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[hsl(var(--hyper-violet))]/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-contacts"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredProfiles.length === 0 ? (
                  <div className="p-4 text-center">
                    <MessageCircle className="w-8 h-8 text-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-foreground/60">No contacts found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[hsl(var(--hyper-violet))]/10">
                    {filteredProfiles.map((profile) => (
                      <motion.button
                        key={profile.id}
                        onClick={() => setSelectedUserId(profile.id)}
                        whileHover={{ x: 4 }}
                        className={`w-full p-4 text-left transition-all ${
                          selectedUserId === profile.id
                            ? "bg-gradient-to-r from-[hsl(var(--hyper-violet))]/20 to-[hsl(var(--cyber-fuchsia))]/10 border-l-2 border-l-[hsl(var(--hyper-violet))]"
                            : "hover:bg-[hsl(var(--hyper-violet))]/5"
                        }`}
                        data-testid={`button-contact-${profile.id}`}
                      >
                        <h3 className="font-semibold text-foreground line-clamp-1">{profile.headline}</h3>
                        <p className="text-xs text-foreground/60 line-clamp-1 mt-1">{profile.location}</p>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedUserId ? (
              <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-[hsl(var(--cyber-fuchsia))]/5 border border-[hsl(var(--cyber-fuchsia))]/20 rounded-xl overflow-hidden">
                {/* Chat Header */}
                <div className="border-b border-[hsl(var(--cyber-fuchsia))]/20 p-4">
                  <h2 className="font-semibold text-foreground">
                    {profiles.find(p => p.id === selectedUserId)?.headline}
                  </h2>
                  <p className="text-sm text-foreground/60">
                    {profiles.find(p => p.id === selectedUserId)?.location}
                  </p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="flex justify-center py-8">
                    <Badge variant="outline" className="text-xs">
                      Start a conversation with {profiles.find(p => p.id === selectedUserId)?.headline}
                    </Badge>
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-[hsl(var(--cyber-fuchsia))]/20 p-4 space-y-3">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 rounded-lg border border-input bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--cyber-fuchsia))]/20 resize-none"
                    rows={3}
                    data-testid="input-message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="w-full gap-2 bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] text-white"
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-[hsl(var(--cyber-fuchsia))]/5 border border-[hsl(var(--cyber-fuchsia))]/20 rounded-xl">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Select a contact</h3>
                  <p className="text-foreground/60">Choose someone to start messaging with them</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
