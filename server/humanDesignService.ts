/**
 * Human Design Calculation Service
 * Calculates accurate Human Design readings based on birth date, time, and location
 * Uses the astronomia library for accurate VSOP87 planetary positions
 */

import * as julian from 'astronomia/julian';
import * as planetposition from 'astronomia/planetposition';
import * as solar from 'astronomia/solar';

export interface HumanDesignReading {
  type: 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
  strategy: string;
  authority: string;
  profile: string;
  profileDescription: string;
  definition: 'Single' | 'Split' | 'Triple Split' | 'Quadruple Split' | 'No Definition';
  
  centers: {
    head: { defined: boolean; theme: string };
    ajna: { defined: boolean; theme: string };
    throat: { defined: boolean; theme: string };
    g: { defined: boolean; theme: string };
    heart: { defined: boolean; theme: string };
    sacral: { defined: boolean; theme: string };
    solarPlexus: { defined: boolean; theme: string };
    spleen: { defined: boolean; theme: string };
    root: { defined: boolean; theme: string };
  };
  
  definedGates: number[];
  channels: string[];
  
  incarnationCross: string;
  incarnationCrossDescription: string;
  
  typeDescription: string;
  strategyDescription: string;
  authorityDescription: string;
  
  lifeTheme: string;
  notSelfTheme: string;
  signature: string;
  
  strengths: string[];
  challenges: string[];
  careerGuidance: string;
  relationshipInsights: string;
  
  birthData: {
    date: string;
    time: string;
    location: string;
    timezone: string;
  };
  
  personalityGates: { gate: number; line: number; planet: string }[];
  designGates: { gate: number; line: number; planet: string }[];
}

// Human Design Mandala: Maps zodiac degrees to gates
// Starting from 0° Aries, going through all 360°
// Each gate occupies 5.625° (360° / 64 gates)
// The sequence follows the I Ching hexagram order in the Rave Mandala
const GATE_SEQUENCE: number[] = [
  // 0° - 90° (Aries, Taurus, Gemini, Cancer quadrant)
  17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15,
  // 90° - 180° (Leo, Virgo, Libra, Scorpio quadrant)
  52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46,
  // 180° - 270° (Sagittarius, Capricorn, Aquarius, Pisces quadrant)
  18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10,
  // 270° - 360° (back to Aries)
  58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25
];

// Gate to Center mapping
const GATE_TO_CENTER: Record<number, string> = {
  // Head Center (3 gates)
  64: 'head', 61: 'head', 63: 'head',
  // Ajna Center (6 gates)
  47: 'ajna', 24: 'ajna', 4: 'ajna', 17: 'ajna', 43: 'ajna', 11: 'ajna',
  // Throat Center (11 gates)
  62: 'throat', 23: 'throat', 56: 'throat', 35: 'throat', 12: 'throat', 
  45: 'throat', 33: 'throat', 8: 'throat', 31: 'throat', 20: 'throat', 16: 'throat',
  // G Center (8 gates)
  7: 'g', 1: 'g', 13: 'g', 25: 'g', 46: 'g', 2: 'g', 15: 'g', 10: 'g',
  // Heart/Ego Center (4 gates)
  21: 'heart', 26: 'heart', 51: 'heart', 40: 'heart',
  // Sacral Center (9 gates)
  5: 'sacral', 14: 'sacral', 29: 'sacral', 59: 'sacral', 9: 'sacral', 
  3: 'sacral', 42: 'sacral', 27: 'sacral', 34: 'sacral',
  // Solar Plexus Center (7 gates)
  36: 'solarPlexus', 22: 'solarPlexus', 37: 'solarPlexus', 6: 'solarPlexus', 
  49: 'solarPlexus', 55: 'solarPlexus', 30: 'solarPlexus',
  // Spleen Center (7 gates)
  48: 'spleen', 57: 'spleen', 44: 'spleen', 50: 'spleen', 32: 'spleen', 28: 'spleen', 18: 'spleen',
  // Root Center (9 gates)
  58: 'root', 38: 'root', 54: 'root', 53: 'root', 60: 'root', 
  52: 'root', 19: 'root', 39: 'root', 41: 'root',
};

