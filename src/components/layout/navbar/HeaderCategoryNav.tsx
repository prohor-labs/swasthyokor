"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CategoryNavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL_PRODUCTS_LINK: CategoryNavItem = {
  id: "all-products",
  title: "সকল পণ্য",
  handle: "",
  href: "/search",
};

export function HeaderCategoryNav({
  categories,
}: {
  categories: CategoryNavItem[];
}) {
  const pathname = usePathname();

  const activeCategory = categories.find(
    (category) =>
      pathname === category.href || pathname.startsWith(`${category.href}/`),
  );

  const isActive = (href: string) =>
    href === ALL_PRODUCTS_LINK.href
      ? !activeCategory
      : activeCategory?.href === href;

  const items = [ALL_PRODUCTS_LINK, ...categories];

  return (
    <div className="hidden border-t border-border/50 md:block">
      <nav
        aria-label="ক্যাটাগরি নেভিগেশন"
        className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6"
      >
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="mx-auto flex w-max items-center gap-0.5">
            {items.map((item) => {
              const active = isActive(item.href);

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    prefetch={true}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-10 items-center whitespace-nowrap rounded-lg px-3 text-[13px] font-semibold transition-colors",
                      active
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    {item.title}
                    {active ? (
                      <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
