import { useHeader } from "@/stores/header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { 
  UploadIcon, 
  CheckCircle2Icon,
  SparklesIcon,
  ShieldCheckIcon,
  DatabaseIcon
} from "lucide-react";
import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadProgressSteps from "@/components/upload/UploadProgressSteps";
import UploadProcessingStage from "@/components/upload/UploadProcessingStage";
import UploadComplete from "@/components/upload/UploadComplete";

export const Route = createFileRoute("/(app)/upload")({
  component: RouteComponent,
});

type UploadStep = "upload" | "analyzing" | "compliance" | "blockchain" | "complete";

function RouteComponent() {
  useHeader("Upload Contract");
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<UploadStep>("upload");
  const [progress, setProgress] = useState(0);

  const steps = [
    { id: "upload", label: "Upload", icon: UploadIcon },
    { id: "analyzing", label: "AI Analysis", icon: SparklesIcon },
    { id: "compliance", label: "Compliance Check", icon: ShieldCheckIcon },
    { id: "blockchain", label: "Blockchain", icon: DatabaseIcon },
    { id: "complete", label: "Complete", icon: CheckCircle2Icon },
  ];

  const startUploadProcess = async (files: File[]) => {
    if (files.length === 0) return;

    // Step 1: Analyzing
    setCurrentStep("analyzing");
    setProgress(0);
    
    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setProgress(i);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 2: Compliance Check
    setCurrentStep("compliance");
    setProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 120));
      setProgress(i);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 3: Blockchain
    setCurrentStep("blockchain");
    setProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 4: Complete
    setCurrentStep("complete");
    setProgress(100);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate({ to: "/contracts" });
    }, 2000);
  };

  return (
    <div>
      {/* Progress Steps */}
      <AnimatePresence mode="wait">
        {currentStep !== "upload" && (
          <UploadProgressSteps 
            steps={steps} 
            currentStep={currentStep} 
            progress={progress} 
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentStep === "upload" && (
          <UploadDropzone 
            key="upload"
            onFilesSelected={startUploadProcess}
            dragActive={dragActive}
            onDragStateChange={setDragActive}
          />
        )}

        {currentStep === "analyzing" && (
          <UploadProcessingStage
            key="analyzing"
            icon={SparklesIcon}
            title="Analyzing Contract"
            description="AI is reading and understanding your document..."
            progress={progress}
            animationType="rotate"
            color="primary"
          />
        )}

        {currentStep === "compliance" && (
          <UploadProcessingStage
            key="compliance"
            icon={ShieldCheckIcon}
            title="Compliance Check"
            description="Verifying legal and Shariah compliance..."
            progress={progress}
            animationType="scale"
            color="green"
          />
        )}

        {currentStep === "blockchain" && (
          <UploadProcessingStage
            key="blockchain"
            icon={DatabaseIcon}
            title="Blockchain Registration"
            description="Creating immutable proof on Polygon network..."
            progress={progress}
            animationType="float"
            color="blue"
          />
        )}

        {currentStep === "complete" && (
          <UploadComplete key="complete" />
        )}
      </AnimatePresence>
    </div>
  );
}

