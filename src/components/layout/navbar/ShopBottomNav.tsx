"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCartModal } from "@/components/cart";
import { BagShopping, Home, Tag, User as UserIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "8801982027508";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "আসসালামু আলাইকুম, আমি স্বাস্থ্যকর (SwasthyoKor) থেকে পণ্য সম্পর্কে জানতে চাই।",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const NOTCH_RADIUS = 34;
const NOTCH_CENTER_Y = 4;
const NOTCH_MASK_IMAGE = `radial-gradient(circle ${NOTCH_RADIUS}px at 50% ${NOTCH_CENTER_Y}px, transparent ${NOTCH_RADIUS - 0.5}px, #000 ${NOTCH_RADIUS}px)`;

const NOTCH_MASK = {
  maskImage: NOTCH_MASK_IMAGE,
  WebkitMaskImage: NOTCH_MASK_IMAGE,
} as const;

export function ShopBottomNav() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { openCart, isOpen: isCartOpen } = useCartModal();
  const { data: user } = useUser();

  const isHome = pathname === "/";
  const isOffers = pathname === "/offers" || pathname.startsWith("/offers/");
  const isProfile =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isProductPage = pathname.startsWith("/product/");

  if (isProductPage) {
    return null;
  }
  const profileHref = user
    ? user.isAdmin
      ? "/admin"
      : "/dashboard"
    : "/login";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <nav
        aria-label="মোবাইল নেভিগেশন"
        className="pointer-events-auto relative mx-auto mb-[calc(0.5rem+env(safe-area-inset-bottom))] w-[calc(100%-1.5rem)] max-w-md"
      >
        {/* Round cutout: the page stays visible in the gap around the WhatsApp logo. */}
        <div className="pointer-events-none absolute inset-0 drop-shadow-[0_-4px_16px_rgba(0,0,0,0.16)] dark:drop-shadow-[0_-4px_16px_rgba(0,0,0,0.5)]">
          <div
            className="size-full rounded-[26px] border border-border/80 bg-background"
            style={NOTCH_MASK}
          />
          <div className="absolute inset-x-0 top-0 h-10 overflow-hidden">
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/80"
              style={{
                top: NOTCH_CENTER_Y,
                width: NOTCH_RADIUS * 2,
                height: NOTCH_RADIUS * 2,
              }}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[26px]">
          <div className="grid h-16 grid-cols-5 items-center px-1">
            <NavItem
              href="/"
              label="হোম"
              icon={<Home className="size-[21px] shrink-0" />}
              active={isHome}
            />
            <NavItem
              href="/offers"
              label="অফার"
              icon={<Tag className="size-[21px] shrink-0" />}
              active={isOffers}
            />

            <span aria-hidden="true" />

            <CartItem
              quantity={cart?.totalQuantity}
              active={isCartOpen}
              onOpen={openCart}
            />
            <NavItem
              href={profileHref}
              label="প্রোফাইল"
              icon={<ProfileIcon user={user} />}
              active={isProfile}
            />
          </div>
        </div>

        <Link
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="হোয়াটসঅ্যাপে চ্যাট করুন"
          className="absolute left-1/2 -top-7 z-10 flex size-16 -translate-x-1/2 items-center justify-center transition-transform duration-200 active:scale-95"
        >
          {/* The optimizer cannot transcode SVG, so serve the file as-is. */}
          <Image
            src="/whatsapp.svg"
            alt=""
            aria-hidden="true"
            width={256}
            height={256}
            unoptimized
            className="size-full object-contain"
          />
        </Link>
      </nav>
    </div>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-13 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-[10.5px] font-semibold transition-colors",
        active
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span className="whitespace-nowrap leading-none">{label}</span>
    </Link>
  );
}

function ProfileIcon({ user }: { user: ReturnType<typeof useUser>["data"] }) {
  if (!user) {
    return <UserIcon className="size-[21px] shrink-0" />;
  }

  const initials = user.name ? user.name[0].toUpperCase() : "স্ব";

  return (
    <Avatar className="size-[21px] shrink-0 border-0 after:border-0">
      {user.avatarUrl && (
        <AvatarImage src={user.avatarUrl} alt="" className="rounded-full" />
      )}
      <AvatarFallback className="rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function CartItem({
  quantity,
  active,
  onOpen,
}: {
  quantity?: number;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="কার্ট খুলুন"
      aria-expanded={active}
      className={cn(
        "flex h-13 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-[10.5px] font-semibold transition-colors",
        active
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="relative">
        <BagShopping className="size-[21px] shrink-0" />
        {quantity ? (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold leading-none text-white">
            {quantity}
          </span>
        ) : null}
      </span>
      <span className="whitespace-nowrap leading-none">কার্ট</span>
    </button>
  );
}
