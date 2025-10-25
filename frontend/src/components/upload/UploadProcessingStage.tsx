import { motion } from "motion/react";
import { type LucideIcon } from "lucide-react";

interface UploadProcessingStageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  progress: number;
  animationType: "rotate" | "scale" | "float";
  color: "primary" | "green" | "blue";
}

export default function UploadProcessingStage({
  icon: Icon,
  title,
  description,
  progress,
  animationType,
  color
}: UploadProcessingStageProps) {
  const getAnimation = () => {
    switch (animationType) {
      case "rotate":
        return { rotate: 360 };
      case "scale":
        return { scale: [1, 1.1, 1] };
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

  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-linear-to-br from-primary to-secondary",
          progressBg: "bg-primary"
        };
      case "green":
        return {
          bg: "bg-linear-to-br from-green-500 to-green-600",
          progressBg: "bg-green-600"
        };
      case "blue":
        return {
          bg: "bg-linear-to-br from-blue-500 to-blue-600",
          progressBg: "bg-blue-600"
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-[50vh]"
    >
      <div className="text-center max-w-md">
        <motion.div
          animate={getAnimation()}
          transition={getTransition()}
          className="size-24 mx-auto mb-6"
        >
          <div className={`size-24 rounded-full ${colorClasses.bg} flex items-center justify-center shadow-lg`}>
            <Icon className="size-12 text-white" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className={`h-2 ${colorClasses.progressBg} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
      </div>
    </motion.div>
  );
}
