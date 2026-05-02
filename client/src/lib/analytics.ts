// Event tracking utilities for Google Analytics and other analytics tools

declare global {
  interface Window {
    trackEvent?: (eventName: string, eventParams?: Record<string, any>) => void;
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
    __metaPixelLoaded?: boolean;
    dataLayer?: any[];
  }
}

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

const META_STANDARD_EVENTS: Record<string, string> = {
  sign_up: "CompleteRegistration",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  lead: "Lead",
  quiz_complete: "Lead",
};

function hasValidMetaPixelId() {
  return Boolean(META_PIXEL_ID && META_PIXEL_ID !== "PIXEL_ID_HERE");
}

function loadMetaPixel() {
  if (typeof window === "undefined" || !hasValidMetaPixelId() || window.__metaPixelLoaded) {
    return;
  }

  const fbq = function (...args: any[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }
    fbq.queue.push(args);
  } as any;

  if (!window.fbq) {
    window.fbq = fbq;
    window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode?.insertBefore(script, firstScript);

  window.fbq?.("init", META_PIXEL_ID);
  window.__metaPixelLoaded = true;
}

export function initializeAnalytics() {
  loadMetaPixel();
}

function trackMetaEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined" || !hasValidMetaPixelId()) {
    return;
  }

  loadMetaPixel();
  const metaEventName = META_STANDARD_EVENTS[eventName];
  if (metaEventName) {
    window.fbq?.("track", metaEventName, params);
    return;
  }

  window.fbq?.("trackCustom", eventName, params);
}

/**
 * Track a conversion event (signup, purchase, quiz completion, etc.)
 */
export function trackConversion(eventName: string, params?: {
  value?: number;
  currency?: string;
  tier?: string;
  source?: string;
  [key: string]: any;
}) {
  // Use global trackEvent function if available (defined in index.html)
  if (typeof window !== 'undefined' && window.trackEvent) {
    window.trackEvent(eventName, params);
  }

  trackMetaEvent(eventName, params);
  
  // Also log to console for debugging
  // Analytics: ${eventName}`, params);
}

/**
 * Track signup event
 */
export function trackSignup(source?: string, tier?: string) {
  trackConversion('sign_up', {
    method: 'email',
    source: source || 'direct',
    tier: tier || 'free',
  });
}

/**
 * Track purchase/checkout initiation
 */
export function trackCheckout(tier: string, value: number) {
  trackConversion('begin_checkout', {
    currency: 'USD',
    value: value,
    tier: tier,
    items: [{
      item_id: tier,
      item_name: `MetaHers ${tier}`,
      price: value,
    }],
  });
}

/**
 * Track quiz completion
 */
export function trackQuizComplete(matchedRitual: string) {
  trackConversion('quiz_complete', {
    ritual: matchedRitual,
  });
}

/**
 * Track ritual start/completion
 */
export function trackRitualStart(ritualSlug: string) {
  trackConversion('ritual_start', {
    ritual_slug: ritualSlug,
  });
}

export function trackRitualComplete(ritualSlug: string) {
  trackConversion('ritual_complete', {
    ritual_slug: ritualSlug,
  });
}

/**
 * Track CTA clicks
 */
export function trackCTAClick(ctaName: string, destination?: string, tier?: string) {
  trackConversion('cta_click', {
    cta_name: ctaName,
    destination: destination,
    tier: tier,
  });
}

/**
 * Track page views
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }

  if (typeof window !== "undefined" && hasValidMetaPixelId()) {
    loadMetaPixel();
    window.fbq?.("track", "PageView");
  }
}
