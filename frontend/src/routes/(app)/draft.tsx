import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SparklesIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  SaveIcon,
} from "lucide-react";
import { mockClauseSuggestions, mockTemplates, type ClauseSuggestion } from "@/lib/mock-data";

export const Route = createFileRoute("/(app)/draft")({
  component: RouteComponent,
});

interface DraftMetadata {
  title: string;
  type: string;
  category: string;
}

function RouteComponent() {
  useHeader("Smart Contract Drafting");
  
  const [metadata, setMetadata] = useState<DraftMetadata>({
    title: "",
    type: "",
    category: "",
  });
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState("");
  const [complianceScore, setComplianceScore] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredSuggestions = mockClauseSuggestions.filter(
    (suggestion) =>
      suggestion.title.toLowerCase().includes(searchSuggestions.toLowerCase()) ||
      suggestion.type.toLowerCase().includes(searchSuggestions.toLowerCase()) ||
      suggestion.tags.some((tag) => tag.toLowerCase().includes(searchSuggestions.toLowerCase()))
  );

  const handleInsertClause = (clause: ClauseSuggestion) => {
    const newContent = content + (content ? "\n\n" : "") + `${clause.type}:\n${clause.content}`;
    setContent(newContent);
    
    // Scroll to bottom
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleLoadTemplate = () => {
    if (!selectedTemplate) return;
    const template = mockTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      setMetadata({
        title: `New ${template.name}`,
        type: template.category.toLowerCase().replace(" ", "-"),
        category: template.category,
      });
      setContent(`${template.name}\n\nThis contract is based on the ${template.name} template.\n\nPARTIES:\n[PARTY_A_NAME]\n[PARTY_B_NAME]\n\nDate: [DATE]\n\n`);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    // Simulate AI validation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Calculate mock compliance score based on content
    const hasForcemajeure = content.toLowerCase().includes("force majeure");
    const hasPayment = content.toLowerCase().includes("payment");
    const hasTermination = content.toLowerCase().includes("termination");
    const hasLiability = content.toLowerCase().includes("liability");
    
    let score = 70;
    if (hasForcemajeure) score += 7;
    if (hasPayment) score += 8;
    if (hasTermination) score += 7;
    if (hasLiability) score += 8;
    
    setComplianceScore(score);
    setIsValidating(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    alert("Export to PDF/DOCX functionality will download your contract");
  };

  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 h-[calc(95vh-5rem)]">
      {/* Main Editor */}
      <div className="space-y-4 overflow-y-auto">
        {/* Metadata */}
        <div className="p-4 border rounded-xl shadow-island bg-card">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <FileTextIcon className="size-4 text-primary" />
            Contract Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Contract title"
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
            />
            <Select
              value={selectedTemplate}
              onValueChange={(value) => {
                setSelectedTemplate(value);
                if (value) handleLoadTemplate();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Load template" />
              </SelectTrigger>
              <SelectContent>
                {mockTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={metadata.category}
              onValueChange={(value) => setMetadata({ ...metadata, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Islamic Finance">Islamic Finance</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Employment">Employment</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Procurement">Procurement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Editor Toolbar */}
        <div className="p-3 border rounded-xl shadow-island bg-card">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" title="Bold">
              <BoldIcon className="size-4" />
            </Button>
            <Button variant="outline" size="sm" title="Italic">
              <ItalicIcon className="size-4" />
            </Button>
            <Button variant="outline" size="sm" title="Underline">
              <UnderlineIcon className="size-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button variant="outline" size="sm" title="List">
              <ListIcon className="size-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <span className="text-xs text-muted-foreground ml-auto">
              {wordCount} words • {charCount} characters
            </span>
          </div>
        </div>

        {/* Editor */}
        <div className="p-4 border rounded-xl shadow-island bg-card">
          <Textarea
            ref={textareaRef}
            placeholder="Start drafting your contract... Use [VARIABLE_NAME] for variables. AI will suggest clauses as you type."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm resize-none border-0 focus-visible:ring-0"
          />
        </div>

        {/* Compliance & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Compliance Check */}
          <div className="p-4 border rounded-xl shadow-island bg-card">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <SparklesIcon className="size-4 text-primary" />
              Compliance Check
            </h3>
            {complianceScore !== null ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Score</span>
                  <div className="flex items-center gap-2">
                    {complianceScore >= 90 ? (
                      <CheckCircleIcon className="size-5 text-green-600" />
                    ) : (
                      <AlertTriangleIcon className="size-5 text-amber-500" />
                    )}
                    <span
                      className={`text-2xl font-bold ${
                        complianceScore >= 90
                          ? "text-green-600"
                          : complianceScore >= 75
                          ? "text-amber-500"
                          : "text-red-600"
                      }`}
                    >
                      {complianceScore}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      complianceScore >= 90
                        ? "bg-green-600"
                        : complianceScore >= 75
                        ? "bg-amber-500"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${complianceScore}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {complianceScore >= 90
                    ? "Excellent! Contract meets all compliance requirements."
                    : complianceScore >= 75
                    ? "Good, but consider adding more standard clauses."
                    : "Needs improvement. Add key clauses from suggestions."}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-3">
                Validate your draft to check compliance score and get AI recommendations.
              </p>
            )}
            <Button
              onClick={handleValidate}
              disabled={!content || isValidating}
              className="w-full mt-3"
              variant="outline"
            >
              {isValidating ? (
                <>
                  <SparklesIcon className="size-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <SparklesIcon className="size-4 mr-2" />
                  Validate Draft
                </>
              )}
            </Button>
          </div>

          {/* Actions */}
          <div className="p-4 border rounded-xl shadow-island bg-card">
            <h3 className="font-semibold text-sm mb-3">Actions</h3>
            <div className="space-y-2">
              <Button onClick={handleSave} disabled={!content} className="w-full">
                <SaveIcon className="size-4 mr-2" />
                {saved ? "Saved!" : "Save Draft"}
              </Button>
              <Button onClick={handleExport} disabled={!content} variant="outline" className="w-full">
                <DownloadIcon className="size-4 mr-2" />
                Export to PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      <div className="space-y-4 overflow-y-auto">
        <div className="p-4 border rounded-xl shadow-island bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <SparklesIcon className="size-4 text-primary" />
              AI Clause Suggestions
            </h3>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs text-primary hover:underline"
            >
              {showSuggestions ? "Hide" : "Show"}
            </button>
          </div>
          {showSuggestions && (
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search clauses..."
                value={searchSuggestions}
                onChange={(e) => setSearchSuggestions(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>

        {showSuggestions && (
          <div className="space-y-3">
            {filteredSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 border rounded-xl shadow-island bg-card hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                    <span className="text-xs text-muted-foreground capitalize">{suggestion.type}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">
                      {suggestion.confidence}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                  {suggestion.content}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        suggestion.complianceScore >= 90
                          ? "bg-green-600"
                          : suggestion.complianceScore >= 75
                          ? "bg-amber-500"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${suggestion.complianceScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {suggestion.complianceScore}%
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {suggestion.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => handleInsertClause(suggestion)}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <PlusIcon className="size-3 mr-1" />
                  Insert Clause
                </Button>
              </div>
            ))}

            {filteredSuggestions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No suggestions match your search
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
