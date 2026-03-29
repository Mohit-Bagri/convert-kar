"use client";

import { useState, useMemo } from "react";
import { FormatCategory, FormatInfo } from "@/types/formats";
import { getOutputFormats, getFileExtension, allFormats, categoryLabels } from "@/lib/formats/registry";
import { cn } from "@/lib/utils";
import { Video, Music, ImageIcon, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface FormatSelectorProps {
  inputFile: File | null;
  selectedFormat: string | null;
  onFormatSelect: (format: string) => void;
}

const categoryIcons: Record<FormatCategory, React.ElementType> = {
  video: Video,
  audio: Music,
  image: ImageIcon,
};

export function FormatSelector({
  inputFile,
  selectedFormat,
  onFormatSelect,
}: FormatSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<FormatCategory | null>(null);
  const [search, setSearch] = useState("");

  const availableFormats = useMemo(() => {
    if (!inputFile) return allFormats;
    const ext = getFileExtension(inputFile.name);
    return getOutputFormats(ext);
  }, [inputFile]);

  const groupedFormats = useMemo(() => {
    const groups: Record<FormatCategory, FormatInfo[]> = {
      video: [],
      audio: [],
      image: [],
    };
    for (const fmt of availableFormats) {
      if (
        search &&
        !fmt.label.toLowerCase().includes(search.toLowerCase()) &&
        !fmt.extension.toLowerCase().includes(search.toLowerCase())
      ) {
        continue;
      }
      if (groups[fmt.category]) {
        // Deduplicate by extension
        if (!groups[fmt.category].some((f) => f.extension === fmt.extension)) {
          groups[fmt.category].push(fmt);
        }
      }
    }
    return groups;
  }, [availableFormats, search]);

  const categories = (Object.keys(groupedFormats) as FormatCategory[]).filter(
    (cat) => groupedFormats[cat].length > 0
  );

  const displayCategory = activeCategory && categories.includes(activeCategory)
    ? activeCategory
    : categories[0] || null;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Search */}
      <div className="border-b p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search formats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-muted/50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex">
        {/* Category sidebar */}
        <div className="w-28 sm:w-32 border-r bg-muted/30 p-2 space-y-1">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            const isActive = displayCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors text-left",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{categoryLabels[cat]}</span>
              </button>
            );
          })}
        </div>

        {/* Format chips */}
        <div className="flex-1 p-4">
          {displayCategory && groupedFormats[displayCategory] ? (
            <div className="flex flex-wrap gap-2">
              {groupedFormats[displayCategory].map((fmt, i) => {
                const isSelected = selectedFormat === fmt.extension;
                return (
                  <motion.button
                    key={fmt.extension}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => onFormatSelect(fmt.extension)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium border transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card hover:bg-muted border-border hover:border-primary/30"
                    )}
                  >
                    {fmt.label}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {inputFile
                ? "No compatible formats found"
                : "Upload a file to see available formats"}
            </p>
          )}
        </div>
      </div>

      {/* Selected format indicator */}
      {selectedFormat && (
        <div className="border-t px-4 py-3 bg-muted/30">
          <p className="text-sm">
            Converting to{" "}
            <Badge variant="secondary" className="font-semibold">
              {selectedFormat.toUpperCase()}
            </Badge>
          </p>
        </div>
      )}
    </div>
  );
}
