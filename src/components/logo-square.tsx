import Image from "next/image";
import { cn } from "@/lib/utils";

// The wordmark is 2048x838, so it sizes by height and keeps its own ratio.
export default function LogoSquare({
  size,
  className,
  priority = true,
}: {
  size?: "sm" | undefined;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.svg"
      alt="স্বাস্থ্যকর"
      width={2048}
      height={838}
      unoptimized
      priority={priority}
      className={cn(
        size === "sm" ? "h-8 w-auto shrink-0" : "h-10 w-auto shrink-0",
        className,
      )}
    />
  );
}
