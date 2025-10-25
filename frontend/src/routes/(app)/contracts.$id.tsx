import { useHeader } from "@/stores/header";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  getContractById, 
  getAIAnalysis, 
  getBlockchainVerification, 
  getVersionHistory,
  getComplianceIssuesByContract
} from "@/lib/mock-data";
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  FileTextIcon,
  CopyIcon,
  ExternalLinkIcon,
  InfoIcon,
  TrendingUpIcon,
  GitCompareIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";

export const Route = createFileRoute("/(app)/contracts/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const contract = getContractById(id);
  const aiAnalysis = getAIAnalysis(id);
  const blockchainVerification = getBlockchainVerification(id);
  const versionHistory = getVersionHistory(id);
  const issues = getComplianceIssuesByContract(id);

  const [selectedClause, setSelectedClause] = useState(0);
  const [copiedHash, setCopiedHash] = useState(false);

  useHeader(contract?.title || "Contract Details");

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <XCircleIcon className="size-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">Contract Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The contract you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleRegisterBlockchain = () => {
    alert("Blockchain registration initiated! Transaction will be confirmed on Polygon network.");
  };

  const handleApprove = () => {
    alert("Contract approved! Status updated to 'Approved'");
  };

  const handleReject = () => {
    alert("Contract rejected. Please provide feedback to the submitter.");
  };

  return (
    <div className="space-y-4">
      {/* Contract Header Info */}
      <div className="p-5 border rounded-xl shadow-island bg-card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{contract.title}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{contract.client}</span>
              <span>•</span>
              <span>{format(new Date(contract.date), "MMMM d, yyyy")}</span>
              <span>•</span>
              <span className="font-medium capitalize">{contract.type.replace("-", " ")}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold mb-1">{contract.amount}</div>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap ${
              contract.status === "approved" || contract.status === "signed"
                ? "bg-green-500/10 text-green-600"
                : contract.status === "under_review"
                ? "bg-blue-500/10 text-blue-600"
                : contract.status === "draft"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-red-500/10 text-red-600"
            }`}>
              {contract.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Compliance</div>
            <div className="flex items-center justify-center gap-1">
              <ShieldCheckIcon className={`size-5 ${
                contract.complianceScore >= 90 ? "text-green-600" :
                contract.complianceScore >= 75 ? "text-amber-500" :
                "text-red-600"
              }`} />
              <span className={`text-xl font-bold ${
                contract.complianceScore >= 90 ? "text-green-600" :
                contract.complianceScore >= 75 ? "text-amber-500" :
                "text-red-600"
              }`}>
                {contract.complianceScore}%
              </span>
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
            <div className={`text-xl font-bold ${
              contract.riskScore >= 7 ? "text-red-600" :
              contract.riskScore >= 4 ? "text-amber-500" :
              "text-green-600"
            }`}>
              {contract.riskScore}/10
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Version</div>
            <div className="text-xl font-bold">{contract.version}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Issues</div>
            <div className="flex items-center justify-center gap-1">
              {contract.criticalIssues > 0 ? (
                <AlertTriangleIcon className="size-4 text-red-600" />
              ) : (
                <CheckCircle2Icon className="size-4 text-green-600" />
              )}
              <span className={`text-xl font-bold ${contract.criticalIssues > 0 ? "text-red-600" : "text-green-600"}`}>
                {contract.criticalIssues}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
        {/* Left Column - AI Analysis & Issues */}
        <div className="space-y-4">
          {/* AI Analysis */}
          {aiAnalysis && (
            <div className="p-5 border rounded-xl shadow-island bg-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                  <FileTextIcon className="size-4 text-white" />
                </div>
                <h3 className="font-semibold text-lg">AI Analysis</h3>
                <span className="ml-auto text-xs text-muted-foreground">
                  Confidence: {aiAnalysis.confidence}%
                </span>
              </div>

              {/* Shariah Compliance */}
              {contract.type === "islamic-finance" && (
                <div className={`p-4 rounded-lg mb-4 ${
                  aiAnalysis.shariahCompliance.compliant
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheckIcon className={`size-5 ${
                      aiAnalysis.shariahCompliance.compliant ? "text-green-600" : "text-red-600"
                    }`} />
                    <span className="font-semibold">
                      Shariah Compliance: {aiAnalysis.shariahCompliance.score}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {aiAnalysis.shariahCompliance.compliant
                      ? "Contract meets Shariah compliance requirements"
                      : "Contract requires Shariah compliance review"}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">AI Recommendations</h4>
                <ul className="space-y-2">
                  {aiAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <TrendingUpIcon className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clause Analysis */}
              <div>
                <h4 className="font-medium text-sm mb-2">Clause-by-Clause Analysis</h4>
                <div className="space-y-2">
                  {aiAnalysis.clauses.map((clause, index) => (
                    <div
                      key={clause.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedClause === index
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedClause(index)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{clause.type}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            clause.riskLevel === "critical" ? "bg-red-500/10 text-red-600" :
                            clause.riskLevel === "high" ? "bg-amber-500/10 text-amber-600" :
                            clause.riskLevel === "medium" ? "bg-blue-500/10 text-blue-600" :
                            "bg-green-500/10 text-green-600"
                          }`}>
                            {clause.riskLevel}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {clause.complianceScore}%
                          </span>
                        </div>
                      </div>
                      {selectedClause === index && (
                        <>
                          <p className="text-xs text-muted-foreground mb-2 italic">
                            "{clause.text}"
                          </p>
                          <p className="text-xs">{clause.analysis}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Compliance Issues */}
          {issues.length > 0 && (
            <div className="p-5 border rounded-xl shadow-island bg-card">
              <h3 className="font-semibold text-lg mb-4">Compliance Issues</h3>
              <div className="space-y-3">
                {issues.map((issue) => (
                  <div key={issue.id} className="p-3 rounded-lg border">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm">{issue.title}</h4>
                      <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                        issue.severity === "critical" ? "bg-red-500/10 text-red-600" :
                        issue.severity === "high" ? "bg-amber-500/10 text-amber-600" :
                        issue.severity === "medium" ? "bg-blue-500/10 text-blue-600" :
                        "bg-green-500/10 text-green-600"
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{issue.description}</p>
                    <div className="text-xs text-muted-foreground mb-2">
                      <span className="font-medium">Clause:</span> {issue.clause}
                    </div>
                    <div className="p-2 rounded bg-blue-500/10 text-xs">
                      <span className="font-medium">Recommendation:</span> {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Blockchain & Version History */}
        <div className="space-y-4">
          {/* Blockchain Verification */}
          <div className="p-5 border rounded-xl shadow-island bg-card">
            <h3 className="font-semibold text-base mb-4">Blockchain Verification</h3>
            {blockchainVerification ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2Icon className="size-5 text-green-600" />
                  <span className="font-medium text-green-600">Verified on Polygon</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Contract Hash</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                        {blockchainVerification.hash.substring(0, 20)}...
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyHash(blockchainVerification.hash)}
                      >
                        {copiedHash ? (
                          <CheckCircle2Icon className="size-3" />
                        ) : (
                          <CopyIcon className="size-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Block Number</div>
                    <div className="font-medium">{blockchainVerification.blockNumber.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Timestamp</div>
                    <div className="font-medium">
                      {format(new Date(blockchainVerification.timestamp), "MMM d, yyyy HH:mm:ss")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Registered By</div>
                    <div className="font-medium">{blockchainVerification.registeredBy}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLinkIcon className="size-3 mr-2" />
                    View on PolygonScan
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <InfoIcon className="size-5 text-amber-500" />
                  <span className="font-medium text-amber-600">Not Registered</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Register this contract on the Polygon blockchain for immutable verification.
                </p>
                <Button className="w-full" onClick={handleRegisterBlockchain}>
                  Register on Blockchain
                </Button>
              </>
            )}
          </div>

          {/* Version History */}
          {versionHistory && versionHistory.length > 0 && (
            <div className="p-5 border rounded-xl shadow-island bg-card">
              <h3 className="font-semibold text-base mb-4">Version History</h3>
              <div className="space-y-3">
                {versionHistory.map((version) => (
                  <div key={version.id} className="border-l-2 border-primary pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{version.version}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(version.timestamp), "MMM d, HH:mm")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{version.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{version.editor}</span>
                      <span className="text-green-600">+{version.changes.additions}</span>
                      <span className="text-red-600">-{version.changes.deletions}</span>
                      <span className="text-amber-600">~{version.changes.modifications}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-5 border rounded-xl shadow-island bg-card">
            <h3 className="font-semibold text-base mb-4">Actions</h3>
            <div className="space-y-2">
              <Link to="/compare/$id" params={{ id }}>
                <Button variant="outline" className="w-full">
                  <GitCompareIcon className="size-4 mr-2" />
                  Compare with Template
                </Button>
              </Link>
              <Button className="w-full" onClick={handleApprove}>
                <CheckCircle2Icon className="size-4 mr-2" />
                Approve Contract
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleReject}>
                <XCircleIcon className="size-4 mr-2" />
                Reject Contract
              </Button>
              <Button variant="outline" className="w-full">
                <ClockIcon className="size-4 mr-2" />
                Request Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
