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
    <div className="flex flex-col h-full lg:max-h-[calc(95vh-4.5rem)] space-y-4">
      {/* Header */}
      {/* <div className="p-4 border rounded-xl shadow-island bg-card shrink-0">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          AI Clause Suggestions
        </h3>
      </div> */}

      {/* Scrollable Suggestions */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop: Vertical Scroll */}
        <div className="hidden lg:block h-full overflow-y-auto lg:pe-1 rounded-xl">
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

        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden h-full overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full pb-4">
            {isLoading && (
              <div className="w-[300px] shrink-0 p-4 border rounded-xl shadow-island bg-card flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Generating...</span>
              </div>
            )}
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="w-[300px] shrink-0 p-4 border rounded-xl shadow-island bg-card hover:border-primary/50 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      {suggestion.title}
                    </h4>
                    <span className="text-xs text-muted-foreground capitalize">
                      {suggestion.type}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-4 flex-1">
                  {suggestion.content}
                </p>

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
                  onClick={() => onInsertClause(suggestion)}
                  size="sm"
                  variant="outline"
                  className="w-full mt-auto"
                >
                  <PlusIcon className="size-3 mr-1" />
                  Insert Clause
                </Button>
              </div>
            ))}

            {suggestions.length === 0 && (
              <div className="w-full flex items-center justify-center text-muted-foreground text-sm">
                No suggestions available
              </div>
            )}
          </div>
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
