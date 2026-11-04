import { BagShopping } from "@/components/icons";
import { cn } from "@/lib/utils";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <span className="flex flex-col items-center gap-0.5">
      <div className="relative flex size-9 sm:size-10 md:size-11 items-center justify-center rounded-lg text-black transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800">
        <BagShopping
          className={cn(
            "size-5 sm:size-6 transition-all ease-in-out hover:scale-110",
            className,
          )}
        />

        {quantity ? (
          <div className="absolute right-0 top-0 -mr-2 -mt-2 size-5 rounded-full bg-emerald-600 text-[11px] font-bold text-white flex items-center justify-center">
            {quantity}
          </div>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="text-[9px] sm:text-[10px] leading-none font-semibold text-muted-foreground"
      >
        কার্ট
      </span>
    </span>
  );
}
