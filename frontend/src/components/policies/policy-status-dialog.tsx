import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Circle, Archive, Trash2 } from "lucide-react";
import { PolicyStatus } from "@/actions/policies";

interface PolicyStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus?: PolicyStatus;
  onStatusChange: (status: PolicyStatus) => void;
  isPending: boolean;
}

export function PolicyStatusDialog({
  isOpen,
  onOpenChange,
  currentStatus,
  onStatusChange,
  isPending,
}: PolicyStatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={() => onStatusChange(PolicyStatus.DRAFT)}
            disabled={isPending}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentStatus === PolicyStatus.DRAFT
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Circle className="size-5 mx-auto mb-2 text-primary" />
            <span className="text-sm font-medium">Draft</span>
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(PolicyStatus.ACTIVE)}
            disabled={isPending}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentStatus === PolicyStatus.ACTIVE
                ? "border-green-500 bg-green-500/10"
                : "border-border hover:border-green-500/50"
            }`}
          >
            <CheckCircle className="size-5 mx-auto mb-2 text-green-500" />
            <span className="text-sm font-medium">Active</span>
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(PolicyStatus.ARCHIVED)}
            disabled={isPending}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentStatus === PolicyStatus.ARCHIVED
                ? "border-amber-500 bg-amber-500/10"
                : "border-border hover:border-amber-500/50"
            }`}
          >
            <Archive className="size-5 mx-auto mb-2 text-amber-500" />
            <span className="text-sm font-medium">Archived</span>
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(PolicyStatus.DELETED)}
            disabled={isPending}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentStatus === PolicyStatus.DELETED
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
  );
}
