import { motion } from "motion/react";
import { CheckCircle2Icon, ClipboardList, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Clause, Risk } from "@/actions/contracts";

interface ContractData {
  _id: string;
  file_name: string;
  [key: string]: unknown;
}

interface ComplianceData {
  compliance_score: number;
  status: string;
  issues?: Risk[];
  [key: string]: unknown;
}

interface UploadCompleteProps {
  contractId: string | null;
  contractData: ContractData | null;
  clausesData: Clause[] | null;
  complianceData: ComplianceData | null;
  onViewContract?: () => void;
  onUploadAnother?: () => void;
  onGoToContracts?: () => void;
}

export default function UploadComplete({
  contractId,
  clausesData,
  complianceData,
  onViewContract,
  onUploadAnother,
  onGoToContracts,
}: UploadCompleteProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-[65vh]"
    >
      <div className="text-center max-w-lg p-6 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="size-24 mx-auto mb-6"
        >
          <div className="size-24 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-island">
            <CheckCircle2Icon className="size-12 text-white" strokeWidth={3} />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-title font-bold mb-2 text-green-600"
        >
          Created Successfully!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-8"
        >
          Your contract has been successfully processed and analyzed.
        </motion.p>

        {/* Quick Stats */}
        {(clausesData || complianceData) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8 grid grid-cols-2 gap-4"
          >
            {clausesData && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  {Array.isArray(clausesData) ? clausesData.length : 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Clauses Identified
                </div>
              </div>
            )}
            {complianceData?.compliance_score !== undefined && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    complianceData.compliance_score >= 0.9
                      ? "text-green-600"
                      : complianceData.compliance_score >= 0.7
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {(complianceData.compliance_score * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Compliance Score
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 max-w-md mx-auto"
        >
          {onViewContract && contractId && (
            <Button onClick={onViewContract} size="lg" className="w-full">
              <ClipboardList className="size-4" />
              View Contract Details
            </Button>
          )}
          {onUploadAnother && (
            <Button
              onClick={onUploadAnother}
              size="lg"
              variant="outline"
              className="w-full"
            >
              <UploadIcon className="size-4" />
              Upload Another
            </Button>
          )}
          {onGoToContracts && (
            <Button
              onClick={onGoToContracts}
              size="lg"
              variant="ghost"
              className="w-full"
            >
              Go to Contracts
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
