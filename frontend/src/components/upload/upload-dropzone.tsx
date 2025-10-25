import { useCallback, useRef } from "react";
import { motion } from "motion/react";
import { UploadIcon, FileTextIcon, XIcon, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  dragActive: boolean;
  onDragStateChange: (active: boolean) => void;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
}

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function UploadDropzone({
  onFilesSelected,
  dragActive,
  onDragStateChange,
  selectedFiles = [],
  onRemoveFile,
}: UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    return files.filter((file) => {
      // Check file type
      const isValidType = Object.keys(ACCEPTED_FILE_TYPES).includes(file.type);
      if (!isValidType) {
        return false;
      }
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return false;
      }
      return true;
    });
  };

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        onDragStateChange(true);
      } else if (e.type === "dragleave") {
        onDragStateChange(false);
      }
    },
    [onDragStateChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragStateChange(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const validFiles = validateFiles(files);
        if (validFiles.length > 0) {
          onFilesSelected(validFiles);
        }
      }
    },
    [onFilesSelected, onDragStateChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="w-full">
        <motion.div
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-all",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 bg-card shadow-island"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="size-20 mx-auto rounded-full bg-primary flex items-center justify-center mb-6 shadow-island">
            <UploadIcon className="size-10 text-white" strokeWidth={2.5} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Drop your contract here</h2>
            <p className="text-muted-foreground mb-6">
              or click to browse from your computer
            </p>

            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
            />

            <Button onClick={handleSelectClick} size="lg">
              Select Files
            </Button>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileTextIcon className="size-4" />
                <span>PDF, DOCX, TXT</span>
              </div>
              <span>•</span>
              <span>Max 50MB</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h3 className="text-sm font-medium text-foreground">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-3 border rounded-lg bg-card shadow-island"
              >
                <Folder className="size-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {onRemoveFile && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemoveFile(index)}
                    className="shrink-0"
                  >
                    <XIcon className="size-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
