// Mock data for AI-Driven Contract Lifecycle Management Platform

export interface Contract {
  id: string;
  title: string;
  client: string;
  date: string;
  amount: string;
  status: "draft" | "under_review" | "approved" | "rejected" | "signed";
  type: "islamic-finance" | "real-estate" | "employment" | "commercial" | "procurement";
  complianceScore: number;
  riskScore: number;
  criticalIssues: number;
  uploadedBy: string;
  lastModified: string;
  version: string;
  blockchainVerified: boolean;
}

export interface Template {
  id: string;
  name: string;
  category: "Islamic Finance" | "Real Estate" | "Employment" | "Commercial" | "Procurement";
  description: string;
  clauseCount: number;
  complianceScore: number;
  usageCount: number;
  lastUsed: string;
  createdBy: string;
  variables: string[];
}

export interface ComplianceIssue {
  id: string;
  contractId: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "shariah" | "legal" | "internal" | "risk" | "data-protection";
  title: string;
  description: string;
  clause: string;
  recommendation: string;
  status: "open" | "in-progress" | "resolved";
  detectedDate: string;
}

export interface AIAnalysis {
  contractId: string;
  overallScore: number;
  riskScore: number;
  confidence: number;
  issues: ComplianceIssue[];
  recommendations: string[];
  shariahCompliance: {
    compliant: boolean;
    score: number;
    issues: string[];
  };
  clauses: {
    id: string;
    text: string;
    type: string;
    riskLevel: "low" | "medium" | "high" | "critical";
    complianceScore: number;
    analysis: string;
  }[];
}

export interface BlockchainVerification {
  contractId: string;
  verified: boolean;
  hash: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  registeredBy: string;
  network: "Polygon";
}

export interface Version {
  id: string;
  contractId: string;
  version: string;
  editor: string;
  timestamp: string;
  summary: string;
  confidence: number;
  changes: {
    additions: number;
    deletions: number;
    modifications: number;
  };
}

// Mock Contracts Data
export const mockContracts: Contract[] = [
  {
    id: "1",
    title: "Murabaha Financing Agreement",
    client: "Al Baraka Islamic Bank",
    date: "2024-01-15",
    amount: "$250,000",
    status: "under_review",
    type: "islamic-finance",
    complianceScore: 92,
    riskScore: 3,
    criticalIssues: 0,
    uploadedBy: "Ahmed Hassan",
    lastModified: "2024-01-20",
    version: "1.2",
    blockchainVerified: true,
  },
  {
    id: "2",
    title: "Real Estate Sale Agreement",
    client: "Dubai Properties LLC",
    date: "2024-01-20",
    amount: "$1,500,000",
    status: "draft",
    type: "real-estate",
    complianceScore: 85,
    riskScore: 5,
    criticalIssues: 1,
    uploadedBy: "Sarah Al-Mansoori",
    lastModified: "2024-01-22",
    version: "2.0",
    blockchainVerified: false,
  },
  {
    id: "3",
    title: "Employment Contract - Senior Developer",
    client: "Tech Innovations DMCC",
    date: "2024-02-01",
    amount: "$120,000/year",
    status: "approved",
    type: "employment",
    complianceScore: 98,
    riskScore: 1,
    criticalIssues: 0,
    uploadedBy: "Mohammed Al-Rashid",
    lastModified: "2024-02-05",
    version: "1.0",
    blockchainVerified: true,
  },
  {
    id: "4",
    title: "Ijara Lease Agreement",
    client: "Emirates Leasing Corp",
    date: "2024-02-10",
    amount: "$50,000",
    status: "under_review",
    type: "islamic-finance",
    complianceScore: 88,
    riskScore: 4,
    criticalIssues: 0,
    uploadedBy: "Fatima Al-Zahra",
    lastModified: "2024-02-12",
    version: "1.1",
    blockchainVerified: false,
  },
  {
    id: "5",
    title: "Service Level Agreement",
    client: "Enterprise Systems Inc.",
    date: "2024-02-15",
    amount: "$75,000",
    status: "rejected",
    type: "commercial",
    complianceScore: 65,
    riskScore: 8,
    criticalIssues: 3,
    uploadedBy: "Ali Mansour",
    lastModified: "2024-02-18",
    version: "1.0",
    blockchainVerified: false,
  },
  {
    id: "6",
    title: "Procurement Agreement",
    client: "Supply Chain Solutions",
    date: "2024-02-20",
    amount: "$35,000",
    status: "signed",
    type: "procurement",
    complianceScore: 90,
    riskScore: 2,
    criticalIssues: 0,
    uploadedBy: "Layla Ibrahim",
    lastModified: "2024-02-21",
    version: "1.0",
    blockchainVerified: false,
  },
];

