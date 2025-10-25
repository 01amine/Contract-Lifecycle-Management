import { useState, useEffect } from "react";
import { PolicyForm } from "./policy-form";

interface Clause {
  clause_id: string;
  title: string;
  text: string;
  mandatory: boolean;
}

interface EditPolicyFormProps {
  policyId: string;
  setActiveTab: (tabId: string) => void;
}

// Mock function to fetch policy data
function getPolicyData(id: string) {
  const mockPolicies = [
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
  return mockPolicies.find((p) => p.id === id);
}

export function EditPolicyForm({
  policyId,
  setActiveTab,
}: EditPolicyFormProps) {
  const [policyName, setPolicyName] = useState("");
  const [clauses, setClauses] = useState<Clause[]>([]);

  useEffect(() => {
    const policy = getPolicyData(policyId);
    if (policy) {
      setPolicyName(policy.name);
      setClauses(policy.clauses);
    }
  }, [policyId]);

  const handleCancel = () => {
    setActiveTab("policies");
  };

  return (
    <PolicyForm
      initialPolicyName={policyName}
      initialClauses={clauses}
      onCancel={handleCancel}
      saveButtonText="Save Changes"
    />
  );
}
