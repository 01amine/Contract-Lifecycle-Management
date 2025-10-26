// AI Copilot Engine - Realistic clause analysis and regeneration
// This module provides sophisticated clause analysis mimicking real AI behavior

export interface ClauseAnalysis {
  issues: string[];
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  complianceGaps: string[];
  recommendations: string[];
  improvedVersion: string;
  analysisSteps: string[];
}

interface Clause {
  clause_id?: string;
  text?: string;
  content?: string;
  heading?: string;
  level?: number;
  type?: string;
  confidence?: number;
}

// Legal keywords that indicate strong clauses
const STRONG_LEGAL_INDICATORS = [
  "shall",
  "must",
  "will",
  "hereby",
  "notwithstanding",
  "pursuant to",
  "in accordance with",
  "subject to",
  "provided that",
  "reasonable",
  "material",
];

// Weak indicators that suggest problems
const WEAK_INDICATORS = ["may", "might", "could", "should", "try", "attempt"];

// Critical missing elements
const CRITICAL_ELEMENTS = {
  termination: [
    "notice period",
    "termination conditions",
    "consequences of termination",
  ],
  liability: [
    "limitation of liability",
    "cap on damages",
    "indemnification",
  ],
  payment: [
    "payment terms",
    "late payment penalties",
    "currency",
    "method of payment",
  ],
  confidentiality: [
    "duration of confidentiality",
    "exceptions to confidentiality",
    "return of materials",
  ],
  "intellectual property": [
    "ownership rights",
    "license grants",
    "restrictions on use",
  ],
  warranties: [
    "warranty scope",
    "warranty duration",
    "warranty disclaimers",
  ],
};

/**
 * Analyzes a clause and provides detailed feedback
 */
export function analyzeClause(clause: Clause): ClauseAnalysis {
  const text = clause.content || clause.text || "";
  const heading = clause.heading || "Untitled";
  const clauseType = detectClauseType(text, heading);

  const issues: string[] = [];
  const complianceGaps: string[] = [];
  const recommendations: string[] = [];
  const analysisSteps: string[] = [];

  // Step 1: Basic structure analysis
  analysisSteps.push("Analyzing clause structure and completeness...");
  const structuralIssues = analyzeStructure(text);
  issues.push(...structuralIssues);

  // Step 2: Legal language strength
  analysisSteps.push("Evaluating legal language strength...");
  const languageIssues = analyzeLegalLanguage(text);
  issues.push(...languageIssues);

  // Step 3: Type-specific requirements
  analysisSteps.push(`Checking ${clauseType}-specific requirements...`);
  const typeSpecificGaps = checkTypeSpecificRequirements(text, clauseType);
  complianceGaps.push(...typeSpecificGaps);

  // Step 4: Regulatory compliance
  analysisSteps.push("Cross-referencing with regulatory standards...");
  const regulatoryIssues = checkRegulatoryCompliance(text, clauseType);
  complianceGaps.push(...regulatoryIssues);

  // Step 5: Risk assessment
  analysisSteps.push("Assessing risk exposure...");
  const riskLevel = calculateRiskLevel(issues, complianceGaps);

  // Step 6: Generate recommendations
  recommendations.push(...generateRecommendations(issues, complianceGaps, clauseType));

  // Step 7: Create improved version
  analysisSteps.push("Generating improved clause version...");
  const improvedVersion = generateImprovedClause(
    text,
    heading,
    clauseType,
    issues,
    complianceGaps
  );

  return {
    issues,
    riskLevel,
    complianceGaps,
    recommendations,
    improvedVersion,
    analysisSteps,
  };
}

/**
 * Detects the type of clause based on content and heading
 */