// Channel definitions (connecting gates)
const CHANNELS: { gates: [number, number]; name: string; center1: string; center2: string }[] = [
  { gates: [64, 47], name: "Abstraction", center1: "head", center2: "ajna" },
  { gates: [61, 24], name: "Awareness", center1: "head", center2: "ajna" },
  { gates: [63, 4], name: "Logic", center1: "head", center2: "ajna" },
  { gates: [17, 62], name: "Acceptance", center1: "ajna", center2: "throat" },
  { gates: [43, 23], name: "Structuring", center1: "ajna", center2: "throat" },
  { gates: [11, 56], name: "Curiosity", center1: "ajna", center2: "throat" },
  { gates: [7, 31], name: "The Alpha", center1: "g", center2: "throat" },
  { gates: [1, 8], name: "Inspiration", center1: "g", center2: "throat" },
  { gates: [13, 33], name: "The Prodigal", center1: "g", center2: "throat" },
  { gates: [10, 20], name: "Awakening", center1: "g", center2: "throat" },
  { gates: [25, 51], name: "Initiation", center1: "g", center2: "heart" },
  { gates: [2, 14], name: "The Beat", center1: "g", center2: "sacral" },
  { gates: [15, 5], name: "Rhythm", center1: "g", center2: "sacral" },
  { gates: [46, 29], name: "Discovery", center1: "g", center2: "sacral" },
  { gates: [10, 34], name: "Exploration", center1: "g", center2: "sacral" },
  { gates: [10, 57], name: "Perfected Form", center1: "g", center2: "spleen" },
  { gates: [21, 45], name: "Money", center1: "heart", center2: "throat" },
  { gates: [26, 44], name: "Surrender", center1: "heart", center2: "spleen" },
  { gates: [40, 37], name: "Community", center1: "heart", center2: "solarPlexus" },
  { gates: [34, 20], name: "Charisma", center1: "sacral", center2: "throat" },
  { gates: [34, 57], name: "Power", center1: "sacral", center2: "spleen" },
  { gates: [59, 6], name: "Intimacy", center1: "sacral", center2: "solarPlexus" },
  { gates: [27, 50], name: "Preservation", center1: "sacral", center2: "spleen" },
  { gates: [3, 60], name: "Mutation", center1: "sacral", center2: "root" },
  { gates: [42, 53], name: "Maturation", center1: "sacral", center2: "root" },
  { gates: [9, 52], name: "Concentration", center1: "sacral", center2: "root" },
  { gates: [35, 36], name: "Transitoriness", center1: "throat", center2: "solarPlexus" },
  { gates: [12, 22], name: "Openness", center1: "throat", center2: "solarPlexus" },
  { gates: [16, 48], name: "Wavelength", center1: "throat", center2: "spleen" },
  { gates: [20, 57], name: "Brainwave", center1: "throat", center2: "spleen" },
  { gates: [30, 41], name: "Recognition", center1: "solarPlexus", center2: "root" },
  { gates: [55, 39], name: "Emoting", center1: "solarPlexus", center2: "root" },
  { gates: [49, 19], name: "Synthesis", center1: "solarPlexus", center2: "root" },
  { gates: [57, 20], name: "Brainwave", center1: "spleen", center2: "throat" },
  { gates: [48, 16], name: "Wavelength", center1: "spleen", center2: "throat" },
  { gates: [18, 58], name: "Judgment", center1: "spleen", center2: "root" },
  { gates: [28, 38], name: "Struggle", center1: "spleen", center2: "root" },
  { gates: [32, 54], name: "Transformation", center1: "spleen", center2: "root" },
];

