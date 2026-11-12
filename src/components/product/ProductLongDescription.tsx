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
      {/* Clean, Non-Carded Minimalist Design */}
      <div className="relative">
        <div
          className={cn(
            "transition-all duration-500 ease-in-out overflow-hidden",
            !isExpanded ? "max-h-[280px] sm:max-h-[320px]" : "max-h-none",
          )}
        >
          {descriptionHtml ? (
            <Prose
              className="max-w-none text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose text-foreground/90 prose-h2:text-base sm:prose-h2:text-lg prose-h2:font-bold prose-h2:text-foreground prose-h2:mt-5 sm:prose-h2:mt-6 prose-h2:mb-2.5 prose-p:my-2 prose-ul:my-2.5 prose-li:my-1"
              html={descriptionHtml}
            />
          ) : (
            <div className="text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose text-foreground/90 whitespace-pre-line">
              {description}
            </div>
          )}
        </div>

        {/* Smooth Gradient Fade when collapsed */}
        {!isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand / Collapse Action Button */}
      <div className="flex justify-center pt-3 border-t border-border/30 mt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (isExpanded) {
              setIsExpanded(false);
              document
                .getElementById("product-long-description")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              setIsExpanded(true);
            }
          }}
          className="group rounded-full border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold px-6 py-2 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <span>{isExpanded ? "সংক্ষেপ করুন" : "সম্পূর্ণ বিবরণ পড়ুন"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={cn(
              "size-4 transition-transform duration-200",
              isExpanded ? "rotate-180" : "rotate-0",
            )}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </section>
  );
}
