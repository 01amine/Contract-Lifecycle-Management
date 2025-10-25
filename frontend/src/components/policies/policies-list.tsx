import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pencil,
  Power,
  Loader2,
  CheckCircle,
  Circle,
  Archive,
  Trash2,
} from "lucide-react";
import { usePolicies, useUpdatePolicy } from "@/actions/hooks/use-policies";
import { format } from "date-fns";
import { PolicyStatus } from "@/actions/policies";
import { useState } from "react";
import { toast } from "sonner";

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

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Policy Status</DialogTitle>
            <DialogDescription>
              Select the new status for this policy
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            <button
              type="button"
              onClick={() => handleStatusChange(PolicyStatus.DRAFT)}
              disabled={updatePolicy.isPending}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPolicy?.currentStatus === PolicyStatus.DRAFT
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Circle className="size-5 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange(PolicyStatus.ACTIVE)}
              disabled={updatePolicy.isPending}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPolicy?.currentStatus === PolicyStatus.ACTIVE
                  ? "border-green-500 bg-green-500/10"
                  : "border-border hover:border-green-500/50"
              }`}
            >
              <CheckCircle className="size-5 mx-auto mb-2 text-green-500" />
              <span className="text-sm font-medium">Active</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange(PolicyStatus.ARCHIVED)}
              disabled={updatePolicy.isPending}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPolicy?.currentStatus === PolicyStatus.ARCHIVED
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-border hover:border-amber-500/50"
              }`}
            >
              <Archive className="size-5 mx-auto mb-2 text-amber-500" />
              <span className="text-sm font-medium">Archived</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange(PolicyStatus.DELETED)}
              disabled={updatePolicy.isPending}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPolicy?.currentStatus === PolicyStatus.DELETED
                  ? "border-red-500 bg-red-500/10"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <Trash2 className="size-5 mx-auto mb-2 text-red-500" />
              <span className="text-sm font-medium">Deleted</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="p-6 border rounded-xl shadow-island bg-card min-h-[calc(90vh-5rem)] mb-2 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Policies</h2>
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
              <p className="text-muted-foreground">No policies yet.</p>
            </div>
          )}

          {!isLoading && !error && policies && policies.length > 0 && (
            <Accordion type="single" collapsible>
              {policies.map((policy) => (
                <AccordionItem
                  key={policy.id}
                  value={policy.id}
                  className="border-b last:border-0"
                >
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{policy.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {policy.policy_type}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                            Country: {policy.country}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded capitalize ${
                              policy.status === PolicyStatus.ACTIVE
                                ? "bg-green-500/10 text-green-600"
                                : policy.status === PolicyStatus.DRAFT
                                ? "bg-amber-500/10 text-amber-600"
                                : policy.status === PolicyStatus.ARCHIVED
                                ? "bg-gray-500/10 text-gray-600"
                                : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {policy.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>v{policy.version}</span>
                          <span>
                            Created:{" "}
                            {format(new Date(policy.created_at), "MMM d, yyyy")}
                          </span>
                          <span>
                            Updated:{" "}
                            {format(new Date(policy.updated_at), "MMM d, yyyy")}
                          </span>
                          <span>By: {policy.created_by}</span>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="p-2 hover:bg-accent rounded-md transition-colors"
                          onClick={() =>
                            setActiveTab("edit-policy", {
                              policyId: policy.id,
                            })
                          }
                        >
                          <Pencil className="size-4" />
                        </div>
                        <div
                          className="p-2 hover:bg-accent rounded-md transition-colors"
                          onClick={() =>
                            openStatusDialog(policy.id, policy.status)
                          }
                          title="Change policy status"
                        >
                          <Power className="size-4" />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {policy.description && (
                      <div className="mb-4 p-2 bg-muted/50 rounded-sm">
                        <p className="text-sm text-muted-foreground">
                          {policy.description}
                        </p>
                      </div>
                    )}
                    <div className="space-y-3">
                      {policy.clauses.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No clauses defined yet.
                        </p>
                      ) : (
                        policy.clauses.map((clause, index) => (
                          <div
                            key={clause.clause_id}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="font-bold font-title text-muted-foreground shrink-0">
                              {index + 1}.
                            </span>
                            <div className="flex-1">
                              <div className="font-medium">{clause.title}</div>
                              <div className="text-muted-foreground">
                                {clause.text}
                              </div>
                              {clause.mandatory && (
                                <span className="text-xs text-primary mt-1 inline-block">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </>
  );
}
