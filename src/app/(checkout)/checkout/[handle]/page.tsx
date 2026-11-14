import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectCheckoutClient } from "@/components/checkout/DirectCheckoutClient";
import LogoSquare from "@/components/logo-square";
import { getCurrentUser } from "@/lib/auth/session";
import { getProduct, getStoreSettings } from "@/lib/db/queries";

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

  const settings = await getStoreSettings();

  const variant = product.variants[0];
  const unitPrice = variant
    ? Number(variant.price.amount)
    : Number(product.priceRange.minVariantPrice.amount);

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

        <DirectCheckoutClient
          product={product}
          quantity={quantity}
          unitPrice={unitPrice}
          initialName={user?.name || ""}
          initialPhone={user?.phone || ""}
          initialPhoneVerified={Boolean(user?.phoneVerified && user?.phone)}
          allowCoupons={product.allowCoupons ?? true}
          insideDhakaFee={settings.insideDhakaFee ?? 60}
          outsideDhakaFee={settings.outsideDhakaFee ?? 120}
          freeShippingMinAmount={settings.freeShippingMinAmount ?? 1500}
        />
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
