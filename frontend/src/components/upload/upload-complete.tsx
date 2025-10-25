import { motion } from "motion/react";
import { CheckCircle2Icon, ClipboardList, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadCompleteProps {
  onViewContract?: () => void;
  onUploadAnother?: () => void;
  onGoToContracts?: () => void;
}

export default function UploadComplete({
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
          Upload Complete!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-8"
        >
          Your contract has been successfully processed and stored securely on
          the blockchain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 max-w-md mx-auto"
        >
          {onViewContract && (
            <Button onClick={onViewContract} size="lg" className="w-full">
              <ClipboardList className="size-4" />
              View Contract
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
