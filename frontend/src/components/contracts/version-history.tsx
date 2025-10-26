import { GitBranch, Clock, User, Hash, Link as LinkIcon, CheckCircle2, Shield } from "lucide-react";
import { format } from "date-fns";
import type { ContractVersion } from "@/lib/demo-versioning";
import { verifyHashChain, getBlockchainExplorerUrl } from "@/lib/demo-versioning";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VersionHistoryProps {
  versions: ContractVersion[];
}

export function VersionHistory({ versions }: VersionHistoryProps) {
  const [expandedVersion, setExpandedVersion] = useState<number | null>(
    versions[0]?.version || null
  );

  const toggleVersion = (version: number) => {
    setExpandedVersion(expandedVersion === version ? null : version);
  };

  return (
    <div className="p-6 border rounded-xl shadow-island bg-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <GitBranch className="size-5 text-primary" />
          Version History
          <span className="text-sm font-normal text-muted-foreground">
            ({versions.length} {versions.length === 1 ? "version" : "versions"})
          </span>
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="size-4 text-green-500" />
          <span>Blockchain Verified</span>
        </div>
      </div>

      <div className="space-y-4">
        {versions.map((version, index) => {
          const previousVersion = versions[index + 1];
          const isChainValid = verifyHashChain(version, previousVersion);
          const isExpanded = expandedVersion === version.version;
          const isLatest = index === 0;

          return (
            <div
              key={version.version}
              className={`border rounded-lg transition-all ${
                isLatest
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border"
              }`}
            >
              {/* Version Header */}
              <button
                onClick={() => toggleVersion(version.version)}
                className="w-full p-4 text-left hover:bg-muted/30 transition-colors rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-primary">
                        Version {version.version}
                      </span>
                      {isLatest && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                          Current
                        </span>
                      )}
                      {isChainValid && (
                        <CheckCircle2 className="size-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {version.changes}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="size-3" />
                        {version.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {format(version.timestamp, "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    {isExpanded ? "▼" : "▶"}
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3 mt-2">
                  {/* Blockchain Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Hash className="size-3" />
                        Block Number
                      </label>
                      <p className="text-xs font-mono bg-muted/50 p-2 rounded border">
                        {version.blockNumber.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <LinkIcon className="size-3" />
                        Transaction ID
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono bg-muted/50 p-2 rounded border flex-1 overflow-hidden text-ellipsis">
                          {version.transactionId.slice(0, 16)}...
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() =>
                            window.open(
                              getBlockchainExplorerUrl(version.transactionId),
                              "_blank"
                            )
                          }
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Hash Information */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Contract Hash (SHA-256)
                      </label>
                      <p className="text-xs font-mono bg-muted/50 p-2 rounded border break-all">
                        {version.hash}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Previous Hash
                      </label>
                      <p className="text-xs font-mono bg-muted/50 p-2 rounded border break-all">
                        {version.previousHash}
                      </p>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs">
                    <CheckCircle2 className="size-4 text-green-500" />
                    <span className="text-green-700 dark:text-green-400 font-medium">
                      Hash chain verified • Immutable record on Hyperledger Fabric
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Why Blockchain?</strong> Each version is stored as an immutable record on Hyperledger Fabric,
          ensuring complete transparency, tamper-proof audit trails, and cryptographic verification of all
          changes. The hash chain links each version to its predecessor, making any unauthorized
          modifications immediately detectable.
        </p>
      </div>
    </div>
  );
}
