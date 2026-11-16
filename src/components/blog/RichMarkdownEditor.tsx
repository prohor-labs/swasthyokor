"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Eye,
  Edit3,
  Columns,
  Minus,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "cn";

interface RichMarkdownEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichMarkdownEditor({
  id = "rich-markdown-editor",
  value,
  onChange,
  placeholder = "ব্লগ কনটেন্ট লিখুন (Markdown সমর্থিত)...",
  minHeight = "450px",
}: RichMarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert markdown tags around selection or at cursor
  const insertFormatting = (prefix: string, suffix: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selectedText = value.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(
        start + prefix.length,
        newCursorPos
      );
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;

    // Find the start of the current line
    const beforeCursor = value.substring(0, start);
    const lastNewline = beforeCursor.lastIndexOf("\n");
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const currentLine = value.substring(lineStart, end);
    const updatedLine = `${prefix}${currentLine}`;

    const newValue = value.substring(0, lineStart) + updatedLine + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt("লিংক ইউআরএল (URL) দিন:", "https://");
    if (!url) return;
    insertFormatting("[", `](${url})`, "লিংকের টেক্সট");
  };

  const insertImage = () => {
    const url = prompt("ছবির ইউআরএল (Image URL) দিন:", "https://");
    if (!url) return;
    const alt = prompt("ছবির বিবরণ / ক্যাপশন (Caption):", "ছবির ক্যাপশন") || "ছবি";
    const imgMd = `\n\n![${alt}](${url})\n\n`;
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const newValue = value.substring(0, start) + imgMd + value.substring(end);
    onChange(newValue);
  };

  const insertTable = () => {
    const tableTemplate = `\n\n| উপাদান / বৈশিষ্ট্য | পরিমাণ / উপকারিতা |\n|:---|:---|\n| বৈশিষ্ট্য ১ | উপকারিতা ১ |\n| বৈশিষ্ট্য ২ | উপকারিতা ২ |\n\n`;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const newValue = value.substring(0, start) + tableTemplate + value.substring(end);
    onChange(newValue);
  };

  const insertCallout = () => {
    const callout = `\n\n> 💡 **স্বাস্থ্যকর টিপস:** এখানে গুরুত্বপূর্ণ টিপস বা পরামর্শ লিখুন।\n\n`;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const newValue = value.substring(0, start) + callout + value.substring(end);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col w-full rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border/80 bg-muted/40 p-2 sm:px-3">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("**", "**", "বোল্ড টেক্সট")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Bold (**text**)"
          >
            <Bold className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("*", "*", "ইটালিক টেক্সট")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Italic (*text*)"
          >
            <Italic className="size-4" />
          </Button>

          <div className="h-4 w-px bg-border/80 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix("## ")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Heading 2 (## Title)"
          >
            <Heading2 className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix("### ")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Heading 3 (### Subtitle)"
          >
            <Heading3 className="size-4" />
          </Button>

          <div className="h-4 w-px bg-border/80 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix("- ")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Bullet List (- item)"
          >
            <List className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix("1. ")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Numbered List (1. item)"
          >
            <ListOrdered className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix("- [ ] ")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Task List (- [ ] task)"
          >
            <CheckSquare className="size-4" />
          </Button>

          <div className="h-4 w-px bg-border/80 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix("> ")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Quote (> quote)"
          >
            <Quote className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("`", "`", "code")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Inline Code (`code`)"
          >
            <Code className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertCallout}
            className="h-8 px-2 text-xs gap-1 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer font-semibold"
            title="Callout Box"
          >
            <Sparkles className="size-3.5" />
            <span>টিপস বক্স</span>
          </Button>

          <div className="h-4 w-px bg-border/80 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertLink}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Add Link [text](url)"
          >
            <LinkIcon className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertImage}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Add Image ![alt](url)"
          >
            <ImageIcon className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertTable}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Insert Table"
          >
            <TableIcon className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertLinePrefix("\n---\n")}
            className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Horizontal Divider"
          >
            <Minus className="size-4" />
          </Button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-background/80 border border-border/80 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              viewMode === "edit"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="শুধুমাত্র এডিটর"
          >
            <Edit3 className="size-3.5" />
            <span className="hidden sm:inline">এডিট</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              viewMode === "split"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="স্প্লিট ভিউ (পাশাপাশি প্রিভিউ)"
          >
            <Columns className="size-3.5" />
            <span>স্প্লিট</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              viewMode === "preview"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="লাইভ প্রিভিউ"
          >
            <Eye className="size-3.5" />
            <span>প্রিভিউ</span>
          </button>
        </div>
      </div>

      {/* ─── Editor & Preview Area ─── */}
      <div
        className={cn(
          "w-full grid divide-x divide-border/60 bg-background",
          viewMode === "split" ? "md:grid-cols-2" : "grid-cols-1"
        )}
        style={{ minHeight }}
      >
        {/* Editor Area */}
        {viewMode !== "preview" && (
          <div className="relative flex flex-col h-full">
            <textarea
              ref={textareaRef}
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full min-h-[380px] p-4 font-mono text-sm leading-relaxed bg-transparent text-foreground placeholder:text-muted-foreground/60 resize-y outline-none focus:ring-0 border-0"
              spellCheck={false}
            />
          </div>
        )}

        {/* Live Preview Area */}
        {viewMode !== "edit" && (
          <div className="flex flex-col h-full min-h-[380px] p-4 sm:p-6 overflow-y-auto bg-card/50">
            <div className="mb-3 flex items-center justify-between pb-2 border-b border-border/50 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Eye className="size-3.5" />
                লাইভ রিহাইপ প্রিভিউ (Rehype + Remark GFM)
              </span>
              <span>{value.length.toLocaleString("bn-BD")} অক্ষর</span>
            </div>

            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-sm text-muted-foreground italic py-10 text-center">
                প্রিভিউ দেখতে বামপাশে কিছু লিখুন...
              </p>
            )}
          </div>
        )}
      </div>

      {/* ─── Footer Stats ─── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-t border-border/50 text-[11px] text-muted-foreground font-mono">
        <div className="flex items-center gap-3">
          <span>
            {value.length.toLocaleString("bn-BD")} অক্ষর
          </span>
          <span>•</span>
          <span>
            {value.trim()
              ? value.trim().split(/\s+/).length.toLocaleString("bn-BD")
              : 0}{" "}
            শব্দ
          </span>
          <span>•</span>
          <span>
            পড়ার সময়: ~
            {Math.max(
              1,
              Math.ceil((value.trim() ? value.trim().split(/\s+/).length : 0) / 180)
            ).toLocaleString("bn-BD")}{" "}
            মিনিট
          </span>
        </div>

        <span className="text-[10px] hidden sm:inline text-muted-foreground">
          GitHub Flavored Markdown (GFM) + HTML + Rehype Sanitized
        </span>
      </div>
    </div>
  );
}
