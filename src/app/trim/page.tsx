"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { Dropzone } from "@/components/converter/dropzone";
import { ConversionProgress } from "@/components/converter/conversion-progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Shield, Scissors } from "lucide-react";
import { motion } from "framer-motion";
import { getFileExtension, formatMap, formatFileSize } from "@/lib/formats/registry";
import { trimFile, getFFmpeg } from "@/lib/ffmpeg/engine";

type Status = "idle" | "loading" | "converting" | "completed" | "error";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function TrimPage() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState<[number, number]>([0, 100]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setStatus("idle");
    setProgress(0);
    setOutputUrl(null);
    setOutputBlob(null);
    setError(null);
    setRange([0, 100]);
    setDuration(0);
  }, []);

  const handleClear = useCallback(() => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setDuration(0);
    setRange([0, 100]);
    setStatus("idle");
    setProgress(0);
    setOutputUrl(null);
    setOutputBlob(null);
    setError(null);
  }, [outputUrl]);

  const ext = file ? getFileExtension(file.name) : "";
  const format = formatMap[ext];
  const isVideo = format?.category === "video";
  const isAudio = format?.category === "audio";
  const isMediaFile = isVideo || isAudio;

  const startTime = (range[0] / 100) * duration;
  const endTime = (range[1] / 100) * duration;
  const trimDuration = endTime - startTime;

  const handleLoadedMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>
  ) => {
    const d = e.currentTarget.duration;
    if (isFinite(d)) setDuration(d);
  };

  const handleTrim = async () => {
    if (!file || !isMediaFile || !format) return;

    try {
      setStatus("loading");
      await getFFmpeg();
      setStatus("converting");
      setProgress(0);

      const blob = await trimFile(
        file,
        startTime,
        trimDuration,
        ext,
        format.mimeType,
        (p) => setProgress(p)
      );

      const url = URL.createObjectURL(blob);
      setOutputBlob(blob);
      setOutputUrl(url);
      setProgress(100);
      setStatus("completed");
    } catch (err) {
      console.error("Trim error:", err);
      setError(err instanceof Error ? err.message : "Trimming failed.");
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Trim Media</h1>
            <p className="text-muted-foreground text-sm">
              Cut video or audio files to any length
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <Dropzone
          onFileSelect={handleFileSelect}
          selectedFile={file}
          onClear={handleClear}
          allowedCategories={["video", "audio"]}
          description="Drop a video or audio file to trim"
        />

        {file && isMediaFile && (status === "idle" || status === "completed") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Input Preview */}
            {status === "idle" && fileUrl && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Input Preview
                </p>
                {isVideo ? (
                  <video
                    src={fileUrl}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls
                    className="w-full rounded-lg max-h-[300px]"
                  />
                ) : (
                  <audio
                    src={fileUrl}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls
                    className="w-full"
                  />
                )}

                {duration > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Start:{" "}
                        <span className="font-mono font-medium text-foreground">
                          {formatTime(startTime)}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        End:{" "}
                        <span className="font-mono font-medium text-foreground">
                          {formatTime(endTime)}
                        </span>
                      </span>
                    </div>
                    <Slider
                      value={range}
                      onValueChange={(v) => setRange(v as [number, number])}
                      min={0}
                      max={100}
                      step={0.1}
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Output duration: {formatTime(trimDuration)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {status === "idle" && (
              <Button
                size="lg"
                className="w-full gap-2 text-base h-12"
                onClick={handleTrim}
                disabled={duration === 0}
              >
                <Scissors className="h-4 w-4" />
                Trim {isVideo ? "Video" : "Audio"}
              </Button>
            )}
          </motion.div>
        )}

        <ConversionProgress
          status={status}
          progress={progress}
          outputUrl={outputUrl}
          outputBlob={outputBlob}
          outputFormat={ext}
          fileName={file?.name}
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
      </div>
    </div>
  );
}
