"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/converter/dropzone";
import { FormatSelector } from "@/components/converter/format-selector";
import { ConversionProgress } from "@/components/converter/conversion-progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeftRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getFileExtension, formatMap } from "@/lib/formats/registry";
import { BrandingBanner } from "@/components/branding-banner";
import { convertFile, getFFmpeg } from "@/lib/ffmpeg/engine";
import { convertImage } from "@/lib/ffmpeg/image-converter";

type Status = "idle" | "loading" | "converting" | "completed" | "error";

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setOutputFormat(null);
    setStatus("idle");
    setProgress(0);
    setOutputUrl(null);
    setOutputBlob(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setOutputFormat(null);
    setStatus("idle");
    setProgress(0);
    setOutputUrl(null);
    setOutputBlob(null);
    setError(null);
  }, [outputUrl]);

  const handleConvert = async () => {
    if (!file || !outputFormat) return;

    try {
      const inputExt = getFileExtension(file.name);
      const inputFormat = formatMap[inputExt];
      const outputFormatInfo = formatMap[outputFormat];

      // Image-to-image conversion uses Canvas API
      if (
        inputFormat?.category === "image" &&
        outputFormatInfo?.category === "image"
      ) {
        setStatus("converting");
        setProgress(50);
        const blob = await convertImage(file, outputFormat);
        const url = URL.createObjectURL(blob);
        setOutputBlob(blob);
        setOutputUrl(url);
        setProgress(100);
        setStatus("completed");
        return;
      }

      // Everything else uses FFmpeg
      setStatus("loading");
      await getFFmpeg();
      setStatus("converting");
      setProgress(0);

      const blob = await convertFile(file, outputFormat, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(blob);
      setOutputBlob(blob);
      setOutputUrl(url);
      setProgress(100);
      setStatus("completed");
    } catch (err) {
      console.error("Conversion error:", err);
      setError(
        err instanceof Error ? err.message : "Conversion failed. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Convert Files</h1>
            <p className="text-muted-foreground text-sm">
              Transform between 100+ video, audio and image formats
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Step 1: File Upload */}
        <Dropzone
          onFileSelect={handleFileSelect}
          selectedFile={file}
          onClear={handleClear}
        />

        {/* Step 2: Format Selection */}
        {file && status !== "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FormatSelector
              inputFile={file}
              selectedFormat={outputFormat}
              onFormatSelect={setOutputFormat}
            />
          </motion.div>
        )}

        {/* Convert Button */}
        {file && outputFormat && status === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              size="lg"
              className="w-full gap-2 text-base h-12"
              onClick={handleConvert}
            >
              <Zap className="h-4 w-4" />
              Convert to {outputFormat.toUpperCase()}
            </Button>
          </motion.div>
        )}

        {/* Progress / Result */}
        <ConversionProgress
          status={status}
          progress={progress}
          outputUrl={outputUrl}
          outputBlob={outputBlob}
          outputFormat={outputFormat || undefined}
          fileName={file?.name}
          error={error}
          onReset={handleClear}
        />

        {/* Privacy notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
          <Shield className="h-3.5 w-3.5 text-green-500" />
          Your files are processed locally and never uploaded to any server.
        </div>

        <BrandingBanner />
      </div>
    </div>
  );
}
