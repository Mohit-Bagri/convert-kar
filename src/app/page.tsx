"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandingBanner } from "@/components/branding-banner";
import {
  ArrowRight,
  ArrowLeftRight,
  Minimize2,
  Scissors,
  Merge,
  Shield,
  Zap,
  Globe,
  Video,
  Music,
  ImageIcon,
  Lock,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

const tools = [
  {
    icon: ArrowLeftRight,
    title: "Convert",
    description: "Transform between 100+ video, audio and image formats",
    href: "/convert",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Minimize2,
    title: "Compress",
    description: "Reduce file sizes while maintaining quality",
    href: "/compress",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Scissors,
    title: "Trim",
    description: "Cut and trim video or audio files to any length",
    href: "/trim",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Merge,
    title: "Merge",
    description: "Combine multiple audio or video files into one",
    href: "/merge",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const features = [
  {
    icon: Lock,
    title: "100% Private",
    description:
      "Files never leave your device. All processing happens in your browser using WebAssembly.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "No upload/download wait times. Conversion starts instantly on your machine.",
  },
  {
    icon: Globe,
    title: "No Limits",
    description:
      "No file size caps, no daily conversion limits, no accounts required. Completely free.",
  },
  {
    icon: MonitorSmartphone,
    title: "Works Everywhere",
    description:
      "Runs in any modern browser. Desktop, tablet or phone — no software to install.",
  },
];

const formats = [
  { category: "Video", icon: Video, items: ["MP4", "MKV", "AVI", "MOV", "WebM", "FLV", "OGV", "WMV", "3GP", "MPEG", "TS", "M4V"] },
  { category: "Audio", icon: Music, items: ["MP3", "WAV", "AAC", "OGG", "FLAC", "M4A", "WMA", "AIFF", "OPUS", "WEBA", "AMR", "AC3"] },
  { category: "Image", icon: ImageIcon, items: ["PNG", "JPG", "WebP", "GIF", "BMP", "SVG", "ICO", "AVIF", "TIFF"] },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-16 sm:pt-32 sm:pb-24">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center text-center gap-6"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs sm:text-sm text-center">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">100+ Format Conversions Supported</span>
                <span className="sm:hidden">100+ Formats Supported</span>
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight max-w-4xl"
            >
              Convert any file,{" "}
              <span className="text-primary">right in your browser</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl"
            >
              Free, private and unlimited. Transform videos, audio and images
              without uploading anything. Your files never leave your device.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 mt-2"
            >
              <Link href="/convert">
                <Button size="lg" className="gap-2 text-base px-8">
                  Start Converting
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/privacy">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <Shield className="h-4 w-4" />
                  How We Protect Your Privacy
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            All the tools you need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One place for all your file conversion needs. No switching between
            apps or websites.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Link href={tool.href}>
                  <div className="group rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.bg} ${tool.color} mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Convert&#2325;&#2352;?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for people who care about privacy and hate waiting for
              uploads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Supported Formats
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Convert between all major video, audio and image formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formats.map((group, gi) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + gi * 0.1 }}
                className="rounded-xl border bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Drop your file",
                description:
                  "Drag and drop or click to select any video, audio or image file.",
              },
              {
                step: "02",
                title: "Choose format",
                description:
                  "Pick from 100+ output formats. We'll show you what's compatible.",
              },
              {
                step: "03",
                title: "Download",
                description:
                  "Conversion happens instantly in your browser. Download when ready.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary/20 mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border bg-card p-8 sm:p-12 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 mx-auto mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Your files never leave your device
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            All conversions happen locally in your browser using WebAssembly.
            No files are uploaded to any server. No data is collected. No
            cookies. No tracking. No accounts required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/convert">
              <Button size="lg" className="gap-2">
                Start Converting
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/privacy">
              <Button size="lg" variant="outline">
                Read Privacy Policy
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Branding */}
      <BrandingBanner />
    </div>
  );
}
