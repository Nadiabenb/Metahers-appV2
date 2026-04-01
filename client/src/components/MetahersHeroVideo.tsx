/**
 * MetahersHeroVideo
 *
 * A self-contained animated hero video component for the Metahers brand.
 * Cycles through 4 cinematic scenes (5 s each), looping continuously.
 *
 * ─── Requirements ────────────────────────────────────────────────────────────
 *  External dependency (install in your project):
 *    npm install framer-motion
 *    — or —
 *    yarn add framer-motion
 *
 *  Google Fonts (add to your HTML <head>):
 *    <link
 *      href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap"
 *      rel="stylesheet"
 *    />
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *  import MetahersHeroVideo from './MetahersHeroVideo';
 *
 *  // Full-viewport hero:
 *  <MetahersHeroVideo />
 *
 *  // Constrained container (e.g. a card):
 *  <div style={{ width: '100%', height: '500px' }}>
 *    <MetahersHeroVideo />
 *  </div>
 *
 * ─── No other files needed ───────────────────────────────────────────────────
 *  Everything is inlined: palette, animations, scenes, and the scene-cycling
 *  hook. Zero internal import aliases or Tailwind CSS required.
 */

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// ─── Brand Palette ────────────────────────────────────────────────────────────

const P = {
  primary:       '#1A1A2E',   // Deep navy — headers, bold text
  secondary:     '#E8D5C4',   // Warm nude — section backgrounds, fills
  accent:        '#C9A96E',   // Gold — highlights, CTAs, animations
  accentBold:    '#8B2252',   // Deep rose — dramatic emphasis moments
  bgLight:       '#FEFEFE',   // Clean off-white — main background
  bgMuted:       '#F2E0D6',   // Soft blush — light section backgrounds
  textPrimary:   '#2D2D3A',   // Dark — body text
  textSecondary: '#6B6B7B',   // Medium — secondary/muted text
  textInverse:   '#FEFEFE',   // Off-white — text on dark backgrounds
} as const;

const FONT_DISPLAY = "'Outfit', 'Georgia', serif";
const FONT_MONO    = "'JetBrains Mono', 'Courier New', monospace";

// ─── Shared Style Helpers ─────────────────────────────────────────────────────

const absoluteFill: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

// ─── Animation Constants ──────────────────────────────────────────────────────

const sceneTransitions = {
  scaleFade: {
    initial:    { opacity: 0, scale: 0.95 },
    animate:    { opacity: 1, scale: 1 },
    exit:       { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
    transition: { duration: 0.8, ease: 'circOut' },
  },
  wipe: {
    initial:    { clipPath: 'inset(0 100% 0 0)' },
    animate:    { clipPath: 'inset(0 0% 0 0)' },
    exit:       { clipPath: 'inset(0 0 0 100%)' },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
  },
  clipCircle: {
    initial:    { clipPath: 'circle(0% at 50% 50%)' },
    animate:    { clipPath: 'circle(100% at 50% 50%)' },
    exit:       { clipPath: 'circle(0% at 50% 50%)' },
    transition: { duration: 1, ease: [0.4, 0, 0.2, 1] as const },
  },
} as const;

const elasticScaleVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 15 } },
};

