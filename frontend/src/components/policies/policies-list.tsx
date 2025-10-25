import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pencil, Trash2 } from "lucide-react";
import { useConfirm } from "@/components/ui/confirm";
import { useState } from "react";

interface Clause {
  clause_id: string;
  title: string;
  text: string;
  mandatory: boolean;
}

interface Policy {
  id: string;
  name: string;
  clauses: Clause[];
}

const mockPolicies: Policy[] = [
  {
    id: "pol-privacy-001",
    name: "Data Privacy Policy",
    clauses: [
      {
        clause_id: "clause-1",
        title: "Data Encryption",
        text: "All personal data must be encrypted at rest and in transit",
        mandatory: true,
      },
      {
        clause_id: "clause-2",
        title: "Data Retention",
        text: "Data retention periods must not exceed 7 years",
        mandatory: true,
      },
      {
        clause_id: "clause-3",
        title: "Data Deletion Rights",
        text: "Users have the right to request data deletion",
        mandatory: false,
      },
    ],
  },
  {
    id: "pol-security-002",
    name: "Security Policy",
    clauses: [
      {
        clause_id: "clause-1",
        title: "Two-Factor Authentication",
        text: "Two-factor authentication is required for all accounts",
        mandatory: true,
      },
      {
        clause_id: "clause-2",
        title: "Password Requirements",
        text: "Passwords must be changed every 90 days",
        mandatory: true,
      },
      {
        clause_id: "clause-3",
        title: "Incident Reporting",
        text: "All security incidents must be reported within 24 hours",
        mandatory: true,
      },
    ],
  },
  {
    id: "pol-use-003",
    name: "Acceptable Use Policy",
    clauses: [
      {
        clause_id: "clause-1",
        title: "Credential Sharing",
        text: "Users must not share their credentials",
        mandatory: true,
      },
      {
        clause_id: "clause-2",
        title: "Illegal Activities",
        text: "Computing resources must not be used for illegal activities",
        mandatory: true,
      },
      {
        clause_id: "clause-3",
        title: "Network Monitoring",
        text: "All network traffic is monitored and logged",
        mandatory: false,
      },
    ],
  },
];

export function PoliciesList({
  setActiveTab,
}: {
  setActiveTab: (
    tabId: string,
    additionalSearch?: Record<string, string>
  ) => void;
}) {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);

  const { confirmDialog, confirm } = useConfirm({
    title: "Delete policy?",
    description:
      "Are you sure you want to delete this policy? This action cannot be undone.",
    destructive: true,
  });

  const handleDelete = async (id: string) => {
    const shouldDelete = await confirm();
    if (shouldDelete) {
      setPolicies(policies.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      {confirmDialog}
      <div className="p-6 border rounded-xl shadow-island bg-card h-[calc(90vh-5rem)] flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Policies</h2>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {policies.length === 0 ? (
            <div className="p-12 border border-dashed rounded-lg text-center">
              <p className="text-muted-foreground">No policies yet.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible>
              {policies.map((policy) => (
                <AccordionItem
                  key={policy.id}
                  value={policy.id}
                  className="border-b last:border-0"
                >
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-medium">{policy.name}</span>
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
                          onClick={() => handleDelete(policy.id)}
                        >
                          <Trash2 className="size-4" />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-3">
                      {policy.clauses.map((clause, index) => (
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
                      ))}
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
