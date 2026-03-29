<div align="center">

# Convertकर

### Convert any file, right in your browser.

**Free, private and unlimited.** No uploads, no limits, no ads.

<p align="center">
  <a href="https://convertkar.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🔗_Live_Demo-convertkar.vercel.app-F5C518?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcnui" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/FFmpeg.wasm-007808?style=flat-square&logo=ffmpeg" alt="FFmpeg.wasm" />
  <img src="https://img.shields.io/badge/Framer%20Motion-FF0050?style=flat-square&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" />
</p>

</div>

---

## What is Convertकर?

**Convertकर** (Hindi: "just convert it!") is an all-in-one file conversion toolkit that runs entirely in your browser. Convert videos, audio and images between 100+ formats without uploading a single byte to any server.

Built with FFmpeg.wasm (WebAssembly) for video/audio and the native Canvas API for images -- all processing happens on your machine.

---

## Features

| Feature | Description |
|---------|-------------|
| **File Converter** | Transform between 100+ video, audio and image formats |
| **File Compressor** | Reduce file sizes with adjustable quality slider |
| **Media Trimmer** | Cut video or audio files with visual timeline |
| **File Merger** | Combine multiple audio or video files into one |
| **Format Detection** | Detects renamed file extensions using MIME type analysis |
| **Output Preview** | Play converted/trimmed/merged files before downloading |
| **Batch Support** | Format selector with category sidebar and search |
| **Dark & Light Theme** | System preference detection with manual toggle |
| **Privacy First** | Zero uploads, zero tracking, zero cookies, zero accounts |

---

## Supported Formats

### Video

| Format | Extensions |
|--------|-----------|
| MP4, MKV, AVI, MOV | `.mp4` `.mkv` `.avi` `.mov` |
| WebM, FLV, OGV, M4V | `.webm` `.flv` `.ogv` `.m4v` |
| 3GP, MPEG, WMV, TS | `.3gp` `.mpeg` `.wmv` `.ts` |

### Audio

| Format | Extensions |
|--------|-----------|
| MP3, WAV, AAC, OGG | `.mp3` `.wav` `.aac` `.ogg` |
| FLAC, M4A, WMA, AIFF | `.flac` `.m4a` `.wma` `.aiff` |
| OPUS, WEBA, AMR, AC3 | `.opus` `.weba` `.amr` `.ac3` |

### Image

| Format | Extensions |
|--------|-----------|
| PNG, JPG, WebP, GIF | `.png` `.jpg` `.webp` `.gif` |
| BMP, SVG, ICO, AVIF, TIFF | `.bmp` `.svg` `.ico` `.avif` `.tiff` |

### Cross-Format

| From | To |
|------|----|
| Any video | MP3, WAV, AAC, OGG, FLAC (audio extraction) |
| Any video | GIF (animated) |
| Any image | Any other image format |

---

## Tools

| Tool | Route | Description |
|------|-------|-------------|
| **Convert** | `/convert` | Drag-drop file, pick output format, download |
| **Compress** | `/compress` | Reduce file size with quality control |
| **Trim** | `/trim` | Set start/end points on a timeline, preview result |
| **Merge** | `/merge` | Add multiple files of the same format, combine into one |
| **Privacy** | `/privacy` | Full transparency on how your data is (not) handled |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Animations** | Framer Motion |
| **Video/Audio** | FFmpeg.wasm (WebAssembly) |
| **Image** | Browser Canvas API |
| **State** | Zustand |
| **Theme** | next-themes |
| **Deployment** | Vercel |

---

## Project Structure

```
convert-kar/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout with theme provider
│   │   ├── convert/page.tsx        # File converter
│   │   ├── compress/page.tsx       # File compressor
│   │   ├── trim/page.tsx           # Media trimmer
│   │   ├── merge/page.tsx          # File merger
│   │   └── privacy/page.tsx        # Privacy policy
│   ├── components/
│   │   ├── converter/
│   │   │   ├── dropzone.tsx        # Drag-drop with validation and format detection
│   │   │   ├── format-selector.tsx # Category sidebar + format chips + search
│   │   │   └── conversion-progress.tsx
│   │   ├── ui/                     # shadcn components
│   │   ├── navbar.tsx              # Navigation with mobile sheet menu
│   │   ├── footer.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── ffmpeg/
│   │   │   ├── engine.ts           # FFmpeg singleton, convert, trim, merge
│   │   │   └── image-converter.ts  # Canvas API image conversion
│   │   └── formats/
│   │       └── registry.ts         # 33 format definitions with conversion matrix
│   ├── store/
│   │   └── conversion-store.ts     # Zustand store
│   └── types/
│       └── formats.ts
├── next.config.ts                  # CORS headers for SharedArrayBuffer
├── tailwind.config.ts
└── package.json
```

---

## Installation

### Prerequisites

- Node.js 18 or higher
- npm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Mohit-Bagri/convert-kar.git
cd convert-kar

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## How It Works

1. **Drop a file** -- drag-and-drop, click to browse or paste from clipboard
2. **Pick a format** -- browse by category (Video, Audio, Image) or search
3. **Convert** -- FFmpeg.wasm processes the file in your browser's WebAssembly sandbox
4. **Preview & Download** -- play the output, then download when ready

### Technical Details

| Aspect | Implementation |
|--------|---------------|
| **Video/Audio** | FFmpeg.wasm (UMD build) runs in a Web Worker |
| **Images** | Browser Canvas API for format conversion and compression |
| **Memory** | Files are read into browser memory via ArrayBuffer |
| **Threading** | SharedArrayBuffer enabled via COOP/COEP headers |
| **Cleanup** | WASM memory freed after each conversion |

---

## Privacy

```
YOUR FILES NEVER LEAVE YOUR DEVICE.

All conversions happen locally using WebAssembly.
No files uploaded. No data collected. No cookies.
No tracking. No accounts. 100% open source.
```

Read the full [Privacy Policy](https://convertkar.vercel.app/privacy) for technical details on how processing works.

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 89+ | Full |
| Firefox 79+ | Full |
| Edge 89+ | Full |
| Safari 15.2+ | Partial (single-threaded fallback) |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made in 🇮🇳 with ❤️ by [Mohit Bagri](https://mohitbagri-portfolio.vercel.app)

⭐ **Star this repo if you found it helpful!** ⭐

</div>
