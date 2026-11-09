import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectCheckoutForm } from "@/components/checkout/DirectCheckoutForm";
import LogoSquare from "@/components/logo-square";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getProduct } from "@/lib/db/queries";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  return {
    title: `চেকআউট - ${product.title} | স্বাস্থ্যকর`,
    description: `${product.title} সরাসরি অর্ডার করুন।`,
  };
}

export default async function CheckoutProductPage(props: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ quantity?: string }>;
}) {
  const { handle } = await props.params;
  const searchParams = await props.searchParams;
  const product = await getProduct(handle);
  const user = await getCurrentUser();

  if (!product) return notFound();

  const quantity = Math.max(
    1,
    parseInt(searchParams?.quantity || "1", 10) || 1,
  );

  const variant = product.variants[0];
  const unitPrice = variant
    ? Number(variant.price.amount)
    : Number(product.priceRange.minVariantPrice.amount);
  const finalTotal = unitPrice * quantity;

  return (
    <div className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 py-5 px-3 sm:py-8 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-border/80 mb-5 sm:mb-8">
          <Link
            href="/"
            className="flex items-center text-emerald-800 dark:text-emerald-300"
            aria-label="স্বাস্থ্যকর"
          >
            <LogoSquare size="sm" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Left Column: Delivery Form */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <Card className="border-border/80 bg-card rounded-xl sm:rounded-2xl shadow-xs py-0 gap-0 [--card-spacing:0px]">
              <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-5 pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                  ডেলিভারির ঠিকানা ও তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1 sm:pt-2">
                <DirectCheckoutForm
                  handle={product.handle}
                  quantity={quantity}
                  finalTotal={finalTotal}
                  initialName={user?.name || ""}
                  initialPhone={user?.phone || ""}
                  initialPhoneVerified={Boolean(
                    user?.phoneVerified && user?.phone,
                  )}
                  allowCoupons={product.allowCoupons ?? true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="sticky top-8 space-y-4">
              {/* Falaqfood Style "YOUR ORDER" Card */}
              <div className="overflow-hidden rounded-[12px] sm:rounded-[14px] border border-border/80 bg-card shadow-xs">
                {/* Table Header: PRODUCT / SUBTOTAL */}
                <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                  <span>পণ্য</span>
                  <span>মোট</span>
                </div>

                {/* Product Item Row */}
                <div className="flex items-start gap-3.5 px-4 py-4 sm:px-5 sm:py-4 border-b border-border/70 last:border-b-0">
                  {/* Thumbnail */}
                  <div className="relative size-[56px] sm:size-[64px] shrink-0 overflow-hidden rounded-md border border-border/80 bg-neutral-100 dark:bg-neutral-900">
                    {product.featuredImage?.url ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.title}
                        fill
                        sizes="64px"
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Title & Price Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="line-clamp-2 text-xs sm:text-sm font-semibold text-foreground leading-snug">
                      {product.title}
                    </span>
                    {variant?.title && variant.title !== "Default Title" ? (
                      <span className="text-[11px] text-muted-foreground">
                        {variant.title}
                      </span>
                    ) : null}

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="whitespace-nowrap text-xs text-muted-foreground font-mono">
                        × {quantity} (৳{unitPrice.toLocaleString("bn-BD")})
                      </span>
                      <span className="whitespace-nowrap text-sm font-bold text-foreground font-mono">
                        ৳{finalTotal.toLocaleString("bn-BD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtotals & Fees */}
                <div className="flex flex-col border-t border-border/80 bg-muted/20 text-xs sm:text-sm divide-y divide-border/60">
                  <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 text-muted-foreground">
                    <span>সাবটোটাল</span>
                    <span className="font-semibold text-foreground font-mono">
                      ৳{finalTotal.toLocaleString("bn-BD")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 text-muted-foreground">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ফ্রি ডেলিভারি
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 text-base sm:text-lg font-bold text-foreground bg-card">
                    <span>সর্বমোট</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black text-lg sm:text-xl">
                      ৳{finalTotal.toLocaleString("bn-BD")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Bottom link back */}
      <div className="text-center py-6 text-xs text-muted-foreground">
        <Link href={`/product/${product.handle}`} className="hover:underline">
          ← প্রোডাক্ট পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
