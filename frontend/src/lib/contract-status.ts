import { ContractStatus } from "@/actions/contracts";

export const getStatusColor = (status: ContractStatus): string => {
  switch (status) {
    case ContractStatus.DRAFT:
    case ContractStatus.UNDER_REVIEW:
      return "bg-amber-500/10 text-amber-600";
    case ContractStatus.APPROVED:
    case ContractStatus.SIGNED:
      return "bg-green-500/10 text-green-600";
    case ContractStatus.REJECTED:
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-gray-500/10 text-gray-600";
  }
};

export const getStatusLabel = (status: ContractStatus): string => {
  switch (status) {
    case ContractStatus.DRAFT:
      return "Draft";
    case ContractStatus.UNDER_REVIEW:
      return "Under Review";
    case ContractStatus.APPROVED:
      return "Approved";
    case ContractStatus.REJECTED:
      return "Rejected";
    case ContractStatus.SIGNED:
      return "Signed";
    default:
      return status;
  }
};

export const isPendingStatus = (status: ContractStatus): boolean => {
  return (
    status === ContractStatus.DRAFT || status === ContractStatus.UNDER_REVIEW
  );
};

export const isCompletedStatus = (status: ContractStatus): boolean => {
  return status === ContractStatus.APPROVED || status === ContractStatus.SIGNED;
};

export const isDiscardedStatus = (status: ContractStatus): boolean => {
  return status === ContractStatus.REJECTED;
};
