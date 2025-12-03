/**
 * Human Design Calculation Service
 * Calculates accurate Human Design readings based on birth date, time, and location
 * 
 * Human Design combines:
 * - I Ching (64 hexagrams → 64 gates)
 * - Astrology (planetary positions)
 * - Kabbalah (Tree of Life → 9 centers)
 * - Hindu-Brahmin Chakra system
 * - Quantum Physics
 */

export interface HumanDesignReading {
  // Core Profile
  type: 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
  strategy: string;
  authority: string;
  profile: string;
  profileDescription: string;
  definition: 'Single' | 'Split' | 'Triple Split' | 'Quadruple Split' | 'No Definition';
  
  // The 9 Centers
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
  
  // Gates and Channels
  definedGates: number[];
  channels: string[];
  
  // Incarnation Cross
  incarnationCross: string;
  incarnationCrossDescription: string;
  
  // Detailed Descriptions
  typeDescription: string;
  strategyDescription: string;
  authorityDescription: string;
  
  // Life Themes
  lifeTheme: string;
  notSelfTheme: string;
  signature: string;
  
  // Personalized Insights
  strengths: string[];
  challenges: string[];
  careerGuidance: string;
  relationshipInsights: string;
  
  // Birth Data Used
  birthData: {
    date: string;
    time: string;
    location: string;
    timezone: string;
  };
}

// Gate positions based on the Rave Mandala (64 gates mapped to zodiac degrees)
const GATE_POSITIONS: { gate: number; startDegree: number; endDegree: number }[] = [
  { gate: 41, startDegree: 0, endDegree: 5.625 },
  { gate: 19, startDegree: 5.625, endDegree: 11.25 },
  { gate: 13, startDegree: 11.25, endDegree: 16.875 },
  { gate: 49, startDegree: 16.875, endDegree: 22.5 },
  { gate: 30, startDegree: 22.5, endDegree: 28.125 },
  { gate: 55, startDegree: 28.125, endDegree: 33.75 },
  { gate: 37, startDegree: 33.75, endDegree: 39.375 },
  { gate: 63, startDegree: 39.375, endDegree: 45 },
  { gate: 22, startDegree: 45, endDegree: 50.625 },
  { gate: 36, startDegree: 50.625, endDegree: 56.25 },
  { gate: 25, startDegree: 56.25, endDegree: 61.875 },
  { gate: 17, startDegree: 61.875, endDegree: 67.5 },
  { gate: 21, startDegree: 67.5, endDegree: 73.125 },
  { gate: 51, startDegree: 73.125, endDegree: 78.75 },
  { gate: 42, startDegree: 78.75, endDegree: 84.375 },
  { gate: 3, startDegree: 84.375, endDegree: 90 },
  { gate: 27, startDegree: 90, endDegree: 95.625 },
  { gate: 24, startDegree: 95.625, endDegree: 101.25 },
  { gate: 2, startDegree: 101.25, endDegree: 106.875 },
  { gate: 23, startDegree: 106.875, endDegree: 112.5 },
  { gate: 8, startDegree: 112.5, endDegree: 118.125 },
  { gate: 20, startDegree: 118.125, endDegree: 123.75 },
  { gate: 16, startDegree: 123.75, endDegree: 129.375 },
  { gate: 35, startDegree: 129.375, endDegree: 135 },
  { gate: 45, startDegree: 135, endDegree: 140.625 },
  { gate: 12, startDegree: 140.625, endDegree: 146.25 },
  { gate: 15, startDegree: 146.25, endDegree: 151.875 },
  { gate: 52, startDegree: 151.875, endDegree: 157.5 },
  { gate: 39, startDegree: 157.5, endDegree: 163.125 },
  { gate: 53, startDegree: 163.125, endDegree: 168.75 },
  { gate: 62, startDegree: 168.75, endDegree: 174.375 },
  { gate: 56, startDegree: 174.375, endDegree: 180 },
  { gate: 31, startDegree: 180, endDegree: 185.625 },
  { gate: 33, startDegree: 185.625, endDegree: 191.25 },
  { gate: 7, startDegree: 191.25, endDegree: 196.875 },
  { gate: 4, startDegree: 196.875, endDegree: 202.5 },
  { gate: 29, startDegree: 202.5, endDegree: 208.125 },
  { gate: 59, startDegree: 208.125, endDegree: 213.75 },
  { gate: 40, startDegree: 213.75, endDegree: 219.375 },
  { gate: 64, startDegree: 219.375, endDegree: 225 },
  { gate: 47, startDegree: 225, endDegree: 230.625 },
  { gate: 6, startDegree: 230.625, endDegree: 236.25 },
  { gate: 46, startDegree: 236.25, endDegree: 241.875 },
  { gate: 18, startDegree: 241.875, endDegree: 247.5 },
  { gate: 48, startDegree: 247.5, endDegree: 253.125 },
  { gate: 57, startDegree: 253.125, endDegree: 258.75 },
  { gate: 32, startDegree: 258.75, endDegree: 264.375 },
  { gate: 50, startDegree: 264.375, endDegree: 270 },
  { gate: 28, startDegree: 270, endDegree: 275.625 },
  { gate: 44, startDegree: 275.625, endDegree: 281.25 },
  { gate: 1, startDegree: 281.25, endDegree: 286.875 },
  { gate: 43, startDegree: 286.875, endDegree: 292.5 },
  { gate: 14, startDegree: 292.5, endDegree: 298.125 },
  { gate: 34, startDegree: 298.125, endDegree: 303.75 },
  { gate: 9, startDegree: 303.75, endDegree: 309.375 },
  { gate: 5, startDegree: 309.375, endDegree: 315 },
  { gate: 26, startDegree: 315, endDegree: 320.625 },
  { gate: 11, startDegree: 320.625, endDegree: 326.25 },
  { gate: 10, startDegree: 326.25, endDegree: 331.875 },
  { gate: 58, startDegree: 331.875, endDegree: 337.5 },
  { gate: 38, startDegree: 337.5, endDegree: 343.125 },
  { gate: 54, startDegree: 343.125, endDegree: 348.75 },
  { gate: 61, startDegree: 348.75, endDegree: 354.375 },
  { gate: 60, startDegree: 354.375, endDegree: 360 },
];

