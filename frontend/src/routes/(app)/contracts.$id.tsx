import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { contractActions } from "@/actions/contracts";
import { FileText, AlertCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/(app)/contracts/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const {
    data: contract,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contract", id],
    queryFn: () => contractActions.getContract(id),
  });

  useHeader(contract?.file_name || "Contract Details");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="size-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Contract</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FileText className="size-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Contract not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Header */}
      <div className="p-6 border rounded-xl shadow-island bg-card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold font-title mb-1">
              {contract.file_name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Status:{" "}
              <span
                className={`font-medium ${
                  contract.status === "approved"
                    ? "text-green-600"
                    : contract.status === "under_review"
                    ? "text-yellow-600"
                    : contract.status === "rejected"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {contract.status.replace("_", " ").toUpperCase()}
              </span>
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>ID: {contract._id}</div>
            <div>Version: {contract.version}</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {contract.compliance_score !== undefined && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">
                Compliance Score
              </div>
              <div
                className={`text-xl font-bold ${
                  contract.compliance_score >= 0.9
                    ? "text-green-600"
                    : contract.compliance_score >= 0.7
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {(contract.compliance_score * 100).toFixed(1)}%
              </div>
            </div>
          )}
          {contract.clauses && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">
                Total Clauses
              </div>
              <div className="text-xl font-bold">{contract.clauses.length}</div>
            </div>
          )}
          {contract.risks && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">
                Risk Items
              </div>
              <div className="text-xl font-bold">{contract.risks.length}</div>
            </div>
          )}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">
              Last Updated
            </div>
            <div className="text-sm font-medium">
              {new Date(contract.last_updated).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Full Contract Data (JSON) */}
      <div className="p-6 border rounded-xl shadow-island bg-card">
        <h3 className="text-lg font-semibold mb-4">Complete Contract Data</h3>
        <div className="bg-muted/50 rounded-lg p-4 overflow-auto max-h-[600px]">
          <pre className="text-xs font-mono">
            {JSON.stringify(contract, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
