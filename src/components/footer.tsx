import Link from "next/link";
import { Shield, GitBranch, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-3.5 w-3.5" />
              </div>
              Convert<span className="text-primary">&#2325;&#2352;</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Free, private, browser-based file converter. No uploads, no limits.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/convert" className="hover:text-foreground transition-colors">Convert</Link></li>
              <li><Link href="/compress" className="hover:text-foreground transition-colors">Compress</Link></li>
              <li><Link href="/trim" className="hover:text-foreground transition-colors">Trim</Link></li>
              <li><Link href="/merge" className="hover:text-foreground transition-colors">Merge</Link></li>
            </ul>
          </div>

          {/* Formats */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Popular Conversions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/convert" className="hover:text-foreground transition-colors">MP4 to MP3</Link></li>
              <li><Link href="/convert" className="hover:text-foreground transition-colors">PNG to JPG</Link></li>
              <li><Link href="/convert" className="hover:text-foreground transition-colors">WebM to MP4</Link></li>
              <li><Link href="/convert" className="hover:text-foreground transition-colors">WAV to MP3</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <GitBranch className="h-3.5 w-3.5" />
                  Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-green-500" />
            Your files never leave your device. All processing happens in your browser.
          </div>
          <p>&copy; {new Date().getFullYear()} Convertकर. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
