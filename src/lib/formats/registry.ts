import { FormatInfo, FormatCategory } from "@/types/formats";

const videoFormats: FormatInfo[] = [
  {
    extension: "mp4",
    label: "MP4",
    mimeType: "video/mp4",
    category: "video",
    convertTo: ["mkv", "avi", "mov", "webm", "flv", "ogv", "gif", "mp3", "wav", "aac", "ogg", "flac"],
  },
  {
    extension: "mkv",
    label: "MKV",
    mimeType: "video/x-matroska",
    category: "video",
    convertTo: ["mp4", "avi", "mov", "webm", "flv", "mp3", "wav", "aac"],
  },
  {
    extension: "avi",
    label: "AVI",
    mimeType: "video/x-msvideo",
    category: "video",
    convertTo: ["mp4", "mkv", "mov", "webm", "mp3", "wav"],
  },
  {
    extension: "mov",
    label: "MOV",
    mimeType: "video/quicktime",
    category: "video",
    convertTo: ["mp4", "mkv", "avi", "webm", "mp3", "wav"],
  },
  {
    extension: "webm",
    label: "WebM",
    mimeType: "video/webm",
    category: "video",
    convertTo: ["mp4", "mkv", "avi", "mov", "mp3", "wav", "ogg"],
  },
  {
    extension: "flv",
    label: "FLV",
    mimeType: "video/x-flv",
    category: "video",
    convertTo: ["mp4", "mkv", "avi", "mov", "webm", "mp3", "wav"],
  },
  {
    extension: "ogv",
    label: "OGV",
    mimeType: "video/ogg",
    category: "video",
    convertTo: ["mp4", "mkv", "webm", "mp3", "wav", "ogg"],
  },
  {
    extension: "m4v",
    label: "M4V",
    mimeType: "video/x-m4v",
    category: "video",
    convertTo: ["mp4", "mkv", "avi", "mov", "mp3", "wav"],
  },
  {
    extension: "3gp",
    label: "3GP",
    mimeType: "video/3gpp",
    category: "video",
    convertTo: ["mp4", "mkv", "avi", "mov", "mp3", "wav"],
  },
  {
    extension: "mpeg",
    label: "MPEG",
    mimeType: "video/mpeg",
    category: "video",
    convertTo: ["mp4", "mkv", "avi", "mov", "webm", "mp3", "wav"],
  },
  {
    extension: "wmv",
    label: "WMV",
    mimeType: "video/x-ms-wmv",
    category: "video",
    convertTo: ["mp4", "mkv", "avi", "mov", "mp3", "wav"],
  },
  {
    extension: "ts",
    label: "TS",
    mimeType: "video/mp2t",
    category: "video",
    convertTo: ["mp4", "mkv", "avi", "mov", "mp3", "wav"],
  },
];

const audioFormats: FormatInfo[] = [
  {
    extension: "mp3",
    label: "MP3",
    mimeType: "audio/mpeg",
    category: "audio",
    convertTo: ["wav", "aac", "ogg", "flac", "m4a", "wma", "aiff", "opus", "weba"],
  },
  {
    extension: "wav",
    label: "WAV",
    mimeType: "audio/wav",
    category: "audio",
    convertTo: ["mp3", "aac", "ogg", "flac", "m4a", "aiff", "opus", "weba"],
  },
  {
    extension: "aac",
    label: "AAC",
    mimeType: "audio/aac",
    category: "audio",
    convertTo: ["mp3", "wav", "ogg", "flac", "m4a"],
  },
  {
    extension: "ogg",
    label: "OGG",
    mimeType: "audio/ogg",
    category: "audio",
    convertTo: ["mp3", "wav", "aac", "flac", "m4a"],
  },
  {
    extension: "flac",
    label: "FLAC",
    mimeType: "audio/flac",
    category: "audio",
    convertTo: ["mp3", "wav", "aac", "ogg", "m4a", "aiff"],
  },
  {
    extension: "m4a",
    label: "M4A",
    mimeType: "audio/mp4",
    category: "audio",
    convertTo: ["mp3", "wav", "aac", "ogg", "flac"],
  },
  {
    extension: "wma",
    label: "WMA",
    mimeType: "audio/x-ms-wma",
    category: "audio",
    convertTo: ["mp3", "wav", "aac", "ogg"],
  },
  {
    extension: "aiff",
    label: "AIFF",
    mimeType: "audio/aiff",
    category: "audio",
    convertTo: ["mp3", "wav", "aac", "flac", "ogg"],
  },
  {
    extension: "opus",
    label: "OPUS",
    mimeType: "audio/opus",
    category: "audio",
    convertTo: ["mp3", "wav", "ogg", "flac"],
  },
  {
    extension: "weba",
    label: "WEBA",
    mimeType: "audio/webm",
    category: "audio",
    convertTo: ["mp3", "wav", "ogg", "flac"],
  },
  {
    extension: "amr",
    label: "AMR",
    mimeType: "audio/amr",
    category: "audio",
    convertTo: ["mp3", "wav", "aac"],
  },
  {
    extension: "ac3",
    label: "AC3",
    mimeType: "audio/ac3",
    category: "audio",
    convertTo: ["mp3", "wav", "aac", "ogg"],
  },
];

