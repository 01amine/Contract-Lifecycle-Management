import { api } from "./api";

export enum ContractStatus {
  DRAFT = "draft",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  SIGNED = "signed",
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
  clauses?: any[];
  risks?: any[];
  compliance_score?: number;
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
    statistics: any;
  }> {
    return api.post(`/contract/${id}/extract-clauses`);
  },

  // Run compliance check on a contract
  async complianceCheck(id: string): Promise<{
    status: string;
    compliance_score: number;
    issues: any[];
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
