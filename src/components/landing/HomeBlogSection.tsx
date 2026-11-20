import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/lib/db/queries";
import { getSafeBlogCover } from "@/lib/blog-utils";

export async function HomeBlogSection() {
  const blogs = await getBlogs();
  if (!blogs || blogs.length === 0) return null;

  // Show the latest 3 blogs on the homepage
  const latestBlogs = blogs.slice(0, 3);

  return (
    <section className="py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div className="space-y-2">
          <Badge
            variant="secondary"
            className="gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 w-fit"
          >
            <Sparkles className="size-3.5 text-emerald-600" />
            <span>স্বাস্থ্য ও পুষ্টি গাইড</span>
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            নতুন স্বাস্থ্য ব্লগ ও পরামর্শ
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            প্রাকৃতিক খাদ্য, রোগ প্রতিরোধ ক্ষমতা ও স্বাস্থ্যকর জীবনযাপনের নির্ভরযোগ্য বৈজ্ঞানিক তথ্য ও টিপস।
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full group hover:border-emerald-500 hover:text-emerald-600 self-start sm:self-auto font-medium"
        >
          <Link href="/blog" className="flex items-center gap-1.5">
            <span>সকল ব্লগ দেখুন</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {/* Grid of latest 3 blogs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {latestBlogs.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300"
          >
            <div>
              {/* Card Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={getSafeBlogCover(post.coverImage)}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              <div className="p-4 sm:p-5 space-y-2.5">
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

                <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
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
                <span>পড়ুন</span>
                <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
