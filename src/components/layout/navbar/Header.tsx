import Link from "next/link";
import { Suspense } from "react";
import { CartModal } from "@/components/cart";
import { Tag } from "@/components/icons";
import LogoSquare from "@/components/logo-square";
import { ThemeToggler } from "@/components/theme-toggler";
import { siteConfig } from "@/config";
import { getHeaderCategories } from "@/lib/db/queries";
import { HeaderAuth } from "./HeaderAuth";
import { HeaderCategoryNav } from "./HeaderCategoryNav";
import MobileMenu from "./MobileMenu";
import { MobileSearch } from "./MobileSearch";
import Search, { SearchSkeleton } from "./Search";

export async function Header() {
  const categories = await getHeaderCategories();
  const siteName = siteConfig.name;

  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-1.5 sm:px-4 sm:py-3 lg:px-6">
        {/* Left: Mobile Menu + Logo & Brand Title */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="block flex-none md:hidden">
            <Suspense fallback={null}>
              <MobileMenu categories={categories} />
            </Suspense>
          </div>
          <Link
            href="/"
            prefetch={true}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center md:static md:translate-x-0 md:translate-y-0"
            aria-label={siteName}
          >
            <LogoSquare className="h-9 sm:h-10" />
          </Link>
        </div>

        {/* Center: Desktop Search */}
        <div className="hidden md:flex md:max-w-xs lg:max-w-md xl:max-w-lg w-full mx-4 justify-center">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>

        {/* Right: Mobile Search + ThemeToggler + Offers + Cart + Profile/Auth */}
        <div className="flex items-center gap-1 sm:gap-2">
          <MobileSearch />
          <span className="flex flex-col items-center gap-0.5">
            <ThemeToggler className="border-0 [&_svg]:size-5 sm:[&_svg]:size-6" />
            <span
              aria-hidden="true"
              className="hidden md:block text-[10px] leading-none font-semibold text-muted-foreground"
            >
              থিম
            </span>
          </span>
          {/* Below md, ShopBottomNav owns the offers, cart and profile entry points. */}
          <div className="hidden items-center gap-1 sm:gap-2 md:flex">
            <span className="flex flex-col items-center gap-0.5">
              <Link
                href="/offers"
                prefetch={true}
                aria-label="অফার দেখুন"
                className="relative flex size-9 sm:size-10 md:size-11 items-center justify-center rounded-lg text-black transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
              >
                <Tag className="size-5 sm:size-6 transition-all ease-in-out hover:scale-110" />
              </Link>
              <span
                aria-hidden="true"
                className="text-[9px] sm:text-[10px] leading-none font-semibold text-muted-foreground"
              >
                অফার
              </span>
            </span>
            <CartModal />
            <HeaderAuth />
          </div>
        </div>
      </div>

      {/* Desktop/tablet category navigation */}
      <HeaderCategoryNav categories={categories} />
    </nav>
  );
}
