import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";
import { mockTemplates } from "@/lib/mocks";

interface TemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateDialog({
  isOpen,
  onOpenChange,
  onSelectTemplate,
}: TemplateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Select a Template</DialogTitle>
        <div className="space-y-2">
          {mockTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelectTemplate(template.id)}
            >
              <HistoryIcon className="size-4" />
              {template.name}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
