import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useConfirm } from "@/components/ui/confirm";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableClause, type Clause } from "./sortable-clause";

interface PolicyFormProps {
  initialPolicyName?: string;
  initialClauses?: Clause[];
  onCancel?: () => void;
  saveButtonText?: string;
}

export function PolicyForm({
  initialPolicyName = "",
  initialClauses = [],
  onCancel = () => {},
  saveButtonText = "Save Policy",
}: PolicyFormProps) {
  const [policyName, setPolicyName] = useState(initialPolicyName);
  const [clauses, setClauses] = useState<Clause[]>([]);

  const prevInitialsRef = useRef({
    policyName: initialPolicyName,
    clausesKey: "",
  });

  const { confirmDialog, confirm } = useConfirm({
    title: "Discard changes?",
    description: "Are you sure you want to discard your changes?",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const clausesKey = JSON.stringify(initialClauses);

    // Only update if initial values actually changed
    if (
      prevInitialsRef.current.policyName !== initialPolicyName ||
      prevInitialsRef.current.clausesKey !== clausesKey
    ) {
      setPolicyName(initialPolicyName);
      setClauses(initialClauses);
      prevInitialsRef.current = {
        policyName: initialPolicyName,
        clausesKey,
      };
    }
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setClauses((items) => {
        const oldIndex = items.findIndex(
          (item) => item.clause_id === active.id
        );
        const newIndex = items.findIndex((item) => item.clause_id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addClause = () => {
    const newClause: Clause = {
      clause_id: `clause-${Date.now()}`,
      title: "",
      text: "",
      mandatory: true,
    };
    setClauses([...clauses, newClause]);
  };

  const deleteClause = (clause_id: string) => {
    setClauses(clauses.filter((c) => c.clause_id !== clause_id));
  };

  const updateClause = (
    clause_id: string,
    field: keyof Clause,
    value: string | boolean
  ) => {
    setClauses(
      clauses.map((c) =>
        c.clause_id === clause_id ? { ...c, [field]: value } : c
      )
    );
  };

  const handleCancel = async () => {
    const shouldCancel = await confirm();
    if (shouldCancel) {
      setPolicyName(initialPolicyName);
      setClauses(initialClauses);
      onCancel();
    }
  };

  return (
    <>
      {confirmDialog}
      <div className="p-6 border rounded-xl shadow-island bg-card min-h-[calc(86vh-6rem)] flex flex-col mb-4">
        <div className="flex flex-col gap-6 flex-1">
          <div>
            <Label className="mb-2 block">Policy Name</Label>
            <Input
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="Enter policy name..."
              className="max-w-md bg-muted!"
            />
          </div>

          <div>
            <Label className="mb-4 block">Clauses</Label>

            {clauses.length === 0 ? (
              <div className="p-4 text-sm text-center">
                <p className="text-muted-foreground">
                  No clauses yet. Click "Add Clause" to get started.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={clauses.map((c) => c.clause_id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {clauses.map((clause, index) => (
                      <SortableClause
                        key={clause.clause_id}
                        clause={clause}
                        index={index}
                        onDelete={deleteClause}
                        onUpdate={updateClause}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <div className="pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={addClause}
                className="gap-2 w-full"
              >
                <Plus className="size-4" />
                Add Clause
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-end">
        <Button size="lg" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="lg">{saveButtonText}</Button>
      </div>
    </>
  );
}