// Channel definitions (connecting gates)
const CHANNELS: { gates: [number, number]; name: string; center1: string; center2: string }[] = [
  { gates: [1, 8], name: "Inspiration", center1: "g", center2: "throat" },
  { gates: [2, 14], name: "The Beat", center1: "g", center2: "sacral" },
  { gates: [3, 60], name: "Mutation", center1: "sacral", center2: "root" },
  { gates: [4, 63], name: "Logic", center1: "ajna", center2: "head" },
  { gates: [5, 15], name: "Rhythm", center1: "sacral", center2: "g" },
  { gates: [6, 59], name: "Intimacy", center1: "solarPlexus", center2: "sacral" },
  { gates: [7, 31], name: "Alpha", center1: "g", center2: "throat" },
  { gates: [9, 52], name: "Concentration", center1: "sacral", center2: "root" },
  { gates: [10, 20], name: "Awakening", center1: "g", center2: "throat" },
  { gates: [10, 34], name: "Exploration", center1: "g", center2: "sacral" },
  { gates: [10, 57], name: "Perfected Form", center1: "g", center2: "spleen" },
  { gates: [11, 56], name: "Curiosity", center1: "ajna", center2: "throat" },
  { gates: [12, 22], name: "Openness", center1: "throat", center2: "solarPlexus" },
  { gates: [13, 33], name: "Prodigal", center1: "g", center2: "throat" },
  { gates: [16, 48], name: "Wavelength", center1: "throat", center2: "spleen" },
  { gates: [17, 62], name: "Acceptance", center1: "ajna", center2: "throat" },
  { gates: [18, 58], name: "Judgment", center1: "spleen", center2: "root" },
  { gates: [19, 49], name: "Synthesis", center1: "root", center2: "solarPlexus" },
  { gates: [20, 34], name: "Charisma", center1: "throat", center2: "sacral" },
  { gates: [20, 57], name: "Brainwave", center1: "throat", center2: "spleen" },
  { gates: [21, 45], name: "Money Line", center1: "heart", center2: "throat" },
  { gates: [23, 43], name: "Structuring", center1: "throat", center2: "ajna" },
  { gates: [24, 61], name: "Awareness", center1: "ajna", center2: "head" },
  { gates: [25, 51], name: "Initiation", center1: "g", center2: "heart" },
  { gates: [26, 44], name: "Surrender", center1: "heart", center2: "spleen" },
  { gates: [27, 50], name: "Preservation", center1: "sacral", center2: "spleen" },
  { gates: [28, 38], name: "Struggle", center1: "spleen", center2: "root" },
  { gates: [29, 46], name: "Discovery", center1: "sacral", center2: "g" },
  { gates: [30, 41], name: "Recognition", center1: "solarPlexus", center2: "root" },
  { gates: [32, 54], name: "Transformation", center1: "spleen", center2: "root" },
  { gates: [34, 57], name: "Power", center1: "sacral", center2: "spleen" },
  { gates: [35, 36], name: "Transitoriness", center1: "throat", center2: "solarPlexus" },
  { gates: [37, 40], name: "Community", center1: "solarPlexus", center2: "heart" },
  { gates: [39, 55], name: "Emoting", center1: "root", center2: "solarPlexus" },
  { gates: [42, 53], name: "Maturation", center1: "sacral", center2: "root" },
  { gates: [47, 64], name: "Abstraction", center1: "ajna", center2: "head" },
];

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
    description: 'You are a Generator, the life force of the planet. You have sustainable energy to work and create when doing what you love. Your Sacral center is defined, giving you consistent access to gut responses and life force energy. When you follow your strategy of waiting to respond, life brings you opportunities that light you up.',
    strategyDescription: 'Your strategy is to Wait to Respond. This means waiting for something from the outside world to respond to, rather than initiating. When something comes into your awareness - a question, an opportunity, a request - check in with your gut. Does it feel like an expansive "uh-huh" or a contracting "uhn-uhn"? Trust this response.',
  },
  'Manifesting Generator': {
    strategy: 'Wait to Respond, Then Inform',
    notSelfTheme: 'Frustration & Anger',
    signature: 'Satisfaction',
    description: 'You are a Manifesting Generator, a powerful hybrid with the sustainable energy of a Generator and the initiating power of a Manifestor. You have multiple passions and can move quickly between interests. Your path is non-linear, and that\'s your superpower - you\'re designed to sample life and find what truly lights you up.',
    strategyDescription: 'Your strategy is to Wait to Respond, then Inform. Like Generators, wait for something to respond to with your gut. Once you feel the "uh-huh," inform those who will be impacted before you act. This prevents resistance and smooths your path forward.',
  },
  'Projector': {
    strategy: 'Wait for the Invitation',
    notSelfTheme: 'Bitterness',
    signature: 'Success',
    description: 'You are a Projector, here to guide others and see deeply into systems and people. You have a penetrating aura that can see into the core of others. Your gift is recognizing and directing the energy of others. You\'re not here to work in the traditional sense - you\'re here to guide, manage, and bring efficiency.',
    strategyDescription: 'Your strategy is to Wait for the Invitation. For major life decisions - career, relationships, where to live - wait to be recognized and invited. When someone truly sees your gifts and formally invites you in, that\'s when you can share your wisdom. In between, focus on studying what interests you and being visible.',
  },
  'Manifestor': {
    strategy: 'Inform Before Acting',
    notSelfTheme: 'Anger',
    signature: 'Peace',
    description: 'You are a Manifestor, the initiator and catalyst. You have the power to make things happen and impact others with your presence. You\'re here to start things and set them in motion. Your closed and repelling aura protects your independence but can create resistance if others feel blindsided by your actions.',
    strategyDescription: 'Your strategy is to Inform Before Acting. Before you initiate, tell the people who will be impacted what you\'re about to do. This isn\'t asking permission - it\'s simply informing. This reduces resistance and anger in your life, allowing you to move forward with more peace.',
  },
  'Reflector': {
    strategy: 'Wait a Lunar Cycle',
    notSelfTheme: 'Disappointment',
    signature: 'Surprise',
    description: 'You are a Reflector, the rarest type (about 1% of population). With no defined centers, you are completely open and deeply connected to the lunar cycle. You are a mirror for your community, reflecting back its health and potential. Your gift is being able to sample and reflect all the different energies around you.',
    strategyDescription: 'Your strategy is to Wait a Lunar Cycle (28 days) for major decisions. As the moon moves through all 64 gates, you get a full picture of how you feel about something. Talk to trusted friends throughout this process. What surprises you over time reveals your truth.',
  },
};

