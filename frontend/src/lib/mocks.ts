export type ClauseSuggestion = {
  id: string;
  title: string;
  type: string;
  content: string;
  tags: string[];
};

export type ContractTemplate = {
  id: string;
  name: string;
  category: string;
};

// Mock clause suggestions have been removed - now using AI-powered suggestions from the API
// This is kept for backward compatibility but should not be used
export const mockClauseSuggestions: ClauseSuggestion[] = [];

/* Previous mock data removed - now using AI-powered suggestions
  {
    id: "2",
    title: "Business Interruption Clause",
    type: "Risk Management",
    content:
      "In the event of business interruption caused by unforeseen circumstances, the affected party shall notify the other party within [NUMBER] days and provide regular updates every [NUMBER] days thereafter.",
    tags: ["business interruption", "notification", "communication"],
  },

  // Payment & Financial Terms
  {
    id: "3",
    title: "Payment Terms",
    type: "Financial",
    content:
      "Payment shall be made within [NUMBER] days of invoice date. Late payments shall incur interest at the rate of [INTEREST_RATE]% per annum calculated daily. All payments shall be made in [CURRENCY] via bank transfer to the account specified.",
    tags: ["payment", "invoice", "terms", "late payment"],
  },
  {
    id: "4",
    title: "Currency and Exchange Rate",
    type: "Financial",
    content:
      "All amounts specified in this Agreement are in [CURRENCY]. In the event of currency conversion, the exchange rate shall be determined using the prevailing rate published by [BANK_NAME] on the date of payment.",
    tags: ["currency", "exchange rate", "conversion"],
  },
  {
    id: "5",
    title: "Escrow Arrangement",
    type: "Financial",
    content:
      "Funds in the amount of [AMOUNT] shall be deposited into an escrow account with [ESCROW_AGENT] pending satisfaction of the conditions set forth in Section [SECTION_NUMBER].",
    tags: ["escrow", "security", "conditions"],
  },

  // Liability & Indemnification
  {
    id: "6",
    title: "Limitation of Liability",
    type: "Liability",
    content:
      "To the maximum extent permitted by law, neither party's total liability for any claims arising out of or related to this Agreement shall exceed [AMOUNT] or the total fees paid in the [TIME_PERIOD] months preceding the claim, whichever is greater.",
    tags: ["liability", "limitation", "caps"],
  },
  {
    id: "7",
    title: "Indemnification",
    type: "Liability",
    content:
      "Each party agrees to indemnify, defend, and hold harmless the other party from and against any claims, damages, losses, liabilities, and expenses arising out of breach of this Agreement or violation of applicable laws by the indemnifying party.",
    tags: ["indemnification", "liability", "claims"],
  },
  {
    id: "8",
    title: "Consequential Damages Exclusion",
    type: "Liability",
    content:
      "Neither party shall be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, revenue, data, or business opportunities, regardless of the theory of liability.",
    tags: ["damages", "consequential", "exclusion"],
  },

  // Termination
  {
    id: "9",
    title: "Termination for Cause",
    type: "Termination",
    content:
      "Either party may terminate this Agreement immediately upon written notice if the other party: (a) materially breaches this Agreement and fails to cure such breach within [NUMBER] days of written notice; (b) becomes insolvent or files for bankruptcy; or (c) engages in conduct that brings the terminating party into disrepute.",
    tags: ["termination", "breach", "cause"],
  },
  {
    id: "10",
    title: "Termination for Convenience",
    type: "Termination",
    content:
      "Either party may terminate this Agreement for convenience by providing [NUMBER] days written notice to the other party. Upon such termination, all fees owed through the termination date shall be immediately due and payable.",
    tags: ["termination", "convenience", "notice"],
  },
  {
    id: "11",
    title: "Effects of Termination",
    type: "Termination",
    content:
      "Upon termination, all rights and obligations shall cease except that: (a) accrued obligations shall survive; (b) provisions that by their nature should survive shall remain in effect; and (c) each party shall return or destroy confidential information as required.",
    tags: ["termination", "survival", "confidentiality"],
  },

  // Confidentiality & Data Protection
  {
    id: "12",
    title: "Confidentiality Obligations",
    type: "Confidentiality",
    content:
      "Each party agrees to maintain the confidentiality of all proprietary information disclosed by the other party and to use such information solely for the purposes of this Agreement. This obligation shall survive termination for [NUMBER] years.",
    tags: ["confidentiality", "proprietary", "NDA"],
  },
  {
    id: "13",
    title: "Data Protection & GDPR",
    type: "Confidentiality",
    content:
      "Both parties agree to comply with applicable data protection laws including GDPR. Personal data shall be processed only for specified purposes, stored securely, and retained only as necessary. Data subjects have the right to access, rectify, and delete their personal data.",
    tags: ["GDPR", "data protection", "privacy"],
  },
  {
    id: "14",
    title: "Data Breach Notification",
    type: "Confidentiality",
    content:
      "In the event of a data breach involving personal data, the affected party shall notify the other party and relevant supervisory authorities within [NUMBER] hours of becoming aware of the breach and provide full details of the incident and remediation measures.",
    tags: ["data breach", "notification", "GDPR"],
  },

  // Intellectual Property
  {
    id: "15",
    title: "Intellectual Property Ownership",
    type: "Intellectual Property",
    content:
      "Each party retains ownership of its pre-existing intellectual property. Any new intellectual property created by [PARTY_NAME] in the course of performing this Agreement shall belong to [OWNER_NAME]. A non-exclusive license is granted for the term of this Agreement.",
    tags: ["IP", "ownership", "licensing"],
  },
  {
    id: "16",
    title: "License Grant",
    type: "Intellectual Property",
    content:
      "The Licensor hereby grants to the Licensee a [exclusive/non-exclusive], [worldwide/territory-specific], [paid-up royalty-free] license to use the Licensed Materials for the purposes set forth in this Agreement, subject to the restrictions and obligations herein.",
    tags: ["license", "IP", "grant"],
  },

  // Warranties & Representations
  {
    id: "17",
    title: "Representations and Warranties",
    type: "Warranties",
    content:
      "Each party represents and warrants that: (a) it has full power and authority to enter into this Agreement; (b) execution does not violate any other agreement; (c) all information provided is accurate; and (d) it will comply with all applicable laws.",
    tags: ["warranties", "representations", "authority"],
  },
  {
    id: "18",
    title: "Warranty Disclaimer",
    type: "Warranties",
    content:
      "EXCEPT AS EXPRESSLY PROVIDED HEREIN, THE PRODUCTS AND SERVICES ARE PROVIDED 'AS IS' WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.",
    tags: ["warranty", "disclaimer", "as-is"],
  },

  // Dispute Resolution
  {
    id: "19",
    title: "Dispute Resolution & Arbitration",
    type: "Dispute Resolution",
    content:
      "Any dispute arising under this Agreement shall first be subject to good faith negotiation for [NUMBER] days. If unresolved, disputes shall be resolved through binding arbitration administered by [ARBITRATION_BODY] in accordance with [JURISDICTION] law, with arbitration to take place in [LOCATION].",
    tags: ["dispute", "arbitration", "mediation"],
  },
  {
    id: "20",
    title: "Jurisdiction and Governing Law",
    type: "Dispute Resolution",
    content:
      "This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION], without regard to conflict of law principles. Any legal action shall be brought exclusively in the courts of [JURISDICTION].",
    tags: ["jurisdiction", "governing law", "venue"],
  },

  // Insurance & Security
  {
    id: "21",
    title: "Insurance Requirements",
    type: "Insurance",
    content:
      "Each party shall maintain at its own expense: (a) commercial general liability insurance of at least [AMOUNT]; (b) professional liability insurance of at least [AMOUNT]; and (c) cyber liability insurance of at least [AMOUNT]. Proof of insurance shall be provided upon request.",
    tags: ["insurance", "liability", "coverage"],
  },
  {
    id: "22",
    title: "Security Measures",
    type: "Insurance",
    content:
      "Both parties shall implement and maintain appropriate technical and organizational security measures to protect against unauthorized access, alteration, disclosure, or destruction of data, including encryption, access controls, and regular security audits.",
    tags: ["security", "encryption", "data protection"],
  },

  // Assignment & Transfer
  {
    id: "23",
    title: "Assignment Restrictions",
    type: "Assignment",
    content:
      "Neither party may assign this Agreement without the prior written consent of the other party, except that either party may assign to an affiliate or in connection with a merger, acquisition, or sale of substantially all assets.",
    tags: ["assignment", "transfer", "consent"],
  },

  // Notices & Communication
  {
    id: "24",
    title: "Notices",
    type: "Communication",
    content:
      "All notices required under this Agreement shall be in writing and delivered personally, by certified mail, or by email to the addresses specified above. Notices shall be deemed received upon: personal delivery; [NUMBER] days after mailing; or upon email transmission if during business hours.",
    tags: ["notices", "communication", "service"],
  },

  // Default & Remedies
  {
    id: "25",
    title: "Events of Default",
    type: "Default",
    content:
      "The following shall constitute events of default: (a) failure to make payment when due; (b) material breach of any provision not cured within [NUMBER] days; (c) insolvency or bankruptcy; (d) failure to maintain required insurance; and (e) any misrepresentation.",
    tags: ["default", "breach", "events"],
  },
  {
    id: "26",
    title: "Remedies for Default",
    type: "Default",
    content:
      "Upon default, the non-defaulting party may: (a) terminate this Agreement; (b) seek specific performance; (c) recover all costs and expenses including attorney fees; and (d) pursue any other remedies available at law or in equity.",
    tags: ["remedies", "default", "enforcement"],
  },

  // Amendment & Modification
  {
    id: "27",
    title: "Amendment and Modification",
    type: "Amendment",
    content:
      "This Agreement may only be amended or modified by a written instrument signed by both parties. No oral modifications or waivers shall be binding. A waiver of any provision in one instance shall not constitute a waiver in future instances.",
    tags: ["amendment", "modification", "waiver"],
  },

  // Severability & Entire Agreement
  {
    id: "28",
    title: "Severability",
    type: "General",
    content:
      "If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect, and the invalid provision shall be replaced with a valid provision that most closely approximates the intent of the original.",
    tags: ["severability", "validity", "enforceability"],
  },
  {
    id: "29",
    title: "Entire Agreement",
    type: "General",
    content:
      "This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements, representations, and understandings relating to the subject matter. No other terms or conditions shall apply unless expressly agreed in writing.",
    tags: ["entire agreement", "integration", "merger"],
  },

  // Islamic Finance Specific
  {
    id: "30",
    title: "Sharia Compliance Certification",
    type: "Islamic Finance",
    content:
      "This Agreement has been reviewed and approved by the Sharia Board of [INSTITUTION_NAME] as compliant with Islamic principles. Both parties warrant that all transactions hereunder conform to Sharia law and do not involve riba (interest), gharar (uncertainty), or maysir (gambling).",
    tags: ["sharia", "islamic finance", "compliance"],
  },
  {
    id: "31",
    title: "Profit and Loss Sharing",
    type: "Islamic Finance",
    content:
      "All profits and losses shall be shared between the parties in the ratio of [PARTY_A_SHARE]% and [PARTY_B_SHARE]% respectively. Losses shall be shared in proportion to capital contribution. Profit distribution shall occur [PERIODICITY] and be documented in writing.",
    tags: ["profit sharing", "loss sharing", "mudarabah"],
  },
  {
    id: "32",
    title: "Zakat Obligation",
    type: "Islamic Finance",
    content:
      "The parties acknowledge that Zakat obligations shall be calculated and paid separately in accordance with Sharia principles. Any Zakat payable on assets subject to this Agreement shall be the responsibility of the respective asset owner.",
    tags: ["zakat", "sharia", "islamic finance"],
  },

  // Real Estate Specific
  {
    id: "33",
    title: "Property Inspection Rights",
    type: "Real Estate",
    content:
      "The Lender or its authorized representatives shall have the right to inspect the Property at reasonable times upon [NUMBER] days written notice to ensure compliance with the terms of this Agreement and to assess the condition and value of the Property.",
    tags: ["inspection", "property", "access"],
  },
  {
    id: "34",
    title: "Use and Occupancy Restrictions",
    type: "Real Estate",
    content:
      "The Property shall be used solely for [PERMITTED_USE] purposes. The Borrower shall not use or permit the Property to be used for any illegal purposes, nor commit waste or cause environmental contamination. Any change in use requires written consent.",
    tags: ["use restrictions", "property", "occupancy"],
  },

  // Banking & Finance Specific
  {
    id: "35",
    title: "Financial Covenants",
    type: "Banking",
    content:
      "The Borrower covenants to maintain: (a) minimum tangible net worth of [AMOUNT]; (b) current ratio of at least [RATIO]:1; (c) debt-to-equity ratio not exceeding [RATIO]:1; and (d) debt service coverage ratio of at least [RATIO]:1. Compliance shall be tested [FREQUENCY].",
    tags: ["covenants", "financial", "banking"],
  },
  {
    id: "36",
    title: "Right of Set-Off",
    type: "Banking",
    content:
      "The Lender shall have the right to set off any amounts owing by the Borrower against any deposits or credits of the Borrower held with the Lender, without prior notice, whether or not such amounts are due and regardless of any other security held.",
    tags: ["set-off", "banking", "rights"],
  },
  {
    id: "37",
    title: "Costs and Expenses",
    type: "Banking",
    content:
      "The Borrower shall reimburse the Lender for all costs and expenses incurred in connection with this Agreement, including but not limited to legal fees, due diligence costs, appraisal fees, and recording fees, regardless of whether the transaction closes.",
    tags: ["costs", "expenses", "fees"],
  },
];
*/

