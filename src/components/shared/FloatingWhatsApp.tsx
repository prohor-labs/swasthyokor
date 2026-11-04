"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingWhatsApp() {
  const pathname = usePathname();

  // Hide in admin panel and customer dashboards
  const isDashboardOrAdmin =
    pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");
  if (isDashboardOrAdmin) return null;

  // The shop pages have their own WhatsApp button in the mobile bottom nav.
  const isShopRoute = ![
    "/checkout",
    "/order",
    "/payment",
    "/login",
    "/admin",
    "/dashboard",
  ].some((prefix) => pathname?.startsWith(prefix));

  const phone = "8801982027508";
  const defaultMsg = encodeURIComponent(
    "আসসালামু আলাইকুম, আমি স্বাস্থ্যকর (SwasthyoKor) থেকে পণ্য সম্পর্কে জানতে চাই।",
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${defaultMsg}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center group ${
        isShopRoute ? "max-md:hidden" : ""
      }`}
    >
      {/* Tooltip on hover */}
      <span className="pointer-events-none absolute right-16 hidden rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 group-hover:block dark:bg-neutral-100 dark:text-neutral-900 whitespace-nowrap">
        হোয়াটসঅ্যাপে চ্যাট করুন
      </span>

      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex size-14 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-xl hover:drop-shadow-emerald-500/25"
      >
        {/* The optimizer cannot transcode SVG, so serve the file as-is. */}
        <Image
          src="/whatsapp.svg"
          alt=""
          aria-hidden="true"
          width={256}
          height={256}
          unoptimized
          className="inline-block size-full shrink-0 object-contain transition-transform duration-300 group-hover:rotate-6"
        />
      </Link>
    </div>
  );
}