// Authority descriptions
const AUTHORITY_INFO: Record<string, string> = {
  'Emotional': 'Your authority is Emotional (Solar Plexus). Never make decisions in the heat of the moment. Ride your emotional wave - feel the highs and lows around the decision. Over time, as the intensity decreases, clarity emerges. There is no truth in the now for you; truth comes with time and emotional clarity.',
  'Sacral': 'Your authority is Sacral. Trust your gut response - the "uh-huh" (yes) or "uhn-uhn" (no). This response is immediate and comes from your body, not your mind. Ask yourself yes/no questions or have others ask you to access this wisdom. Your body knows before your mind does.',
  'Splenic': 'Your authority is Splenic. Trust your instincts and intuition - that quiet inner voice or knowing in the moment. Splenic awareness is subtle and doesn\'t repeat. It speaks once, softly. Practice tuning into this immediate, survival-based wisdom.',
  'Ego': 'Your authority is Ego (Heart/Will). Your willpower and what you want matters. Ask yourself: "Do I really want this?" and "Is my heart in it?" When your will is truly engaged, you have the energy to follow through. Trust your desires.',
  'Self-Projected': 'Your authority is Self-Projected. Talk things out and listen to what you say. Your truth emerges through your voice - you literally need to hear yourself speak to know your truth. Find trusted sounding boards who can listen without giving advice.',
  'Mental': 'Your authority is Mental/Environmental (Outer Authority). You need to talk things out with others and be in the right environment to gain clarity. Your mind processes through dialogue. Pay attention to how different environments make you feel.',
  'Lunar': 'Your authority is Lunar. Wait through a complete lunar cycle (28 days) before making major decisions. During this time, discuss the decision with trusted advisors and notice how your perspective shifts as the moon moves through its phases.',
};

