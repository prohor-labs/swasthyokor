import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen } from "@/components/icons";
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
      {/* Section Header matching clean site header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 sm:pb-4 gap-3 mb-6 sm:mb-8">
        <div className="min-w-0 flex-1">
          <Link href="/blog" className="group block max-w-full">
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
              সুস্থ জীবনের পরামর্শ ও ব্লগ
            </h2>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
            প্রাকৃতিক খাঁটি খাদ্যের গুণাগুণ, খাওয়ার সঠিক নিয়ম ও সুস্থ জীবনযাপনে পুষ্টি সম্পর্কিত বিশ্বস্ত তথ্য
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full text-xs font-semibold shrink-0 border-border/80 hover:border-emerald-500 hover:text-emerald-600"
        >
          <Link href="/blog" className="flex items-center gap-1.5">
            <span>সকল আর্টিকেল দেখুন</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {/* Editorial Magazine Split Layout (Clean, Seamless, No heavy enclosing box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Main Hero Featured Story (Left Column - 7 Cols) */}
        {featuredPost && (
          <div className="lg:col-span-7 flex flex-col">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-muted transition-all duration-300 hover:shadow-lg h-full min-h-[360px] sm:min-h-[420px]"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300" />

              {/* Bottom Story Content */}
              <div className="relative z-10 p-5 sm:p-7 text-white space-y-2.5">
                <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
                  <span className="font-semibold text-emerald-300">
                    {featuredPost.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5 text-emerald-400" />
                    {new Date(featuredPost.publishedAt).toLocaleDateString("bn-BD")}
                  </span>
                  <span>•</span>
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

                <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>সম্পূর্ণ পড়ুন</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Secondary Stories Feed (Right Column - 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
          {recentBlogs.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex gap-4 p-2 sm:p-2.5 rounded-xl hover:bg-muted/40 transition-colors items-center"
            >
              {/* Compact Thumbnail */}
              <div className="relative size-24 sm:size-26 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={getSafeBlogCover(post.coverImage)}
                  alt={post.title}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Content details */}
              <div className="min-w-0 flex-1 space-y-1">
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

                <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}

          {/* Quick Link Row inside feed */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-muted/30 flex items-center justify-between gap-3 mt-auto">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <BookOpen className="size-4" />
              </div>
              <p className="text-xs font-semibold text-foreground">আরও স্বাস্থ্য ও ডায়েট টিপস এক্সপ্লোর করুন</p>
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
    </section>
  );
}
