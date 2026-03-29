"use client";

import { useCallback, useState } from "react";
import { Upload, FileIcon, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatFileSize, getFileExtension, formatMap, allFormats } from "@/lib/formats/registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormatCategory } from "@/types/formats";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  accept?: string;
  allowedCategories?: FormatCategory[];
  description?: string;
}

function detectFormatFromMime(file: File): string | null {
  const mimeType = file.type;
  if (!mimeType) return null;
  const match = allFormats.find((f) => f.mimeType === mimeType);
  return match ? match.extension : null;
}

function validateFile(
  file: File,
  allowedCategories?: FormatCategory[]
): { valid: boolean; error?: string; detectedExt?: string } {
  // Try to detect actual format from MIME type (handles renamed extensions)
  const mimeExt = detectFormatFromMime(file);
  const nameExt = getFileExtension(file.name);
  const ext = mimeExt || nameExt;

  const format = formatMap[ext];

  if (!format) {
    return {
      valid: false,
      error: `Unsupported format: .${nameExt}. Please upload a supported file.`,
    };
  }

  if (allowedCategories && !allowedCategories.includes(format.category)) {
    const allowed = allowedCategories.join(" or ");
    return {
      valid: false,
      error: `Only ${allowed} files are supported here. You uploaded a ${format.category} file.`,
    };
  }

  return { valid: true, detectedExt: ext };
}

function buildAcceptString(allowedCategories?: FormatCategory[]): string {
  const formats = allowedCategories
    ? allFormats.filter((f) => allowedCategories.includes(f.category))
    : allFormats;

  const mimes = [...new Set(formats.map((f) => f.mimeType))];
  const exts = formats.map((f) => `.${f.extension}`);
  return [...mimes, ...exts].join(",");
}

function getSupportedFormatsText(allowedCategories?: FormatCategory[]): string[] {
  const categories = allowedCategories || (["video", "audio", "image"] as FormatCategory[]);
  const lines: string[] = [];

  for (const cat of categories) {
    const formats = allFormats
      .filter((f) => f.category === cat)
      .map((f) => f.label);
    const unique = [...new Set(formats)];
    if (unique.length > 0) {
      lines.push(`${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${unique.join(", ")}`);
    }
  }
  return lines;
}

export function Dropzone({
  onFileSelect,
  selectedFile,
  onClear,
  accept,
  allowedCategories,
  description,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const effectiveAccept = accept || buildAcceptString(allowedCategories);
  const supportedFormats = getSupportedFormatsText(allowedCategories);

  const trySelectFile = useCallback(
    (file: File) => {
      setValidationError(null);
      const result = validateFile(file, allowedCategories);
      if (!result.valid) {
        setValidationError(result.error || "Unsupported file");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect, allowedCategories]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) trySelectFile(file);
    },
    [trySelectFile]
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
    input.accept = effectiveAccept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) trySelectFile(file);
    };
    input.click();
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const file = e.clipboardData.files[0];
      if (file) trySelectFile(file);
    },
    [trySelectFile]
  );

  if (selectedFile) {
    const mimeExt = detectFormatFromMime(selectedFile);
    const nameExt = getFileExtension(selectedFile.name);
    const ext = mimeExt || nameExt;
    const format = formatMap[ext];
    const isRenamed = mimeExt && mimeExt !== nameExt;

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
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </span>
            {format && (
              <Badge variant="secondary" className="text-xs">
                {format.label}
              </Badge>
            )}
            {isRenamed && (
              <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                Detected as .{mimeExt} (renamed)
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
    <div className="space-y-3">
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
                {isDragOver
                  ? "Drop your file here"
                  : description || "Drop a file or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You can also paste from clipboard.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Validation error */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
        >
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{validationError}</p>
        </motion.div>
      )}

      {/* Supported formats */}
      <div className="rounded-lg bg-muted/50 px-4 py-3 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Supported formats:</p>
        {supportedFormats.map((line) => (
          <p key={line} className="text-xs text-muted-foreground">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
