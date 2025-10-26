import {
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  ClipboardList,
} from "lucide-react";
import { getContractVersion } from "@/lib/demo-versioning";

interface Contract {
  _id?: string;
  file_name?: string;
  category?: string;
  created_at?: string;
  last_updated?: string;
  status?: string;
  risk_level?: string;
  version?: number;
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
            <p className="text-sm font-medium mt-1">
              v{contract._id && contract.created_at 
                ? getContractVersion(contract._id, contract.created_at)
                : contract.version || 1}
            </p>
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
    </div>
  );
}
