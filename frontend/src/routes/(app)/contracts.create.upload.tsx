import { useHeader } from "@/stores/header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  UploadIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  BrainIcon,
} from "lucide-react";
import UploadDropzone from "@/components/upload/upload-dropzone";
import ContractProcessingStepper from "@/components/upload/contract-processing-stepper";
import ContractProcessingStage from "@/components/upload/contract-processing-stage";
import ContractProcessingComplete from "@/components/upload/contract-processing-complete";
import { Button } from "@/components/ui/button";
import { contractActions } from "@/actions/contracts";

export const Route = createFileRoute("/(app)/contracts/create/upload")({
  component: RouteComponent,
});

type UploadStep = "upload" | "segmentation" | "compliance" | "complete";

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
  const [contractId, setContractId] = useState<string | null>(null);
  const [contractData, setContractData] = useState<any>(null);
  const [clausesData, setClausesData] = useState<any>(null);
  const [complianceData, setComplianceData] = useState<any>(null);

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
      // Step 1: Upload the file
      setCurrentStep("segmentation");
      setProgress(20);

      const formData = new FormData();
      formData.append("file", files[0]);

      const uploadedContract = await contractActions.uploadContract(formData);
      console.log("Upload response:", uploadedContract);

      const contractId = uploadedContract._id || null;

      if (!contractId) {
        throw new Error(
          "No contract ID returned from server. Response: " +
            JSON.stringify(uploadedContract)
        );
      }

      setContractId(contractId);
      setContractData(uploadedContract);
      setProgress(30);

      // Step 2: Extract clauses
      setProgress(50);
      const clauses = await contractActions.extractClauses(contractId);
      console.log("Clauses response:", clauses);
      setClausesData(clauses);
      setProgress(100);

      // Wait a bit before moving to compliance
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 3: Compliance Check
      setCurrentStep("compliance");
      setProgress(0);
      setProgress(30);

      const complianceResult = await contractActions.complianceCheck(
        contractId
      );
      console.log("Compliance response:", complianceResult);
      setComplianceData(complianceResult);
      setProgress(100);

      // Wait a bit before showing complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 4: Complete
      setCurrentStep("complete");
      setProgress(100);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during upload. Please try again."
      );
      setCurrentStep("upload");
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <AnimatePresence mode="wait">
        {currentStep !== "upload" && (
          <ContractProcessingStepper
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
          <ContractProcessingStage
            key="segmentation"
            icon={BrainIcon}
            title="Segmenting Contract and reading clauses"
            description="AI is segmenting the contract and reading the clauses..."
            progress={progress}
            animationType="rotate"
          />
        )}

        {currentStep === "compliance" && (
          <ContractProcessingStage
            key="compliance"
            icon={ShieldCheckIcon}
            title="Compliance Check"
            description="Verifying legal and Policy compliance..."
            progress={progress}
            animationType="scale"
          />
        )}

        {currentStep === "complete" && (
          <ContractProcessingComplete
            key="complete"
            contractId={contractId}
            contractData={contractData}
            clausesData={clausesData}
            complianceData={complianceData}
            onViewContract={() =>
              contractId && navigate({ to: `/contracts/${contractId}` })
            }
            onUploadAnother={() => {
              setCurrentStep("upload");
              setSelectedFiles([]);
              setProgress(0);
              setContractId(null);
              setContractData(null);
              setClausesData(null);
              setComplianceData(null);
            }}
            onGoToContracts={() => navigate({ to: "/contracts" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
