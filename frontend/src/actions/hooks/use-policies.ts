import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "../api";
import {
  policyActions,
  type PolicyCreate,
  type PolicyUpdate,
  type PoliciesListParams,
} from "../policies";

// Query keys
export const policyKeys = {
  all: ["policies"] as const,
  lists: () => [...policyKeys.all, "list"] as const,
  list: (params?: PoliciesListParams) =>
    [...policyKeys.lists(), params] as const,
  details: () => [...policyKeys.all, "detail"] as const,
  detail: (id: string) => [...policyKeys.details(), id] as const,
};

// Hook to get list of policies
export function usePolicies(params?: PoliciesListParams) {
  return useQuery({
    queryKey: policyKeys.list(params),
    queryFn: () => policyActions.listPolicies(params),
  });
}

// Hook to get a single policy
export function usePolicy(id: string) {
  return useQuery({
    queryKey: policyKeys.detail(id),
    queryFn: () => policyActions.getPolicy(id),
    enabled: !!id,
  });
}

// Hook to create a policy
export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PolicyCreate) => policyActions.createPolicy(data),
    onSuccess: () => {
      // Invalidate and refetch policies list
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error) || "Failed to create policy");
    },
  });
}

// Hook to update a policy
export function useUpdatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PolicyUpdate }) =>
      policyActions.updatePolicy(id, data),
    onSuccess: (data) => {
      // Invalidate the specific policy and list
      queryClient.invalidateQueries({ queryKey: policyKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error) || "Failed to update policy");
    },
  });
}

// Hook to delete a policy
export function useDeletePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => policyActions.deletePolicy(id),
    onSuccess: () => {
      // Invalidate all policy queries
      queryClient.invalidateQueries({ queryKey: policyKeys.all });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error) || "Failed to delete policy");
    },
  });
}
