import {
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  ClipboardList,
  Shield,
} from "lucide-react";
import type { Risk } from "@/actions/contracts";

interface Contract {
  file_name?: string;
  category?: string;
  created_at?: string;
  last_updated?: string;
  status?: string;
  risk_level?: string;
  version?: number;
  compliance_score?: number;
  risks?: Risk[];
}

interface OverviewContentProps {
  contract: Contract;
}

export function OverviewContent({ contract }: OverviewContentProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRiskColor = (risk?: string) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="p-6 border rounded-xl shadow-island bg-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ClipboardList className="size-5 text-primary" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              File Name
            </label>
            <p className="text-sm font-medium mt-1">
              {contract.file_name || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag className="size-4" />
              Category
            </label>
            <p className="text-sm font-medium mt-1">
              {contract.category || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="size-4" />
              Created At
            </label>
            <p className="text-sm font-medium mt-1">
              {formatDate(contract.created_at)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="size-4" />
              Last Updated
            </label>
            <p className="text-sm font-medium mt-1">
              {formatDate(contract.last_updated)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              Version
            </label>
            <p className="text-sm font-medium mt-1">v{contract.version || 1}</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      {contract.risk_level && (
        <div className="p-6 border rounded-xl shadow-island bg-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="size-5 text-primary" />
            Risk Assessment
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-semibold ${getRiskColor(
                contract.risk_level
              )}`}
            >
              {contract.risk_level.toUpperCase()}
            </span>
            <span className="text-sm text-muted-foreground">Risk Level</span>
          </div>
        </div>
      )}

      {/* Status */}
      {contract.status && (
        <div className="p-6 border rounded-xl shadow-island bg-card">
          <h3 className="text-lg font-semibold mb-4">Status</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {contract.status}
          </span>
        </div>
      )}

      {/* Compliance Score */}
      {contract.compliance_score !== undefined && (
        <div className="p-6 border rounded-xl shadow-island bg-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            Compliance Score
          </h3>
          <div className="flex items-center gap-4">
            <div
              className={`text-4xl font-bold ${
                contract.compliance_score >= 0.9
                  ? "text-green-600"
                  : contract.compliance_score >= 0.7
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {(contract.compliance_score * 100).toFixed(0)}%
            </div>
            <div className="flex-1">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    contract.compliance_score >= 0.9
                      ? "bg-green-600"
                      : contract.compliance_score >= 0.7
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                  style={{ width: `${contract.compliance_score * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {contract.compliance_score >= 0.9
                  ? "Excellent compliance"
                  : contract.compliance_score >= 0.7
                  ? "Good compliance with minor issues"
                  : "Needs attention"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risks List */}
      {contract.risks && contract.risks.length > 0 && (
        <div className="p-6 border rounded-xl shadow-island bg-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="size-5 text-primary" />
            Identified Risks ({contract.risks.length})
          </h3>
          <div className="space-y-3">
            {contract.risks.map((risk, index) => (
              <div
                key={index}
                className="p-4 bg-muted/50 rounded-lg border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium">{risk.clause}</span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      risk.risk === "Critical"
                        ? "bg-red-500/10 text-red-600"
                        : risk.risk === "High"
                        ? "bg-orange-500/10 text-orange-600"
                        : risk.risk === "Medium"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-green-500/10 text-green-600"
                    }`}
                  >
                    {risk.risk}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{risk.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
