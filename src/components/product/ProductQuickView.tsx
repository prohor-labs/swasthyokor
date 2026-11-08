import type * as React from "react";
import type { Product } from "@/lib/types";

interface ProductQuickViewProps {
  product: Product;
  children: React.ReactNode;
  className?: string;
}

export function ProductQuickView({
  children,
  className,
}: ProductQuickViewProps) {
  return <div className={className}>{children}</div>;
}
