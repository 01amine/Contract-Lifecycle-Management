import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface Clause {
  clause_id: string;
  title: string;
  text: string;
  mandatory: boolean;
}

interface SortableClauseProps {
  clause: Clause;
  index: number;
  onDelete: (clause_id: string) => void;
  onUpdate: (
    clause_id: string,
    field: keyof Clause,
    value: string | boolean
  ) => void;
}

export function SortableClause({
  clause,
  index,
  onDelete,
  onUpdate,
}: SortableClauseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: clause.clause_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg bg-card hover:border-primary/50 transition-colors overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center shrink-0">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            >
              <GripVertical className="size-5" />
            </button>
            <span className="text-sm font-bold font-title text-muted-foreground w-6">
              {index + 1}.
            </span>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Clause Title
              </Label>
              <Input
                value={clause.title}
                onChange={(e) =>
                  onUpdate(clause.clause_id, "title", e.target.value)
                }
                placeholder="Enter clause title..."
                className="text-sm bg-muted!"
              />
            </div>
            <InputGroup className="bg-muted!">
              <InputGroupTextarea
                value={clause.text}
                onChange={(e) =>
                  onUpdate(clause.clause_id, "text", e.target.value)
                }
                placeholder="Enter clause description..."
                className="min-h-12 max-h-48"
              />
              <InputGroupAddon align="block-end">
                <div className="flex items-center gap-4 justify-between w-full">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <Checkbox
                      checked={clause.mandatory}
                      onCheckedChange={(checked) =>
                        onUpdate(
                          clause.clause_id,
                          "mandatory",
                          checked === true
                        )
                      }
                    />
                    <span className="text-muted-foreground whitespace-nowrap">
                      Mandatory
                    </span>
                  </label>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {clause.text.trim().split(/\s+/).filter(Boolean).length}{" "}
                    words
                  </span>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <button
            onClick={() => onDelete(clause.clause_id)}
            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
