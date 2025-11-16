
interface ValidationResult {
  score: number; // 0-5
  passed: boolean;
  issues: string[];
  recommendations: string[];
}

interface Section {
  id: string;
  title: string;
  type: string;
  content: string;
  quickWinChallenge?: string;
  reflectionPrompts?: string[];
  monetizationInsight?: string;
  resources?: any[];
}

export function validateSectionQuality(section: Section, sectionIndex: number): ValidationResult {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 5.0;

  // 1. Content Depth (20% of score)
  const wordCount = section.content.split(/\s+/).length;
  if (section.type === "text") {
    if (wordCount < 1000) {
      issues.push(`Section ${sectionIndex + 1}: Text content too short (${wordCount} words, need 1000-1500)`);
      score -= 0.5;
    }
    if (wordCount > 1800) {
      issues.push(`Section ${sectionIndex + 1}: Text content too long (${wordCount} words, max 1500)`);
      score -= 0.2;
    }
  }

  // 2. Strategic Frameworks (20% of score)
  const hasFramework = 
    section.content.toLowerCase().includes('framework') ||
    section.content.toLowerCase().includes('model') ||
    section.content.toLowerCase().includes('system');
  
  if (!hasFramework && sectionIndex < 4) {
    issues.push(`Section ${sectionIndex + 1}: Missing strategic framework or model`);
    score -= 0.4;
  }

  // 3. Actionability (20% of score)
  if (!section.quickWinChallenge || section.quickWinChallenge.length < 100) {
    issues.push(`Section ${sectionIndex + 1}: Missing or weak Quick Win Challenge`);
    score -= 0.4;
  }

  const hasActionSteps = 
    section.content.includes('Step 1') ||
    section.content.includes('1.') ||
    section.content.includes('First,');
  
  if (!hasActionSteps) {
    issues.push(`Section ${sectionIndex + 1}: Missing numbered action steps`);
    score -= 0.3;
  }

  // 4. AI Prompts (15% of score)
  const hasPrompts = 
    section.content.includes('```') || // Code block for prompts
    section.content.toLowerCase().includes('prompt:') ||
    section.content.toLowerCase().includes('ask chatgpt');
  
  if (!hasPrompts) {
    recommendations.push(`Section ${sectionIndex + 1}: Consider adding copy-paste AI prompts`);
    score -= 0.3;
  }

  // 5. Case Studies (10% of score)
  const hasCaseStudy = 
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(section.content) && // Names
    /\$\d+/.test(section.content); // Money amounts
  
  if (!hasCaseStudy && sectionIndex >= 2) {
    recommendations.push(`Section ${sectionIndex + 1}: Add real case study with metrics`);
    score -= 0.2;
  }

  // 6. Monetization Clarity (10% of score)
  if (!section.monetizationInsight || section.monetizationInsight.length < 50) {
    issues.push(`Section ${sectionIndex + 1}: Missing clear monetization insight`);
    score -= 0.3;
  }

  // 7. Reflection Prompts (5% of score)
  if (!section.reflectionPrompts || section.reflectionPrompts.length < 3) {
    issues.push(`Section ${sectionIndex + 1}: Need at least 3 reflection prompts`);
    score -= 0.2;
  }

  // 8. Resources (5% of score)
  if (!section.resources || section.resources.length < 2) {
    recommendations.push(`Section ${sectionIndex + 1}: Add more curated resources (aim for 3-5)`);
    score -= 0.1;
  }

  // 9. Formatting Quality (5% of score)
  const hasFormatting =
    section.content.includes('**') && // Bold
    section.content.includes('##') && // Headers
    (section.content.match(/\n/g) || []).length > 10; // Paragraph breaks
  
  if (!hasFormatting) {
    issues.push(`Section ${sectionIndex + 1}: Poor formatting - needs headers, bold, paragraph breaks`);
    score -= 0.2;
  }

  return {
    score: Math.max(0, Math.min(5, score)),
    passed: score >= 4.0,
    issues,
    recommendations
  };
}

export function validateExperienceQuality(sections: Section[]): ValidationResult {
  const sectionResults = sections.map((section, index) => 
    validateSectionQuality(section, index)
  );

  const avgScore = sectionResults.reduce((sum, r) => sum + r.score, 0) / sections.length;
  const allIssues = sectionResults.flatMap(r => r.issues);
  const allRecommendations = sectionResults.flatMap(r => r.recommendations);

  // Experience-level checks
  const experienceIssues: string[] = [];
  
  // Check section variety
  const types = sections.map(s => s.type);
  const hasVariety = new Set(types).size >= 3;
  if (!hasVariety) {
    experienceIssues.push("Experience lacks section variety (need text, interactive, hands_on_lab mix)");
  }

  // Check progression
  const hasProgressiveDepth = 
    sections[0].type === "text" && // Start with foundation
    sections.some(s => s.type === "hands_on_lab"); // Include practical work
  
  if (!hasProgressiveDepth) {
    experienceIssues.push("Experience lacks progressive depth (should start with text, build to hands-on)");
  }

  return {
    score: avgScore,
    passed: avgScore >= 4.0 && experienceIssues.length === 0,
    issues: [...allIssues, ...experienceIssues],
    recommendations: allRecommendations
  };
}

export function generateQualityReport(experienceId: string, result: ValidationResult): string {
  const rating = result.score >= 4.5 ? "⭐⭐⭐⭐⭐" :
                 result.score >= 4.0 ? "⭐⭐⭐⭐" :
                 result.score >= 3.0 ? "⭐⭐⭐" :
                 result.score >= 2.0 ? "⭐⭐" : "⭐";

  return `
📊 Quality Report: ${experienceId}
${rating} Score: ${result.score.toFixed(2)}/5.00
${result.passed ? "✅ PASSED" : "❌ FAILED"} - ${result.passed ? "Ready for premium sale" : "Needs improvement"}

${result.issues.length > 0 ? `
🚨 Issues to Fix (${result.issues.length}):
${result.issues.map(i => `   - ${i}`).join('\n')}
` : ""}

${result.recommendations.length > 0 ? `
💡 Recommendations (${result.recommendations.length}):
${result.recommendations.map(r => `   - ${r}`).join('\n')}
` : ""}
`;
}
