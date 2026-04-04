import { BookOpen } from "lucide-react";
import { Link } from "wouter";

type Resource = {
  title: string;
  url: string;
  type: string;
  blogSlug?: string;
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

export default function TextSectionRenderer({ section }: TextSectionRendererProps) {
  // Render plain text content as readable paragraphs
  const paragraphs = section.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // If no paragraph breaks, treat the whole text as one paragraph
  const content = paragraphs.length > 1 ? paragraphs : [section.content];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {content.map((paragraph, i) => (
          <p
            key={i}
            className="text-white/80 leading-relaxed"
            style={{ fontSize: "1.05rem", lineHeight: "1.8" }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {section.resources && section.resources.length > 0 && (
        <div
          className="mt-6 p-5 rounded-xl"
          style={{ background: "#0D0B14", border: "1px solid #C9A96E22" }}
        >
          <h4 className="text-xs uppercase tracking-widest font-medium mb-4 flex items-center gap-2 text-white/60">
            <BookOpen className="w-3.5 h-3.5" />
            MetaHers Learning Library
          </h4>
          <div className="space-y-2">
            {section.resources.map((resource, index) => {
              const blogPath = resource.blogSlug ? `/blog/${resource.blogSlug}` : `/blog`;
              return (
                <Link
                  key={index}
                  href={blogPath}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-white/5"
                  style={{ border: "1px solid #FFFFFF08" }}
                  data-testid={`resource-link-${index}`}
                >
                  <span className="text-sm text-white/70 hover:text-white transition-colors">
                    {resource.title}
                  </span>
                  <BookOpen className="w-3.5 h-3.5 text-white/30 shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
