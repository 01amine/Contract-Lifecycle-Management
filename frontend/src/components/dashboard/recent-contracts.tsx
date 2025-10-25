import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRecentContracts } from "@/actions/hooks/use-contracts";
import { getStatusColor, getStatusLabel } from "@/lib/contract-status";

export function RecentContracts() {
  const { data: contracts, isLoading, error } = useRecentContracts(5);

  return (
    <div className="p-6 border rounded-xl shadow-island bg-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold font-title">Recent Contracts</h2>
        <Link
          to="/contracts"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-sm text-destructive">
            Failed to load contracts
          </div>
        )}

        {!isLoading && !error && contracts && contracts.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No contracts yet
          </div>
        )}

        {!isLoading &&
          !error &&
          contracts &&
          contracts.length > 0 &&
          contracts.map((contract) => (
            <Link
              key={contract.id}
              to="/contracts/$id"
              params={{ id: contract.id }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
            >
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <ClipboardList className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">
                  {contract.file_name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(contract.created_at), "MMM d, yyyy")}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(contract.created_at), "MMM d")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                      contract.status
                    )}`}
                  >
                    {getStatusLabel(contract.status)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
