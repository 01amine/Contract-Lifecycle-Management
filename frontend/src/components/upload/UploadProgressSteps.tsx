import { motion } from "motion/react";
import { CheckCircle2Icon, type LucideIcon } from "lucide-react";

interface Step {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface UploadProgressStepsProps {
  steps: Step[];
  currentStep: string;
  progress: number;
}

export default function UploadProgressSteps({ steps, currentStep, progress }: UploadProgressStepsProps) {
  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = index < getCurrentStepIndex();
          const StepIcon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted ? "#10b981" : isActive ? "#ff9500" : "#e5e7eb"
                }}
                className="relative"
              >
                <div className={`size-12 rounded-full flex items-center justify-center ${
                  isCompleted ? "bg-green-600" : isActive ? "bg-primary" : "bg-gray-200"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2Icon className="size-6 text-white" />
                  ) : (
                    <StepIcon className={`size-6 ${isActive ? "text-white" : "text-gray-400"}`} />
                  )}
                </div>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <div className="ml-3 flex-1">
                <div className={`text-sm font-medium ${
                  isCompleted || isActive ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </div>
                {isActive && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-1 bg-primary rounded-full mt-1"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-full mx-4 ${
                  isCompleted ? "bg-green-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
