import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getContractById,
  getClauseComparisons,
  mockTemplates,
} from "@/lib/mock-data";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  CopyIcon,
} from "lucide-react";

export const Route = createFileRoute("/(app)/compare/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const contract = getContractById(id);
  const comparisons = getClauseComparisons(id);
  
  const [selectedTemplate, setSelectedTemplate] = useState("T3");
  const [selectedClause, setSelectedClause] = useState(0);
  const [showDiff, setShowDiff] = useState(true);
  const [copiedSuggestion, setCopiedSuggestion] = useState(false);

  useHeader(`Compare: ${contract?.title || "Contract"}`);

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <XCircleIcon className="size-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">Contract Not Found</h2>
        </div>
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <AlertTriangleIcon className="size-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">No Comparison Data</h2>
          <p className="text-sm text-muted-foreground">
            Comparison data is not available for this contract yet. Please run AI analysis first.
          </p>
        </div>
      </div>
    );
  }

  const currentComparison = comparisons[selectedClause];

  const handleCopySuggestion = () => {
    navigator.clipboard.writeText(currentComparison.suggestedRewrite);
    setCopiedSuggestion(true);
    setTimeout(() => setCopiedSuggestion(false), 2000);
  };

  const handleAcceptSuggestion = () => {
    alert("Suggestion accepted! The clause will be updated in the contract.");
  };

  const handleRejectSuggestion = () => {
    alert("Suggestion rejected. The original clause will be kept.");
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {mockTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDiff(!showDiff)}
          >
            {showDiff ? "Hide" : "Show"} Differences
          </Button>
        </div>

        {/* Clause Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedClause(Math.max(0, selectedClause - 1))}
            disabled={selectedClause === 0}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Clause {selectedClause + 1} of {comparisons.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedClause(Math.min(comparisons.length - 1, selectedClause + 1))}
            disabled={selectedClause === comparisons.length - 1}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Main Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
        {/* Split View */}
        <div className="space-y-4">
          {/* Clause Type Header */}
          <div className="p-3 border rounded-xl shadow-island bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">
                  Clause {currentComparison.clauseNumber}: {currentComparison.originalClause.type}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Comparing with standard template clause
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                    currentComparison.complianceImpact === "critical"
                      ? "bg-red-500/10 text-red-600"
                      : currentComparison.complianceImpact === "high"
                      ? "bg-amber-500/10 text-amber-600"
                      : currentComparison.complianceImpact === "medium"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-green-500/10 text-green-600"
                  }`}
                >
                  {currentComparison.complianceImpact} impact
                </span>
              </div>
            </div>
          </div>

          {/* Split Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Clause */}
            <div className="p-4 border rounded-xl shadow-island bg-card">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">Original Clause</h4>
                <span className="text-xs bg-red-500/10 text-red-600 px-2 py-1 rounded">
                  Current
                </span>
              </div>
              <div className={`text-sm leading-relaxed p-3 rounded-lg ${
                showDiff ? "bg-red-500/5 border border-red-500/20" : "bg-muted/30"
              }`}>
                {currentComparison.originalClause.text}
              </div>
            </div>

            {/* Standard Clause */}
            <div className="p-4 border rounded-xl shadow-island bg-card">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">Standard Template</h4>
                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                  Recommended
                </span>
              </div>
              <div className={`text-sm leading-relaxed p-3 rounded-lg ${
                showDiff ? "bg-green-500/5 border border-green-500/20" : "bg-muted/30"
              }`}>
                {currentComparison.standardClause.text}
              </div>
            </div>
          </div>

          {/* Deviations */}
          {currentComparison.deviations.length > 0 && (
            <div className="p-4 border rounded-xl shadow-island bg-card">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <AlertTriangleIcon className="size-4 text-amber-500" />
                Detected Deviations
              </h4>
              <ul className="space-y-2">
                {currentComparison.deviations.map((deviation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 shrink-0">•</span>
                    <span className="text-muted-foreground">{deviation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Suggested Rewrite */}
          <div className="p-4 border-2 border-primary/20 rounded-xl shadow-island bg-card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                AI Suggested Rewrite
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Confidence: {currentComparison.confidence}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySuggestion}
                >
                  {copiedSuggestion ? (
                    <CheckCircle2Icon className="size-3" />
                  ) : (
                    <CopyIcon className="size-3" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-sm leading-relaxed p-3 rounded-lg bg-primary/5 border border-primary/20 mb-3">
              {currentComparison.suggestedRewrite}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAcceptSuggestion} className="flex-1">
                <CheckCircle2Icon className="size-4 mr-2" />
                Accept Suggestion
              </Button>
              <Button onClick={handleRejectSuggestion} variant="outline" className="flex-1">
                <XCircleIcon className="size-4 mr-2" />
                Keep Original
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Risk Analysis */}
        <div className="space-y-4">
          {/* Risk Score */}
          <div className="p-4 border rounded-xl shadow-island bg-card">
            <h4 className="font-semibold text-sm mb-3">Risk Assessment</h4>
            <div className="text-center mb-3">
              <div
                className={`text-4xl font-bold mb-1 ${
                  currentComparison.riskScore >= 7
                    ? "text-red-600"
                    : currentComparison.riskScore >= 4
                    ? "text-amber-500"
                    : "text-green-600"
                }`}
              >
                {currentComparison.riskScore}
              </div>
              <div className="text-xs text-muted-foreground">Risk Score (1-10)</div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  currentComparison.riskScore >= 7
                    ? "bg-red-600"
                    : currentComparison.riskScore >= 4
                    ? "bg-amber-500"
                    : "bg-green-600"
                }`}
                style={{ width: `${(currentComparison.riskScore / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {currentComparison.riskScore >= 7
                ? "High risk - Immediate attention required"
                : currentComparison.riskScore >= 4
                ? "Medium risk - Review recommended"
                : "Low risk - Acceptable deviation"}
            </p>
          </div>

          {/* Compliance Impact */}
          <div className="p-4 border rounded-xl shadow-island bg-card">
            <h4 className="font-semibold text-sm mb-3">Compliance Impact</h4>
            <div className="space-y-3">
              <div
                className={`p-3 rounded-lg text-center ${
                  currentComparison.complianceImpact === "critical"
                    ? "bg-red-500/10 border border-red-500/20"
                    : currentComparison.complianceImpact === "high"
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : currentComparison.complianceImpact === "medium"
                    ? "bg-blue-500/10 border border-blue-500/20"
                    : "bg-green-500/10 border border-green-500/20"
                }`}
              >
                <div className="text-lg font-bold capitalize mb-1">
                  {currentComparison.complianceImpact}
                </div>
                <div className="text-xs text-muted-foreground">Impact Level</div>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentComparison.complianceImpact === "critical"
                  ? "This deviation creates critical compliance issues that must be fixed before approval."
                  : currentComparison.complianceImpact === "high"
                  ? "Significant deviation from standard that should be addressed for compliance."
                  : currentComparison.complianceImpact === "medium"
                  ? "Moderate deviation. Consider aligning with standard template."
                  : "Minor deviation with minimal compliance impact."}
              </p>
            </div>
          </div>

          {/* All Clauses List */}
          <div className="p-4 border rounded-xl shadow-island bg-card">
            <h4 className="font-semibold text-sm mb-3">All Clauses</h4>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {comparisons.map((comp, index) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedClause(index)}
                  className={`w-full text-left p-2 rounded-lg border transition-all text-sm ${
                    selectedClause === index
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Clause {comp.clauseNumber}</span>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        comp.riskScore >= 7
                          ? "bg-red-500/10 text-red-600"
                          : comp.riskScore >= 4
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {comp.riskScore}/10
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {comp.originalClause.type}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 border rounded-xl shadow-island bg-card">
            <h4 className="font-semibold text-sm mb-3">Overall Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Clauses</span>
                <span className="font-medium">{comparisons.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">High Risk</span>
                <span className="font-medium text-red-600">
                  {comparisons.filter((c) => c.riskScore >= 7).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Medium Risk</span>
                <span className="font-medium text-amber-500">
                  {comparisons.filter((c) => c.riskScore >= 4 && c.riskScore < 7).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Low Risk</span>
                <span className="font-medium text-green-600">
                  {comparisons.filter((c) => c.riskScore < 4).length}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg Confidence</span>
                  <span className="font-medium">
                    {Math.round(
                      comparisons.reduce((sum, c) => sum + c.confidence, 0) / comparisons.length
                    )}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