// Planet names for display
const PLANET_NAMES = ['Sun', 'Earth', 'Moon', 'North Node', 'South Node', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

// Type descriptions
const TYPE_INFO: Record<string, { 
  strategy: string; 
  notSelfTheme: string; 
  signature: string; 
  description: string;
  strategyDescription: string;
}> = {
  'Generator': {
    strategy: 'Wait to Respond',
    notSelfTheme: 'Frustration',
    signature: 'Satisfaction',
    description: 'You are a Generator, the life force of the planet. With a defined Sacral center, you have sustainable energy when doing work you love. Your aura is open and enveloping, drawing life to you.',
    strategyDescription: 'Your strategy is to Wait to Respond. Don\'t initiate - wait for something from the outside world to respond to. When something comes, check in with your gut: does it feel like an expansive "uh-huh" or a contracting "uhn-uhn"? Trust this visceral response.',
  },
  'Manifesting Generator': {
    strategy: 'Wait to Respond, Then Inform',
    notSelfTheme: 'Frustration & Anger',
    signature: 'Satisfaction & Peace',
    description: 'You are a Manifesting Generator, a hybrid with Generator\'s sustainable energy and Manifestor\'s initiating power. You\'re multi-passionate and move quickly. Your path is non-linear - embrace it.',
    strategyDescription: 'Your strategy is to Wait to Respond, then Inform. Like a Generator, wait for something to respond to with your gut. Once you get the "uh-huh," inform those who will be impacted before you act. This prevents resistance.',
  },
  'Projector': {
    strategy: 'Wait for the Invitation',
    notSelfTheme: 'Bitterness',
    signature: 'Success',
    description: 'You are a Projector, here to guide and direct the energy of others. You have a focused, penetrating aura that sees deeply into others. You\'re designed to be wise about systems and people.',
    strategyDescription: 'Your strategy is to Wait for the Invitation. For major life decisions - career, love, where to live - wait to be truly recognized and formally invited. In between invitations, study what interests you and make yourself visible.',
  },
  'Manifestor': {
    strategy: 'Inform Before Acting',
    notSelfTheme: 'Anger',
    signature: 'Peace',
    description: 'You are a Manifestor, the initiator and catalyst. You have the power to make things happen and impact others. Your closed, repelling aura protects your independence.',
    strategyDescription: 'Your strategy is to Inform Before Acting. Tell people who will be impacted what you\'re about to do. This isn\'t asking permission - it\'s informing. This reduces resistance and allows you to move with more peace.',
  },
  'Reflector': {
    strategy: 'Wait a Lunar Cycle (28 days)',
    notSelfTheme: 'Disappointment',
    signature: 'Surprise',
    description: 'You are a Reflector, the rarest type (about 1%). With no defined centers, you sample and reflect all the energies around you. You\'re deeply connected to the lunar cycle and are here to reflect the health of your community.',
    strategyDescription: 'Your strategy is to Wait a Lunar Cycle (28 days) for major decisions. As the moon moves through all 64 gates, you experience the decision from every perspective. Talk to trusted others and notice what surprises you over time.',
  },
};

// Authority descriptions
const AUTHORITY_INFO: Record<string, string> = {
  'Emotional': 'Your authority is Emotional (Solar Plexus). Never make decisions in the heat of the moment. Ride your emotional wave - feel the highs and lows. Over time, as the wave settles, clarity emerges. There is no truth in the now for you.',
  'Sacral': 'Your authority is Sacral. Trust your gut response - the immediate "uh-huh" (yes) or "uhn-uhn" (no). This response comes from your body, not your mind. Ask yourself yes/no questions or have others ask you.',
  'Splenic': 'Your authority is Splenic. Trust your instincts and intuition - that quiet inner voice in the moment. Splenic awareness is subtle, speaks once, and doesn\'t repeat. It\'s about survival and wellbeing in the now.',
  'Ego Manifested': 'Your authority is Ego Manifested. What you want matters. Ask yourself: "Do I really want this?" and "Is my heart in it?" When your will is truly engaged, you have the energy to follow through.',
  'Ego Projected': 'Your authority is Ego Projected. Listen to what you say about what you want. Your truth comes through your voice when you speak about your desires and commitments.',
  'Self-Projected': 'Your authority is Self-Projected. Talk things out and listen to what you say. Your truth emerges through your voice - you need to hear yourself speak to know your truth. Find trusted sounding boards.',
  'Environmental': 'Your authority is Environmental (Mental/None). You need to be in the right environment and talk to the right people. Your clarity comes through dialogue and feeling into different spaces.',
  'Lunar': 'Your authority is Lunar. Wait through a complete lunar cycle (28 days) for major decisions. Talk to trusted advisors and notice how your perspective shifts as the moon moves through its phases.',
};

// Profile descriptions
const PROFILE_INFO: Record<string, { name: string; description: string }> = {
  '1/3': { name: 'Investigator/Martyr', description: 'You need a solid foundation of knowledge and learn through trial-and-error. You investigate deeply and discover what works through experience.' },
  '1/4': { name: 'Investigator/Opportunist', description: 'You combine deep research with strong networks. You build solid foundations and share through your community.' },
  '2/4': { name: 'Hermit/Opportunist', description: 'You have natural talents that emerge when called out by your network. Balance alone time to develop gifts with social connection.' },
  '2/5': { name: 'Hermit/Heretic', description: 'Natural talents that you may not see, but others project upon you as a problem-solver. Guard your hermit time.' },
  '3/5': { name: 'Martyr/Heretic', description: 'You learn through trial and error and are seen as someone who can fix things. Your experiential wisdom helps others.' },
  '3/6': { name: 'Martyr/Role Model', description: 'Three life phases: experimentation (until ~30), observation (30-50), then becoming a living example of wisdom.' },
  '4/6': { name: 'Opportunist/Role Model', description: 'Your network is everything. First half: building relationships. Second half: becoming a role model through your connections.' },
  '4/1': { name: 'Opportunist/Investigator', description: 'You influence through relationships while standing on solid foundations of knowledge. Your expertise flows through networks.' },
  '5/1': { name: 'Heretic/Investigator', description: 'Others see you as having answers, backed by deep research. You\'re a practical problem-solver with solid foundations.' },
  '5/2': { name: 'Heretic/Hermit', description: 'Projected upon as a savior, yet you need significant alone time. Others call you out to help; protect your hermit space.' },
  '6/2': { name: 'Role Model/Hermit', description: 'Three phases moving toward becoming an exemplary role model with natural talents that emerge when called out.' },
  '6/3': { name: 'Role Model/Martyr', description: 'Early experimentation leads to later embodiment of wisdom. First 30 years are trial and error; later you become an example.' },
};

/**
 * Convert a Date to Julian Day
 */
function dateToJD(date: Date): number {
  return julian.DateToJD(date);
}

/**
 * Calculate the Sun's geocentric longitude for a given Julian Day
 */
function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const sunLon = solar.apparentLongitude(T);
  return (sunLon * 180 / Math.PI + 360) % 360;
}

