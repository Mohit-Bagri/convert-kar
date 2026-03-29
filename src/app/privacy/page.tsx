"use client";

import { Shield, Lock, Eye, Cookie, Server, Code, CheckCircle2 } from "lucide-react";
import { BrandingBanner } from "@/components/branding-banner";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const sections = [
  {
    icon: Server,
    title: "No Server Uploads",
    content:
      "Every file you process with Convertकर stays on your device. We use WebAssembly (FFmpeg.wasm) to run conversion engines directly in your browser. Your files are never uploaded to any server — not ours, not anyone else's.",
  },
  {
    icon: Eye,
    title: "No Tracking",
    content:
      "We do not use Google Analytics, Facebook Pixel or any other tracking service. We don't track which files you convert, what formats you use or how often you visit. Your usage is your business.",
  },
  {
    icon: Cookie,
    title: "No Cookies",
    content:
      "Convertकर does not set any cookies. We don't use session cookies, tracking cookies or any other form of browser storage to identify or profile you. The only local storage used is your theme preference (dark/light mode).",
  },
  {
    icon: Lock,
    title: "No Accounts Required",
    content:
      "There is no sign-up, no login, no email collection. You don't need to provide any personal information to use any of our tools. Just open the page and start converting.",
  },
  {
    icon: Code,
    title: "Open Source",
    content:
      "Convertकर is fully open source. You can inspect every line of code to verify our privacy claims. We believe trust should be verifiable, not just promised.",
  },
];

const commitments = [
  "We will never add server-side file processing",
  "We will never add user tracking or analytics",
  "We will never sell or share any data",
  "We will never require account creation",
  "We will never add advertisements",
  "We will always keep the source code public",
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-12 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 mx-auto mb-4">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your files never leave your device. This is not just a promise — it&apos;s
          how the software is built.
        </p>
      </motion.div>

      <div className="space-y-8">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg mb-2">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Commitments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-6"
        >
          <h2 className="font-semibold text-lg mb-4">Our Commitments</h2>
          <ul className="space-y-3">
            {commitments.map((commitment) => (
              <li key={commitment} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{commitment}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* How it works technically */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-6"
        >
          <h2 className="font-semibold text-lg mb-4">How It Works Technically</h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed">
            <p>
              When you select a file, it is read into your browser&apos;s memory using
              the JavaScript File API. The file data is then passed to FFmpeg.wasm —
              a WebAssembly build of the FFmpeg multimedia framework that runs
              entirely within your browser&apos;s sandbox.
            </p>
            <p>
              The conversion happens using your computer&apos;s CPU. The output file
              is generated in memory, and a download link is created using a
              Blob URL. At no point does any file data leave your browser.
            </p>
            <p>
              For image conversions, we use the browser&apos;s native Canvas API,
              which is even more lightweight and doesn&apos;t require loading the
              FFmpeg engine.
            </p>
          </div>
        </motion.div>

        <p className="text-sm text-muted-foreground text-center pt-4">
          Last updated: March 2025
        </p>

        <BrandingBanner />
      </div>
    </div>
  );
}
