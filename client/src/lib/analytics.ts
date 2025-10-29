// Event tracking utilities for Google Analytics and other analytics tools

declare global {
  interface Window {
    trackEvent?: (eventName: string, eventParams?: Record<string, any>) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
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
  
  // Also log to console for debugging
  console.log(`[Analytics] ${eventName}`, params);
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
}