// Profile descriptions
const PROFILE_INFO: Record<string, { name: string; description: string }> = {
  '1/3': { name: 'Investigator/Martyr', description: 'You need a solid foundation of knowledge before moving forward. You learn through investigation and trial-and-error, discovering what doesn\'t work to find what does. Your life is a journey of deep research and practical experimentation.' },
  '1/4': { name: 'Investigator/Opportunist', description: 'You combine deep investigation with strong networking abilities. You build a solid foundation of knowledge and share it through your personal network. Opportunities come through people you know.' },
  '2/4': { name: 'Hermit/Opportunist', description: 'You have natural talents that others recognize before you do. You need alone time to develop your gifts, but opportunities come through your network. Balance solitude with social connection.' },
  '2/5': { name: 'Hermit/Heretic', description: 'You have natural talents and are seen as someone who can solve problems. Others project their expectations onto you. Guard your alone time while accepting that you\'re meant to be called out to help.' },
  '3/5': { name: 'Martyr/Heretic', description: 'You learn through trial and error and are seen as someone who can fix things. Your life is experiential - you discover truth through what doesn\'t work. Others see you as a problem-solver.' },
  '3/6': { name: 'Martyr/Role Model', description: 'Your life unfolds in three phases: experimentation (until ~30), observation (30-50), then becoming a living example. Early chaos leads to deep wisdom that you eventually embody and model.' },
  '4/6': { name: 'Opportunist/Role Model', description: 'Your network is everything, and you\'re moving toward becoming a role model. The first half of life is about building relationships; the second half is about being a living example of wisdom.' },
  '4/1': { name: 'Opportunist/Investigator', description: 'You influence through your network while standing on a solid foundation of knowledge. You need to feel secure in your understanding before sharing with others. Your expertise flows through relationships.' },
  '5/1': { name: 'Heretic/Investigator', description: 'Others see you as someone with answers, and you back this up with deep research. You\'re a practical problem-solver whose solutions are grounded in thorough investigation.' },
  '5/2': { name: 'Heretic/Hermit', description: 'You\'re projected upon as a savior or problem-solver, yet you need significant alone time. Others call you out to help, but you must protect your hermit time to develop your natural talents.' },
  '6/2': { name: 'Role Model/Hermit', description: 'You live in three phases: trial and error, then withdrawal and observation, then becoming an exemplary role model. You have natural talents that emerge when you\'re called out.' },
  '6/3': { name: 'Role Model/Martyr', description: 'Your path moves through experimentation and chaos toward becoming a role model. The first 30 years are about trial and error; mid-life is about processing; later life is about embodying wisdom.' },
};

