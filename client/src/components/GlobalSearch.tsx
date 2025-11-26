import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Command, Sparkles, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

type Space = {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  requiredTier: string;
};

type Experience = {
  id: string;
  title: string;
  slug: string;
  description: string;
  spaceId: string;
  spaceName: string;
  estimatedMinutes: number;
  requiredTier: string;
};

type SearchResult = {
  type: "space" | "experience";
  id: string;
  title: string;
  description: string;
  slug: string;
  requiredTier: string;
  spaceName?: string;
  estimatedMinutes?: number;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: spaces = [], isError: spacesError } = useQuery<Space[]>({
    queryKey: ['/api/spaces'],
    retry: false,
  });

  const { data: allExperiences = [], isError: experiencesError } = useQuery<Experience[]>({
    queryKey: ['/api/experiences/all'],
    retry: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchResults: SearchResult[] = [
    ...spaces
      .filter(space =>
        space.name.toLowerCase().includes(search.toLowerCase()) ||
        space.description.toLowerCase().includes(search.toLowerCase())
      )
      .map(space => ({
        type: "space" as const,
        id: space.id,
        title: space.name,
        description: space.description,
        slug: space.slug,
        requiredTier: space.requiredTier,
      })),
    ...allExperiences
      .filter(exp =>
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.description.toLowerCase().includes(search.toLowerCase())
      )
      .map(exp => ({
        type: "experience" as const,
        id: exp.id,
        title: exp.title,
        description: exp.description,
        slug: exp.slug,
        requiredTier: exp.requiredTier,
        spaceName: exp.spaceName,
        estimatedMinutes: exp.estimatedMinutes,
      }))
  ].slice(0, 8);

  const handleSelect = (result: SearchResult) => {
    if (result.type === "space") {
      navigate(`/spaces/${result.slug}`);
    } else {
      navigate(`/experiences/${result.slug}`);
    }
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border hover-elevate active-elevate-2 transition-all w-full sm:w-64"
        data-testid="button-open-search"
      >
        <Search className="w-4 h-4 text-foreground" />
        <span className="text-sm text-foreground flex-1 text-left">
          Search experiences...
        </span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-foreground opacity-100">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 bg-card/95 backdrop-blur-xl border-primary/20" aria-describedby="search-description">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Search className="w-5 h-5 text-primary" />
              Global Search
            </DialogTitle>
            <DialogDescription id="search-description">
              Search across all learning spaces and experiences
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <Input
              placeholder="Search spaces and experiences..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 text-base bg-background/50"
              autoFocus
              data-testid="input-global-search"
            />

            {search && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {spacesError || experiencesError ? (
                  <div className="text-center py-8 text-foreground">
                    <p>Unable to load search results.</p>
                    <p className="text-xs mt-2">Please try again later.</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8 text-foreground">
                    No results found for "{search}"
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className="w-full p-4 rounded-lg bg-card/50 border border-border hover-elevate active-elevate-2 transition-all text-left"
                      data-testid={`search-result-${result.slug}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {result.type === "space" ? (
                              <Sparkles className="w-4 h-4 text-primary shrink-0" />
                            ) : (
                              <Badge variant="outline" className="shrink-0">
                                {result.estimatedMinutes}min
                              </Badge>
                            )}
                            <h4 className="font-medium text-foreground truncate">
                              {result.title}
                            </h4>
                          </div>
                          {result.spaceName && (
                            <p className="text-xs text-foreground mb-1">
                              {result.spaceName}
                            </p>
                          )}
                          <p className="text-sm text-foreground line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                        {result.requiredTier !== "free" && (
                          <Lock className="w-4 h-4 text-foreground shrink-0 mt-1" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {!search && (
              <div className="text-center py-8 text-foreground text-sm">
                <p>Start typing to search spaces and experiences</p>
                <p className="mt-2 text-xs">
                  Press{" "}
                  <kbd className="px-2 py-1 rounded bg-muted text-foreground">
                    ⌘K
                  </kbd>{" "}
                  to open anytime
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}