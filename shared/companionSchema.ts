
import { z } from "zod";

export const companionStageSchema = z.enum([
  "seedling",      // Just starting career journey
  "sprout",        // Completed first experiences
  "blooming",      // Active learner, building skills
  "flourishing",   // Pro user, consistent engagement
  "radiant"        // Master level, helping others
]);

export type CompanionStage = z.infer<typeof companionStageSchema>;

export const companionMoodSchema = z.enum([
  "excited",
  "curious",
  "focused",
  "energized",
  "peaceful",
  "celebrated"
]);

export type CompanionMood = z.infer<typeof companionMoodSchema>;

export type CompanionStats = {
  growth: number;        // 0-100, based on learning progress
  inspiration: number;   // 0-100, based on journal activity
  connection: number;    // 0-100, based on community engagement
  mastery: number;       // 0-100, based on completed experiences
};

export type CompanionAccessory = {
  id: string;
  name: string;
  type: "hat" | "glasses" | "necklace" | "background" | "aura";
  unlockCondition: string;
  icon: string;
};

export const COMPANION_ACCESSORIES: CompanionAccessory[] = [
  {
    id: "crown",
    name: "Leadership Crown",
    type: "hat",
    unlockCondition: "Complete 5 experiences",
    icon: "👑"
  },
  {
    id: "tech_glasses",
    name: "Tech Vision Glasses",
    type: "glasses",
    unlockCondition: "Complete AI space",
    icon: "🤓"
  },
  {
    id: "web3_necklace",
    name: "Web3 Crystal Necklace",
    type: "necklace",
    unlockCondition: "Complete Crypto space",
    icon: "💎"
  },
  {
    id: "star_aura",
    name: "Rising Star Aura",
    type: "aura",
    unlockCondition: "Maintain 7-day streak",
    icon: "✨"
  },
  {
    id: "galaxy_bg",
    name: "Metaverse Galaxy",
    type: "background",
    unlockCondition: "Complete Metaverse space",
    icon: "🌌"
  }
];
