import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { contractActions } from "@/actions/contracts";
import { useUpdateContract } from "@/actions/hooks/use-contracts";
import { FileText, AlertCircle, Loader2, ListIcon } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Tabs, useTabs, TabContent } from "@/components/ui/tabs";
import { TextEditor } from "@/components/editor/text-editor";
import { MetadataForm } from "@/components/editor/metadata-form";
import { ClauseSuggestions } from "@/components/editor/clause-suggestions";
import { TemplateDialog } from "@/components/editor/template-dialog";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import type { ClauseSuggestion } from "@/lib/mocks";
import { getTemplateContent } from "@/lib/mocks";
import { debounce } from "@/lib/utils";
import { ClauseList } from "@/components/contracts/clause-list";
import { OverviewContent } from "@/components/contracts/overview-content";
import { CopilotAssistant } from "@/components/contracts/copilot-assistant";
import { VersionHistory } from "@/components/contracts/version-history";
import { generateVersionHistory } from "@/lib/demo-versioning";
import type { Clause } from "@/actions/contracts";
import {
  suggestionsActions,
  type ClauseSuggestion as APIClauseSuggestion,
} from "@/actions/suggestions";
import { toast } from "sonner";

export const Route = createFileRoute("/(app)/contracts/$id")({
  component: RouteComponent,
});

// Convert API suggestion format to UI format
const convertSuggestionToUI = (
  apiSuggestion: APIClauseSuggestion,
  index: number
): ClauseSuggestion => {
  return {
    id: `suggestion-${index}`,
    title: apiSuggestion.title,
    type: apiSuggestion.action || "add",
    content: apiSuggestion.body,
    tags: apiSuggestion.tags.map((tag) => tag.name),
  };
};

// Fetch AI-powered suggestions from the API
const fetchSuggestions = async (
  content: string,
  query?: string
): Promise<{ suggestions: ClauseSuggestion[]; paragraph?: string }> => {
  console.log(`Analyzing ${content.length} characters for suggestions...`);
  if (query) {
    console.log(`Query: ${query}`);
  }

  try {
    const result = await suggestionsActions.generateSuggestions(content, query);

    // Convert API format to UI format
    const suggestions = result.suggestions.map((suggestion, index) =>
      convertSuggestionToUI(suggestion, index)
    );

    return {
      suggestions,
      paragraph: result.paragraph,
    };
  } catch (error) {
    console.error("Failed to fetch AI suggestions:", error);
    // Fallback to empty array on error
    return { suggestions: [] };
  }
};

interface DraftMetadata {
  title: string;
  category: string;
}

