import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pencil, Power } from "lucide-react";
import { format } from "date-fns";
import { PolicyStatus, type Policy } from "@/actions/policies";

interface PolicyItemProps {
  policy: Policy;
  onEdit: (policyId: string) => void;
  onChangeStatus: (policyId: string, currentStatus: PolicyStatus) => void;
}

export function PolicyItem({
  policy,
  onEdit,
  onChangeStatus,
}: PolicyItemProps) {
  return (
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
                Created: {format(new Date(policy.created_at), "MMM d, yyyy")}
              </span>
              <span>
                Updated: {format(new Date(policy.updated_at), "MMM d, yyyy")}
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
              onClick={() => onEdit(policy.id)}
            >
              <Pencil className="size-4" />
            </div>
            <div
              className="p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => onChangeStatus(policy.id, policy.status)}
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
                  <div className="text-muted-foreground">{clause.text}</div>
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
  );
}
