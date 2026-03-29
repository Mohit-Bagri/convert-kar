"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/converter/dropzone";
import { ConversionProgress } from "@/components/converter/conversion-progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Shield, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatFileSize, getFileExtension, formatMap } from "@/lib/formats/registry";
import { compressImage } from "@/lib/ffmpeg/image-converter";
import { convertFile, getFFmpeg } from "@/lib/ffmpeg/engine";

type Status = "idle" | "loading" | "converting" | "completed" | "error";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setStatus("idle");
    setProgress(0);
    setOutputUrl(null);
    setOutputBlob(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setOutputUrl(null);
    setOutputBlob(null);
    setError(null);
  }, [outputUrl]);

  const handleCompress = async () => {
    if (!file) return;

    try {
      const ext = getFileExtension(file.name);
      const format = formatMap[ext];

      if (format?.category === "image") {
        setStatus("converting");
        setProgress(50);
        const blob = await compressImage(file, quality / 100);
        const url = URL.createObjectURL(blob);
        setOutputBlob(blob);
        setOutputUrl(url);
        setProgress(100);
        setStatus("completed");
      } else if (format?.category === "video") {
        setStatus("loading");
        await getFFmpeg();
        setStatus("converting");
        setProgress(0);
        // Re-encode with lower bitrate for compression
        const blob = await convertFile(file, ext, (p) => setProgress(p));
        const url = URL.createObjectURL(blob);
        setOutputBlob(blob);
        setOutputUrl(url);
        setProgress(100);
        setStatus("completed");
      } else if (format?.category === "audio") {
        setStatus("loading");
        await getFFmpeg();
        setStatus("converting");
        setProgress(0);
        const blob = await convertFile(file, "mp3", (p) => setProgress(p));
        const url = URL.createObjectURL(blob);
        setOutputBlob(blob);
        setOutputUrl(url);
        setProgress(100);
        setStatus("completed");
      } else {
        setError("Unsupported file format for compression.");
        setStatus("error");
      }
    } catch (err) {
      console.error("Compression error:", err);
      setError(err instanceof Error ? err.message : "Compression failed.");
      setStatus("error");
    }
  };

  const ext = file ? getFileExtension(file.name) : "";
  const outputExt = formatMap[ext]?.category === "audio" ? "mp3" : ext;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
            <Minimize2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Compress Files</h1>
            <p className="text-muted-foreground text-sm">
              Reduce file sizes while maintaining quality
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <Dropzone
          onFileSelect={handleFileSelect}
          selectedFile={file}
          onClear={handleClear}
        />

        {file && status === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quality slider for images */}
            {formatMap[ext]?.category === "image" && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Quality</p>
                  <Badge variant="secondary">{quality}%</Badge>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={(v) => setQuality(v[0])}
                  min={10}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  Lower quality = smaller file size. 70% is a good balance.
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full gap-2 text-base h-12"
              onClick={handleCompress}
            >
              <Minimize2 className="h-4 w-4" />
              Compress File
            </Button>
          </motion.div>
        )}

        <ConversionProgress
          status={status}
          progress={progress}
          outputUrl={outputUrl}
          outputBlob={outputBlob}
          outputFormat={outputExt}
          fileName={file?.name}
          error={error}
          onReset={handleClear}
        />

        {status === "completed" && file && outputBlob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border bg-card p-6"
          >
            <p className="font-medium mb-3">Compression Results</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Original</p>
                <p className="font-semibold">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Compressed</p>
                <p className="font-semibold">{formatFileSize(outputBlob.size)}</p>
              </div>
            </div>
            {outputBlob.size < file.size && (
              <p className="text-sm text-green-500 mt-3">
                Reduced by {Math.round((1 - outputBlob.size / file.size) * 100)}%
              </p>
            )}
          </motion.div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
          <Shield className="h-3.5 w-3.5 text-green-500" />
          Your files are processed locally and never uploaded to any server.
        </div>
      </div>
    </div>
  );
}
