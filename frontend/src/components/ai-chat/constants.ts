export const SUGGESTED_QUESTIONS = [
  "What are the key Shariah compliance requirements for Murabaha contracts?",
  "Explain the difference between Ijara and Murabaha financing",
  "What are the UAE labor law requirements for employment contracts?",
  "How do I ensure force majeure clauses are compliant?",
  "What should I look for in a commercial service agreement?",
  "Explain the requirements for real estate sale agreements in UAE",
];

export const AI_RESPONSES: Record<
  string,
  { content: string; sources: string[]; confidence: number }
> = {
  shariah: {
    content:
      "Key Shariah compliance requirements for Murabaha contracts include:\n\n1. Asset Ownership: The bank must take actual ownership of the asset before selling to the customer\n2. Cost Disclosure: Clear disclosure of cost price and profit margin is mandatory\n3. No Interest: Profit must be fixed at the time of contract, not time-based\n4. Late Payment: Late fees should go to charity, not as profit to the bank\n5. Asset Type: The asset must be Shariah-compliant (halal)\n6. Documentation: Separate purchase and sale agreements required\n7. Risk Transfer: Bank bears risk during ownership period\n\nAll contracts should be reviewed by a Shariah board for certification.",
    sources: [
      "AAOIFI Standard FAS 28",
      "UAE Islamic Affairs Guidelines",
      "Internal Shariah Policy",
    ],
    confidence: 95,
  },
  ijara: {
    content:
      "The key differences between Ijara and Murabaha:\n\nMurabaha (Cost-Plus Financing):\n- Sale-based contract\n- Ownership transfers immediately\n- Customer owns the asset from start\n- Fixed profit margin on cost\n- Early settlement may reduce profit\n\nIjara (Islamic Lease):\n- Lease-based contract\n- Bank retains ownership during lease period\n- Customer is lessee, not owner\n- Rental payments over time\n- May end with ownership transfer (Ijara wa Iqtina)\n- Bank responsible for major repairs\n\nChoose Murabaha for outright purchase financing, Ijara for asset usufruct needs.",
    sources: ["AAOIFI Standard FAS 8 & 28", "Islamic Fiqh Academy Resolutions"],
    confidence: 98,
  },
  default: {
    content:
      "I'm your AI-powered legal assistant specialized in contract lifecycle management and Islamic finance compliance.\n\nI can help you with:\n- Shariah compliance questions\n- Legal requirements analysis\n- Contract review guidance\n- Risk assessment\n- Best practices for contract drafting\n- UAE and GCC legal frameworks\n\nPlease ask your question about contracts, compliance, or Islamic finance, and I'll provide detailed guidance with references.",
    sources: ["CLM Knowledge Base", "Legal Documentation"],
    confidence: 90,
  },
};
