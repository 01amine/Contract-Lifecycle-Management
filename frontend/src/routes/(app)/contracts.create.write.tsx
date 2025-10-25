import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm";
import { ChevronRightIcon } from "lucide-react";
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

export const Route = createFileRoute("/(app)/contracts/create/write")({
  component: RouteComponent,
});

interface DraftMetadata {
  title: string;
  category: string;
}

function RouteComponent() {
  useHeader("Drafting a new contract");

  const [metadata, setMetadata] = useState<DraftMetadata>({
    title: "",
    category: "",
  });
  const [content, setContent] = useState("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { confirmDialog, confirm } = useConfirm({
    title: "Load Template?",
    description:
      "This will replace your current draft. Are you sure you want to continue?",
    destructive: false,
  });

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
          <Button variant="outline">Cancel</Button>
          <Button variant="default">
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
          >
            <ClauseSuggestions
              suggestions={mockClauseSuggestions}
              onInsertClause={handleInsertClause}
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
