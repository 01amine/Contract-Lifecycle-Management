import {
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  ClipboardList,
  Shield,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  ListIcon,
  Circle,
} from "lucide-react";
import { formatDate } from "date-fns";
import { useState } from "react";

interface Clause {
  clause_id: string;
  text: string;
  content?: string;
  heading?: string;
  level?: number;
  type?: string;
  confidence?: number;
}

interface Risk {
  finding_id: string;
  finding_type: string;
  domain: string;
  severity: string;
  impact: string;
  confidence_score: number;
  title: string;
  description: string;
  affected_clauses: Array<{
    clause_id: string;
    heading?: string;
    excerpt?: string;
  }>;
  policy_violations?: Array<{
    policy_name: string;
    requirement: string;
    section?: string;
  }>;
  remediation_actions: Array<{
    action_type: string;
    description: string;
    priority: number;
  }>;
  business_consequence?: string;
  source: string;
}

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
  clauses?: Clause[];
}

interface OverviewContentProps {
  contract: Contract;
  setActiveTab?: (tabId: string) => void;
}

export function OverviewContent({
  contract,
  setActiveTab,
}: OverviewContentProps) {
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set());
  const [showAllRisks, setShowAllRisks] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return <AlertCircle className="size-4" />;
      case "high":
        return <AlertTriangle className="size-4" />;
      case "medium":
        return <AlertCircle className="size-4" />;
      case "low":
        return <Circle className="size-4" />;
      default:
        return <Info className="size-4" />;
    }
  };

  const toggleRisk = (findingId: string) => {
    const newExpanded = new Set(expandedRisks);
    if (newExpanded.has(findingId)) {
      newExpanded.delete(findingId);
    } else {
      newExpanded.add(findingId);
    }
    setExpandedRisks(newExpanded);
  };

  // Group risks by severity
  const groupedRisks = contract.risks?.reduce((acc, risk) => {
    const severity = risk.severity.toLowerCase();
    if (!acc[severity]) {
      acc[severity] = [];
    }
    acc[severity].push(risk);
    return acc;
  }, {} as Record<string, Risk[]>);

  // Calculate risk stats
  const riskStats = {
    critical: groupedRisks?.critical?.length || 0,
    high: groupedRisks?.high?.length || 0,
    medium: groupedRisks?.medium?.length || 0,
    low: groupedRisks?.low?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Compliance Score Card */}
        {contract.compliance_score !== undefined && (
          <div className="relative p-6 border rounded-xl shadow-island bg-card">
            <div className="flex items-center justify-between mb-3">
              <Shield className="size-8 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Compliance
              </span>
            </div>
            <div className="text-5xl font-title mb-2 text-primary">
              {(contract.compliance_score * 100).toFixed(0)}%
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="h-2 rounded-full transition-all bg-primary"
                style={{ width: `${contract.compliance_score * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {contract.compliance_score >= 0.9
                ? "Excellent"
                : contract.compliance_score >= 0.7
                ? "Good"
                : "Needs attention"}
            </p>
          </div>
        )}

        {/* Status Card */}
        {contract.status && (
          <div className="relative p-6 border rounded-xl shadow-island bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="size-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </span>
            </div>
            <div className="text-2xl font-title mb-2 capitalize text-primary">
              {contract.status.replace(/_/g, " ")}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-3" />
              <span>Version {contract.version || 1}</span>
            </div>
          </div>
        )}

        {/* Risk Summary Card */}
        {contract.risks && contract.risks.length > 0 && (
          <div className="relative p-6 border rounded-xl shadow-island bg-card">
            <div className="flex items-center justify-between mb-3">
              <ShieldAlert className="size-8 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Risk Level
              </span>
            </div>
            <div className="text-2xl font-title mb-2 text-primary">
              {contract.risks.length} Findings
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {riskStats.critical > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  {riskStats.critical} Critical
                </span>
              )}
              {riskStats.high > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  {riskStats.high} High
                </span>
              )}
            </div>
          </div>
        )}

        {/* Clauses Summary Card */}
        {contract.clauses && contract.clauses.length > 0 && (
          <div className="relative p-6 border rounded-xl shadow-island bg-card">
            <div className="flex items-center justify-between mb-3">
              <ListIcon className="size-8 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Clauses
              </span>
            </div>
            <div className="text-2xl font-title mb-2 text-primary">
              {contract.clauses.length} Clauses
            </div>
            <p className="text-xs text-muted-foreground">
              Key clauses identified
            </p>
          </div>
        )}
      </div>

      {/* Contract Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contract Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 border rounded-xl shadow-island h-full bg-card">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
              <ClipboardList className="size-4" />
              Contract Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  File Name
                </label>
                <p className="text-sm font-medium mt-1 wrap-anywhere">
                  {contract.file_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Tag className="size-3" />
                  Category
                </label>
                <p className="text-sm font-medium mt-1">
                  {contract.category || "Uncategorized"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="size-3" />
                    Created
                  </label>
                  <p className="text-sm font-medium mt-1">
                    {formatDate(
                      new Date(contract.created_at || ""),
                      "MMM d, yyyy"
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Clock className="size-3" />
                    Updated
                  </label>
                  <p className="text-sm font-medium mt-1">
                    {formatDate(new Date(contract.last_updated || ""), "MMM d")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Clauses & Risks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Analysis Section */}
          {contract.risks && contract.risks.length > 0 && (
            <div className="p-5 border rounded-xl shadow-island bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
                  <ShieldAlert className="size-4" />
                  Risk Analysis
                </h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {contract.risks.length} findings
                </span>
              </div>

              {/* Risk Breakdown Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {Object.entries(groupedRisks || {}).map(([severity, risks]) => (
                  <div
                    key={severity}
                    className="p-3 rounded-lg border border-border/50 bg-muted/30"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityIcon(severity)}
                      <span className="text-xs font-semibold capitalize text-foreground">
                        {severity}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {risks.length}
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Risk Findings */}
              <div className="space-y-2">
                {(showAllRisks
                  ? contract.risks
                  : contract.risks.slice(0, 3)
                ).map((risk) => {
                  const isExpanded = expandedRisks.has(risk.finding_id);
                  return (
                    <div
                      key={risk.finding_id}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        isExpanded ? "border-primary/30" : "border-border/50"
                      }`}
                    >
                      <button
                        onClick={() => toggleRisk(risk.finding_id)}
                        className="w-full"
                      >
                        <div className="p-3 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(
                                    risk.severity
                                  )}`}
                                >
                                  {getSeverityIcon(risk.severity)}
                                  {risk.severity.toUpperCase()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {risk.domain}
                                </span>
                              </div>
                              <h4 className="text-sm font-semibold mb-1 w-full text-start">
                                {risk.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1 w-full text-start">
                                {risk.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {(risk.confidence_score * 100).toFixed(0)}%
                              </span>
                              <span className="text-muted-foreground transition-transform text-xs">
                                {isExpanded ? "▼" : "▶"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 space-y-3 border-t border-border/50 animate-in slide-in-from-top-2">
                          {/* Affected Clauses */}
                          {risk.affected_clauses &&
                            risk.affected_clauses.length > 0 && (
                              <div>
                                <h5 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase">
                                  Affected Clauses
                                </h5>
                                <div className="space-y-1.5">
                                  {risk.affected_clauses.map((clause, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2 bg-muted/30 rounded text-xs"
                                    >
                                      <span className="font-medium">
                                        Clause {clause.clause_id}
                                      </span>
                                      {clause.heading && `: ${clause.heading}`}
                                      {clause.excerpt && ` - ${clause.excerpt}`}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Policy Violations */}
                          {risk.policy_violations &&
                            risk.policy_violations.length > 0 && (
                              <div>
                                <h5 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase">
                                  Policy Violations
                                </h5>
                                <div className="space-y-1.5">
                                  {risk.policy_violations.map(
                                    (violation, idx) => (
                                      <div
                                        key={idx}
                                        className="p-2 bg-yellow-500/10 rounded text-xs border border-yellow-500/20"
                                      >
                                        <div className="font-medium text-yellow-700 dark:text-yellow-400">
                                          {violation.policy_name}
                                        </div>
                                        <div className="text-muted-foreground mt-0.5">
                                          {violation.requirement}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Remediation Actions */}
                          {risk.remediation_actions &&
                            risk.remediation_actions.length > 0 && (
                              <div>
                                <h5 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase">
                                  Recommended Actions
                                </h5>
                                <div className="space-y-1.5">
                                  {risk.remediation_actions
                                    .sort((a, b) => a.priority - b.priority)
                                    .map((action, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-2 p-2 bg-blue-500/10 rounded text-xs border border-blue-500/20"
                                      >
                                        <CheckCircle2 className="size-3 text-blue-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                          <div className="font-medium text-blue-700 dark:text-blue-400">
                                            {action.action_type.replace(
                                              /_/g,
                                              " "
                                            )}
                                          </div>
                                          <div className="text-muted-foreground mt-0.5">
                                            {action.description}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                          {/* Business Consequence */}
                          <div>
                            <h5 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase">
                              Business Impact
                            </h5>
                            <div className="p-2 bg-red-500/10 rounded text-xs border border-red-500/20 text-red-700 dark:text-red-400">
                              {risk.business_consequence}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {contract.risks.length > 3 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowAllRisks(!showAllRisks)}
                    className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                  >
                    {showAllRisks
                      ? "Show less"
                      : `+${contract.risks.length - 3} more risk findings`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Clauses Preview */}
          {contract.clauses && contract.clauses.length > 0 && (
            <div className="p-5 border rounded-xl shadow-island bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
                  <ListIcon className="size-4" />
                  Contract Clauses
                </h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {contract.clauses.length} total
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {contract.clauses.slice(0, 4).map((clause) => (
                  <div key={clause.clause_id}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        {clause.heading && (
                          <h4 className="text-xs font-bold mb-1 text-foreground/80">
                            #{clause.clause_id} {clause.heading}
                          </h4>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {clause.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {contract.clauses.length > 6 && (
                <div className="mt-3 text-center">
                  {setActiveTab ? (
                    <button
                      onClick={() => setActiveTab("clauses")}
                      className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                    >
                      +{contract.clauses.length - 6} more clauses →
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      +{contract.clauses.length - 6} more clauses
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
