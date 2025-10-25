import { Accordion } from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { usePolicies, useUpdatePolicy } from "@/actions/hooks/use-policies";
import { PolicyStatus } from "@/actions/policies";
import { useState } from "react";
import { toast } from "sonner";
import { PolicyStatusDialog } from "./policy-status-dialog";
import { PolicyItem } from "./policy-item";

export function PoliciesList({
  setActiveTab,
}: {
  setActiveTab: (
    tabId: string,
    additionalSearch?: Record<string, string>
  ) => void;
}) {
  const { data: policies, isLoading, error } = usePolicies();
  const updatePolicy = useUpdatePolicy();
  const [selectedPolicy, setSelectedPolicy] = useState<{
    id: string;
    currentStatus: PolicyStatus;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusChange = async (newStatus: PolicyStatus) => {
    if (!selectedPolicy) return;

    try {
      await updatePolicy.mutateAsync({
        id: selectedPolicy.id,
        data: {
          status: newStatus,
        },
      });
      toast.success(`Policy status changed to ${newStatus}`);
      setIsDialogOpen(false);
      setSelectedPolicy(null);
    } catch (error) {
      toast.error("Failed to update policy status");
    }
  };

  const openStatusDialog = (policyId: string, currentStatus: PolicyStatus) => {
    setSelectedPolicy({ id: policyId, currentStatus });
    setIsDialogOpen(true);
  };

  const handleEdit = (policyId: string) => {
    setActiveTab("edit-policy", { policyId });
  };

  return (
    <>
      <PolicyStatusDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentStatus={selectedPolicy?.currentStatus}
        onStatusChange={handleStatusChange}
        isPending={updatePolicy.isPending}
      />

      <div className="p-6 border rounded-xl shadow-island bg-card min-h-[calc(90vh-5rem)] mb-2 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-title tracking-tight">
            Your Policies
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your contract templates and compliance policies
          </p>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="p-12 border border-dashed rounded-lg text-center">
              <p className="text-destructive">Failed to load policies</p>
            </div>
          )}

          {!isLoading && !error && policies && policies.length === 0 && (
            <div className="p-12 border border-dashed rounded-lg text-center">
              <p className="text-muted-foreground">
                No policies yet. Create your first policy to get started.
              </p>
            </div>
          )}

          {!isLoading && !error && policies && policies.length > 0 && (
            <Accordion type="single" collapsible>
              {policies.map((policy) => (
                <PolicyItem
                  key={policy.id}
                  policy={policy}
                  onEdit={handleEdit}
                  onChangeStatus={openStatusDialog}
                />
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </>
  );
}
