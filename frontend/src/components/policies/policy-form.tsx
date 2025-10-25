import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Loader2,
  CheckCircle,
  Circle,
  Archive,
  Trash2,
} from "lucide-react";
import { useConfirm } from "@/components/ui/confirm";
import { toast } from "sonner";
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
import {
  useCreatePolicy,
  useUpdatePolicy,
  useDeletePolicy,
} from "@/actions/hooks/use-policies";
import type { PolicyCreate, PolicyUpdate } from "@/actions/policies";
import { PolicyStatus } from "@/actions/policies";

interface PolicyFormProps {
  // For new policy
  isNew?: boolean;
  // For editing policy
  policyId?: string;
  initialPolicyName?: string;
  initialCountry?: string;
  initialPolicyType?: string;
  initialDescription?: string;
  initialClauses?: Clause[];
  initialCreatedBy?: string;
  initialStatus?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  onDelete?: () => void;
  saveButtonText?: string;
}

const COUNTRIES = [
  "Qatar",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
];

const POLICY_TYPES = [
  "Privacy",
  "Security",
  "Data Protection",
  "Acceptable Use",
  "Terms of Service",
  "GDPR Compliance",
  "HIPAA Compliance",
  "Vendor Management",
  "IT Security",
  "Risk Management",
];

export function PolicyForm({
  isNew = false,
  policyId,
  initialPolicyName = "",
  initialCountry = "",
  initialPolicyType = "",
  initialDescription = "",
  initialClauses = [],
  initialCreatedBy = "",
  initialStatus = "",
  onCancel = () => {},
  onSuccess = () => {},
  saveButtonText = "Save Policy",
}: PolicyFormProps) {
  const [policyName, setPolicyName] = useState(initialPolicyName);
  const [country, setCountry] = useState(initialCountry);
  const [policyType, setPolicyType] = useState(initialPolicyType);
  const [description, setDescription] = useState(initialDescription);
  const [createdBy, setCreatedBy] = useState(initialCreatedBy);
  const [status, setStatus] = useState<string>(
    initialStatus || PolicyStatus.DRAFT
  );
  const [clauses, setClauses] = useState<Clause[]>([]);

  const createPolicy = useCreatePolicy();
  const updatePolicy = useUpdatePolicy();
  const deletePolicy = useDeletePolicy();

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
      setCountry(initialCountry);
      setPolicyType(initialPolicyType);
      setDescription(initialDescription);
      setCreatedBy(initialCreatedBy);
      setClauses(initialClauses);
      prevInitialsRef.current = {
        policyName: initialPolicyName,
        clausesKey,
      };
    }
  }, [
    initialPolicyName,
    initialCountry,
    initialPolicyType,
    initialDescription,
    initialCreatedBy,
    initialClauses,
  ]);

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
      setCountry(initialCountry);
      setPolicyType(initialPolicyType);
      setDescription(initialDescription);
      setCreatedBy(initialCreatedBy);
      setClauses(initialClauses);
      onCancel();
    }
  };

  const handleSave = async () => {
    if (!policyName.trim()) {
      toast.error("Please enter a policy name");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (isNew) {
      if (!country.trim() || !policyType.trim() || !createdBy.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }

      const newPolicy: PolicyCreate = {
        name: policyName,
        country,
        policy_type: policyType,
        description,
        clauses,
        created_by: createdBy,
        status: status as PolicyStatus,
      };

      try {
        await createPolicy.mutateAsync(newPolicy);
        toast.success("Policy created successfully");
        onSuccess();
      } catch (error) {
        toast.error("Failed to create policy");
      }
    } else if (policyId) {
      const updateData: PolicyUpdate = {
        name: policyName,
        description,
        clauses,
        status: status as PolicyStatus,
      };

      try {
        await updatePolicy.mutateAsync({ id: policyId, data: updateData });
        toast.success("Policy updated successfully");
        onSuccess();
      } catch (error) {
        toast.error("Failed to update policy");
      }
    }
  };

  const isLoading =
    createPolicy.isPending || updatePolicy.isPending || deletePolicy.isPending;

  return (
    <>
      {confirmDialog}
      <div className="p-6 border rounded-xl shadow-island bg-card min-h-[calc(86vh-6rem)] flex flex-col mb-4">
        <div className="flex flex-col gap-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Policy Name *</Label>
              <Input
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                placeholder="Enter policy name..."
                className="bg-muted!"
                disabled={isLoading}
              />
            </div>

            {isNew ? (
              <>
                <div>
                  <Label className="mb-2 block">Country *</Label>
                  <Select
                    value={country}
                    onValueChange={setCountry}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full bg-muted!">
                      <SelectValue placeholder="Select country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Policy Type *</Label>
                  <Select
                    value={policyType}
                    onValueChange={setPolicyType}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full bg-muted!">
                      <SelectValue placeholder="Select policy type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {POLICY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Created By *</Label>
                  <Input
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    placeholder="Your name or email"
                    className="bg-muted!"
                    disabled={isLoading}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="mb-2 block">Country</Label>
                  <Input
                    value={country}
                    disabled
                    className="bg-muted opacity-60"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Policy Type</Label>
                  <Input
                    value={policyType}
                    disabled
                    className="bg-muted opacity-60"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Created By</Label>
                  <Input
                    value={createdBy}
                    disabled
                    className="bg-muted opacity-60"
                  />
                </div>
                {!isNew && (
                  <div className="col-span-full">
                    <Label className="mb-2 block">Status</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStatus(PolicyStatus.DRAFT)}
                        disabled={isLoading}
                        className={`flex gap-4 flex-1 p-3 rounded-sm border-2 transition-all shadow-island ${
                          status === PolicyStatus.DRAFT
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Circle
                          className={`size-5 ${
                            status === PolicyStatus.DRAFT
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">Draft</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(PolicyStatus.ACTIVE)}
                        disabled={isLoading}
                        className={`flex gap-4 flex-1 p-3 rounded-sm border-2 transition-all shadow-island ${
                          status === PolicyStatus.ACTIVE
                            ? "border-green-500 bg-green-500/10"
                            : "border-border hover:border-green-500/50"
                        }`}
                      >
                        <CheckCircle
                          className={`size-5 ${
                            status === PolicyStatus.ACTIVE
                              ? "text-green-500"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">Active</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(PolicyStatus.ARCHIVED)}
                        disabled={isLoading}
                        className={`flex gap-4 flex-1 p-3 rounded-sm border-2 transition-all shadow-island ${
                          status === PolicyStatus.ARCHIVED
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-border hover:border-amber-500/50"
                        }`}
                      >
                        <Archive
                          className={`size-5 ${
                            status === PolicyStatus.ARCHIVED
                              ? "text-amber-500"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">Archived</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(PolicyStatus.DELETED)}
                        disabled={isLoading}
                        className={`flex gap-4 flex-1 p-3 rounded-sm border-2 transition-all shadow-island ${
                          status === PolicyStatus.DELETED
                            ? "border-red-500 bg-red-500/10"
                            : "border-border hover:border-red-500/50"
                        }`}
                      >
                        <Trash2
                          className={`size-5 ${
                            status === PolicyStatus.DELETED
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">Deleted</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Description *</Label>
            <InputGroup className="bg-muted!">
              <InputGroupTextarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter policy description..."
                rows={3}
                disabled={isLoading}
                required
              />
              <InputGroupAddon align="block-end">
                <span className="text-xs text-muted-foreground whitespace-nowrap ms-auto">
                  {description.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </InputGroupAddon>
            </InputGroup>
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
                disabled={isLoading}
              >
                <Plus className="size-4" />
                Add Clause
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-end">
        <Button
          size="lg"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button size="lg" onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            saveButtonText
          )}
        </Button>
      </div>
    </>
  );
}