// Mock Templates Data
export const mockTemplates: Template[] = [
  {
    id: "T1",
    name: "Murabaha Agreement",
    category: "Islamic Finance",
    description: "Standard Shariah-compliant cost-plus financing agreement",
    clauseCount: 18,
    complianceScore: 95,
    usageCount: 45,
    lastUsed: "2024-02-20",
    createdBy: "Legal Team",
    variables: ["[BANK_NAME]", "[CLIENT_NAME]", "[AMOUNT]", "[PROFIT_RATE]", "[DURATION]"],
  },
  {
    id: "T2",
    name: "Ijara Lease Agreement",
    category: "Islamic Finance",
    description: "Islamic leasing contract compliant with AAOIFI standards",
    clauseCount: 15,
    complianceScore: 93,
    usageCount: 32,
    lastUsed: "2024-02-18",
    createdBy: "Legal Team",
    variables: ["[LESSOR]", "[LESSEE]", "[ASSET]", "[RENT_AMOUNT]", "[TERM]"],
  },
  {
    id: "T3",
    name: "Property Sale Agreement",
    category: "Real Estate",
    description: "Comprehensive real estate purchase agreement for UAE",
    clauseCount: 25,
    complianceScore: 88,
    usageCount: 67,
    lastUsed: "2024-02-22",
    createdBy: "Real Estate Dept",
    variables: ["[SELLER]", "[BUYER]", "[PROPERTY]", "[PRICE]", "[COMPLETION_DATE]"],
  },
  {
    id: "T4",
    name: "Employment Contract - Full Time",
    category: "Employment",
    description: "UAE labor law compliant full-time employment agreement",
    clauseCount: 20,
    complianceScore: 97,
    usageCount: 89,
    lastUsed: "2024-02-21",
    createdBy: "HR Department",
    variables: ["[EMPLOYEE_NAME]", "[POSITION]", "[SALARY]", "[START_DATE]", "[PROBATION]"],
  },
  {
    id: "T5",
    name: "Service Agreement",
    category: "Commercial",
    description: "General commercial service agreement template",
    clauseCount: 22,
    complianceScore: 90,
    usageCount: 54,
    lastUsed: "2024-02-19",
    createdBy: "Legal Team",
    variables: ["[SERVICE_PROVIDER]", "[CLIENT]", "[SERVICES]", "[FEE]", "[TERM]"],
  },
  {
    id: "T6",
    name: "Purchase Order",
    category: "Procurement",
    description: "Standard procurement purchase order template",
    clauseCount: 12,
    complianceScore: 92,
    usageCount: 120,
    lastUsed: "2024-02-22",
    createdBy: "Procurement Team",
    variables: ["[BUYER]", "[VENDOR]", "[ITEMS]", "[AMOUNT]", "[DELIVERY_DATE]"],
  },
];

// Mock Compliance Issues
export const mockComplianceIssues: ComplianceIssue[] = [
  {
    id: "I1",
    contractId: "2",
    severity: "critical",
    category: "legal",
    title: "Missing Force Majeure Clause",
    description: "Contract lacks proper force majeure provisions required under UAE law",
    clause: "General Terms - Section 8",
    recommendation: "Add comprehensive force majeure clause covering natural disasters, pandemics, and governmental actions",
    status: "open",
    detectedDate: "2024-02-22",
  },
  {
    id: "I2",
    contractId: "4",
    severity: "medium",
    category: "shariah",
    title: "Interest-Based Late Payment",
    description: "Late payment clause mentions interest charges, not Shariah-compliant",
    clause: "Payment Terms - Clause 5.3",
    recommendation: "Replace interest charges with late payment administrative fees or penalties",
    status: "in-progress",
    detectedDate: "2024-02-12",
  },
  {
    id: "I3",
    contractId: "5",
    severity: "high",
    category: "risk",
    title: "Unlimited Liability Exposure",
    description: "Liability clause exposes organization to unlimited financial risk",
    clause: "Liability - Section 12",
    recommendation: "Cap liability at 2x contract value and exclude consequential damages",
    status: "open",
    detectedDate: "2024-02-18",
  },
  {
    id: "I4",
    contractId: "1",
    severity: "low",
    category: "internal",
    title: "Non-Standard Termination Notice",
    description: "Termination notice period differs from company policy (45 days vs 30 days)",
    clause: "Termination - Clause 15.2",
    recommendation: "Align termination notice with standard 30-day company policy",
    status: "resolved",
    detectedDate: "2024-01-20",
  },
];

