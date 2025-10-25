import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

const ConfirmDialog = ({
  isOpen,
  title,
  description,
  handleConfirm,
  destructive,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  handleConfirm: (value: boolean) => void;
  destructive?: boolean;
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleConfirm(false);
        }
      }}
    >
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <p className="text-muted-foreground">{description}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => handleConfirm(true)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const useConfirm = ({
  title,
  description,
  destructive = false,
}: {
  title: string;
  description: string;
  destructive?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const promiseRef = useRef<
    ((value: boolean | PromiseLike<boolean>) => void) | null
  >(null);

  const confirm = () => {
    setIsOpen(true);
    return new Promise((resolve) => {
      promiseRef.current = resolve;
    });
  };

  const handleConfirm = (value: boolean) => {
    setIsOpen(false);
    if (promiseRef.current) {
      promiseRef.current(value);
    } else {
      console.warn("No promise found");
    }
  };

  return {
    confirmDialog: (
      <ConfirmDialog
        isOpen={isOpen}
        handleConfirm={handleConfirm}
        title={title}
        description={description}
        destructive={destructive}
      />
    ),
    confirm,
  };
};