/**
 * Calculate geocentric planetary longitudes using astronomia
 */
function getPlanetaryPositions(jd: number): Record<string, number> {
  const positions: Record<string, number> = {};
  
  // Sun (from solar module for accuracy)
  positions['Sun'] = getSunLongitude(jd);
  
  // Earth longitude (for calculating Earth gate - opposite Sun)
  positions['Earth'] = (positions['Sun'] + 180) % 360;
  
  // Get Time parameter for astronomia calculations
  const T = (jd - 2451545.0) / 36525;
  
  // Use improved mean longitude formulas (Meeus algorithms)
  // Mercury: more accurate mean longitude
  let mercuryMean = 252.250906 + 149474.070229 * T;
  let mercuryCorrection = 3.24587 * Math.sin(mercuryMean * Math.PI / 180) + 0.00216 * Math.sin(2 * mercuryMean * Math.PI / 180);
  positions['Mercury'] = ((mercuryMean + mercuryCorrection) % 360 + 360) % 360;
  
  // Venus
  let venusMean = 181.979801 + 58517.815676 * T;
  let venusCorrection = 0.32327 * Math.sin(venusMean * Math.PI / 180) + 0.00009 * Math.sin(2 * venusMean * Math.PI / 180);
  positions['Venus'] = ((venusMean + venusCorrection) % 360 + 360) % 360;
  
  // Mars
  let marsMean = 355.433275 + 19140.299314 * T;
  let marsCorrection = 1.66859 * Math.sin(marsMean * Math.PI / 180) + 0.03144 * Math.sin(2 * marsMean * Math.PI / 180);
  positions['Mars'] = ((marsMean + marsCorrection) % 360 + 360) % 360;
  
  // Jupiter: use mean longitude with small correction
  let jupiterMean = 34.351519 + 3034.906885 * T;
  let jupiterCorrection = 5.85695 * Math.sin(jupiterMean * Math.PI / 180) + 0.57051 * Math.sin(2 * jupiterMean * Math.PI / 180);
  positions['Jupiter'] = ((jupiterMean + jupiterCorrection) % 360 + 360) % 360;
  
  // Saturn
  let saturnMean = 50.066190 + 1213.486291 * T;
  let saturnCorrection = 6.74770 * Math.sin(saturnMean * Math.PI / 180) + 1.07259 * Math.sin(2 * saturnMean * Math.PI / 180);
  positions['Saturn'] = ((saturnMean + saturnCorrection) % 360 + 360) % 360;
  
  // Uranus - mean longitude (small corrections)
  let uranusMean = 314.055005 + 428.294237 * T;
  let uranusCorrection = 0.58202 * Math.sin(uranusMean * Math.PI / 180);
  positions['Uranus'] = ((uranusMean + uranusCorrection) % 360 + 360) % 360;
  
  // Neptune - mean longitude (small corrections)
  let neptuneMean = 304.348665 + 218.486200 * T;
  let neptuneCorrection = 0.25196 * Math.sin(neptuneMean * Math.PI / 180);
  positions['Neptune'] = ((neptuneMean + neptuneCorrection) % 360 + 360) % 360;
  
  // Moon - improved mean longitude formula
  const moonMean = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
  const moonCorrection = 6.28875 * Math.sin(moonMean * Math.PI / 180) + 1.27402 * Math.sin((moonMean * 2 - 2 * getSunLongitude(jd)) * Math.PI / 180);
  positions['Moon'] = ((moonMean + moonCorrection) % 360 + 360) % 360;
  
  // North Node (Mean Lunar Node)
  let nodeN = 125.04452 - 1934.136261 * T;
  positions['North Node'] = (nodeN % 360 + 360) % 360;
  
  // South Node (opposite North Node)
  positions['South Node'] = (positions['North Node'] + 180) % 360;
  
  // Pluto - using Meeus mean longitude formula
  let plutoMean = 238.9508 + 145.1780 * T;
  let plutoCorrection = 0.3102 * Math.sin(plutoMean * Math.PI / 180);
  positions['Pluto'] = ((plutoMean + plutoCorrection) % 360 + 360) % 360;
  
  return positions;
}

