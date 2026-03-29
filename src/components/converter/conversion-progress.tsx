"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Check, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatFileSize } from "@/lib/formats/registry";
import { cn } from "@/lib/utils";

interface ConversionProgressProps {
  status: "idle" | "loading" | "converting" | "completed" | "error";
  progress: number;
  outputUrl?: string | null;
  outputBlob?: Blob | null;
  outputFormat?: string;
  fileName?: string;
  error?: string | null;
  onReset: () => void;
}

export function ConversionProgress({
  status,
  progress,
  outputUrl,
  outputBlob,
  outputFormat,
  fileName,
  error,
  onReset,
}: ConversionProgressProps) {
  if (status === "idle") return null;

  const handleDownload = () => {
    if (!outputUrl || !fileName || !outputFormat) return;
    const a = document.createElement("a");
    a.href = outputUrl;
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}.${outputFormat}`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card p-6"
    >
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <p className="font-medium">Loading FFmpeg engine...</p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a moment on first use (~31MB download)
            </p>
          </div>
        </div>
      )}

      {status === "converting" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Converting...</p>
              <p className="text-sm text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {status === "completed" && outputUrl && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <Check className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Conversion complete!</p>
              {outputBlob && (
                <p className="text-sm text-muted-foreground">
                  Output size: {formatFileSize(outputBlob.size)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleDownload} className="gap-2 flex-1">
              <Download className="h-4 w-4" />
              Download .{outputFormat?.toUpperCase()}
            </Button>
            <Button variant="outline" onClick={onReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Convert Another
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Conversion failed</p>
              <p className="text-sm text-muted-foreground">
                {error || "An unexpected error occurred. Please try again."}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </motion.div>
  );
}