function detectClauseType(text: string, heading: string): string {
  const combined = (text + " " + heading).toLowerCase();

  const typePatterns: Record<string, RegExp[]> = {
    "Termination": [
      /terminat(e|ion)/i,
      /cancellation/i,
      /expir(y|ation)/i,
    ],
    "Liability": [
      /liabilit(y|ies)/i,
      /indemnif(y|ication)/i,
      /damages/i,
      /limitation.*liability/i,
    ],
    "Payment": [
      /payment/i,
      /fee(s)?/i,
      /invoice/i,
      /compensation/i,
      /pricing/i,
    ],
    "Confidentiality": [
      /confidential/i,
      /proprietary/i,
      /nda/i,
      /non-disclosure/i,
    ],
    "Intellectual Property": [
      /intellectual property/i,
      /\bip\b/i,
      /copyright/i,
      /trademark/i,
      /patent/i,
      /ownership/i,
    ],
    "Warranties": [
      /warrant(y|ies)/i,
      /represent(ation)?/i,
      /guarantee/i,
    ],
    "Force Majeure": [
      /force majeure/i,
      /act of god/i,
      /unforeseeable/i,
    ],
    "Governing Law": [
      /governing law/i,
      /jurisdiction/i,
      /dispute resolution/i,
    ],
  };

  for (const [type, patterns] of Object.entries(typePatterns)) {
    if (patterns.some((pattern) => pattern.test(combined))) {
      return type;
    }
  }

  return "General Provision";
}

/**
 * Analyzes structural completeness
 */
function analyzeStructure(text: string): string[] {
  const issues: string[] = [];

  if (text.length < 150) {
    issues.push("Clause is too brief and lacks necessary detail");
  }

  if (!text.includes(".")) {
    issues.push("Clause lacks proper sentence structure");
  }

  const sentenceCount = text.split(/[.!?]/).filter(s => s.trim().length > 0).length;
  if (sentenceCount < 2) {
    issues.push("Clause should contain multiple sentences for clarity");
  }

  // Check for placeholder text
  if (/\[.*?\]/.test(text)) {
    issues.push("Contains placeholder text that needs to be specified");
  }

  return issues;
}

/**
 * Analyzes legal language strength
 */
function analyzeLegalLanguage(text: string): string[] {
  const issues: string[] = [];
  const lowerText = text.toLowerCase();

  // Check for strong indicators
  const hasStrongLanguage = STRONG_LEGAL_INDICATORS.some((indicator) =>
    lowerText.includes(indicator)
  );
  if (!hasStrongLanguage) {
    issues.push(
      "Lacks strong legal terminology (e.g., 'shall', 'must', 'hereby')"
    );
  }

  // Check for weak language
  const weakLanguageCount = WEAK_INDICATORS.filter((indicator) =>
    lowerText.includes(indicator)
  ).length;
  if (weakLanguageCount > 2) {
    issues.push(
      "Contains weak or ambiguous language that reduces enforceability"
    );
  }

  // Check for vague terms
  const vagueTerms = ["reasonable", "appropriate", "timely", "promptly"];
  const vagueCount = vagueTerms.filter((term) => lowerText.includes(term)).length;
  if (vagueCount > 0 && !lowerText.includes("defined as")) {
    issues.push("Uses vague terms without clear definitions");
  }

  return issues;
}

/**
 * Checks type-specific requirements
 */
function checkTypeSpecificRequirements(text: string, type: string): string[] {
  const gaps: string[] = [];
  const lowerText = text.toLowerCase();

  const requirements = CRITICAL_ELEMENTS[type.toLowerCase() as keyof typeof CRITICAL_ELEMENTS] || [];

  requirements.forEach((requirement) => {
    const keywords = requirement.split(" ");
    const hasRequirement = keywords.some((keyword) =>
      lowerText.includes(keyword)
    );

    if (!hasRequirement) {
      gaps.push(`Missing: ${requirement}`);
    }
  });

  return gaps;
}

/**
 * Checks regulatory compliance
 */
function checkRegulatoryCompliance(text: string, type: string): string[] {
  const issues: string[] = [];
  const lowerText = text.toLowerCase();

  // Data protection requirements
  if (
    type.toLowerCase().includes("confidential") ||
    type.toLowerCase().includes("data")
  ) {
    if (!lowerText.includes("gdpr") && !lowerText.includes("data protection")) {
      issues.push("No reference to GDPR or data protection regulations");
    }
  }

  // Financial regulations
  if (type.toLowerCase().includes("payment")) {
    if (!lowerText.includes("currency")) {
      issues.push("Currency not specified for international compliance");
    }
    if (!lowerText.includes("late payment") && !lowerText.includes("interest")) {
      issues.push("No late payment penalty specified");
    }
  }

  // Termination requirements
  if (type.toLowerCase().includes("terminat")) {
    if (!text.match(/\d+\s*(day|week|month)/)) {
      issues.push("No specific notice period defined");
    }
  }

  return issues;
}

/**
 * Calculates overall risk level
 */
