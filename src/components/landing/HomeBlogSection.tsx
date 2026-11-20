import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Sparkles } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/lib/db/queries";
import { getSafeBlogCover } from "@/lib/blog-utils";

export async function HomeBlogSection() {
  const blogs = await getBlogs();
  if (!blogs || blogs.length === 0) return null;

  // Show the latest 3 blogs on the homepage
  const latestBlogs = blogs.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-10">
      {/* Category/Section Header matching the site's standard style */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 sm:pb-4 gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <Link href="/blog" className="group block max-w-full">
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
              স্বাস্থ্য ও পুষ্টি ব্লগ
            </h2>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            খাঁটি অর্গানিক খাদ্যের স্বাস্থ্য উপকারিতা ও পুষ্টি সম্পর্কিত বৈজ্ঞানিক পরামর্শ
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

      {/* Grid of latest 3 blogs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {latestBlogs.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card hover:border-emerald-500/50 shadow-2xs hover:shadow-md transition-all duration-300"
          >
            <div>
              {/* Card Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={getSafeBlogCover(post.coverImage)}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-background/90 text-foreground backdrop-blur-md shadow-xs border border-border/50">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content Header & Description */}
              <div className="p-4 sm:p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3 text-emerald-600" />
                    {new Date(post.publishedAt).toLocaleDateString("bn-BD")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-emerald-600" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 sm:px-5 py-3 border-t border-border/50 flex items-center justify-end bg-muted/10 mt-auto">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>সম্পূর্ণ পড়ুন</span>
                <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
