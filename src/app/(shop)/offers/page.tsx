import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Tag } from "@/components/icons";
import { ProductCard } from "@/components/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getProducts } from "@/lib/db/queries";
import type { Product } from "@/lib/types";
import { baseUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "অফার ও ডিল | স্বাস্থ্যকর (SwasthyoKor)",
  description:
    "স্বাস্থ্যকর (SwasthyoKor)-এর চলমান ছাড়, বিশেষ অফার ও জনপ্রিয় পণ্যের সংগ্রহ এক জায়গায় দেখুন।",
  alternates: {
    canonical: `${baseUrl}/offers`,
  },
  openGraph: {
    title: "অফার ও ডিল | স্বাস্থ্যকর (SwasthyoKor)",
    description:
      "স্বাস্থ্যকর (SwasthyoKor)-এর চলমান ছাড়, বিশেষ অফার ও জনপ্রিয় পণ্যের সংগ্রহ এক জায়গায় দেখুন।",
    url: `${baseUrl}/offers`,
    type: "website",
  },
};

function getDiscountAmount(product: Product) {
  return product.variants.reduce((bestDiscount, variant) => {
    const price = Number(variant.price.amount);
    const compareAtPrice = Number(variant.compareAtPrice?.amount ?? 0);
    const discount = compareAtPrice > price ? compareAtPrice - price : 0;

    return Math.max(bestDiscount, discount);
  }, 0);
}

export default async function OffersPage() {
  const products = await getProducts({
    sortKey: "CREATED_AT",
    reverse: true,
  });

  const discountedProducts = products
    .filter((product) => getDiscountAmount(product) > 0)
    .sort((a, b) => getDiscountAmount(b) - getDiscountAmount(a));

  const discountedHandles = new Set(
    discountedProducts.map((product) => product.handle),
  );

  const popularProducts = products
    .filter((product) => !discountedHandles.has(product.handle))
    .slice(0, 8);

  const hasProducts =
    discountedProducts.length > 0 || popularProducts.length > 0;

  return (
    <div className="container-layout page-section-spacing">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-background to-amber-50 px-5 py-7 sm:px-8 sm:py-10 dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-background dark:to-amber-950/20">
        <div className="relative flex max-w-2xl flex-col items-start gap-3">
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-0.5 text-xs">
            <Tag data-icon="inline-start" />
            <span>সীমিত সময়ের অফার</span>
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            আজকের সেরা অফার ও ডিল
          </h1>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            স্বাস্থ্যকর-এর নির্বাচিত পণ্যে চলমান ছাড় ও জনপ্রিয় পণ্যের সংগ্রহ। পছন্দের পণ্য
            অর্ডার করুন ঘরে বসেই।
          </p>
        </div>
      </section>

      {!hasProducts ? (
        <Empty className="min-h-64 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800">
          <EmptyMedia variant="icon">
            <Tag className="size-6 text-neutral-400" />
          </EmptyMedia>
          <EmptyTitle>এখন কোনো অফার নেই</EmptyTitle>
          <EmptyDescription>
            নতুন অফার চালু হলে এখানে দেখা যাবে। ততক্ষণ সব পণ্য দেখুন।
          </EmptyDescription>
        </Empty>
      ) : null}

      {discountedProducts.length > 0 ? (
        <section>
          <SectionHeader
            title="বিশেষ ছাড়"
            description="সীমিত সময়ের জন্য কম দামে পাওয়া যাচ্ছে"
            icon={
              <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
            }
          />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {discountedProducts.map((product, index) => (
              <ProductCard
                key={product.handle}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        </section>
      ) : null}

      {popularProducts.length > 0 ? (
        <section>
          <SectionHeader
            title="জনপ্রিয় ও হট ডিল"
            description="গ্রাহকদের পছন্দের পণ্যগুলো এখন অফার পেজে"
            icon={
              <Tag className="size-5 text-emerald-600 dark:text-emerald-400" />
            }
          />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/25 px-5 py-6 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            আরও পণ্য খুঁজছেন?
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            আমাদের সম্পূর্ণ পণ্যের সংগ্রহ দেখুন এবং পছন্দের পণ্য বেছে নিন।
          </p>
        </div>
        <Button
          render={<Link href="/search" />}
          className="shrink-0 rounded-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
        >
          <span>সব পণ্য দেখুন</span>
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 border-b border-border/50 pb-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
        <p className="text-[11px] text-muted-foreground sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
