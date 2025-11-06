import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onLoad?: () => void;
  optimizedBasename?: string;
}

const BREAKPOINTS = [400, 800, 1200, 1600, 2400];

export function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  objectFit = "cover",
  onLoad,
  optimizedBasename,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const pictureRef = useRef<HTMLPictureElement>(null);

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

    if (pictureRef.current) {
      observer.observe(pictureRef.current);
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

  if (optimizedBasename && isInView) {
    const avifSrcset = BREAKPOINTS.map(w => `/optimized/${optimizedBasename}-${w}w.avif ${w}w`).join(', ');
    const webpSrcset = BREAKPOINTS.map(w => `/optimized/${optimizedBasename}-${w}w.webp ${w}w`).join(', ');
    const fallbackSrc = `/optimized/${optimizedBasename}-fallback.jpg`;

    return (
      <>
        {!isLoaded && (
          <div
            className={`absolute inset-0 bg-muted/20 animate-pulse ${className}`}
            aria-hidden="true"
          />
        )}

        <motion.picture
          ref={pictureRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <source
            type="image/avif"
            srcSet={avifSrcset}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 2400px"
          />
          <source
            type="image/webp"
            srcSet={webpSrcset}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 2400px"
          />
          <img
            src={fallbackSrc}
            alt={alt}
            className={`${className} ${objectFitClass} ${
              isLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            loading={priority ? "eager" : "lazy"}
            onLoad={handleLoad}
          />
        </motion.picture>
      </>
    );
  }

  return (
    <>
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-muted/20 animate-pulse ${className}`}
          aria-hidden="true"
        />
      )}

      <motion.img
        ref={pictureRef as any}
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
