"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<void> | null = null;

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  if (loadPromise) {
    await loadPromise;
    return ffmpegInstance!;
  }

  ffmpegInstance = new FFmpeg();

  loadPromise = (async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

    await ffmpegInstance!.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });
  })();

  await loadPromise;
  return ffmpegInstance!;
}

export async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function convertFile(
  file: File,
  outputFormat: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();

  const inputName = `input.${file.name.split(".").pop()}`;
  const outputName = `output.${outputFormat}`;

  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => {
      onProgress(Math.round(Math.min(progress * 100, 100)));
    });
  }

  const data = await fileToUint8Array(file);
  await ffmpeg.writeFile(inputName, data);

  const args = buildFFmpegArgs(inputName, outputName, outputFormat);
  await ffmpeg.exec(args);

  const output = await ffmpeg.readFile(outputName);

  try {
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch {
    // ignore cleanup errors
  }

  const mimeType = getMimeType(outputFormat);
  return new Blob([output as BlobPart], { type: mimeType });
}

export async function trimFile(
  file: File,
  startSeconds: number,
  durationSeconds: number,
  ext: string,
  mimeType: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();

  const inputName = `input.${ext}`;
  const outputName = `output.${ext}`;

  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => {
      onProgress(Math.round(Math.min(progress * 100, 100)));
    });
  }

  const data = await fileToUint8Array(file);
  await ffmpeg.writeFile(inputName, data);

  await ffmpeg.exec([
    "-i",
    inputName,
    "-ss",
    String(startSeconds),
    "-t",
    String(durationSeconds),
    "-c",
    "copy",
    outputName,
  ]);

  const output = await ffmpeg.readFile(outputName);

  try {
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch {
    // ignore cleanup errors
  }

  return new Blob([output as BlobPart], { type: mimeType });
}

export async function mergeFiles(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();

  const fileList: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const ext = files[i].name.split(".").pop() || "mp3";
    const name = `input_${i}.${ext}`;
    const data = await fileToUint8Array(files[i]);
    await ffmpeg.writeFile(name, data);
    fileList.push(`file '${name}'`);
    if (onProgress) {
      onProgress(Math.round(((i + 1) / files.length) * 30));
    }
  }

  const listContent = new TextEncoder().encode(fileList.join("\n"));
  await ffmpeg.writeFile("filelist.txt", listContent);

  const outputExt = files[0].name.split(".").pop() || "mp3";
  const outputName = `merged.${outputExt}`;

  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => {
      onProgress(30 + Math.round(Math.min(progress * 70, 70)));
    });
  }

  await ffmpeg.exec([
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    "filelist.txt",
    "-c",
    "copy",
    outputName,
  ]);

  const output = await ffmpeg.readFile(outputName);

  try {
    for (let i = 0; i < files.length; i++) {
      const ext = files[i].name.split(".").pop() || "mp3";
      await ffmpeg.deleteFile(`input_${i}.${ext}`);
    }
    await ffmpeg.deleteFile("filelist.txt");
    await ffmpeg.deleteFile(outputName);
  } catch {
    // ignore cleanup errors
  }

  const mimeType = getMimeType(outputExt);
  return new Blob([output as BlobPart], { type: mimeType });
}

function buildFFmpegArgs(
  input: string,
  output: string,
  outputFormat: string
): string[] {
  const args = ["-i", input];

  const audioOnly = [
    "mp3", "wav", "aac", "ogg", "flac", "m4a",
    "wma", "aiff", "opus", "weba", "amr", "ac3",
  ];

  if (audioOnly.includes(outputFormat)) {
    args.push("-vn");

    switch (outputFormat) {
      case "mp3":
        args.push("-codec:a", "libmp3lame", "-q:a", "2");
        break;
      case "wav":
        args.push("-codec:a", "pcm_s16le");
        break;
      case "aac":
        args.push("-codec:a", "aac", "-b:a", "192k");
        break;
      case "ogg":
        args.push("-codec:a", "libvorbis", "-q:a", "5");
        break;
      case "flac":
        args.push("-codec:a", "flac");
        break;
      case "m4a":
        args.push("-codec:a", "aac", "-b:a", "192k");
        break;
      case "opus":
        args.push("-codec:a", "libopus", "-b:a", "128k");
        break;
      case "aiff":
        args.push("-codec:a", "pcm_s16be");
        break;
      case "weba":
        args.push("-codec:a", "libvorbis");
        break;
      default:
        break;
    }
  } else if (outputFormat === "gif") {
    args.push("-vf", "fps=10,scale=480:-1:flags=lanczos", "-t", "10");
  } else {
    switch (outputFormat) {
      case "mp4":
        args.push("-codec:v", "libx264", "-preset", "fast", "-crf", "23", "-codec:a", "aac");
        break;
      case "webm":
        args.push("-codec:v", "libvpx", "-crf", "30", "-b:v", "0", "-codec:a", "libvorbis");
        break;
      case "mkv":
        args.push("-codec:v", "libx264", "-preset", "fast", "-crf", "23", "-codec:a", "aac");
        break;
      case "avi":
        args.push("-codec:v", "mpeg4", "-q:v", "5", "-codec:a", "mp3");
        break;
      case "mov":
        args.push("-codec:v", "libx264", "-preset", "fast", "-crf", "23", "-codec:a", "aac");
        break;
      case "flv":
        args.push("-codec:v", "flv1", "-codec:a", "mp3");
        break;
      case "ogv":
        args.push("-codec:v", "libtheora", "-q:v", "7", "-codec:a", "libvorbis");
        break;
      default:
        break;
    }
  }

  args.push(output);
  return args;
}

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4", mkv: "video/x-matroska", avi: "video/x-msvideo",
    mov: "video/quicktime", webm: "video/webm", flv: "video/x-flv",
    ogv: "video/ogg", gif: "image/gif", mp3: "audio/mpeg", wav: "audio/wav",
    aac: "audio/aac", ogg: "audio/ogg", flac: "audio/flac", m4a: "audio/mp4",
    wma: "audio/x-ms-wma", aiff: "audio/aiff", opus: "audio/opus",
    weba: "audio/webm", amr: "audio/amr", ac3: "audio/ac3",
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    webp: "image/webp", bmp: "image/bmp", ico: "image/x-icon",
    avif: "image/avif", tiff: "image/tiff", svg: "image/svg+xml",
  };
  return mimeTypes[format] || "application/octet-stream";
}
