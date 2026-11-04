"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { User as UserIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-auth";

export function HeaderAuth() {
  const { data: user, isPending } = useUser();

  let control: ReactNode;

  if (isPending) {
    control = (
      <div className="size-9 sm:size-10 md:size-11 rounded-full bg-muted/60 animate-pulse shrink-0" />
    );
  } else if (user) {
    const initials = user.name ? user.name[0].toUpperCase() : "স্ব";
    const targetUrl = user.isAdmin ? "/admin" : "/dashboard";

    control = (
      <Link
        href={targetUrl}
        title={user.name || user.email || "ড্যাশবোর্ড"}
        className="relative flex size-9 sm:size-10 md:size-11 items-center justify-center rounded-full transition-all hover:ring-2 hover:ring-emerald-500/40 p-0.5"
      >
        <Avatar className="size-full rounded-full border-0 after:border-0">
          {user.avatarUrl && (
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name || "User"}
              className="rounded-full object-cover"
            />
          )}
          <AvatarFallback className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs sm:text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Link>
    );
  } else {
    control = (
      <Link
        href="/login"
        aria-label="লগইন করুন"
        title="লগইন করুন"
        className="relative flex size-9 sm:size-10 md:size-11 items-center justify-center rounded-lg text-black transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
      >
        <UserIcon className="size-5 sm:size-6 transition-all ease-in-out hover:scale-110" />
      </Link>
    );
  }

  return (
    <span className="flex flex-col items-center gap-0.5">
      {control}
      <span
        aria-hidden="true"
        className="text-[9px] sm:text-[10px] leading-none font-semibold text-muted-foreground"
      >
        প্রোফাইল
      </span>
    </span>
  );
}
