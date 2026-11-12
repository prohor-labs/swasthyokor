"use client";

import { useState } from "react";
import { Prose } from "@/components/prose";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductLongDescriptionProps {
  descriptionHtml?: string;
  description?: string;
  className?: string;
}

export function ProductLongDescription({
  descriptionHtml,
  description,
  className,
}: ProductLongDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!descriptionHtml && !description) return null;

  return (
    <section className={cn("mt-6", className)} id="product-long-description">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        {/* Falaq Food Style Tab Header */}
        <div className="flex w-full items-start gap-10 bg-muted/40 px-4 sm:px-6 border-b border-border/50">
          <div className="flex flex-col items-center justify-center gap-2 pt-3.5 pb-0">
            <h2 className="m-0 whitespace-nowrap text-center text-sm sm:text-base font-bold text-foreground">
              বিবরণ ও উপকারিতা
            </h2>
            <span
              aria-hidden="true"
              className="h-0.5 w-full rounded-full bg-emerald-600"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8">
          <div className="relative">
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden",
                !isExpanded && "max-h-[360px]",
              )}
            >
              {descriptionHtml ? (
                <Prose
                  className="max-w-none text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose text-foreground/90 prose-h2:text-lg sm:prose-h2:text-xl prose-h2:font-bold prose-h2:text-foreground prose-h2:mt-6 prose-h2:mb-3 prose-p:my-2.5 prose-ul:my-2.5 prose-li:my-1"
                  html={descriptionHtml}
                />
              ) : (
                <div className="text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose text-foreground/90 whitespace-pre-line">
                  {description}
                </div>
              )}
            </div>

            {/* Gradient fade when collapsed */}
            {!isExpanded && (
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
            )}
          </div>

          {/* Read More / Less Toggle Button */}
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full border-border/80 text-xs font-semibold px-5 py-2 hover:bg-muted text-foreground"
            >
              {isExpanded ? "সংক্ষেপ করুন ▲" : "আরও পড়ুন ▼"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