// Mock AI Analysis
export const mockAIAnalyses: Record<string, AIAnalysis> = {
  "1": {
    contractId: "1",
    overallScore: 92,
    riskScore: 3,
    confidence: 94,
    issues: [mockComplianceIssues[3]],
    recommendations: [
      "Consider adding explicit Shariah audit clause",
      "Include dispute resolution via Islamic arbitration",
      "Strengthen collateral documentation requirements",
    ],
    shariahCompliance: {
      compliant: true,
      score: 95,
      issues: [],
    },
    clauses: [
      {
        id: "C1",
        text: "The Bank agrees to purchase the asset and sell it to the Client at cost plus agreed profit margin",
        type: "Murabaha Terms",
        riskLevel: "low",
        complianceScore: 98,
        analysis: "Fully compliant with Shariah principles. Clear cost-plus structure.",
      },
      {
        id: "C2",
        text: "Payment shall be made in 36 monthly installments",
        type: "Payment Terms",
        riskLevel: "low",
        complianceScore: 95,
        analysis: "Standard payment structure. No interest-based components detected.",
      },
      {
        id: "C3",
        text: "In case of default, a late payment fee of 2% may be charged",
        type: "Default Terms",
        riskLevel: "medium",
        complianceScore: 85,
        analysis: "Late fee acceptable if charitable. Recommend clarifying charitable donation destination.",
      },
    ],
  },
  "2": {
    contractId: "2",
    overallScore: 85,
    riskScore: 5,
    confidence: 88,
    issues: [mockComplianceIssues[0]],
    recommendations: [
      "Add comprehensive force majeure clause",
      "Include property inspection timeline",
      "Clarify title transfer documentation requirements",
    ],
    shariahCompliance: {
      compliant: true,
      score: 90,
      issues: [],
    },
    clauses: [
      {
        id: "C1",
        text: "Seller agrees to sell the Property to Buyer for the Purchase Price",
        type: "Sale Terms",
        riskLevel: "low",
        complianceScore: 95,
        analysis: "Clear and compliant sale terms.",
      },
      {
        id: "C2",
        text: "Completion shall occur within 60 days of contract signing",
        type: "Completion Terms",
        riskLevel: "medium",
        complianceScore: 80,
        analysis: "Timeline acceptable but lacks force majeure provisions.",
      },
    ],
  },
};

// Mock Blockchain Verifications
export const mockBlockchainVerifications: Record<string, BlockchainVerification> = {
  "1": {
    contractId: "1",
    verified: true,
    hash: "0x742d35cc6634c0532925a3b844bc9e7fe3d1e6f2c7b6e8f9d3a1c4e5b2f8a9c3",
    transactionHash: "0x8f3d2b9e1c5a6f4d8e2a7c3b5f1d9e6a4c8b2e5f7a3d6c1e9b4f2a8c5e3d7b6",
    blockNumber: 45283921,
    timestamp: "2024-01-20T14:32:18Z",
    registeredBy: "Ahmed Hassan",
    network: "Polygon",
  },
  "3": {
    contractId: "3",
    verified: true,
    hash: "0x9e4a7d2f8b1c6e5a3d9f2b8c4e7a1d6f9c3b5e2a8d4f7c1e6b9a3f5d2c8e4a7",
    transactionHash: "0x2c8f5e3a9d1b7f4e6c2a8d5f3e9b1c7a4f6d8e2b5a9c3f1e7d4a6b8c5f2e9d3",
    blockNumber: 45298453,
    timestamp: "2024-02-05T09:15:42Z",
    registeredBy: "Mohammed Al-Rashid",
    network: "Polygon",
  },
};

