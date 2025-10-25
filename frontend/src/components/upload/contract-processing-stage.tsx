import { motion } from "motion/react";
import { type LucideIcon } from "lucide-react";

interface UploadProcessingStageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  progress: number;
  animationType: "rotate" | "scale" | "float";
}

export default function UploadProcessingStage({
  icon: Icon,
  title,
  description,
  progress,
  animationType,
}: UploadProcessingStageProps) {
  const getAnimation = () => {
    switch (animationType) {
      case "rotate":
        return { rotate: 360 };
      case "scale":
        return { opacity: [1, 0.7, 1] };
      case "float":
        return { y: [0, -10, 0] };
    }
  };

  const getTransition = () => {
    switch (animationType) {
      case "rotate":
        return { duration: 2, repeat: Infinity, ease: "linear" as const };
      case "scale":
        return { duration: 1.5, repeat: Infinity };
      case "float":
        return { duration: 1.5, repeat: Infinity };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="text-center min-w-lg">
        <motion.div
          animate={getAnimation()}
          transition={getTransition()}
          className="size-24 mx-auto mb-6"
        >
          <div className="size-24 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-island">
            <Icon className="size-12 text-white" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="h-2 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
