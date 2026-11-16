import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { cn } from "cn";

// Custom schema extending defaultSchema to allow class names and styling for safe elements
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...(defaultSchema.attributes?.["*"] || []),
      "className",
      "style",
      "target",
      "rel",
    ],
    a: [
      ...(defaultSchema.attributes?.a || []),
      "href",
      "target",
      "rel",
      "title",
    ],
    img: [
      ...(defaultSchema.attributes?.img || []),
      "src",
      "alt",
      "title",
      "width",
      "height",
      "loading",
    ],
  },
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
        "prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8",
        "prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-border/40 prose-h2:pb-2",
        "prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2",
        "prose-p:leading-relaxed prose-p:text-foreground/90 prose-p:mb-4 text-sm sm:text-base",
        "prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-bold",
        "prose-blockquote:border-l-4 prose-blockquote:border-emerald-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-emerald-500/5 prose-blockquote:py-1 prose-blockquote:rounded-r-lg",
        "prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 prose-li:text-foreground/90",
        "prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1 prose-li:text-foreground/90",
        "prose-table:w-full prose-table:my-6 prose-table:overflow-x-auto prose-table:border-collapse",
        "prose-th:border prose-th:border-border prose-th:bg-muted/60 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-xs prose-th:font-bold prose-th:text-foreground",
        "prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 prose-td:text-xs sm:prose-td:text-sm",
        "prose-hr:border-border/60 prose-hr:my-8",
        "prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:rounded-xl prose-pre:bg-neutral-900 prose-pre:p-4 prose-pre:text-neutral-100",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["no-underline hover:underline cursor-pointer"],
              },
            },
          ],
        ]}
        components={{
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return (
              <figure className="my-6 overflow-hidden rounded-2xl border border-border/70 bg-card p-2 sm:p-3 shadow-xs not-prose">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={src}
                    alt={alt || "Blog image"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 850px"
                    className="object-cover"
                  />
                </div>
                {alt && (
                  <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
          a: ({ href, children, ...props }) => {
            if (!href) return <a {...props}>{children}</a>;
            const isInternal = href.startsWith("/") || href.startsWith("#");
            if (isInternal) {
              return (
                <Link
                  href={href}
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  {...props}
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
                {...props}
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto rounded-xl border border-border shadow-2xs">
              <table className="w-full text-left border-collapse">{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