// Mock Version History
export const mockVersions: Record<string, Version[]> = {
  "1": [
    {
      id: "V1",
      contractId: "1",
      version: "1.0",
      editor: "Ahmed Hassan",
      timestamp: "2024-01-15T10:30:00Z",
      summary: "Initial contract draft created from Murabaha template",
      confidence: 95,
      changes: {
        additions: 0,
        deletions: 0,
        modifications: 0,
      },
    },
    {
      id: "V2",
      contractId: "1",
      version: "1.1",
      editor: "Legal Review Team",
      timestamp: "2024-01-18T14:20:00Z",
      summary: "Updated payment terms and clarified profit calculation method. Added Shariah compliance certification clause.",
      confidence: 92,
      changes: {
        additions: 3,
        deletions: 1,
        modifications: 5,
      },
    },
    {
      id: "V3",
      contractId: "1",
      version: "1.2",
      editor: "Ahmed Hassan",
      timestamp: "2024-01-20T11:45:00Z",
      summary: "Minor corrections to party details and adjusted repayment schedule.",
      confidence: 97,
      changes: {
        additions: 0,
        deletions: 0,
        modifications: 2,
      },
    },
  ],
};

// Helper functions
export const getContractById = (id: string): Contract | undefined => {
  return mockContracts.find((c) => c.id === id);
};

export const getTemplateById = (id: string): Template | undefined => {
  return mockTemplates.find((t) => t.id === id);
};

export const getAIAnalysis = (contractId: string): AIAnalysis | undefined => {
  return mockAIAnalyses[contractId];
};

export const getBlockchainVerification = (contractId: string): BlockchainVerification | undefined => {
  return mockBlockchainVerifications[contractId];
};

export const getVersionHistory = (contractId: string): Version[] => {
  return mockVersions[contractId] || [];
};

export const getComplianceIssuesByContract = (contractId: string): ComplianceIssue[] => {
  return mockComplianceIssues.filter((issue) => issue.contractId === contractId);
};

// Dashboard Stats
export const getDashboardStats = () => {
  const totalContracts = mockContracts.length;
  const pendingReviews = mockContracts.filter((c) => c.status === "draft" || c.status === "under_review").length;
  const criticalIssues = mockContracts.reduce((sum, c) => sum + c.criticalIssues, 0);
  const avgComplianceScore = Math.round(
    mockContracts.reduce((sum, c) => sum + c.complianceScore, 0) / totalContracts
  );
  
  return {
    totalContracts,
    pendingReviews,
    criticalIssues,
    complianceRate: avgComplianceScore,
    approvedContracts: mockContracts.filter((c) => c.status === "approved" || c.status === "signed").length,
    rejectedContracts: mockContracts.filter((c) => c.status === "rejected").length,
  };
};

// AI Clause Suggestions for Smart Drafting
export interface ClauseSuggestion {
  id: string;
  type: string;
  title: string;
  content: string;
  category: "payment" | "liability" | "termination" | "general" | "shariah" | "dispute";
  confidence: number;
  complianceScore: number;
  tags: string[];
}