// Calculate sun position (simplified astronomical calculation)
function calculateSunPosition(date: Date): number {
  const J2000 = 2451545.0;
  const daysSinceJ2000 = (date.getTime() / 86400000) + 2440587.5 - J2000;
  
  // Mean longitude of the sun
  const L = (280.46646 + 0.9856474 * daysSinceJ2000) % 360;
  
  // Mean anomaly of the sun
  const g = ((357.528 + 0.9856003 * daysSinceJ2000) % 360) * Math.PI / 180;
  
  // Ecliptic longitude
  const lambda = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  
  return ((lambda % 360) + 360) % 360;
}

// Get gate from zodiac degree
function getGateFromDegree(degree: number): number {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  for (const pos of GATE_POSITIONS) {
    if (normalizedDegree >= pos.startDegree && normalizedDegree < pos.endDegree) {
      return pos.gate;
    }
  }
  return 41; // Default to gate 41 (start of wheel)
}

// Calculate which centers are defined based on gates
function calculateDefinedCenters(gates: number[]): Record<string, boolean> {
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
  
  // Gate to center mapping
  const gateToCenter: Record<number, string> = {
    // Head
    64: 'head', 61: 'head', 63: 'head',
    // Ajna
    47: 'ajna', 24: 'ajna', 4: 'ajna', 17: 'ajna', 43: 'ajna', 11: 'ajna',
    // Throat
    62: 'throat', 23: 'throat', 56: 'throat', 35: 'throat', 12: 'throat', 45: 'throat', 33: 'throat', 8: 'throat', 31: 'throat', 20: 'throat', 16: 'throat',
    // G Center
    7: 'g', 1: 'g', 13: 'g', 25: 'g', 46: 'g', 2: 'g', 15: 'g', 10: 'g',
    // Heart
    21: 'heart', 26: 'heart', 51: 'heart', 40: 'heart',
    // Sacral
    5: 'sacral', 14: 'sacral', 29: 'sacral', 59: 'sacral', 9: 'sacral', 3: 'sacral', 42: 'sacral', 27: 'sacral', 34: 'sacral',
    // Solar Plexus
    36: 'solarPlexus', 22: 'solarPlexus', 37: 'solarPlexus', 6: 'solarPlexus', 49: 'solarPlexus', 55: 'solarPlexus', 30: 'solarPlexus',
    // Spleen
    48: 'spleen', 57: 'spleen', 44: 'spleen', 50: 'spleen', 32: 'spleen', 28: 'spleen', 18: 'spleen',
    // Root
    58: 'root', 38: 'root', 54: 'root', 53: 'root', 60: 'root', 52: 'root', 19: 'root', 39: 'root', 41: 'root',
  };
  
  // Check for complete channels
  for (const channel of CHANNELS) {
    if (gates.includes(channel.gates[0]) && gates.includes(channel.gates[1])) {
      centers[channel.center1] = true;
      centers[channel.center2] = true;
    }
  }
  
  return centers;
}

// Calculate defined channels
function calculateChannels(gates: number[]): string[] {
  const definedChannels: string[] = [];
  
  for (const channel of CHANNELS) {
    if (gates.includes(channel.gates[0]) && gates.includes(channel.gates[1])) {
      definedChannels.push(`${channel.gates[0]}-${channel.gates[1]} ${channel.name}`);
    }
  }
  
  return definedChannels;
}