const imageFormats: FormatInfo[] = [
  {
    extension: "png",
    label: "PNG",
    mimeType: "image/png",
    category: "image",
    convertTo: ["jpg", "webp", "bmp", "gif", "ico", "avif"],
  },
  {
    extension: "jpg",
    label: "JPG",
    mimeType: "image/jpeg",
    category: "image",
    convertTo: ["png", "webp", "bmp", "gif", "ico", "avif"],
  },
  {
    extension: "jpeg",
    label: "JPEG",
    mimeType: "image/jpeg",
    category: "image",
    convertTo: ["png", "webp", "bmp", "gif", "ico", "avif"],
  },
  {
    extension: "webp",
    label: "WebP",
    mimeType: "image/webp",
    category: "image",
    convertTo: ["png", "jpg", "bmp", "gif"],
  },
  {
    extension: "gif",
    label: "GIF",
    mimeType: "image/gif",
    category: "image",
    convertTo: ["png", "jpg", "webp", "bmp"],
  },
  {
    extension: "bmp",
    label: "BMP",
    mimeType: "image/bmp",
    category: "image",
    convertTo: ["png", "jpg", "webp", "gif"],
  },
  {
    extension: "ico",
    label: "ICO",
    mimeType: "image/x-icon",
    category: "image",
    convertTo: ["png", "jpg", "webp"],
  },
  {
    extension: "svg",
    label: "SVG",
    mimeType: "image/svg+xml",
    category: "image",
    convertTo: ["png", "jpg", "webp"],
  },
  {
    extension: "avif",
    label: "AVIF",
    mimeType: "image/avif",
    category: "image",
    convertTo: ["png", "jpg", "webp"],
  },
  {
    extension: "tiff",
    label: "TIFF",
    mimeType: "image/tiff",
    category: "image",
    convertTo: ["png", "jpg", "webp"],
  },
];

export const allFormats: FormatInfo[] = [
  ...videoFormats,
  ...audioFormats,
  ...imageFormats,
];

export const formatMap: Record<string, FormatInfo> = Object.fromEntries(
  allFormats.map((f) => [f.extension, f])
);

export function getFormatsByCategory(category: FormatCategory): FormatInfo[] {
  return allFormats.filter((f) => f.category === category);
}

export function getOutputFormats(inputExtension: string): FormatInfo[] {
  const input = formatMap[inputExtension.toLowerCase()];
  if (!input) return [];
  return input.convertTo
    .map((ext) => formatMap[ext])
    .filter(Boolean);
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function getCategoryIcon(category: FormatCategory): string {
  switch (category) {
    case "video":
      return "Video";
    case "audio":
      return "Audio";
    case "image":
      return "Image";
    default:
      return "File";
  }
}

export function getCategoryColor(category: FormatCategory): string {
  switch (category) {
    case "video":
      return "text-blue-500";
    case "audio":
      return "text-green-500";
    case "image":
      return "text-purple-500";
    default:
      return "text-muted-foreground";
  }
}

export const categoryLabels: Record<FormatCategory, string> = {
  video: "Video",
  audio: "Audio",
  image: "Image",
};

export const supportedInputMimes = allFormats.map((f) => f.mimeType);

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