export const mockClauseSuggestions: ClauseSuggestion[] = [
  {
    id: "CS1",
    type: "Payment Terms",
    title: "Installment Payment Schedule",
    content: "The Client shall pay the Total Amount in [NUMBER] equal monthly installments of [AMOUNT] each, commencing on [START_DATE] and continuing on the same day of each successive month thereafter.",
    category: "payment",
    confidence: 95,
    complianceScore: 92,
    tags: ["payment", "installment", "schedule"],
  },
  {
    id: "CS2",
    type: "Payment Terms",
    title: "Shariah-Compliant Late Payment",
    content: "In the event of late payment, the Client shall pay a charitable donation of [PERCENTAGE]% of the overdue amount to [CHARITY_NAME], as specified by the Institution. This amount shall not be retained as profit by the Institution.",
    category: "shariah",
    confidence: 98,
    complianceScore: 99,
    tags: ["shariah", "late payment", "penalty", "charity"],
  },
  {
    id: "CS3",
    type: "Liability Clause",
    title: "Limited Liability Cap",
    content: "The aggregate liability of either Party arising out of or related to this Agreement shall not exceed two times (2x) the total value of this Agreement. Neither Party shall be liable for any indirect, incidental, consequential, or punitive damages.",
    category: "liability",
    confidence: 93,
    complianceScore: 90,
    tags: ["liability", "limitation", "damages"],
  },
  {
    id: "CS4",
    type: "Termination",
    title: "Termination for Convenience",
    content: "Either Party may terminate this Agreement upon thirty (30) days written notice to the other Party. Upon termination, all outstanding payments shall become immediately due and payable.",
    category: "termination",
    confidence: 90,
    complianceScore: 88,
    tags: ["termination", "notice", "payment"],
  },
  {
    id: "CS5",
    type: "Force Majeure",
    title: "Force Majeure - UAE Compliant",
    content: "Neither Party shall be liable for failure to perform its obligations if such failure results from events beyond reasonable control including acts of God, pandemic, war, terrorism, governmental actions, or natural disasters. The affected Party shall notify the other within seven (7) days.",
    category: "general",
    confidence: 96,
    complianceScore: 94,
    tags: ["force majeure", "liability", "UAE law"],
  },
  {
    id: "CS6",
    type: "Dispute Resolution",
    title: "Islamic Arbitration",
    content: "Any dispute arising from this Agreement shall be resolved through arbitration in accordance with Shariah principles. The arbitration shall be conducted by [ARBITRATION_BODY] and shall be final and binding on both Parties.",
    category: "dispute",
    confidence: 97,
    complianceScore: 98,
    tags: ["shariah", "arbitration", "dispute"],
  },
  {
    id: "CS7",
    type: "Confidentiality",
    title: "Mutual Confidentiality",
    content: "Each Party agrees to maintain confidentiality of all proprietary and confidential information disclosed during the term of this Agreement. This obligation shall survive termination for a period of [YEARS] years.",
    category: "general",
    confidence: 94,
    complianceScore: 91,
    tags: ["confidentiality", "proprietary", "information"],
  },
  {
    id: "CS8",
    type: "Shariah Compliance",
    title: "Shariah Audit Right",
    content: "The Institution reserves the right to conduct periodic Shariah compliance audits. The Client agrees to provide all necessary documentation to verify compliance with Islamic finance principles. Any non-compliant aspects shall be rectified immediately.",
    category: "shariah",
    confidence: 99,
    complianceScore: 99,
    tags: ["shariah", "audit", "compliance"],
  },
];

// Clause Comparison Data
export interface ClauseComparison {
  id: string;
  clauseNumber: number;
  originalClause: {
    text: string;
    type: string;
  };
  standardClause: {
    text: string;
    type: string;
  };
  riskScore: number;
  deviations: string[];
  suggestedRewrite: string;
  confidence: number;
  complianceImpact: "none" | "low" | "medium" | "high" | "critical";
}

export const mockClauseComparisons: Record<string, ClauseComparison[]> = {
  "2": [
    {
      id: "CC1",
      clauseNumber: 1,
      originalClause: {
        text: "The Seller shall transfer the Property to the Buyer within 60 days of signing this agreement.",
        type: "Transfer Terms",
      },
      standardClause: {
        text: "The Seller shall transfer the Property to the Buyer within 60 days of signing this agreement, subject to Force Majeure conditions as defined in Clause 15.",
        type: "Transfer Terms",
      },
      riskScore: 6,
      deviations: ["Missing Force Majeure reference", "No contingency provisions"],
      suggestedRewrite: "The Seller shall transfer the Property to the Buyer within sixty (60) days of signing this agreement, subject to Force Majeure conditions as defined in Clause 15. In case of unforeseen circumstances, the timeline may be extended by mutual written agreement.",
      confidence: 92,
      complianceImpact: "medium",
    },
    {
      id: "CC2",
      clauseNumber: 2,
      originalClause: {
        text: "The Purchase Price shall be paid in full at completion.",
        type: "Payment Terms",
      },
      standardClause: {
        text: "The Purchase Price shall be paid as follows: (a) 10% deposit upon signing, (b) 90% at completion through bank transfer to the Seller's designated account.",
        type: "Payment Terms",
      },
      riskScore: 5,
      deviations: ["Missing payment breakdown", "No deposit clause", "No payment method specified"],
      suggestedRewrite: "The Purchase Price shall be paid as follows: (a) Ten percent (10%) deposit upon signing this Agreement; (b) Ninety percent (90%) balance payment at completion through direct bank transfer to the Seller's designated account as specified in Schedule A.",
      confidence: 95,
      complianceImpact: "medium",
    },
    {
      id: "CC3",
      clauseNumber: 3,
      originalClause: {
        text: "Either party may terminate this agreement with written notice.",
        type: "Termination",
      },
      standardClause: {
        text: "Either Party may terminate this Agreement with thirty (30) days written notice. The deposit shall be non-refundable unless termination is due to Seller's breach.",
        type: "Termination",
      },
      riskScore: 8,
      deviations: ["No notice period specified", "Missing deposit refund terms", "No breach conditions"],
      suggestedRewrite: "Either Party may terminate this Agreement with thirty (30) days prior written notice to the other Party. In the event of termination by the Buyer, the deposit shall be forfeited to the Seller. In the event of termination due to Seller's breach, the deposit shall be fully refunded to the Buyer within fourteen (14) days.",
      confidence: 88,
      complianceImpact: "high",
    },
  ],
};