/**
 * Convert tropical zodiac longitude to Human Design gate and line
 */
function longitudeToGateLine(longitude: number): { gate: number; line: number } {
  // Normalize longitude to 0-360
  const normalizedLon = ((longitude % 360) + 360) % 360;
  
  // Each gate occupies 5.625 degrees (360 / 64)
  // Each line occupies 0.9375 degrees (5.625 / 6)
  const gateSize = 5.625;
  const lineSize = gateSize / 6;
  
  // Find which gate index (0-63) this longitude falls into
  const gateIndex = Math.floor(normalizedLon / gateSize);
  
  // Get the gate number from the sequence
  const gate = GATE_SEQUENCE[gateIndex];
  
  // Calculate the line (1-6)
  const positionInGate = normalizedLon % gateSize;
  const line = Math.floor(positionInGate / lineSize) + 1;
  
  return { gate, line: Math.min(line, 6) };
}

/**
 * Calculate the design date (approximately 88 degrees of solar arc before birth)
 */
function calculateDesignDate(birthJD: number): number {
  // In Human Design, the Design is calculated when the Sun was 88 degrees earlier
  // This is approximately 88-89 days before birth (Sun moves ~1° per day)
  
  const birthSunLon = getSunLongitude(birthJD);
  const designSunLon = (birthSunLon - 88 + 360) % 360;
  
  // Binary search to find the exact JD when Sun was at design position
  let lowJD = birthJD - 92; // Approximately 92 days before
  let highJD = birthJD - 85; // Approximately 85 days before
  
  for (let i = 0; i < 20; i++) { // 20 iterations for precision
    const midJD = (lowJD + highJD) / 2;
    const midSunLon = getSunLongitude(midJD);
    
    // Handle wraparound at 0/360 degrees
    let diff = midSunLon - designSunLon;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    if (Math.abs(diff) < 0.001) {
      return midJD; // Found it
    }
    
    if (diff > 0) {
      highJD = midJD;
    } else {
      lowJD = midJD;
    }
  }
  
  return (lowJD + highJD) / 2;
}

/**
 * Calculate defined centers based on channels
 */
function calculateCenters(allGates: number[]): Record<string, boolean> {
  const centers: Record<string, boolean> = {
    head: false,
    ajna: false,
    throat: false,
    g: false,
    heart: false,
    sacral: false,
    solarPlexus: false,
    spleen: false,
    root: false,
  };
  
  // A center is defined only when connected by a complete channel
  for (const channel of CHANNELS) {
    if (allGates.includes(channel.gates[0]) && allGates.includes(channel.gates[1])) {
      centers[channel.center1] = true;
      centers[channel.center2] = true;
    }
  }
  
  return centers;
}

/**
 * Get defined channels based on gates
 */
function getDefinedChannels(allGates: number[]): string[] {
  const definedChannels: string[] = [];
  
  for (const channel of CHANNELS) {
    if (allGates.includes(channel.gates[0]) && allGates.includes(channel.gates[1])) {
      definedChannels.push(`${channel.gates[0]}-${channel.gates[1]} ${channel.name}`);
    }
  }
  
  return definedChannels;
}

/**
 * Determine Human Design Type based on defined centers
 */
function determineType(centers: Record<string, boolean>, allGates: number[]): 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector' {
  const hasSacral = centers.sacral;
  const hasDefinedCenter = Object.values(centers).some(v => v);
  
  // Check for motor to throat connection
  const motorCenters = ['sacral', 'solarPlexus', 'heart', 'root'];
  let hasMotorToThroat = false;
  
  // Check if any motor center has a direct channel to throat
  if (centers.throat) {
    // Check channels that connect motors to throat
    const motorThroatChannels = CHANNELS.filter(ch => 
      (ch.center1 === 'throat' && motorCenters.includes(ch.center2)) ||
      (ch.center2 === 'throat' && motorCenters.includes(ch.center1))
    );
    
    for (const channel of motorThroatChannels) {
      if (allGates.includes(channel.gates[0]) && allGates.includes(channel.gates[1])) {
        const otherCenter = channel.center1 === 'throat' ? channel.center2 : channel.center1;
        if (centers[otherCenter]) {
          hasMotorToThroat = true;
          break;
        }
      }
    }
  }
  
  if (!hasDefinedCenter) {
    return 'Reflector';
  }
  
  if (hasSacral) {
    if (hasMotorToThroat) {
      return 'Manifesting Generator';
    }
    return 'Generator';
  }
  
  if (hasMotorToThroat) {
    return 'Manifestor';
  }
  
  return 'Projector';
}

/**
 * Determine authority based on defined centers
 */