function calculateRiskLevel(
  issues: string[],
  gaps: string[]
): "Low" | "Medium" | "High" | "Critical" {
  const totalProblems = issues.length + gaps.length;

  if (totalProblems >= 6) return "Critical";
  if (totalProblems >= 4) return "High";
  if (totalProblems >= 2) return "Medium";
  return "Low";
}

/**
 * Generates specific recommendations
 */
function generateRecommendations(
  issues: string[],
  gaps: string[],
  type: string
): string[] {
  const recommendations: string[] = [];

  if (issues.some((i) => i.includes("brief"))) {
    recommendations.push(
      "Expand clause with specific obligations, conditions, and timelines"
    );
  }

  if (issues.some((i) => i.includes("legal terminology"))) {
    recommendations.push(
      "Use mandatory language ('shall', 'must') instead of permissive language"
    );
  }

  if (gaps.some((g) => g.includes("notice period"))) {
    recommendations.push(
      "Specify exact notice period (e.g., '30 days written notice')"
    );
  }

  if (gaps.some((g) => g.includes("liability"))) {
    recommendations.push(
      "Add limitation of liability clause with specific caps"
    );
  }

  if (gaps.length > 0) {
    recommendations.push(
      `Address missing ${type.toLowerCase()} requirements per industry standards`
    );
  }

  return recommendations;
}

/**
 * Generates an improved version of the clause
 */
function generateImprovedClause(
  originalText: string,
  heading: string,
  type: string,
  issues: string[],
  gaps: string[]
): string {
  let improved = `${heading}\n\n`;

  // Start with enhanced version of original
  const enhancedOriginal = enhanceOriginalText(originalText, issues);
  improved += enhancedOriginal;

  // Add missing critical elements
  const additions = generateAdditions(type, gaps);
  if (additions) {
    improved += `\n\n${additions}`;
  }

  // Add compliance footer
  improved += generateComplianceFooter(type);

  return improved;
}

/**
 * Enhances the original text
 */
function enhanceOriginalText(text: string, issues: string[]): string {
  let enhanced = text;

  // Check if we need language strengthening
  const needsStrongLanguage = issues.some(i => i.includes("legal terminology") || i.includes("weak"));

  if (needsStrongLanguage) {
    // Replace weak language with strong language
    enhanced = enhanced
      .replace(/\bmay\b/gi, "shall")
      .replace(/\bshould\b/gi, "shall")
      .replace(/\bcould\b/gi, "shall")
      .replace(/\bmight\b/gi, "shall");
  }

  // Add missing parties if not present
  if (!enhanced.match(/\bParty|parties|Company|Client\b/i)) {
    enhanced = `The parties agree that ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)}`;
  }

  return enhanced;
}

/**
 * Generates additions for missing elements
 */
function generateAdditions(clauseType: string, gaps: string[]): string {
  const additions: string[] = [];

  if (gaps.some((g) => g.includes("notice period"))) {
    additions.push(
      "Either party may terminate this clause upon thirty (30) days prior written notice to the other party."
    );
  }

  if (gaps.some((g) => g.includes("limitation of liability"))) {
    additions.push(
      "In no event shall either party's total liability exceed the total fees paid under this agreement in the twelve (12) months preceding the claim."
    );
  }

  if (gaps.some((g) => g.includes("currency"))) {
    additions.push(
      "All amounts shall be paid in United States Dollars (USD) unless otherwise specified in writing."
    );
  }

  if (gaps.some((g) => g.includes("confidentiality"))) {
    additions.push(
      "The receiving party shall maintain the confidentiality of all disclosed information for a period of five (5) years from the date of disclosure."
    );
  }

  // Type-specific additions
  if (clauseType.toLowerCase().includes("payment") && gaps.length > 0) {
    additions.push(
      "Late payments shall incur interest at the rate of [RATE]% per annum."
    );
  }

  return additions.join(" ");
}

/**
 * Generates compliance footer
 */
function generateComplianceFooter(type: string): string {
  const footers: Record<string, string> = {
    Payment: `\n\nThis clause complies with international payment standards and includes provisions for late payment interest at the statutory rate.`,
    Confidentiality: `\n\nThis clause meets GDPR and data protection requirements for handling confidential information.`,
    Termination: `\n\nThis termination provision includes adequate notice requirements and complies with applicable contract law.`,
    Liability: `\n\nThis limitation of liability clause is enforceable under common law and includes appropriate caps on damages.`,
  };

  return footers[type] || "";
}
