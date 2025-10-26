import { ListIcon } from "lucide-react";
import { ClauseItem } from "./clause-item";

interface Clause {
  clause_id?: string;
  text?: string;
  content?: string;
  heading?: string;
  level?: number;
  type?: string;
  confidence?: number;
}

interface ClauseListProps {
  clauses: Clause[];
}

export function ClauseList({ clauses }: ClauseListProps) {
  if (!clauses || clauses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ListIcon className="size-12 mx-auto mb-4 opacity-50" />
        <p>No clauses extracted yet</p>
        <p className="text-xs mt-2">
          Clauses will appear here after processing
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clauses.map((clause, index) => (
        <ClauseItem
          key={clause.clause_id || index}
          clause={clause}
          index={index}
        />
      ))}
    </div>
  );
}
