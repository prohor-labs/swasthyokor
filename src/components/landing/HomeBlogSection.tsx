import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/lib/db/queries";
import { getSafeBlogCover } from "@/lib/blog-utils";

export async function HomeBlogSection() {
  const blogs = await getBlogs();
  if (!blogs || blogs.length === 0) return null;

  // Take latest 4 articles
  const latestBlogs = blogs.slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-10">
      {/* Clean minimal section header without extra badges */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 sm:pb-4 gap-3 mb-6 sm:mb-8">
        <div className="min-w-0 flex-1">
          <Link href="/blog" className="group block max-w-full">
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
              স্বাস্থ্য ও পুষ্টি ব্লগ
            </h2>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
            খাঁটি অর্গানিক খাদ্যের পুষ্টিগুণ ও সুস্থ জীবনযাপনের প্রয়োজনীয় পরামর্শ
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full text-xs font-semibold shrink-0 border-border/80 hover:border-emerald-500 hover:text-emerald-600"
        >
          <Link href="/blog" className="flex items-center gap-1.5">
            <span>সব ব্লগ পড়ুন</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {/* Clean, Non-carded, Seamless Article Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {latestBlogs.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-3 transition-colors"
          >
            {/* Seamless Image Container with Subtle Radius & Clean Hover */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted/40">
              <Image
                src={getSafeBlogCover(post.coverImage)}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* Content Meta & Text (Cardless, Flat Typography) */}
            <div className="flex flex-col gap-1.5">
              {/* Category, Date & Read Time */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {post.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground/70" />
                  {new Date(post.publishedAt).toLocaleDateString("bn-BD")}
                </span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {post.description}
              </p>

              {/* Subtle Text Link */}
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline pt-1">
                <span>বিস্তারিত পড়ুন</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
