interface Clause {
  clause_id?: string;
  text?: string;
  content?: string;
  heading?: string;
  level?: number;
  type?: string;
  confidence?: number;
}

interface ClauseItemProps {
  clause: Clause;
  index: number;
}

export function ClauseItem({ clause, index }: ClauseItemProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-title text-muted-foreground font-bold">
            #{index + 1} {clause.heading}
          </span>
          {clause.type && (
            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
              {clause.type}
            </span>
          )}
        </div>
        {clause.confidence && (
          <span className="text-xs text-muted-foreground">
            Confidence: {(clause.confidence * 100).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-sm whitespace-pre-wrap">
        {clause.content || clause.text || JSON.stringify(clause)}
      </p>
    </div>
  );
}
