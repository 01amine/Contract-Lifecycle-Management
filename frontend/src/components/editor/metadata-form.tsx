import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bot, Brain, HistoryIcon } from "lucide-react";

interface DraftMetadata {
  title: string;
  category: string;
}

interface MetadataFormProps {
  metadata: DraftMetadata;
  onMetadataChange: (metadata: DraftMetadata) => void;
  onTemplatesClick: () => void;
  showSuggestions: boolean;
  onShowSuggestionsChange: (showSuggestions: boolean) => void;
}

export function MetadataForm({
  metadata,
  onMetadataChange,
  onTemplatesClick,
  showSuggestions,
  onShowSuggestionsChange,
}: MetadataFormProps) {
  return (
    <div className="p-4 border rounded-xl shadow-island bg-card">
      <div className="mb-3">
        <h3 className="font-title font-bold text-lg flex items-center gap-2">
          Contract Details
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Enter the details of the contract you are drafting.
        </p>
      </div>
      <div className="flex gap-3">
        <Input
          placeholder="Contract title"
          value={metadata.title}
          onChange={(e) =>
            onMetadataChange({ ...metadata, title: e.target.value })
          }
          className="max-w-xs"
        />

        <Select
          value={metadata.category}
          onValueChange={(value) =>
            onMetadataChange({ ...metadata, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Credit Facility">Credit Facility</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Islamic Finance">Islamic Finance</SelectItem>
            <SelectItem value="Real Estate">Real Estate</SelectItem>
            <SelectItem value="Employment">Employment</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Procurement">Procurement</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={onTemplatesClick}
          className="justify-start ms-auto"
        >
          <HistoryIcon className="size-4" /> Templates
        </Button>
        <Button
          variant="outline"
          onClick={() => onShowSuggestionsChange(!showSuggestions)}
        >
          {showSuggestions ? (
            <Bot className="size-4" />
          ) : (
            <Brain className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
