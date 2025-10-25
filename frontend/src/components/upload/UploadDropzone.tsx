import { useCallback } from "react";
import { motion } from "motion/react";
import { UploadIcon, FileTextIcon } from "lucide-react";

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  dragActive: boolean;
  onDragStateChange: (active: boolean) => void;
}

export default function UploadDropzone({ onFilesSelected, dragActive, onDragStateChange }: UploadDropzoneProps) {
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      onDragStateChange(true);
    } else if (e.type === "dragleave") {
      onDragStateChange(false);
    }
  }, [onDragStateChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStateChange(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) => 
          file.type === "application/pdf" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "text/plain"
      );
      if (newFiles.length > 0) {
        onFilesSelected(newFiles);
      }
    }
  }, [onFilesSelected, onDragStateChange]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      onFilesSelected(newFiles);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-[60vh]"
    >
      <div className="w-full">
        <motion.div
          className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
            dragActive 
              ? "border-primary bg-primary/10 scale-[1.02]" 
              : "border-border hover:border-primary/50 bg-card shadow-island"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div
            className="size-24 mx-auto rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-lg"
          >
            <UploadIcon className="size-12 text-white" strokeWidth={2.5} />
          </div>
          
          <div
          >
            <h2 className="text-2xl font-bold mb-2">Drop your contract here</h2>
            <p className="text-muted-foreground mb-6">
              or click to browse from your computer
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
            />
            <label htmlFor="file-upload" className="inline-block">
              <div
                className="px-8 py-3 bg-primary text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow cursor-pointer inline-block"
              >
                Select Files
              </div>
            </label>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileTextIcon className="size-4" />
                <span>PDF, DOCX, TXT</span>
              </div>
              <span>•</span>
              <span>Max 50MB</span>
            </div>
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
}