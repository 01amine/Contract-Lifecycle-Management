import { api } from "./api";

export enum PolicyStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
  DELETED = "deleted",
}

export interface Clause {
  clause_id: string;
  title: string;
  text: string;
  numeric_limits?: Record<string, number>;
  mandatory: boolean;
}

export interface Policy {
  id: string;
  name: string;
  country: string;
  policy_type: string;
  description?: string;
  version: number;
  clauses: Clause[];
  created_by: string;
  created_at: string;
  updated_at: string;
  status: PolicyStatus;
}

export interface PolicyCreate {
  name: string;
  country: string;
  policy_type: string;
  description?: string;
  clauses?: Clause[];
  created_by: string;
  status?: PolicyStatus;
}

export interface PolicyUpdate {
  name?: string;
  description?: string;
  clauses?: Clause[];
  status?: PolicyStatus;
}

export interface PoliciesListParams {
  country?: string;
  policy_type?: string;
}

export const policyActions = {
  // Get list of policies (templates)
  async listPolicies(params?: PoliciesListParams): Promise<Policy[]> {
    const queryParams = new URLSearchParams();
    if (params?.country) queryParams.append("country", params.country);
    if (params?.policy_type)
      queryParams.append("policy_type", params.policy_type);

    const queryString = queryParams.toString();
    return api.get<Policy[]>(
      `/templates${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get a single policy by ID
  async getPolicy(id: string): Promise<Policy> {
    return api.get<Policy>(`/templates/${id}`);
  },

  // Create a new policy
  async createPolicy(data: PolicyCreate): Promise<Policy> {
    return api.post<Policy>("/templates", data);
  },

  // Update a policy
  async updatePolicy(id: string, data: PolicyUpdate): Promise<Policy> {
    return api.request<Policy>(`/templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Delete a policy
  async deletePolicy(id: string): Promise<{ detail: string }> {
    return api.delete<{ detail: string }>(`/templates/${id}`);
  },
};
