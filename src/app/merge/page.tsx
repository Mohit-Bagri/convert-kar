"use client";

import { useState, useCallback } from "react";
import { ConversionProgress } from "@/components/converter/conversion-progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Merge, Upload, X, GripVertical, FileIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFileExtension, formatMap, formatFileSize, allFormats } from "@/lib/formats/registry";
import { getFFmpeg } from "@/lib/ffmpeg/engine";
import { fetchFile } from "@ffmpeg/util";

type Status = "idle" | "loading" | "converting" | "completed" | "error";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).filter((f) => {
      const ext = getFileExtension(f.name);
      const mimeMatch = allFormats.find((fmt) => fmt.mimeType === f.type);
      const format = formatMap[mimeMatch?.extension || ext];
      return format && (format.category === "video" || format.category === "audio");
    });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

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
      const ffmpeg = await getFFmpeg();
      setStatus("converting");
      setProgress(0);

      // Write all files
      const fileList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const ext = getFileExtension(files[i].name);
        const name = `input_${i}.${ext}`;
        await ffmpeg.writeFile(name, await fetchFile(files[i]));
        fileList.push(`file '${name}'`);
        setProgress(Math.round(((i + 1) / files.length) * 30));
      }

      // Write concat list
      await ffmpeg.writeFile(
        "filelist.txt",
        new TextEncoder().encode(fileList.join("\n"))
      );

      const outputExt = getFileExtension(files[0].name);
      const outputName = `merged.${outputExt}`;

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(30 + Math.round(p * 70));
      });

      await ffmpeg.exec([
        "-f", "concat",
        "-safe", "0",
        "-i", "filelist.txt",
        "-c", "copy",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);

      // Cleanup
      for (let i = 0; i < files.length; i++) {
        const ext = getFileExtension(files[i].name);
        await ffmpeg.deleteFile(`input_${i}.${ext}`);
      }
      await ffmpeg.deleteFile("filelist.txt");
      await ffmpeg.deleteFile(outputName);

      const mimeType = formatMap[outputExt]?.mimeType || "application/octet-stream";
      const blob = new Blob([data as BlobPart], { type: mimeType });
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

  const outputExt = files.length > 0 ? getFileExtension(files[0].name) : "";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
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
      </motion.div>

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
            <span className="text-sm text-muted-foreground">
              Add files
            </span>
            <input
              type="file"
              multiple
              accept="video/*,audio/*,.mp4,.mkv,.avi,.mov,.webm,.flv,.ogv,.m4v,.3gp,.mpeg,.wmv,.ts,.mp3,.wav,.aac,.ogg,.flac,.m4a,.wma,.aiff,.opus,.weba,.amr,.ac3"
              className="hidden"
              onChange={addFiles}
            />
          </label>

          <div className="rounded-lg bg-muted/50 px-4 py-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Supported formats (video & audio only):</p>
            <p className="text-xs text-muted-foreground">Video: MP4, MKV, AVI, MOV, WebM, FLV, OGV, WMV, 3GP, MPEG, TS, M4V</p>
            <p className="text-xs text-muted-foreground">Audio: MP3, WAV, AAC, OGG, FLAC, M4A, WMA, AIFF, OPUS, WEBA, AMR, AC3</p>
          </div>

          <p className="text-xs text-muted-foreground">
            Files should be the same format for best results. They will be merged in the order shown above.
          </p>
        </div>

        {files.length >= 2 && status === "idle" && (
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

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
          <Shield className="h-3.5 w-3.5 text-green-500" />
          Your files are processed locally and never uploaded to any server.
        </div>
      </div>
    </div>
  );
}
