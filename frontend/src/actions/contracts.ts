import { api } from "./api";

export enum ContractStatus {
  DRAFT = "draft",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  SIGNED = "signed",
}

export interface Clause {
  clause_id?: string;
  text?: string;
  content?: string;
  heading?: string;
  level?: number;
  type?: string;
  confidence?: number;
}

// Compliance Schema Types
export enum FindingType {
  POLICY_VIOLATION = "policy_violation",
  MISSING_CLAUSE = "missing_clause",
  WEAK_PROVISION = "weak_provision",
  LEGAL_RISK = "legal_risk",
  FINANCIAL_RISK = "financial_risk",
  RED_FLAG = "red_flag",
}

export enum ComplianceDomain {
  POLICY_COMPLIANCE = "policy_compliance",
  FINANCIAL = "financial",
  LEGAL = "legal",
  DATA_PRIVACY = "data_privacy",
  PAYMENT_TERMS = "payment_terms",
  DISPUTE_RESOLUTION = "dispute_resolution",
  INDEMNIFICATION = "indemnification",
  CONFIDENTIALITY = "confidentiality",
}

export enum Severity {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  INFO = "info",
}

export enum ImpactLevel {
  SEVERE = "severe",
  SIGNIFICANT = "significant",
  MODERATE = "moderate",
  MINIMAL = "minimal",
}

export enum AnalysisSource {
  COMPLIANCE_AGENT = "compliance_agent",
  TARIFF_AGENT = "tariff_agent",
  EXTERNAL_REVIEW_AGENT = "external_review_agent",
  ORCHESTRATOR = "orchestrator",
}

export interface PolicyReference {
  policy_name: string;
  requirement: string;
  section?: string;
}

export interface AffectedClause {
  clause_id: string;
  heading?: string;
  excerpt?: string;
}

export interface RemediationAction {
  action_type: string;
  description: string;
  priority: number;
}

export interface ComplianceFinding {
  finding_id: string;
  finding_type: FindingType;
  domain: ComplianceDomain;
  severity: Severity;
  impact: ImpactLevel;
  confidence_score: number;
  title: string;
  description: string;
  affected_clauses: AffectedClause[];
  policy_violations: PolicyReference[];
  remediation_actions: RemediationAction[];
  business_consequence?: string;
  source: AnalysisSource;
}

export interface ComplianceMetrics {
  overall_score: number;
  completeness_score: number;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  domains_analyzed: ComplianceDomain[];
  missing_critical_clauses: string[];
}

export interface ContractDocument {
  _id: string;
  file_name: string;
  file_id: string;
  category?: string;
  content?: string;
  status: ContractStatus;
  created_at: string;
  uploaded_at: string;
  version: number;
  last_updated: string;
  clauses?: Clause[];
  risks?: ComplianceFinding[];
  compliance_score?: number;
  findings?: ComplianceFinding[];
  metrics?: ComplianceMetrics;
  executive_summary?: string;
  recommendation?: string;
}

export interface ContractsListParams {
  status?: ContractStatus;
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface DashboardStats {
  totalContracts: number;
  pendingContracts: number;
  completedContracts: number;
  discardedContracts: number;
}

export const contractActions = {
  // Get list of contracts
  async listContracts(
    params?: ContractsListParams
  ): Promise<ContractDocument[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

    const queryString = queryParams.toString();
    return api.get<ContractDocument[]>(
      `/contract${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get a single contract by ID
  async getContract(id: string): Promise<ContractDocument> {
    return api.get<ContractDocument>(`/contract/${id}`);
  },

  // Upload a new contract
  async uploadContract(
    formData: FormData,
    name?: string,
    category?: string
  ): Promise<ContractDocument> {
    // Add name and category to form data if provided
    if (name) {
      formData.append("name", name);
    }
    if (category) {
      formData.append("category", category);
    }

    const response = await fetch(`${api.baseUrl}/contract/upload-contract`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: {
          message: "Unknown error occurred",
          code: response.status,
        },
      }));
      throw new Error(
        error.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  },

  // Upload contract content (text written by hand)
  async uploadContractContent(
    content: string,
    fileName: string,
    category?: string
  ): Promise<ContractDocument> {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("name", fileName);
    if (category) {
      formData.append("category", category);
    }

    const response = await fetch(`${api.baseUrl}/contract/upload-contract`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: {
          message: "Unknown error occurred",
          code: response.status,
        },
      }));
      throw new Error(
        error.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  },

  // Update contract status
  async updateContractStatus(
    id: string,
    status: ContractStatus
  ): Promise<ContractDocument> {
    return api.put<ContractDocument>(`/contract/${id}/status`, {
      new_status: status,
    });
  },

  // Update contract (content, name, and/or category)
  async updateContract(
    id: string,
    data: {
      content?: string;
      name?: string;
      category?: string;
    }
  ): Promise<ContractDocument> {
    await api.put<ContractDocument>(`/contract/${id}`, data);
    await this.extractClauses(id);
    await this.complianceCheck(id);
    return this.getContract(id);
  },

  // Delete a contract
  async deleteContract(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/contract/${id}`);
  },

  // Extract clauses from a contract
  async extractClauses(id: string): Promise<{
    status: string;
    clauses_count: number;
    statistics: Record<string, unknown>;
  }> {
    return api.post(`/contract/${id}/extract-clauses`);
  },

  // Run compliance check on a contract
  async complianceCheck(id: string): Promise<{
    status: string;
    compliance_score: number;
    findings: ComplianceFinding[];
    metrics: ComplianceMetrics;
    executive_summary: string;
    recommendation: string;
    required_actions: string[];
  }> {
    return api.post(`/contract/${id}/compliance-check`);
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const contracts = await this.listContracts({ limit: 1000 });

    const totalContracts = contracts.length;
    const pendingContracts = contracts.filter(
      (c) =>
        c.status === ContractStatus.UNDER_REVIEW ||
        c.status === ContractStatus.DRAFT
    ).length;
    const completedContracts = contracts.filter(
      (c) =>
        c.status === ContractStatus.APPROVED ||
        c.status === ContractStatus.SIGNED
    ).length;
    const discardedContracts = contracts.filter(
      (c) => c.status === ContractStatus.REJECTED
    ).length;

    return {
      totalContracts,
      pendingContracts,
      completedContracts,
      discardedContracts,
    };
  },
};
