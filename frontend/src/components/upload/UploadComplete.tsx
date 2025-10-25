import { motion } from "motion/react";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";

export default function UploadComplete() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-[50vh]"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="size-24 mx-auto mb-6"
        >
          <div className="size-24 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <CheckCircle2Icon className="size-12 text-white" strokeWidth={3} />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-2 text-green-600"
        >
          Upload Complete!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-4"
        >
          Your contract has been successfully processed
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Loader2Icon className="size-4 animate-spin" />
          <span>Redirecting to contracts...</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
