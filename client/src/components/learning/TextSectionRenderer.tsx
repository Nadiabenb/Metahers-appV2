import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Resource = {
  title: string;
  url: string;
  type: string;
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
      {/* Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div 
          className="leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>

      {/* Resources */}
      {section.resources && section.resources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-xl bg-muted/50 border border-border"
        >
          <h4 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Helpful Resources
          </h4>
          <div className="grid gap-3">
            {section.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-lg bg-background hover-elevate active-elevate-2 border border-border transition-all"
                data-testid={`resource-link-${index}`}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {resource.type}
                  </Badge>
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {resource.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
