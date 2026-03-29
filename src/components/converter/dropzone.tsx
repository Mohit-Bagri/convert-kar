"use client";

import { useCallback, useState } from "react";
import { Upload, FileIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatFileSize, getFileExtension, formatMap } from "@/lib/formats/registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  accept?: string;
}

export function Dropzone({ onFileSelect, selectedFile, onClear, accept }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    if (accept) input.accept = accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const file = e.clipboardData.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  if (selectedFile) {
    const ext = getFileExtension(selectedFile.name);
    const format = formatMap[ext];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex items-center gap-4 rounded-xl border-2 border-primary/30 bg-primary/5 p-6"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileIcon className="h-7 w-7" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{selectedFile.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </span>
            {format && (
              <Badge variant="secondary" className="text-xs">
                {format.label}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-8 w-8 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onPaste={handlePaste}
      onClick={handleClick}
      tabIndex={0}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200",
        isDragOver
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDragOver ? "drop" : "upload"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
              isDragOver
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Upload className="h-7 w-7" />
          </div>
          <div className="text-center">
            <p className="font-medium text-lg">
              {isDragOver ? "Drop your file here" : "Drop a file or click to upload"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports video, audio, and image files. You can also paste from clipboard.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