// Template Clause Library
export interface TemplateClause {
  id: string;
  templateId: string;
  clauseNumber: number;
  title: string;
  content: string;
  type: string;
  isMandatory: boolean;
  shariahCompliant: boolean;
  variables: string[];
}

export const mockTemplateClauses: TemplateClause[] = [
  {
    id: "TC1",
    templateId: "T1",
    clauseNumber: 1,
    title: "Parties",
    content: "This Murabaha Agreement (\"Agreement\") is entered into on [DATE] between [BANK_NAME] (\"Bank\") and [CLIENT_NAME] (\"Client\").",
    type: "Parties",
    isMandatory: true,
    shariahCompliant: true,
    variables: ["[DATE]", "[BANK_NAME]", "[CLIENT_NAME]"],
  },
  {
    id: "TC2",
    templateId: "T1",
    clauseNumber: 2,
    title: "Asset Description",
    content: "The Bank agrees to purchase [ASSET_DESCRIPTION] (\"Asset\") at the request of the Client for the cost price of [COST_PRICE].",
    type: "Asset Terms",
    isMandatory: true,
    shariahCompliant: true,
    variables: ["[ASSET_DESCRIPTION]", "[COST_PRICE]"],
  },
  {
    id: "TC3",
    templateId: "T1",
    clauseNumber: 3,
    title: "Profit and Sale Price",
    content: "The Bank shall sell the Asset to the Client at a profit margin of [PROFIT_RATE]%, resulting in a total sale price of [TOTAL_PRICE].",
    type: "Pricing",
    isMandatory: true,
    shariahCompliant: true,
    variables: ["[PROFIT_RATE]", "[TOTAL_PRICE]"],
  },
];

// Compliance Metrics
export const getComplianceMetrics = () => {
  const totalIssues = mockComplianceIssues.length;
  const openIssues = mockComplianceIssues.filter((i) => i.status === "open").length;
  const resolvedIssues = mockComplianceIssues.filter((i) => i.status === "resolved").length;
  
  const issuesByCategory = {
    shariah: mockComplianceIssues.filter((i) => i.category === "shariah").length,
    legal: mockComplianceIssues.filter((i) => i.category === "legal").length,
    internal: mockComplianceIssues.filter((i) => i.category === "internal").length,
    risk: mockComplianceIssues.filter((i) => i.category === "risk").length,
    dataProtection: mockComplianceIssues.filter((i) => i.category === "data-protection").length,
  };
  
  const issuesBySeverity = {
    critical: mockComplianceIssues.filter((i) => i.severity === "critical").length,
    high: mockComplianceIssues.filter((i) => i.severity === "high").length,
    medium: mockComplianceIssues.filter((i) => i.severity === "medium").length,
    low: mockComplianceIssues.filter((i) => i.severity === "low").length,
  };
  
  return {
    totalIssues,
    openIssues,
    resolvedIssues,
    resolutionRate: Math.round((resolvedIssues / totalIssues) * 100),
    issuesByCategory,
    issuesBySeverity,
  };
};

// Get clause comparisons for a contract
export const getClauseComparisons = (contractId: string): ClauseComparison[] => {
  return mockClauseComparisons[contractId] || [];
};