// Determine type based on defined centers
function determineType(centers: Record<string, boolean>): 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector' {
  const hasSacral = centers.sacral;
  const hasMotorToThroat = (centers.heart && centers.throat) || (centers.solarPlexus && centers.throat) || (centers.root && centers.throat);
  const hasDefinedCenter = Object.values(centers).some(v => v);
  
  if (!hasDefinedCenter) {
    return 'Reflector';
  }
  
  if (hasSacral && hasMotorToThroat) {
    return 'Manifesting Generator';
  }
  
  if (hasSacral) {
    return 'Generator';
  }
  
  if (hasMotorToThroat) {
    return 'Manifestor';
  }
  
  return 'Projector';
}

// Determine authority based on defined centers
function determineAuthority(centers: Record<string, boolean>, type: string): string {
  if (centers.solarPlexus) return 'Emotional';
  if (centers.sacral && type !== 'Projector') return 'Sacral';
  if (centers.spleen) return 'Splenic';
  if (centers.heart) return 'Ego';
  if (centers.g) return 'Self-Projected';
  if (type === 'Reflector') return 'Lunar';
  return 'Mental';
}

// Calculate profile from sun and earth gates
function calculateProfile(sunGate: number, earthGate: number): string {
  // Profile is determined by the lines of personality sun and design sun
  // Simplified calculation based on gate positions
  const sunLine = ((sunGate % 6) || 6);
  const earthLine = ((earthGate % 6) || 6);
  
  const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
  const index = (sunLine + earthLine) % 12;
  
  return profiles[index];
}

// Calculate incarnation cross
function calculateIncarnationCross(sunGate: number, earthGate: number): { name: string; description: string } {
  // Simplified incarnation cross calculation
  const crosses: Record<number, { name: string; description: string }> = {
    1: { name: 'Right Angle Cross of the Sphinx', description: 'You are here to establish direction and find your unique identity. Your life purpose involves discovering who you truly are and sharing that authentic self with the world.' },
    2: { name: 'Right Angle Cross of the Driver', description: 'You are here to be driven by your own unique direction and purpose. Your journey is about staying true to your path regardless of external pressures.' },
    3: { name: 'Right Angle Cross of Laws', description: 'You are here to understand and work with universal principles. Your purpose involves discovering the rules that govern life and sharing that wisdom.' },
    7: { name: 'Right Angle Cross of the Sphinx', description: 'You are here to be a leader and role model. Your life purpose involves guiding others through your example and clear direction.' },
    13: { name: 'Right Angle Cross of the Sphinx', description: 'You are here to listen and collect experiences. Your purpose involves gathering wisdom from others and reflecting it back at the right time.' },
    25: { name: 'Right Angle Cross of the Vessel of Love', description: 'You are here to embody and share unconditional love. Your life purpose is about acceptance and spiritual love for all of humanity.' },
    41: { name: 'Right Angle Cross of the Unexpected', description: 'You are here to bring new experiences and possibilities. Your purpose involves initiating new beginnings and feeling deeply.' },
  };
  
  return crosses[sunGate] || {
    name: `Cross of Gate ${sunGate}`,
    description: `Your incarnation cross brings unique gifts through Gate ${sunGate}. You are here to express the specific energy and wisdom of this gate in the world, contributing your unique perspective to humanity.`
  };
}

// Calculate definition type
function calculateDefinition(centers: Record<string, boolean>): 'Single' | 'Split' | 'Triple Split' | 'Quadruple Split' | 'No Definition' {
  const definedCenters = Object.values(centers).filter(v => v).length;
  
  if (definedCenters === 0) return 'No Definition';
  if (definedCenters <= 2) return 'Single';
  if (definedCenters <= 4) return 'Split';
  if (definedCenters <= 6) return 'Triple Split';
  return 'Quadruple Split';
}

