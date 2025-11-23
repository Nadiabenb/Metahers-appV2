import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onLoad?: () => void;
  optimizedBasename?: string;
  blurDataURL?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

const BREAKPOINTS = [400, 800, 1200, 1600, 2400];

const DEFAULT_BLUR_DATA_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23100321' filter='url(%23b)'/%3E%3C/svg%3E";

export function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  objectFit = "cover",
  onLoad,
  optimizedBasename,
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  fetchPriority,
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
      <div className="relative overflow-hidden">
        <AnimatePresence>
          {!isLoaded && (
            <motion.img
              key="blur-placeholder"
              src={blurDataURL}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 ${className} ${objectFitClass} blur-xl scale-110`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        <motion.picture
          ref={pictureRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
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
            className={`${className} ${objectFitClass} relative z-10`}
            loading={priority ? "eager" : "lazy"}
            onLoad={handleLoad}
            fetchpriority={fetchPriority || (priority ? 'high' : 'auto')}
          />
        </motion.picture>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence>
        {!isLoaded && (
          <motion.img
            key="blur-placeholder"
            src={blurDataURL}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 ${className} ${objectFitClass} blur-xl scale-110`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      </div>
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