import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  contractActions,
  type ContractStatus,
  type ContractsListParams,
} from "../contracts";

// Query keys
export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (params?: ContractsListParams) =>
    [...contractKeys.lists(), params] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
  stats: () => [...contractKeys.all, "stats"] as const,
};

// Hook to get list of contracts
export function useContracts(params?: ContractsListParams) {
  return useQuery({
    queryKey: contractKeys.list(params),
    queryFn: () => contractActions.listContracts(params),
  });
}

// Hook to get a single contract
export function useContract(id: string) {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: () => contractActions.getContract(id),
    enabled: !!id,
  });
}

// Hook to get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: contractKeys.stats(),
    queryFn: () => contractActions.getDashboardStats(),
  });
}

// Hook to get recent contracts
export function useRecentContracts(limit: number = 5) {
  return useQuery({
    queryKey: [...contractKeys.lists(), "recent", limit],
    queryFn: () => contractActions.listContracts({ limit }),
  });
}

// Hook to upload a contract
export function useUploadContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      contractActions.uploadContract(formData),
    onSuccess: () => {
      // Invalidate and refetch contracts list and stats
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractKeys.stats() });
    },
  });
}

// Hook to update contract status
export function useUpdateContractStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContractStatus }) =>
      contractActions.updateContractStatus(id, status),
    onSuccess: (data) => {
      // Invalidate the specific contract and related queries
      queryClient.invalidateQueries({
        queryKey: contractKeys.detail(data._id),
      });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractKeys.stats() });
    },
  });
}

// Hook to delete a contract
export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractActions.deleteContract(id),
    onSuccess: () => {
      // Invalidate all contract queries
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
}

// Hook to extract clauses
export function useExtractClauses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractActions.extractClauses(id),
    onSuccess: (_, id) => {
      // Invalidate the specific contract to refetch with clauses
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(id) });
    },
  });
}

// Hook to run compliance check
export function useComplianceCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractActions.complianceCheck(id),
    onSuccess: (_, id) => {
      // Invalidate the specific contract to refetch with compliance data
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(id) });
    },
  });
}
