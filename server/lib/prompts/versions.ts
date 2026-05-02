
import { promptTemplates, PromptType, type PromptVersions } from './templates';

export interface PromptExperiment {
  promptType: PromptType;
  versions: string[];
  distribution: Record<string, number>; // e.g., { v1: 0.5, v2: 0.5 }
  active: boolean;
  startDate: Date;
  endDate?: Date;
}

// Active experiments
export const activeExperiments: PromptExperiment[] = [
  {
    promptType: 'JOURNAL_INSIGHTS',
    versions: ['v1', 'v2'],
    distribution: { v1: 0.5, v2: 0.5 },
    active: true,
    startDate: new Date('2024-01-01'),
  }
];

// Get the appropriate prompt version for a user
export function getPromptVersion(
  promptType: PromptType,
  userId?: string,
  preferredVersion?: string
): string {
  const templates = promptTemplates[promptType] as PromptVersions;

  // If a specific version is requested, use it
  if (preferredVersion && templates[preferredVersion]) {
    return preferredVersion;
  }

  // Check if there's an active experiment
  const experiment = activeExperiments.find(
    exp => exp.promptType === promptType && exp.active
  );

  if (experiment && userId) {
    // Use consistent hashing to assign user to a version
    const hash = hashUserId(userId);
    let cumulative = 0;
    
    for (const [version, weight] of Object.entries(experiment.distribution)) {
      cumulative += weight;
      if (hash < cumulative) {
        return version;
      }
    }
  }

  // Default to latest version (highest version number)
  const versions = Object.keys(templates);
  return versions[versions.length - 1];
}

// Simple hash function for consistent user-to-version assignment
function hashUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 100) / 100; // Return value between 0 and 1
}

// Interpolate variables into prompt template
export function interpolatePrompt(template: string, variables: Record<string, any>): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  }
  
  return result;
}
