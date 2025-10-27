import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  objectFit = "cover",
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  }[objectFit];

  return (
    <>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-muted/20 animate-pulse ${className}`}
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      <motion.img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        className={`${className} ${objectFitClass} ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}

interface BackgroundImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  overlay?: boolean;
  overlayClassName?: string;
  children?: React.ReactNode;
}

export function BackgroundImage({
  src,
  alt,
  className = "",
  priority = false,
  overlay = false,
  overlayClassName = "",
  children,
}: BackgroundImageProps) {
  return (
    <div className={`relative ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full"
        objectFit="cover"
        priority={priority}
      />
      {overlay && (
        <div className={`absolute inset-0 ${overlayClassName}`} />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