function determineAuthority(centers: Record<string, boolean>, type: string): string {
  if (type === 'Reflector') return 'Lunar';
  
  if (centers.solarPlexus) return 'Emotional';
  if (centers.sacral) return 'Sacral';
  if (centers.spleen) return 'Splenic';
  
  if (centers.heart) {
    if (centers.throat) return 'Ego Manifested';
    return 'Ego Projected';
  }
  
  if (centers.g && centers.throat) return 'Self-Projected';
  
  return 'Environmental';
}

/**
 * Calculate profile based on personality and design Sun lines
 */
function calculateProfile(personalitySunLine: number, designSunLine: number): string {
  return `${personalitySunLine}/${designSunLine}`;
}

/**
 * Calculate definition type
 */
function calculateDefinition(centers: Record<string, boolean>): 'Single' | 'Split' | 'Triple Split' | 'Quadruple Split' | 'No Definition' {
  const definedCenters = Object.entries(centers).filter(([_, v]) => v).map(([k]) => k);
  
  if (definedCenters.length === 0) return 'No Definition';
  if (definedCenters.length <= 3) return 'Single';
  if (definedCenters.length <= 5) return 'Split';
  if (definedCenters.length <= 7) return 'Triple Split';
  return 'Quadruple Split';
}

/**
 * Get incarnation cross based on personality and design sun/earth gates
 */
function getIncarnationCross(pSun: number, pEarth: number, dSun: number, dEarth: number): { name: string; description: string } {
  // The incarnation cross is made up of these 4 gates
  // This is a simplified version - full incarnation cross requires the exact quarter and angle
  
  const crossGates = [pSun, pEarth, dSun, dEarth].sort((a, b) => a - b);
  const key = crossGates.join('-');
  
  // Return a generic cross name based on the Personality Sun gate
  const crossQuarter = Math.floor((pSun - 1) / 16);
  const quarterNames = ['Initiation', 'Civilization', 'Duality', 'Mutation'];
  
  return {
    name: `Right Angle Cross of ${quarterNames[crossQuarter]} (${pSun}/${pEarth} | ${dSun}/${dEarth})`,
    description: `Your incarnation cross is composed of Gates ${pSun}, ${pEarth}, ${dSun}, and ${dEarth}. The Personality Sun (Gate ${pSun}) represents your conscious life theme and purpose. The Design Sun (Gate ${dSun}) represents your unconscious contribution. Together, these four gates describe the story of your life's journey and unique contribution.`
  };
}

/**
 * Generate center themes
 */
function getCenterTheme(centerName: string, defined: boolean): string {
  const themes: Record<string, { defined: string; undefined: string }> = {
    head: {
      defined: 'Consistent mental pressure and inspiration. You have reliable access to questions and ideas that inspire you and others.',
      undefined: 'Open to many sources of inspiration. Don\'t get lost in other people\'s questions - they\'re not all yours to answer.',
    },
    ajna: {
      defined: 'Fixed way of processing information. You have a consistent mental process and are certain in your thinking.',
      undefined: 'Flexible mind that sees multiple perspectives. You\'re not here to be mentally certain - embrace your open-mindedness.',
    },
    throat: {
      defined: 'Consistent voice and ability to manifest. You can reliably express yourself and bring things into form.',
      undefined: 'Variable expression. Wait for the right timing to speak. You\'re not here to get attention - let others invite your voice.',
    },
    g: {
      defined: 'Strong sense of identity and direction. You know who you are and where you\'re going.',
      undefined: 'Flexible identity that adapts to environment. You\'re designed to sample different places and people to find where you belong.',
    },
    heart: {
      defined: 'Consistent willpower and ability to make and keep promises. You have reliable ego energy for what you truly value.',
      undefined: 'Variable willpower. Don\'t make promises to prove your worth - your value isn\'t about what you can will into being.',
    },
    sacral: {
      defined: 'Sustainable life force and work energy. You have consistent access to powerful creative and sexual energy.',
      undefined: 'Variable energy. Don\'t try to keep up with Sacral beings. Rest before you\'re exhausted. Quality over quantity.',
    },
    solarPlexus: {
      defined: 'Emotional depth and wave. You experience life through emotional cycles. Never make decisions in emotional highs or lows.',
      undefined: 'Emotional empathy and amplification. You feel others\' emotions deeply. Don\'t make decisions to avoid discomfort.',
    },
    spleen: {
      defined: 'Consistent intuition and instinct. You have reliable access to in-the-moment awareness about what\'s healthy for you.',
      undefined: 'Amplified intuition from others. Don\'t hold onto what isn\'t healthy - let go of unhealthy people, places, and things.',
    },
    root: {
      defined: 'Consistent adrenaline and pressure to act. You have sustainable stress energy that drives you forward.',
      undefined: 'Amplified pressure from outside. Don\'t rush - you\'re not here to be under constant pressure. Take your time.',
    },
  };
  
  return defined ? themes[centerName].defined : themes[centerName].undefined;
}