function RouteComponent() {
  const { id } = Route.useParams();

  const {
    data: contract,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contract", id],
    queryFn: () => contractActions.getContract(id),
  });

  const [metadata, setMetadata] = useState<DraftMetadata>({
    title: "",
    category: "",
  });
  const [content, setContent] = useState("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Copilot Assistant State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);

  const { activeTab, setActiveTab } = useTabs({
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "clauses", label: "Clauses" },
      { id: "versions", label: "Versions" },
      { id: "edit", label: "Edit" },
    ],
    defaultTab: "overview",
  });

  // Mutation for fetching suggestions
  const suggestionsMutation = useMutation({
    mutationFn: ({ content, query }: { content: string; query?: string }) =>
      fetchSuggestions(content, query),
    onError: (error) => {
      console.error("Failed to fetch suggestions:", error);
      toast.error("Failed to fetch AI suggestions");
    },
  });

  // Mutation for updating contract
  const updateContractMutation = useUpdateContract();

  // Create a debounced function to fetch suggestions
  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((content: string, mutate: typeof suggestionsMutation.mutate) => {
        if (content.trim() && content.length < 1200) {
          mutate({ content });
        }
      }, 15000),
    [] // Empty dependency array - function is created only once
  );

  // Initialize metadata and content from contract data
  useEffect(() => {
    if (contract) {
      setMetadata({
        title: contract.file_name || "",
        category: contract.category || "",
      });
      setContent(contract.content || "");
    }
  }, [contract]);

  // Generate version history based on contract data
  const versionHistory = useMemo(() => {
    if (!contract) return [];
    return generateVersionHistory(contract._id, contract.created_at);
  }, [contract]);

  // Trigger debounced suggestions when content changes
  useEffect(() => {
    debouncedFetchSuggestions(content, suggestionsMutation.mutate);
  }, [content, debouncedFetchSuggestions, suggestionsMutation.mutate]);

  const handleInsertClause = (clause: ClauseSuggestion) => {
    const newContent =
      content + (content ? "\n\n" : "") + `${clause.type}:\n${clause.content}`;
    setContent(newContent);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleAskAI = (query: string) => {
    suggestionsMutation.mutate({ content, query });
  };

  const handleSaveChanges = async () => {
    if (!id || !content.trim()) return;

    try {
      // Update content and metadata in a single call
      await updateContractMutation.mutateAsync({
        id,
        data: {
          content,
          name: metadata.title,
          category: metadata.category,
        },
      });

      toast.success("Contract updated successfully");
      // Switch to overview tab after successful save
      setActiveTab("overview");
    } catch (error) {
      console.error("Failed to save changes:", error);
      // Error toast is already handled by the mutation's onError
    }
  };

  const handleRegenerateClause = (clause: Clause) => {
    setSelectedClause(clause);
    setIsCopilotOpen(true);
  };

  const handleClauseUpdate = async (clauseId: string, newContent: string) => {
    // In a real implementation, this would update the specific clause in the backend
    console.log(`Updating clause ${clauseId} with new content:`, newContent);
    
    // For demo purposes, we'll just close the copilot and show success
    // In production, you'd want to:
    // 1. Call an API to update the clause
    // 2. Re-fetch the contract
    // 3. Show a success toast
    
    setTimeout(() => {
      setIsCopilotOpen(false);
      setSelectedClause(null);
    }, 2000);
  };

  useHeader(contract?.file_name || "Contract Details");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="size-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Contract</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FileText className="size-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Contract not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "clauses", label: "Clauses" },
          { id: "versions", label: "Versions" },
          { id: "edit", label: "Edit" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <TabContent value="overview" activeTab={activeTab}>
          <OverviewContent contract={contract} setActiveTab={setActiveTab} />
        </TabContent>

        {/* Clauses Tab */}
        <TabContent value="clauses" activeTab={activeTab}>
          <div className="p-6 border rounded-xl shadow-island bg-card">
            <h3 className="text-lg font-semibold mb-4">
              <ListIcon className="size-5 text-primary inline me-2 mb-1" />{" "}
              Extracted Clauses
            </h3>
            <ClauseList 
              clauses={contract.clauses || []} 
              onRegenerateClick={handleRegenerateClause}
            />
          </div>
        </TabContent>

        {/* Versions Tab */}
        <TabContent value="versions" activeTab={activeTab}>
          <VersionHistory versions={versionHistory} />
        </TabContent>

        {/* Edit Tab */}
        <TabContent value="edit" activeTab={activeTab}>
          <motion.div
            className="grid gap-4 min-h-[calc(95vh-8rem)] overflow-hidden"
            style={{
              gridTemplateColumns:
                content.length > 0 && showSuggestions ? "5fr 3fr" : "1fr",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout
          >
            <motion.div className="space-y-4" layout>
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

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("overview")}
                  disabled={updateContractMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveChanges}
                  disabled={updateContractMutation.isPending || !content.trim()}
                >
                  {updateContractMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
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
                  className="max-h-[calc(95vh-8rem)]"
                >
                  <ClauseSuggestions
                    suggestions={suggestionsMutation.data?.suggestions || []}
                    onInsertClause={handleInsertClause}
                    onAskAI={handleAskAI}
                    isLoading={suggestionsMutation.isPending}
                    paragraph={suggestionsMutation.data?.paragraph}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </TabContent>
      </Tabs>

      {/* Template Dialog */}
      <TemplateDialog
        isOpen={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSelectTemplate={(templateId) => {
          setContent(getTemplateContent(templateId));
          textareaRef.current?.focus();
          setIsTemplateDialogOpen(false);
        }}
      />

      {/* Copilot Assistant */}
      <CopilotAssistant
        isOpen={isCopilotOpen}
        onClose={() => {
          setIsCopilotOpen(false);
          setSelectedClause(null);
        }}
        onRegenerateClause={handleClauseUpdate}
        initialClauseId={selectedClause?.clause_id}
        initialClauseText={selectedClause?.content || selectedClause?.text}
      />
    </div>
  );
}
