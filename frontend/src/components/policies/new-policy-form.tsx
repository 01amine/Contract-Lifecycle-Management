import { useHeader } from "@/stores/header";
import { PolicyForm } from "./policy-form";

interface NewPolicyFormProps {
  setActiveTab: (tabId: string) => void;
}

export function NewPolicyForm({ setActiveTab }: NewPolicyFormProps) {
  useHeader("Create a new policy", 1);

  const handleSuccess = () => {
    setActiveTab("policies");
  };

  const handleCancel = () => {
    setActiveTab("policies");
  };

  return (
    <PolicyForm
      isNew={true}
      saveButtonText="Create Policy"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