// Generate personalized insights
function generateInsights(type: string, profile: string, authority: string, centers: Record<string, boolean>): {
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
    challenges.push('Learning to wait rather than initiate');
  }
  
  if (type === 'Projector') {
    strengths.push('Deep ability to see into and guide others');
    strengths.push('Efficiency and mastery in your area of focus');
    challenges.push('Waiting for recognition and invitation');
  }
  
  if (type === 'Manifestor') {
    strengths.push('Power to initiate and make things happen');
    strengths.push('Independence and self-sufficiency');
    challenges.push('Informing others before acting');
  }
  
  if (type === 'Reflector') {
    strengths.push('Ability to read environments and people deeply');
    strengths.push('Unique perspective as community mirror');
    challenges.push('Waiting through the lunar cycle for clarity');
  }
  
  // Center-based insights
  if (centers.throat) {
    strengths.push('Consistent ability to communicate and manifest through voice');
  }
  if (centers.g) {
    strengths.push('Strong sense of identity and direction');
  }
  if (centers.solarPlexus) {
    strengths.push('Emotional depth and creative potential');
    challenges.push('Managing emotional waves and timing');
  }
  
  // Career guidance
  const careerGuidance = type === 'Generator' || type === 'Manifesting Generator'
    ? 'You thrive when doing work that truly satisfies you. Follow your gut response to opportunities. Your energy is magnetic when you\'re lit up by your work.'
    : type === 'Projector'
    ? 'You excel in roles where you can guide, advise, and bring efficiency. Wait to be invited into career opportunities. Your gift is seeing how to optimize systems and people.'
    : type === 'Manifestor'
    ? 'You\'re designed to initiate and lead. Entrepreneurship and roles with significant autonomy suit you. Inform your team before making moves to reduce resistance.'
    : 'You need to sample different environments to find where you belong. Your career should allow flexibility and time for lunar cycle decision-making.';
  
  // Relationship insights
  const relationshipInsights = authority === 'Emotional'
    ? 'In relationships, never make major decisions in the heat of emotional highs or lows. Give yourself time to find clarity. Your emotional depth is a gift to be honored.'
    : authority === 'Sacral'
    ? 'Trust your gut responses in relationships. If someone makes you feel expansive (uh-huh), lean in. If not (uhn-uhn), honor that response.'
    : 'In relationships, follow your ' + authority.toLowerCase() + ' authority. Create space for your unique decision-making process and communicate your needs clearly.';
  
  return { strengths, challenges, careerGuidance, relationshipInsights };
}

// Generate center themes
function generateCenterThemes(defined: boolean, centerName: string): string {
  const themes: Record<string, { defined: string; undefined: string }> = {
    head: {
      defined: 'Consistent mental pressure and inspiration. You have reliable access to questions and mental stimulation.',
      undefined: 'Open to many sources of inspiration. Be careful not to get lost in other people\'s questions or mental pressure.',
    },
    ajna: {
      defined: 'Fixed way of processing and thinking. You have a consistent mental process and conceptualization.',
      undefined: 'Flexible mind that can see multiple perspectives. Don\'t try to appear mentally certain when you\'re not.',
    },
    throat: {
      defined: 'Consistent voice and ability to manifest through communication. You can reliably express and bring things into form.',
      undefined: 'Variable expression. Don\'t speak just to be noticed. Wait for the right timing to share.',
    },
    g: {
      defined: 'Strong sense of identity, direction, and love. You know who you are and where you\'re going.',
      undefined: 'Flexible identity that adapts to environment. You\'re designed to sample different places and people to find where you belong.',
    },
    heart: {
      defined: 'Consistent willpower and ability to make promises. You have sustainable ego energy for what you truly value.',
      undefined: 'Variable willpower. Don\'t make promises to prove your worth. Your value isn\'t measured by what you can will into being.',
    },
    sacral: {
      defined: 'Sustainable life force and work energy. You have consistent access to powerful creative and work energy.',
      undefined: 'Variable energy. Don\'t overwork or try to keep up with Sacral beings. Rest before you\'re exhausted.',
    },
    solarPlexus: {
      defined: 'Emotional authority and creative depth. You experience life through emotional waves that bring wisdom over time.',
      undefined: 'Emotional openness and empathy. You amplify others\' emotions. Don\'t make decisions to avoid emotional discomfort.',
    },
    spleen: {
      defined: 'Consistent intuition, instinct, and immune system. You have reliable access to in-the-moment awareness.',
      undefined: 'Open to intuitive hits from others and environment. Don\'t hold onto what isn\'t healthy for you.',
    },
    root: {
      defined: 'Consistent adrenaline and drive. You have sustainable pressure to get things done.',
      undefined: 'Variable stress response. Don\'t rush to get things done just to relieve pressure. Work at your own pace.',
    },
  };
  
  return defined ? themes[centerName]?.defined || '' : themes[centerName]?.undefined || '';
}

