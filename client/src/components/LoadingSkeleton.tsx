import { motion, useReducedMotion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Replit-quality skeleton loading states with MetaHers luxury aesthetic

export function ExperienceCardSkeleton() {
  const prefersReducedMotion = useReducedMotion();
  
  const Wrapper = prefersReducedMotion ? "div" : motion.div;
  const animationProps = prefersReducedMotion ? {} : {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };

  return (
    <Wrapper
      {...animationProps}
      className="rounded-lg border border-border bg-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <Skeleton className="h-10 w-full" />
    </Wrapper>
  );
}

export function SpaceCardSkeleton() {
  const prefersReducedMotion = useReducedMotion();
  
  const Wrapper = prefersReducedMotion ? "div" : motion.div;
  const animationProps = prefersReducedMotion ? {} : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <Wrapper
      {...animationProps}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
    </Wrapper>
  );
}

export function ExperienceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16 px-6">
        <div className="container mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-24 w-5/6 mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-6 py-12 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function SpaceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-background via-muted/30 to-background py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="h-14 w-2/3 mb-4" />
          <Skeleton className="h-20 w-full mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ExperienceCardSkeleton />
          <ExperienceCardSkeleton />
          <ExperienceCardSkeleton />
          <ExperienceCardSkeleton />
          <ExperienceCardSkeleton />
          <ExperienceCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function WorldPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-muted/20 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-48 mb-6" />
          <Skeleton className="h-20 w-3/4 mb-6" />
          <Skeleton className="h-24 w-full mb-8" />
          <Skeleton className="h-12 w-64" />
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SpaceCardSkeleton />
          <SpaceCardSkeleton />
          <SpaceCardSkeleton />
          <SpaceCardSkeleton />
          <SpaceCardSkeleton />
          <SpaceCardSkeleton />
        </div>
      </div>
    </div>
  );
}
