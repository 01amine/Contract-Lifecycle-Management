import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import { type ClauseSuggestion } from "@/lib/mocks";
import { Input } from "../ui/input";
import { useState } from "react";

interface ClauseSuggestionsProps {
  suggestions: ClauseSuggestion[];
  onInsertClause: (clause: ClauseSuggestion) => void;
  onAskAI: (query: string) => void;
  isLoading?: boolean;
}

export function ClauseSuggestions({
  suggestions,
  onInsertClause,
  onAskAI,
  isLoading = false,
}: ClauseSuggestionsProps) {
  const [query, setQuery] = useState("");

  const handleAskAI = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAskAI(query);
    setQuery("");
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      {/* <div className="p-4 border rounded-xl shadow-island bg-card shrink-0">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          AI Clause Suggestions
        </h3>
      </div> */}

      <div className="h-full overflow-y-auto lg:pe-1 rounded-xl">
        <div className="space-y-3 pr-2">
          {isLoading && (
            <div className="p-4 border rounded-xl shadow-island bg-card flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Generating suggestions...</span>
            </div>
          )}
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-4 border rounded-xl shadow-island bg-card hover:border-primary/50 transition-all space-y-1"
            >
              <h4 className="font-semibold text-sm">{suggestion.title}</h4>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-muted-foreground capitalize bg-muted rounded-xs px-1.5 py-0.5">
                  {suggestion.type}
                </span>
                {suggestion.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs text-muted-foreground capitalize bg-muted rounded-xs px-1.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                {suggestion.content}
              </p>

              <Button
                onClick={() => onInsertClause(suggestion)}
                size="sm"
                variant="outline"
                className="w-full"
              >
                <PlusIcon className="size-3 mr-1" />
                Insert Clause
              </Button>
            </div>
          ))}

          {suggestions.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No suggestions available
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleAskAI}
        className="p-4 border rounded-xl shadow-island bg-card shrink-0 flex items-center gap-2"
      >
        <Input
          placeholder="Ask AI for more"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="default" type="submit">
          Ask
        </Button>
      </form>
    </div>
  );
}
