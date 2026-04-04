"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ConversionProgress } from "@/components/converter/conversion-progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Merge, Upload, X, GripVertical, FileIcon, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getFileExtension,
  formatMap,
  formatFileSize,
  allFormats,
} from "@/lib/formats/registry";
import { mergeFiles, getFFmpeg } from "@/lib/ffmpeg/engine";
import { BrandingBanner } from "@/components/branding-banner";

type Status = "idle" | "loading" | "converting" | "completed" | "error";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []).filter((f) => {
        const ext = getFileExtension(f.name);
        const mimeMatch = allFormats.find((fmt) => fmt.mimeType === f.type);
        const format = formatMap[mimeMatch?.extension || ext];
        return (
          format &&
          (format.category === "video" || format.category === "audio")
        );
      });
      setFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = useCallback(() => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setOutputUrl(null);
    setOutputBlob(null);
    setError(null);
  }, [outputUrl]);

  const handleMerge = async () => {
    if (files.length < 2) return;

    try {
      setStatus("loading");
      await getFFmpeg();
      setStatus("converting");
      setProgress(0);

      const blob = await mergeFiles(files, (p) => setProgress(p));

      const url = URL.createObjectURL(blob);
      setOutputBlob(blob);
      setOutputUrl(url);
      setProgress(100);
      setStatus("completed");
    } catch (err) {
      console.error("Merge error:", err);
      setError(err instanceof Error ? err.message : "Merge failed.");
      setStatus("error");
    }
  };

  const outputExt =
    files.length > 0 ? getFileExtension(files[0].name) : "";
  const outputFormat = formatMap[outputExt];
  const isVideo = outputFormat?.category === "video";

  // Check if all files have the same extension
  const hasMixedFormats = useMemo(() => {
    if (files.length < 2) return false;
    const firstExt = getFileExtension(files[0].name);
    return files.some((f) => getFileExtension(f.name) !== firstExt);
  }, [files]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Merge className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Merge Files</h1>
            <p className="text-muted-foreground text-sm">
              Combine multiple audio or video files into one
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* File list */}
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Files to merge</p>
            <Badge variant="secondary">{files.length} files</Badge>
          </div>

          <AnimatePresence>
            {files.map((f, i) => (
              <motion.div
                key={`${f.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(f.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => removeFile(i)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add files</span>
            <input
              type="file"
              multiple
              accept="video/*,audio/*,.mp4,.mkv,.avi,.mov,.webm,.flv,.ogv,.m4v,.3gp,.mpeg,.wmv,.ts,.mp3,.wav,.aac,.ogg,.flac,.m4a,.wma,.aiff,.opus,.weba,.amr,.ac3"
              className="hidden"
              onChange={addFiles}
            />
          </label>

          <div className="rounded-lg bg-muted/50 px-4 py-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Supported formats (video & audio only):
            </p>
            <p className="text-xs text-muted-foreground">
              Video: MP4, MKV, AVI, MOV, WebM, FLV, OGV, WMV, 3GP, MPEG, TS,
              M4V
            </p>
            <p className="text-xs text-muted-foreground">
              Audio: MP3, WAV, AAC, OGG, FLAC, M4A, WMA, AIFF, OPUS, WEBA,
              AMR, AC3
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Files should be the same format for best results. They will be
            merged in the order shown above.
          </p>
        </div>

        {/* Format mismatch warning */}
        {hasMixedFormats && files.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Different formats detected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All files must be the same format for merging to work. Please convert your files to a single format first.
                </p>
              </div>
            </div>
            <Link href="/convert">
              <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                Go to Convert
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>
        )}

        {files.length >= 2 && status === "idle" && !hasMixedFormats && (
          <Button
            size="lg"
            className="w-full gap-2 text-base h-12"
            onClick={handleMerge}
          >
            <Merge className="h-4 w-4" />
            Merge {files.length} Files
          </Button>
        )}

        <ConversionProgress
          status={status}
          progress={progress}
          outputUrl={outputUrl}
          outputBlob={outputBlob}
          outputFormat={outputExt}
          fileName={`merged.${outputExt}`}
          error={error}
          onReset={handleClear}
        />

        {/* Output Preview */}
        {status === "completed" && outputUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Output Preview
              </p>
              {outputBlob && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(outputBlob.size)}
                </p>
              )}
            </div>
            {isVideo ? (
              <video
                src={outputUrl}
                controls
                className="w-full rounded-lg max-h-[300px]"
              />
            ) : (
              <audio src={outputUrl} controls className="w-full" />
            )}
          </motion.div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
          <Shield className="h-3.5 w-3.5 text-green-500" />
          Your files are processed locally and never uploaded to any server.
        </div>

        <BrandingBanner />
      </div>
    </div>
  );
}