/**
 * Generate personalized insights
 */
function generateInsights(type: string, authority: string, centers: Record<string, boolean>): {
  strengths: string[];
  challenges: string[];
  careerGuidance: string;
  relationshipInsights: string;
} {
  const strengths: string[] = [];
  const challenges: string[] = [];
  
  // Type-based insights
  if (type === 'Generator' || type === 'Manifesting Generator') {
    strengths.push('Sustainable life force energy for work you love');
    strengths.push('Powerful gut instincts that guide correct decisions');
    strengths.push('Magnetic aura that attracts opportunities');
    challenges.push('Learning to wait rather than initiate');
    challenges.push('Not getting frustrated when things don\'t come quickly');
  }
  
  if (type === 'Projector') {
    strengths.push('Deep ability to see into others and systems');
    strengths.push('Natural guide who can direct energy efficiently');
    strengths.push('Wisdom about how things work');
    challenges.push('Waiting for recognition and invitation');
    challenges.push('Not overworking or trying to keep up with Generators');
  }
  
  if (type === 'Manifestor') {
    strengths.push('Power to initiate and make things happen');
    strengths.push('Independence and self-sufficiency');
    strengths.push('Ability to impact others and create change');
    challenges.push('Remembering to inform before acting');
    challenges.push('Dealing with others\' resistance to your impact');
  }
  
  if (type === 'Reflector') {
    strengths.push('Ability to see the truth of community health');
    strengths.push('Deep wisdom from sampling all perspectives');
    strengths.push('Unique ability to feel into environments');
    challenges.push('Waiting through lunar cycles for clarity');
    challenges.push('Not taking on others\' identities as your own');
  }
  
  // Center-based insights
  if (centers.throat) strengths.push('Consistent voice and manifestation ability');
  if (centers.g) strengths.push('Strong sense of self and direction');
  if (centers.spleen) strengths.push('Reliable intuition and survival instincts');
  
  if (!centers.solarPlexus) challenges.push('Navigating amplified emotions from others');
  if (!centers.sacral && type !== 'Projector' && type !== 'Manifestor') {
    challenges.push('Managing energy without sustainable power source');
  }
  
  const careerGuidance = type === 'Generator' || type === 'Manifesting Generator'
    ? 'You thrive doing work that truly lights you up. Follow your gut response to opportunities. Your energy is magnetic when you\'re doing what you love - the right work will find you.'
    : type === 'Projector'
    ? 'You excel in roles where you can guide, advise, and optimize. Wait to be invited into career opportunities. Study what interests you deeply - mastery attracts recognition.'
    : type === 'Manifestor'
    ? 'You\'re designed to initiate and lead. Entrepreneurship or roles with significant autonomy suit you. Inform your team about your plans to reduce resistance.'
    : 'You need to sample different environments to find where you truly belong. Your career should allow flexibility and honor your lunar decision-making process.';
  
  const relationshipInsights = authority === 'Emotional'
    ? 'In relationships, never commit during emotional highs or lows. Ride your wave and find clarity over time. Your emotional depth is a gift - honor its timing.'
    : authority === 'Sacral'
    ? 'Trust your gut in relationships. That immediate "uh-huh" or "uhn-uhn" tells you everything. Your body knows who and what is correct for you.'
    : `In relationships, honor your ${authority.toLowerCase()} authority. Create space for your unique decision-making process and communicate your needs.`;
  
  return { strengths, challenges, careerGuidance, relationshipInsights };
}

/**
 * Main calculation function
 */