export const mockTemplates: ContractTemplate[] = [
  {
    id: "1",
    name: "Term Loan Agreement",
    category: "Credit Facility",
  },
  {
    id: "2",
    name: "Revolving Credit Facility",
    category: "Credit Facility",
  },
  {
    id: "3",
    name: "Mortgage Agreement",
    category: "Security",
  },
  {
    id: "4",
    name: "Corporate Guarantee",
    category: "Security",
  },
  {
    id: "5",
    name: "Islamic Finance - Murabaha",
    category: "Islamic Finance",
  },
  {
    id: "6",
    name: "Islamic Finance - Ijarah",
    category: "Islamic Finance",
  },
];

const TEMPLATE_CONTENT = {
  "1": `TERM LOAN AGREEMENT

PARTIES:
Lender: [BANK_NAME]
Borrower: [COMPANY_NAME]

WHEREAS the Borrower has requested the Lender to provide a term loan facility;

NOW THEREFORE the parties agree as follows:

1. LOAN AMOUNT
The Lender agrees to advance to the Borrower the principal sum of [AMOUNT] ([AMOUNT_IN_WORDS]).

2. INTEREST RATE
The loan shall bear interest at the rate of [INTEREST_RATE]% per annum, calculated on the outstanding principal balance.

3. REPAYMENT TERMS
The Borrower shall repay the loan in [NUMBER] equal monthly installments of [INSTALLMENT_AMOUNT] each, commencing on [FIRST_PAYMENT_DATE].

4. REPRESENTATIONS AND WARRANTIES
The Borrower represents and warrants that:
- All financial statements are true and accurate
- No event of default has occurred
- The Borrower has the authority to enter into this agreement

5. EVENTS OF DEFAULT
The following shall constitute events of default:
- Failure to make any payment when due
- Breach of any covenant or warranty
- Insolvency or winding up proceedings

6. GOVERNING LAW
This agreement shall be governed by the laws of [JURISDICTION].

SIGNED this [DATE]

[BANK_SIGNATORY]                    [BORROWER_SIGNATORY]
Lender                              Borrower`,

  "2": `REVOLVING CREDIT FACILITY AGREEMENT

PARTIES:
Lender: [BANK_NAME]
Borrower: [COMPANY_NAME]

The parties agree as follows:

1. FACILITY LIMIT
The Lender agrees to make available to the Borrower a revolving credit facility up to a maximum amount of [FACILITY_LIMIT] ([AMOUNT_IN_WORDS]).

2. AVAILABILITY PERIOD
The facility shall be available for drawings from [START_DATE] to [END_DATE] (the "Availability Period").

3. INTEREST AND FEES
- Interest Rate: [INTEREST_RATE]% per annum
- Commitment Fee: [COMMITMENT_FEE]% per annum on undrawn amounts
- Utilization Fee: [UTILIZATION_FEE]% per annum on drawn amounts

4. DRAWINGS AND REPAYMENTS
- Minimum drawing amount: [MIN_DRAWING]
- Notice period for drawings: [NOTICE_PERIOD] business days
- Repayments may be made at any time without penalty

5. FINANCIAL COVENANTS
The Borrower shall maintain:
- Debt-to-equity ratio not exceeding [DEBT_EQUITY_RATIO]:1
- Current ratio of at least [CURRENT_RATIO]:1
- Tangible net worth of not less than [TANGIBLE_NET_WORTH]

6. SECURITY
The facility shall be secured by:
- [COLLATERAL_DESCRIPTION]
- Corporate guarantee from [GUARANTOR_NAME]

Date: [DATE]

[BANK_SIGNATORY]                    [BORROWER_SIGNATORY]
Lender                              Borrower`,

  "3": `MORTGAGE AGREEMENT

PARTIES:
Mortgagee (Lender): [BANK_NAME]
Mortgagor (Borrower): [PROPERTY_OWNER_NAME]

PROPERTY DESCRIPTION:
The property located at [PROPERTY_ADDRESS], consisting of [PROPERTY_DESCRIPTION].

LOAN DETAILS:
Principal Amount: [LOAN_AMOUNT]
Interest Rate: [INTEREST_RATE]% per annum
Term: [LOAN_TERM] years

NOW THEREFORE IT IS AGREED:

1. GRANT OF MORTGAGE
The Mortgagor hereby grants to the Mortgagee a first-ranking mortgage over the Property as security for the repayment of the Loan.

2. COVENANTS BY MORTGAGOR
The Mortgagor covenants to:
- Pay all principal and interest when due
- Keep the Property insured against fire and other risks
- Pay all taxes, assessments, and charges relating to the Property
- Maintain the Property in good repair
- Not transfer or encumber the Property without consent

3. DEFAULT AND POWER OF SALE
Upon default in payment or breach of any covenant, the Mortgagee may:
- Accelerate the outstanding balance
- Take possession of the Property
- Exercise power of sale in accordance with applicable law

4. INSURANCE
The Mortgagor shall maintain comprehensive insurance coverage in the amount of [INSURANCE_AMOUNT] and assign all proceeds to the Mortgagee.

5. DISCHARGE
Upon full repayment of the Loan, the Mortgagee shall execute a discharge of mortgage and return all title documents.

Date: [DATE]

[BANK_SIGNATORY]                    [MORTGAGOR_SIGNATORY]
Mortgagee                           Mortgagor`,

  "4": `CORPORATE GUARANTEE AGREEMENT

PARTIES:
Guarantor: [GUARANTOR_COMPANY_NAME]
Beneficiary (Lender): [BANK_NAME]
Principal Debtor: [BORROWER_NAME]

WHEREAS the Principal Debtor has requested credit facilities from the Beneficiary;
AND WHEREAS the Beneficiary requires a guarantee from the Guarantor;

NOW THEREFORE the Guarantor agrees as follows:

1. GUARANTEE
The Guarantor unconditionally and irrevocably guarantees to the Beneficiary the due and punctual payment and performance of all obligations of the Principal Debtor up to a maximum amount of [GUARANTEE_AMOUNT] ([AMOUNT_IN_WORDS]).

2. GUARANTEE AS PRIMARY OBLIGATION
This guarantee is a primary obligation and not merely a secondary obligation. The Beneficiary may enforce this guarantee without first pursuing the Principal Debtor.

3. CONTINUING GUARANTEE
This guarantee:
- Continues until full repayment and discharge of all obligations
- Remains in effect notwithstanding any variations to the principal facility
- Cannot be revoked without the Beneficiary's written consent

4. PAYMENT ON DEMAND
The Guarantor agrees to pay immediately upon written demand from the Beneficiary, without requiring proof of default.

5. REPRESENTATIONS AND WARRANTIES
The Guarantor represents that:
- It has full corporate power to execute this guarantee
- This guarantee does not violate any law or agreement
- All corporate resolutions have been duly passed

6. GOVERNING LAW
This guarantee shall be governed by the laws of [JURISDICTION].

Date: [DATE]

[GUARANTOR_SIGNATORY]               [BANK_SIGNATORY]
Guarantor                           Beneficiary`,

  "5": `MURABAHA SALE AGREEMENT
(Islamic Finance Product)

PARTIES:
Seller (Bank): [BANK_NAME]
Buyer: [COMPANY_NAME]

1. NATURE OF AGREEMENT
This is a Murabaha agreement whereby the Seller purchases [ASSET_DESCRIPTION] and resells it to the Buyer at a cost-plus-profit basis.

2. PURCHASE OF ASSET
The Seller agrees to purchase the Asset from [VENDOR_NAME] for [ASSET_COST].

3. SALE TO BUYER
The Seller sells the Asset to the Buyer for:
- Cost Price: [ASSET_COST]
- Profit Margin: [PROFIT_MARGIN]
- Total Sale Price: [TOTAL_PRICE]

4. PAYMENT TERMS
The Buyer shall pay the Sale Price in [NUMBER] equal installments of [INSTALLMENT_AMOUNT] each, commencing on [FIRST_PAYMENT_DATE].

5. RISK AND OWNERSHIP
- Ownership transfers to the Buyer upon execution of this agreement
- The Buyer bears all risks relating to the Asset
- The Buyer must maintain insurance on the Asset

6. DEFAULT
In case of default, the Buyer agrees to pay only the outstanding principal amount without any additional interest or penalty (to comply with Sharia principles).

7. GOVERNING LAW
This agreement is governed by the laws of [JURISDICTION] and is subject to Sharia law principles as interpreted by [SHARIA_BOARD].

Date: [DATE]

[BANK_SIGNATORY]                    [BUYER_SIGNATORY]
Seller                              Buyer`,

  "6": `IJARAH AGREEMENT
(Islamic Leasing Agreement)

PARTIES:
Lessor (Bank): [BANK_NAME]
Lessee: [COMPANY_NAME]

1. LEASE OF ASSET
The Lessor hereby leases to the Lessee, and the Lessee hereby leases from the Lessor, the following asset:
[ASSET_DESCRIPTION]

2. LEASE TERM
The lease term shall commence on [START_DATE] and continue for [LEASE_TERM] months/years, ending on [END_DATE].

3. LEASE RENTAL
The Lessee shall pay monthly rental of [MONTHLY_RENTAL] on the [PAYMENT_DAY] of each month. The rental amount includes principal repayment plus rental rate of [RENTAL_RATE]%.

4. MAINTENANCE OBLIGATIONS
- The Lessor shall maintain major structural repairs
- The Lessee shall maintain routine maintenance and repairs
- The Lessee must insure the Asset in the name of the Lessor

5. PURCHASE OPTION
Upon completion of the lease term, the Lessee has the option to purchase the Asset for [PURCHASE_PRICE].

6. DAMAGE AND INSURANCE
The Lessee is responsible for:
- All damages except normal wear and tear
- Maintaining comprehensive insurance coverage
- Returning the Asset in good condition

7. EARLY TERMINATION
The Lessee may terminate early by paying the remaining rental payments plus any outstanding amounts.

8. GOVERNING LAW
This agreement is governed by Sharia principles and the laws of [JURISDICTION].

Date: [DATE]

[BANK_SIGNATORY]                    [LESSEE_SIGNATORY]
Lessor                              Lessee`,
} as const;

export function getTemplateContent(templateId: string): string {
  const content = TEMPLATE_CONTENT[templateId as keyof typeof TEMPLATE_CONTENT];
  if (content) return content;

  const template = mockTemplates.find((t) => t.id === templateId);
  return template
    ? `${template.name}\n\nStandard bank contract template.\n\nDate: [DATE]\n\n`
    : "";
}
