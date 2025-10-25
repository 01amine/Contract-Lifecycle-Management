import { useHeader } from "@/stores/header";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { mockContracts } from "@/lib/mock-data";
import { 
  FileTextIcon, 
  ClockIcon, 
  AlertTriangleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  TrendingUpIcon
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(app)/review")({
  component: RouteComponent,
});

function RouteComponent() {
  useHeader("Contract Review Queue");
  
  // Filter contracts that need review
  const reviewQueue = mockContracts.filter(
    (c) => c.status === "draft" || c.status === "under_review"
  );

  const [sortBy, setSortBy] = useState<"date" | "risk" | "compliance">("risk");

  const sortedQueue = [...reviewQueue].sort((a, b) => {
    if (sortBy === "risk") return b.riskScore - a.riskScore;
    if (sortBy === "compliance") return a.complianceScore - b.complianceScore;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-xl shadow-island bg-card">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="size-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Draft</span>
          </div>
          <div className="text-2xl font-bold">
            {reviewQueue.filter(c => c.status === "draft").length}
          </div>
        </div>
        <div className="p-4 border rounded-xl shadow-island bg-card">
          <div className="flex items-center gap-2 mb-2">
            <FileTextIcon className="size-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">In Review</span>
          </div>
          <div className="text-2xl font-bold">
            {reviewQueue.filter(c => c.status === "under_review").length}
          </div>
        </div>
        <div className="p-4 border rounded-xl shadow-island bg-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangleIcon className="size-4 text-red-500" />
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
          <div className="text-2xl font-bold">
            {reviewQueue.filter(c => c.criticalIssues > 0).length}
          </div>
        </div>
        <div className="p-4 border rounded-xl shadow-island bg-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="size-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Approved Today</span>
          </div>
          <div className="text-2xl font-bold">3</div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Button
          variant={sortBy === "risk" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("risk")}
        >
          Risk Level
        </Button>
        <Button
          variant={sortBy === "compliance" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("compliance")}
        >
          Compliance
        </Button>
        <Button
          variant={sortBy === "date" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("date")}
        >
          Date
        </Button>
      </div>

      {/* Review Queue */}
      <div className="space-y-3">
        {sortedQueue.map((contract) => (
          <Link key={contract.id} to="/contracts/$id" params={{ id: contract.id }}>
            <div className="p-4 border rounded-xl shadow-island bg-card hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{contract.title}</h3>
                    {contract.blockchainVerified && (
                      <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded">
                        ⛓️ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {contract.client} • {format(new Date(contract.date), "MMM d, yyyy")}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-xs text-muted-foreground capitalize">
                      {contract.type.replace("-", " ")}
                    </span>
                    <span className="text-xs font-medium">{contract.amount}</span>
                    <span className="text-xs text-muted-foreground">
                      Uploaded by {contract.uploadedBy}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6">
                  {/* Risk Score */}
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Risk</div>
                    <div className={`text-2xl font-bold ${
                      contract.riskScore >= 7 ? "text-red-600" :
                      contract.riskScore >= 4 ? "text-amber-500" :
                      "text-green-600"
                    }`}>
                      {contract.riskScore}
                    </div>
                    <div className="text-xs text-muted-foreground">/10</div>
                  </div>

                  {/* Compliance Score */}
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Compliance</div>
                    <div className="flex items-center gap-1">
                      <ShieldCheckIcon className={`size-5 ${
                        contract.complianceScore >= 90 ? "text-green-600" :
                        contract.complianceScore >= 75 ? "text-amber-500" :
                        "text-red-600"
                      }`} />
                      <span className={`text-2xl font-bold ${
                        contract.complianceScore >= 90 ? "text-green-600" :
                        contract.complianceScore >= 75 ? "text-amber-500" :
                        "text-red-600"
                      }`}>
                        {contract.complianceScore}
                      </span>
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </div>

                  {/* Critical Issues */}
                  {contract.criticalIssues > 0 && (
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Critical</div>
                      <div className="flex items-center gap-1">
                        <AlertTriangleIcon className="size-5 text-red-600" />
                        <span className="text-2xl font-bold text-red-600">
                          {contract.criticalIssues}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap ${
                      contract.status === "under_review"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {contract.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Arrow */}
                  <TrendingUpIcon className="size-5 text-primary" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sortedQueue.length === 0 && (
        <div className="text-center py-12 border rounded-xl bg-card">
          <CheckCircleIcon className="size-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">All caught up!</h3>
          <p className="text-sm text-muted-foreground">
            No contracts pending review at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
