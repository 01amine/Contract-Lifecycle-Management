import { PolicyForm } from "./policy-form";
import { usePolicy } from "@/actions/hooks/use-policies";
import { useHeader } from "@/stores/header";
import { Loader2 } from "lucide-react";

interface EditPolicyFormProps {
  policyId: string;
  setActiveTab: (tabId: string) => void;
}

export function EditPolicyForm({
  policyId,
  setActiveTab,
}: EditPolicyFormProps) {
  const { data: policy, isLoading, error } = usePolicy(policyId);
  useHeader(policy ? `Edit policy: ${policy.name}` : "Edit policy", 1);

  const handleCancel = () => {
    setActiveTab("policies");
  };

  const handleSuccess = () => {
    setActiveTab("policies");
  };

  const handleDelete = () => {
    setActiveTab("policies");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="p-6 border rounded-xl shadow-island bg-card">
        <p className="text-destructive">Failed to load policy</p>
      </div>
    );
  }

  return (
    <PolicyForm
      policyId={policyId}
      initialPolicyName={policy.name}
      initialCountry={policy.country}
      initialPolicyType={policy.policy_type}
      initialDescription={policy.description}
      initialClauses={policy.clauses}
      initialCreatedBy={policy.created_by}
      initialStatus={policy.status}
      onCancel={handleCancel}
      onSuccess={handleSuccess}
      onDelete={handleDelete}
      saveButtonText="Save Changes"
    />
  );
}
