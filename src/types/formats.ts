export type FormatCategory = "video" | "audio" | "image";

export interface FormatInfo {
  extension: string;
  label: string;
  mimeType: string;
  category: FormatCategory;
  convertTo: string[];
}

export interface ConversionJob {
  id: string;
  file: File;
  inputFormat: string;
  outputFormat: string;
  status: "pending" | "converting" | "completed" | "error";
  progress: number;
  outputBlob?: Blob;
  outputUrl?: string;
  error?: string;
}

export interface FormatRegistry {
  [extension: string]: FormatInfo;
}
