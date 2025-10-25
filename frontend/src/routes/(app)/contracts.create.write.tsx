import { useHeader } from "@/stores/header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm";
import {
  ChevronRightIcon,
  BrainIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
} from "lucide-react";
import {
  mockClauseSuggestions,
  mockTemplates,
  getTemplateContent,
} from "@/lib/mocks";
import type { ClauseSuggestion } from "@/lib/mocks";
import { MetadataForm } from "@/components/editor/metadata-form";
import { TextEditor } from "@/components/editor/text-editor";
import { ClauseSuggestions } from "@/components/editor/clause-suggestions";
import { TemplateDialog } from "@/components/editor/template-dialog";
import { AnimatePresence, motion } from "motion/react";
import { contractActions } from "@/actions/contracts";
import ContractProcessingStepper from "@/components/upload/contract-processing-stepper";
import ContractProcessingStage from "@/components/upload/contract-processing-stage";
import ContractProcessingComplete from "@/components/upload/contract-processing-complete";
import ClauseDisplay from "@/components/upload/clauses-display";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "@/lib/utils";

export const Route = createFileRoute("/(app)/contracts/create/write")({
  component: RouteComponent,
});

interface DraftMetadata {
  title: string;
  category: string;
}

type ProcessingStep = "draft" | "segmentation" | "compliance" | "complete";

const processingSteps = [
  {
    id: "draft",
    label: "Draft",
    title: "Writing Contract",
    icon: ChevronRightIcon,
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

// Mock function to fetch suggestions - replace with actual API call later
const fetchSuggestions = async (
  content: string,
  query?: string
): Promise<ClauseSuggestion[]> => {
  console.log(`Analyzing ${content.length} characters for suggestions...`);
  console.log(`Query: ${query}`);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [...mockClauseSuggestions].sort(() => Math.random() - 0.5).slice(0, 4);
};

function RouteComponent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("draft");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [contractData, setContractData] = useState<any>(null);
  const [clausesData, setClausesData] = useState<any>(null);
  const [complianceData, setComplianceData] = useState<any>(null);

  const [metadata, setMetadata] = useState<DraftMetadata>({
    title: "",
    category: "",
  });
  const [content, setContent] = useState("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const currentStepLabel = processingSteps.find(
    (s) => s.id === currentStep
  )?.title;

  useHeader("Drafting a new contract");
  useHeader(currentStepLabel || null, 1);

  const { confirmDialog, confirm } = useConfirm({
    title: "Load Template?",
    description:
      "This will replace your current draft. Are you sure you want to continue?",
    destructive: false,
  });

  // Mutation for fetching suggestions
  const suggestionsMutation = useMutation({
    mutationFn: ({ content, query }: { content: string; query?: string }) =>
      fetchSuggestions(content, query),
    onError: (error) => {
      console.error("Failed to fetch suggestions:", error);
    },
  });

  // Create a debounced function to fetch suggestions
  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((content: string) => {
        if (content.trim() && currentStep === "draft") {
          console.log("Fetching suggestions for content...");
          suggestionsMutation.mutate({ content });
        }
      }, 5000),
    [suggestionsMutation, currentStep]
  );

  // Trigger debounced suggestions when content changes
  useEffect(() => {
    debouncedFetchSuggestions(content);
  }, [content, debouncedFetchSuggestions]);

  const handleInsertClause = (clause: ClauseSuggestion) => {
    const newContent =
      content + (content ? "\n\n" : "") + `${clause.type}:\n${clause.content}`;
    setContent(newContent);
    // Scroll to bottom
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleLoadTemplate = async (templateId: string) => {
    const template = mockTemplates.find((t) => t.id === templateId);
    if (!template) return;

    // Check if there's existing content that will be replaced
    const hasContent =
      content.trim().length > 0 || metadata.title.trim().length > 0;

    if (hasContent) {
      const confirmed = await confirm();
      if (!confirmed) {
        return;
      }
    }

    setMetadata({
      title: template.name,
      category: template.category,
    });

    const templateContent = getTemplateContent(templateId);
    setContent(templateContent);
    setIsTemplateDialogOpen(false);
  };

  const handleContinue = async () => {
    if (!content.trim()) {
      setError("Please write some contract content before continuing");
      return;
    }

    setError(null);

    try {
      // Step 1: Upload content
      setCurrentStep("segmentation");
      setProgress(20);

      const fileName = metadata.title
        ? `${metadata.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`
        : "draft_contract.txt";

      const uploadedContract = await contractActions.uploadContractContent(
        content,
        fileName,
        metadata.category
      );
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
      console.error("Processing error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during processing. Please try again."
      );
      setCurrentStep("draft");
      setProgress(0);
    }
  };

  const handleAskAI = (query: string) => {
    suggestionsMutation.mutate({ content, query });
    setCurrentStep("draft");
    setProgress(0);
  };

  if (currentStep !== "draft") {
    return (
      <div className="space-y-6">
        {/* Progress Steps */}
        <AnimatePresence mode="wait">
          <ContractProcessingStepper
            steps={processingSteps}
            currentStep={currentStep}
            progress={progress}
          />
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-xl text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Processing Stages */}
        <AnimatePresence mode="wait">
          {currentStep === "segmentation" && (
            <ContractProcessingStage
              key="segmentation"
              icon={BrainIcon}
              title="Segmenting Contract and reading clauses"
              description="AI is analyzing your written contract..."
              progress={progress}
              animationType="rotate"
            />
          )}

          {currentStep === "compliance" && (
            <ContractProcessingStage
              key="compliance"
              icon={ShieldCheckIcon}
              title="Compliance Check"
              description="Verifying legal and policies compliance..."
              progress={progress}
              animationType="scale"
            >
              {clausesData && Array.isArray(clausesData) && (
                <ClauseDisplay clauses={clausesData} />
              )}
            </ContractProcessingStage>
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
                setCurrentStep("draft");
                setContent("");
                setMetadata({ title: "", category: "" });
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

  return (
    <motion.div
      className="grid gap-4 h-[calc(95vh-5rem)]"
      style={{
        gridTemplateColumns:
          content.length > 0 && showSuggestions ? "5fr 3fr" : "1fr",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      layout
    >
      {/* Main Editor */}
      <motion.div className="space-y-4" layout>
        {/* Error Message */}
        {error && (
          <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-xl text-sm text-destructive">
            {error}
          </div>
        )}

        <MetadataForm
          metadata={metadata}
          onMetadataChange={setMetadata}
          showSuggestions={showSuggestions && content.length > 0}
          onShowSuggestionsChange={setShowSuggestions}
          onTemplatesClick={() => setIsTemplateDialogOpen(true)}
        />

        <TextEditor
          content={content}
          onContentChange={setContent}
          textareaRef={textareaRef}
        />

        {/* Compliance & Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/contracts/create" })}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleContinue}
            disabled={!content.trim()}
          >
            Continue <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </motion.div>

      {/* AI Suggestions Panel */}
      <AnimatePresence mode="popLayout">
        {content.length > 0 && showSuggestions && (
          <motion.div
            layout
            key="clause-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-h-[calc(95vh-4rem)]"
          >
            <ClauseSuggestions
              suggestions={suggestionsMutation.data || []}
              onInsertClause={handleInsertClause}
              onAskAI={handleAskAI}
              isLoading={suggestionsMutation.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Dialog */}
      <TemplateDialog
        isOpen={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSelectTemplate={handleLoadTemplate}
      />

      {/* Confirm Dialog */}
      {confirmDialog}
    </motion.div>
  );
}