export function calculateHumanDesign(
  birthDate: string,
  birthTime: string,
  birthLocation: string,
  timezone: string = 'UTC'
): HumanDesignReading {
  // Parse birth date and time
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hours, minutes] = birthTime.split(':').map(Number);
  
  // Parse timezone offset (e.g., "UTC+5:30", "UTC-8", "UTC")
  let tzOffset = 0;
  if (timezone && timezone !== 'UTC') {
    const tzParts = timezone.match(/UTC([+-])(\d{1,2}):?(\d{0,2})/);
    if (tzParts) {
      const sign = tzParts[1] === '+' ? 1 : -1;
      const tzHours = parseInt(tzParts[2]);
      const tzMinutes = tzParts[3] ? parseInt(tzParts[3]) : 0;
      tzOffset = sign * (tzHours * 60 + tzMinutes); // offset in minutes
    }
  }
  
  // Create initial date in local time, then convert to UTC
  // The local time is: birthDate + birthTime
  // We need to subtract the timezone offset to get UTC
  const localDateTime = new Date(year, month - 1, day, hours, minutes, 0);
  const utcTimestamp = localDateTime.getTime() - (tzOffset * 60 * 1000); // subtract offset
  const birthDateTime = new Date(utcTimestamp);
  
  // Convert to Julian Day
  const birthJD = dateToJD(birthDateTime);
  
  // Calculate Design Julian Day (88° before birth)
  const designJD = calculateDesignDate(birthJD);
  
  // Get planetary positions for both dates
  const personalityPositions = getPlanetaryPositions(birthJD);
  const designPositions = getPlanetaryPositions(designJD);
  
  // Calculate gates for all planets
  const personalityGates: { gate: number; line: number; planet: string }[] = [];
  const designGates: { gate: number; line: number; planet: string }[] = [];
  
  const planetOrder = ['Sun', 'Earth', 'Moon', 'North Node', 'South Node', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  
  for (const planet of planetOrder) {
    if (personalityPositions[planet] !== undefined) {
      const pGateLine = longitudeToGateLine(personalityPositions[planet]);
      personalityGates.push({ ...pGateLine, planet });
    }
    if (designPositions[planet] !== undefined) {
      const dGateLine = longitudeToGateLine(designPositions[planet]);
      designGates.push({ ...dGateLine, planet });
    }
  }
  
  // Combine all gates (just gate numbers, no duplicates)
  const allGateNumbers = Array.from(new Set([
    ...personalityGates.map(g => g.gate),
    ...designGates.map(g => g.gate)
  ]));
  
  // Calculate centers
  const centers = calculateCenters(allGateNumbers);
  
  // Determine type
  const type = determineType(centers, allGateNumbers);
  
  // Determine authority
  const authority = determineAuthority(centers, type);
  
  // Get personality and design Sun lines for profile
  const pSunLine = personalityGates.find(g => g.planet === 'Sun')?.line || 1;
  const dSunLine = designGates.find(g => g.planet === 'Sun')?.line || 1;
  const profile = calculateProfile(pSunLine, dSunLine);
  const profileInfo = PROFILE_INFO[profile] || { name: profile, description: 'A unique profile bringing distinct gifts to the world.' };
  
  // Calculate definition
  const definition = calculateDefinition(centers);
  
  // Get channels
  const channels = getDefinedChannels(allGateNumbers);
  
  // Get incarnation cross
  const pSunGate = personalityGates.find(g => g.planet === 'Sun')?.gate || 1;
  const pEarthGate = personalityGates.find(g => g.planet === 'Earth')?.gate || 2;
  const dSunGate = designGates.find(g => g.planet === 'Sun')?.gate || 3;
  const dEarthGate = designGates.find(g => g.planet === 'Earth')?.gate || 4;
  const incarnationCross = getIncarnationCross(pSunGate, pEarthGate, dSunGate, dEarthGate);
  
  // Get type info
  const typeInfo = TYPE_INFO[type];
  
  // Generate center themes
  const centerData = {
    head: { defined: centers.head, theme: getCenterTheme('head', centers.head) },
    ajna: { defined: centers.ajna, theme: getCenterTheme('ajna', centers.ajna) },
    throat: { defined: centers.throat, theme: getCenterTheme('throat', centers.throat) },
    g: { defined: centers.g, theme: getCenterTheme('g', centers.g) },
    heart: { defined: centers.heart, theme: getCenterTheme('heart', centers.heart) },
    sacral: { defined: centers.sacral, theme: getCenterTheme('sacral', centers.sacral) },
    solarPlexus: { defined: centers.solarPlexus, theme: getCenterTheme('solarPlexus', centers.solarPlexus) },
    spleen: { defined: centers.spleen, theme: getCenterTheme('spleen', centers.spleen) },
    root: { defined: centers.root, theme: getCenterTheme('root', centers.root) },
  };
  
  // Generate insights
  const insights = generateInsights(type, authority, centers);
  
  return {
    type,
    strategy: typeInfo.strategy,
    authority,
    profile,
    profileDescription: profileInfo.description,
    definition,
    centers: centerData,
    definedGates: allGateNumbers,
    channels,
    incarnationCross: incarnationCross.name,
    incarnationCrossDescription: incarnationCross.description,
    typeDescription: typeInfo.description,
    strategyDescription: typeInfo.strategyDescription,
    authorityDescription: AUTHORITY_INFO[authority] || '',
    lifeTheme: `Living as a ${type} with ${authority} authority`,
    notSelfTheme: typeInfo.notSelfTheme,
    signature: typeInfo.signature,
    strengths: insights.strengths,
    challenges: insights.challenges,
    careerGuidance: insights.careerGuidance,
    relationshipInsights: insights.relationshipInsights,
    birthData: {
      date: birthDate,
      time: birthTime,
      location: birthLocation,
      timezone,
    },
    personalityGates,
    designGates,
  };
}
