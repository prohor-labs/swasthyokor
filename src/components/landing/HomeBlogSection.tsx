import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Sparkles, BookOpen } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/lib/db/queries";
import { getSafeBlogCover } from "@/lib/blog-utils";

export async function HomeBlogSection() {
  const blogs = await getBlogs();
  if (!blogs || blogs.length === 0) return null;

  const [featuredPost, ...otherBlogs] = blogs;
  const recentBlogs = otherBlogs.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
      {/* Background card container for organic wellness context */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card via-card to-emerald-500/[0.03] p-5 sm:p-8 lg:p-10 shadow-xs">
        
        {/* Decorative subtle ambient blur */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-border/40">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className="gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 w-fit"
            >
              <Sparkles className="size-3.5 text-emerald-600" />
              <span>স্বাস্থ্য ও পুষ্টি গাইড</span>
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              সুস্থ জীবনের পরামর্শ ও ব্লগ
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              প্রাকৃতিক খাঁটি খাদ্যের গুণাগুণ, খাওয়ার সঠিক নিয়ম ও সুস্থ জীবনযাপনে পুষ্টি সম্পর্কিত বিশ্বস্ত তথ্য।
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-semibold shrink-0 border-border/80 hover:border-emerald-500 hover:text-emerald-600 self-start sm:self-auto bg-background/80 backdrop-blur-xs"
          >
            <Link href="/blog" className="flex items-center gap-1.5">
              <span>সকল আর্টিকেল দেখুন</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Editorial Split Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Main Hero Featured Story (Left Column - 7 Cols on Desktop) */}
          {featuredPost && (
            <div className="lg:col-span-7 flex flex-col">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-border/70 bg-muted/40 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl h-full min-h-[380px] sm:min-h-[440px]"
              >
                {/* Background Cover Image with Hover Zoom */}
                <Image
                  src={getSafeBlogCover(featuredPost.coverImage)}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />

                {/* Dark Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 transition-opacity duration-300" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                    বিশেষ আর্টিকেল
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
                    {featuredPost.category}
                  </span>
                </div>

                {/* Bottom Story Content */}
                <div className="relative z-10 p-5 sm:p-7 text-white space-y-3">
                  <div className="flex items-center gap-4 text-xs text-white/80 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-emerald-400" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString("bn-BD")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-emerald-400" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-extrabold leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {featuredPost.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                    {featuredPost.description}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Secondary Stories Feed (Right Column - 5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {recentBlogs.map((post, idx) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 p-3 sm:p-3.5 rounded-2xl border border-border/60 bg-card hover:bg-accent/40 hover:border-emerald-500/40 transition-all duration-300 shadow-2xs hover:shadow-md items-center"
              >
                {/* Compact Thumbnail */}
                <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={getSafeBlogCover(post.coverImage)}
                    alt={post.title}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-background/90 text-foreground backdrop-blur-md shadow-2xs">
                      #{idx + 2}
                    </span>
                  </div>
                </div>

                {/* Content details */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="size-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}

            {/* Quick Link Banner inside feed for engagement */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between gap-3 mt-auto">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <BookOpen className="size-4" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-foreground">আরও স্বাস্থ্য তথ্য খুঁজছেন?</h5>
                  <p className="text-[11px] text-muted-foreground">সবগুলো আর্টিকেল ও ডায়েট টিপস এক্সপ্লোর করুন</p>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost" className="rounded-full text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10">
                <Link href="/blog">
                  <span>ব্রাউজ করুন</span>
                  <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