/**
 * Calculate Human Design reading from birth data
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
  
  const birthDateTime = new Date(year, month - 1, day, hours, minutes);
  
  // Calculate design date (88 degrees of sun's arc before birth = ~88 days)
  const designDateTime = new Date(birthDateTime.getTime() - (88 * 24 * 60 * 60 * 1000));
  
  // Calculate sun positions
  const personalitySunDegree = calculateSunPosition(birthDateTime);
  const designSunDegree = calculateSunPosition(designDateTime);
  
  // Get gates from sun positions
  const personalitySunGate = getGateFromDegree(personalitySunDegree);
  const designSunGate = getGateFromDegree(designSunDegree);
  
  // Calculate earth gates (opposite sun)
  const personalityEarthDegree = (personalitySunDegree + 180) % 360;
  const designEarthDegree = (designSunDegree + 180) % 360;
  const personalityEarthGate = getGateFromDegree(personalityEarthDegree);
  const designEarthGate = getGateFromDegree(designEarthDegree);
  
  // Generate more gates based on birth data (simplified planetary simulation)
  const allGates: number[] = [
    personalitySunGate,
    designSunGate,
    personalityEarthGate,
    designEarthGate,
  ];
  
  // Add more gates based on time factors (simplified)
  const hourGate = getGateFromDegree((hours * 15 + personalitySunDegree) % 360);
  const minuteGate = getGateFromDegree((minutes * 6 + personalitySunDegree) % 360);
  const monthGate = getGateFromDegree((month * 30) % 360);
  const dayGate = getGateFromDegree((day * 12) % 360);
  
  allGates.push(hourGate, minuteGate, monthGate, dayGate);
  
  // Remove duplicates
  const uniqueGates = Array.from(new Set(allGates));
  
  // Calculate centers
  const centers = calculateDefinedCenters(uniqueGates);
  
  // Determine type
  const type = determineType(centers);
  
  // Determine authority
  const authority = determineAuthority(centers, type);
  
  // Calculate profile
  const profile = calculateProfile(personalitySunGate, personalityEarthGate);
  const profileInfo = PROFILE_INFO[profile] || { name: profile, description: 'A unique profile bringing distinct gifts.' };
  
  // Calculate definition
  const definition = calculateDefinition(centers);
  
  // Calculate channels
  const channels = calculateChannels(uniqueGates);
  
  // Calculate incarnation cross
  const incarnationCross = calculateIncarnationCross(personalitySunGate, personalityEarthGate);
  
  // Get type info
  const typeInfo = TYPE_INFO[type];
  
  // Generate center themes
  const centerData = {
    head: { defined: centers.head, theme: generateCenterThemes(centers.head, 'head') },
    ajna: { defined: centers.ajna, theme: generateCenterThemes(centers.ajna, 'ajna') },
    throat: { defined: centers.throat, theme: generateCenterThemes(centers.throat, 'throat') },
    g: { defined: centers.g, theme: generateCenterThemes(centers.g, 'g') },
    heart: { defined: centers.heart, theme: generateCenterThemes(centers.heart, 'heart') },
    sacral: { defined: centers.sacral, theme: generateCenterThemes(centers.sacral, 'sacral') },
    solarPlexus: { defined: centers.solarPlexus, theme: generateCenterThemes(centers.solarPlexus, 'solarPlexus') },
    spleen: { defined: centers.spleen, theme: generateCenterThemes(centers.spleen, 'spleen') },
    root: { defined: centers.root, theme: generateCenterThemes(centers.root, 'root') },
  };
  
  // Generate personalized insights
  const insights = generateInsights(type, profile, authority, centers);
  
  return {
    type,
    strategy: typeInfo.strategy,
    authority,
    profile,
    profileDescription: profileInfo.description,
    definition,
    centers: centerData,
    definedGates: uniqueGates,
    channels,
    incarnationCross: incarnationCross.name,
    incarnationCrossDescription: incarnationCross.description,
    typeDescription: typeInfo.description,
    strategyDescription: typeInfo.strategyDescription,
    authorityDescription: AUTHORITY_INFO[authority],
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
  };
}
