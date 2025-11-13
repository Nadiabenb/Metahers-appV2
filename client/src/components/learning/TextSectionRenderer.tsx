import { motion } from "framer-motion";
import { BookOpen, Sparkles, Quote, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useState } from "react";

type Resource = {
  title: string;
  url: string;
  type: string;
  blogSlug?: string; // Optional: for internal blog references
};

interface TextSectionRendererProps {
  section: {
    content: string;
    resources?: Resource[];
  };
  onComplete: () => void;
  isCompleted: boolean;
  spaceColor: string;
}

export default function TextSectionRenderer({
  section,
  onComplete,
  isCompleted,
  spaceColor,
}: TextSectionRendererProps) {
  return (
    <div className="space-y-6">
      {/* Enhanced Content with preserved HTML - Luxury Typography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="prose prose-lg max-w-none dark:prose-invert"
      >
        {/* Ambient background for luxury feel */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent pointer-events-none rounded-2xl" />
          <div 
            className="relative leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-em:text-foreground/80"
            style={{ 
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      </motion.div>

      {/* Optional: Add breathing room after content */}
      <div className="py-4 flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
        </div>
      </div>

      {/* Resources - MetaHers Blog Only */}
      {section.resources && section.resources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
        >
          <h4 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            MetaHers Learning Library
          </h4>
          <div className="grid gap-3">
            {section.resources.map((resource, index) => {
              // Convert to MetaHers blog path - use specific article if blogSlug exists
              const blogPath = resource.blogSlug ? `/blog/${resource.blogSlug}` : `/blog`;
              
              return (
                <Link
                  key={index}
                  href={blogPath}
                  className="group flex items-center justify-between p-4 rounded-lg bg-background hover-elevate active-elevate-2 border border-border transition-all"
                  data-testid={`resource-link-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary">
                      MetaHers
                    </Badge>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {resource.title}
                    </span>
                  </div>
                  <BookOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground italic">
            All resources curated from the MetaHers knowledge base
          </p>
        </motion.div>
      )}
    </div>
  );
}
