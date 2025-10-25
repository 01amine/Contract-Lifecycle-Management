import { useHeader } from "@/stores/header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  UploadIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  DatabaseIcon,
  BrainIcon,
} from "lucide-react";
import UploadDropzone from "@/components/upload/upload-dropzone";
import UploadProgressSteps from "@/components/upload/upload-progress-steps";
import UploadProcessingStage from "@/components/upload/upload-processing-stage";
import UploadComplete from "@/components/upload/upload-complete";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(app)/contracts/create/upload")({
  component: RouteComponent,
});

type UploadStep =
  | "upload"
  | "segmentation"
  | "compliance"
  | "blockchain"
  | "complete";

const steps = [
  {
    id: "upload",
    label: "Upload",
    title: "Contract File Upload",
    icon: UploadIcon,
  },
  {
    id: "segmentation",
    label: "AI Segmentation",
    title: "Segmenting Contract and reading clauses",
    icon: BrainIcon,
  },
  {
    id: "compliance",
    label: "Compliance Check",
    title: "Checking for Compliance and matching with policies",
    icon: ShieldCheckIcon,
  },
  {
    id: "blockchain",
    label: "Blockchain",
    title: "Blockchain Registration on Hyperledger",
    icon: DatabaseIcon,
  },
  {
    id: "complete",
    label: "Completion",
    title: null,
    icon: CheckCircle2Icon,
  },
];

function RouteComponent() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<UploadStep>("upload");
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Update header based on current step
  const currentStepLabel = steps.find((s) => s.id === currentStep)?.title;

  useHeader("Create Contract", 0);
  useHeader(currentStepLabel || null, 1);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file");
      return;
    }

    await startUploadProcess(selectedFiles);
  };

  const startUploadProcess = async (files: File[]) => {
    if (files.length === 0) return;

    setError(null);

    try {
      // Step 1: Analyzing
      setCurrentStep("segmentation");
      setProgress(0);

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Simulate analysis progress
      for (let i = 0; i <= 100; i += 6) {
        await new Promise((resolve) =>
          setTimeout(resolve, 300 * Math.random() + 50)
        );
        setProgress(i);
      }

      await new Promise((resolve) => setTimeout(resolve, 700));

      // Step 2: Compliance Check
      setCurrentStep("compliance");
      setProgress(0);

      for (let i = 0; i <= 100; i += 4) {
        await new Promise((resolve) =>
          setTimeout(resolve, 200 * Math.random() + 50)
        );
        setProgress(i);
      }

      await new Promise((resolve) => setTimeout(resolve, 700));

      // Step 3: Blockchain
      setCurrentStep("blockchain");
      setProgress(0);

      for (let i = 0; i <= 100; i += 6) {
        await new Promise((resolve) =>
          setTimeout(resolve, 200 * Math.random() + 50)
        );
        setProgress(i);
      }

      await new Promise((resolve) => setTimeout(resolve, 700));

      // Step 4: Complete
      setCurrentStep("complete");
      setProgress(100);
    } catch (err) {
      setError("An error occurred during upload. Please try again.");
      setCurrentStep("upload");
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Error Message */}
      {error && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-xl text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentStep === "upload" && (
          <div key="upload">
            <UploadDropzone
              onFilesSelected={handleFilesSelected}
              dragActive={dragActive}
              onDragStateChange={setDragActive}
              selectedFiles={selectedFiles}
              onRemoveFile={handleRemoveFile}
            />
            {selectedFiles.length > 0 && (
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFiles([]);
                    setError(null);
                  }}
                >
                  Clear
                </Button>
                <Button onClick={handleUpload} size="lg">
                  Upload & Process
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === "segmentation" && (
          <UploadProcessingStage
            key="segmentation"
            icon={BrainIcon}
            title="Segmenting Contract and reading clauses"
            description="AI is segmenting the contract and reading the clauses..."
            progress={progress}
            animationType="rotate"
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
          />
        )}

        {currentStep === "blockchain" && (
          <UploadProcessingStage
            key="blockchain"
            icon={DatabaseIcon}
            title="Blockchain Registration"
            description="Creating immutable proof on Hyperledger network..."
            progress={progress}
            animationType="float"
          />
        )}

        {currentStep === "complete" && (
          <UploadComplete
            key="complete"
            onViewContract={() => navigate({ to: "/contracts" })}
            onUploadAnother={() => {
              setCurrentStep("upload");
              setSelectedFiles([]);
              setProgress(0);
            }}
            onGoToContracts={() => navigate({ to: "/contracts" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