const charVariants: Variants = {
  hidden:  { opacity: 0, y: 40, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

const charContainerVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};

// ─── Scene-Cycling Hook ───────────────────────────────────────────────────────

function useVideoPlayer(durations: Record<string, number>, loop = true): number {
  const durationsArray = useRef(Object.values(durations)).current;
  const totalScenes    = durationsArray.length;

  const [currentScene, setCurrentScene] = useState(0);
  const [hasEnded,     setHasEnded]     = useState(false);

  useEffect(() => {
    if (hasEnded && !loop) return;

    const timer = setTimeout(() => {
      if (currentScene >= totalScenes - 1) {
        setHasEnded(true);
        if (loop) setCurrentScene(0);
      } else {
        setCurrentScene(s => s + 1);
      }
    }, durationsArray[currentScene]);

    return () => clearTimeout(timer);
  }, [currentScene, totalScenes, durationsArray, hasEnded, loop]);

  return currentScene;
}

// ─── Scene 0: Brand Reveal ────────────────────────────────────────────────────

function Scene0BrandReveal() {
  const brandName = 'Metahers';

  return (
    <motion.div
      style={{
        ...absoluteFill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: P.bgLight,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Gold ambient blob */}
      <motion.div
        style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '40vw',
          height: '40vw',
          borderRadius: '9999px',
          mixBlendMode: 'multiply',
          filter: 'blur(64px)',
          opacity: 0.25,
          backgroundColor: P.accent,
        }}
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blush ambient blob */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '30vw',
          height: '30vw',
          borderRadius: '9999px',
          mixBlendMode: 'multiply',
          filter: 'blur(64px)',
          opacity: 0.3,
          backgroundColor: P.bgMuted,
        }}
        animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Deep rose accent blob */}
      <motion.div
        style={{
          position: 'absolute',
          top: '33%',
          right: '33%',
          width: '20vw',
          height: '20vw',
          borderRadius: '9999px',
          filter: 'blur(64px)',
          opacity: 0.1,
          backgroundColor: P.accentBold,
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Gold pulse ring */}
        <motion.div
          style={{
            marginBottom: '2rem',
            width: '4rem',
            height: '4rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: `1px solid ${P.accent}`,
          }}
          variants={elasticScaleVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '9999px',
              backgroundColor: P.accent,
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '9999px',
              border: `1px solid ${P.accent}`,
            }}
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </motion.div>

        {/* Brand name — character stagger */}
        <motion.h1
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 400,
            letterSpacing: '-0.025em',
            color: P.primary,
            margin: 0,
          }}
          variants={charContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {brandName.split('').map((char, i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block' }}
              variants={charVariants}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          style={{
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
            width: '3rem',
            height: '1px',
            backgroundColor: P.accent,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Tagline */}
        <motion.p
          style={{
            fontSize: '1.25rem',
            fontWeight: 300,
            letterSpacing: '0.025em',
            color: P.textSecondary,
            margin: 0,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
        >
          A community for the modern digital era
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── Scene 1: Empowering ──────────────────────────────────────────────────────

function Scene1Empowering() {
  return (
    <motion.div
      style={{
        ...absoluteFill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      variants={sceneTransitions.clipCircle}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Deep navy background */}
      <div style={{ ...absoluteFill, backgroundColor: P.primary }} />

      {/* Warm nude ambient radial */}
      <motion.div
        style={{
          ...absoluteFill,
          background: `radial-gradient(ellipse at 30% 60%, ${P.secondary} 0%, transparent 55%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 3, ease: 'easeOut' }}
      />

      {/* Gold glow — top right */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-5rem',
          right: 0,
          width: '40vw',
          height: '40vw',
          borderRadius: '9999px',
          filter: 'blur(64px)',
          opacity: 0.1,
          backgroundColor: P.accent,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Gold circle — top left geometric accent */}
      <motion.div
        style={{
          position: 'absolute',
          top: '3rem',
          left: '3rem',
          width: '6rem',
          height: '6rem',
          borderRadius: '9999px',
          border: 'rgba(201, 169, 110, 0.3) 0.5px solid',
        }}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 90 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Gold line — bottom right geometric accent */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '3rem',
          right: '3rem',
          width: '8rem',
          height: '1px',
          backgroundColor: 'rgba(201, 169, 110, 0.3)',
          transformOrigin: 'right center',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '56rem',
          padding: '0 4rem',
          textAlign: 'center',
        }}
      >
        {/* "Empowering women" */}
        <div style={{ overflow: 'hidden', marginBottom: '1rem' }}>
          <motion.h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.25,
              color: P.textInverse,
              margin: 0,
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Empowering women
          </motion.h2>
        </div>

        {/* "to lead & thrive" — gold italic */}
        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.25,
              fontStyle: 'italic',
              color: P.accent,
              margin: 0,
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            to lead &amp; thrive
          </motion.h2>
        </div>

        {/* Gold vertical divider */}
        <motion.div
          style={{
            marginTop: '3rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '1px',
            height: '4rem',
            backgroundColor: P.accent,
            opacity: 0.5,
            transformOrigin: 'top',
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </div>
    </motion.div>
  );
}

// ─── Scene 2: Tech ────────────────────────────────────────────────────────────

function Scene2Tech() {
  return (
    <motion.div
      style={{
        ...absoluteFill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      variants={sceneTransitions.wipe}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Soft blush background */}
      <div style={{ ...absoluteFill, backgroundColor: P.bgMuted }} />

      {/* Warm nude subtle grid */}
      <div
        style={{
          ...absoluteFill,
          opacity: 0.4,
          backgroundImage: `linear-gradient(${P.secondary} 1px, transparent 1px), linear-gradient(90deg, ${P.secondary} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Gold ambient glow — bottom left */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-5rem',
          left: '-5rem',
          width: '50vw',
          height: '50vw',
          borderRadius: '9999px',
          filter: 'blur(64px)',
          opacity: 0.12,
          backgroundColor: P.accent,
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '64rem',
          padding: '0 4rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4rem',
        }}
      >
        {/* Left: text */}
        <div style={{ flex: 1, textAlign: 'left' }}>
          <motion.div
            style={{
              fontSize: '0.875rem',
              fontFamily: FONT_MONO,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              color: P.accent,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Focusing on the future
          </motion.div>

          <motion.h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: P.primary,
              margin: 0,
              marginBottom: '1.5rem',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            AI &amp; Web3
          </motion.h2>

          <motion.p
            style={{
              fontSize: '1.25rem',
              fontWeight: 300,
              lineHeight: 1.625,
              maxWidth: '32rem',
              color: P.textPrimary,
              margin: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Mastering the technologies that shape tomorrow&apos;s economy.
          </motion.p>
        </div>

        {/* Right: abstract geometry */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            height: '400px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Outer slow ring — navy */}
          <motion.div
            style={{
              position: 'absolute',
              width: '16rem',
              height: '16rem',
              borderRadius: '9999px',
              border: `0.5px solid ${P.primary}`,
              opacity: 0.2,
            }}
            initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 0.2, rotate: 180 }}
            transition={{ duration: 4, ease: 'linear' }}
          />

          {/* Middle ring — gold */}
          <motion.div
            style={{
              position: 'absolute',
              width: '12rem',
              height: '12rem',
              borderRadius: '9999px',
              border: `1px solid ${P.accent}`,
              opacity: 0.6,
            }}
            initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
            animate={{ scale: 1, opacity: 0.6, rotate: -90 }}
            transition={{ duration: 4, ease: 'linear', delay: 0.2 }}
          />

          {/* Inner filled circle — gold */}
          <motion.div
            style={{
              position: 'absolute',
              width: '8rem',
              height: '8rem',
              borderRadius: '9999px',
              backgroundColor: P.accent,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
          />

          {/* Center dot — deep rose */}
          <motion.div
            style={{
              position: 'absolute',
              width: '1rem',
              height: '1rem',
              borderRadius: '9999px',
              backgroundColor: P.accentBold,
              zIndex: 10,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.9 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scene 3: Leverage ────────────────────────────────────────────────────────

function Scene3Leverage() {
  return (
    <motion.div
      style={{
        ...absoluteFill,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      variants={sceneTransitions.scaleFade}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Warm nude background */}
      <div style={{ ...absoluteFill, backgroundColor: P.secondary }} />

      {/* Gold radial glow */}
      <motion.div
        style={{
          ...absoluteFill,
          background: `radial-gradient(circle at 50% 50%, ${P.accent} 0%, transparent 55%)`,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.18 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />

      {/* Deep rose corner accent */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '30vw',
          height: '30vw',
          borderRadius: '9999px',
          filter: 'blur(64px)',
          opacity: 0.07,
          backgroundColor: P.accentBold,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '56rem',
          padding: '0 2rem',
        }}
      >
        {/* Gold diamond mark */}
        <motion.div
          style={{
            width: '3rem',
            height: '3rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '2.5rem',
            border: `2px solid ${P.accent}`,
            transformOrigin: 'center',
          }}
          initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 45, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: P.primary,
            margin: 0,
            marginBottom: '1rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Leverage in Business
        </motion.h2>

        <motion.h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 500,
            letterSpacing: '-0.025em',
            color: P.primary,
            margin: 0,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          &amp; Personal Life.
        </motion.h2>

        {/* Gold divider with wordmark */}
        <motion.div
          style={{
            marginTop: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span
            style={{
              width: '2rem',
              height: '1px',
              backgroundColor: P.accent,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: FONT_MONO,
              color: P.textSecondary,
            }}
          >
            Metahers
          </span>
          <span
            style={{
              width: '2rem',
              height: '1px',
              backgroundColor: P.accent,
              display: 'inline-block',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

const SCENE_DURATIONS = {
  brand:      5000,
  empowering: 5000,
  tech:       5000,
  leverage:   5000,
};

interface MetahersHeroVideoProps {
  /** Override or extend the root container's styles. */
  style?: CSSProperties;
}

/**
 * MetahersHeroVideo — drop in wherever you want the animation to play.
 *
 * The component fills its parent container (width: 100%, height: 100%).
 * Make sure the parent has an explicit height:
 *
 *   // Full viewport:
 *   <div style={{ height: '100vh' }}><MetahersHeroVideo /></div>
 *
 *   // Fixed card:
 *   <div style={{ height: '600px' }}><MetahersHeroVideo /></div>
 */
export default function MetahersHeroVideo({ style }: MetahersHeroVideoProps = {}) {
  const currentScene = useVideoPlayer(SCENE_DURATIONS);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: P.bgLight,
        ...style,
      }}
    >
      <AnimatePresence mode="wait">
        {currentScene === 0 && <Scene0BrandReveal  key="brand" />}
        {currentScene === 1 && <Scene1Empowering   key="empowering" />}
        {currentScene === 2 && <Scene2Tech         key="tech" />}
        {currentScene === 3 && <Scene3Leverage     key="leverage" />}
      </AnimatePresence>
    </div>
  );
}
