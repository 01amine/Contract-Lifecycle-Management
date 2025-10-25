import { motion } from "motion/react";
import { CheckCircle2Icon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function UploadProgressSteps({
  steps,
  currentStep,
  progress,
}: UploadProgressStepsProps) {
  const getCurrentStepIndex = () =>
    steps.findIndex((s) => s.id === currentStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = index < getCurrentStepIndex();
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <motion.div
                  initial={false}
                  animate={{}}
                  transition={{ duration: 0.3 }}
                  className="relative mb-2"
                >
                  <div
                    className={cn(
                      "size-12 rounded-full flex items-center justify-center transition-colors",
                      isCompleted
                        ? "bg-green-600"
                        : isActive
                        ? "bg-primary"
                        : "bg-muted"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2Icon className="size-6 text-white" />
                    ) : (
                      <StepIcon
                        className={cn(
                          "size-6",
                          isActive ? "text-white" : "text-muted-foreground"
                        )}
                      />
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
                <div className="text-center w-full">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isCompleted || isActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 40 }}
                      className="h-1 bg-primary rounded-full mt-2 mx-auto"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mt-6 transition-colors",
                    isCompleted ? "bg-green-600" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
