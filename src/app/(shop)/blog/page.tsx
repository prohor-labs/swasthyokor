import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  User,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { getBlogs } from "@/lib/db/queries";
import { baseUrl } from "@/lib/utils";
import { getSafeBlogCover } from "@/lib/blog-utils";

export const metadata: Metadata = {
  title: "স্বাস্থ্য ও পুষ্টি গাইড | স্বাস্থ্যকর",
  description:
    "খাঁটি সুন্দরবন মধু, কাঠের ঘানির সরিষার তেল, ঘি ও অর্গানিক সুপারফুডের পুষ্টিগুণ, ব্যবহার বিধি ও বিশেষজ্ঞ স্বাস্থ্য টিপস।",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: "স্বাস্থ্য ও পুষ্টি গাইড | স্বাস্থ্যকর",
    description:
      "খাঁটি সুন্দরবন মধু, কাঠের ঘানির সরিষার তেল, ঘি ও অর্গানিক সুপারফুডের পুষ্টিগুণ, ব্যবহার বিধি ও বিশেষজ্ঞ স্বাস্থ্য টিপস।",
    url: `${baseUrl}/blog`,
    type: "website",
  },
};

export default async function BlogListingPage() {
  const blogs = await getBlogs();
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "স্বাস্থ্যকর ব্লগ ও পুষ্টি গাইড",
    description:
      "খাঁটি অর্গানিক খাদ্যের স্বাস্থ্য উপকারিতা, খাঁটি খাদ্য চেনার উপায় ও পুষ্টি সংক্রান্ত বৈজ্ঞানিক গাইড।",
    url: `${baseUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "SwasthyoKor",
      url: baseUrl,
    },
  };

  const [featuredPost, ...otherPosts] = blogs;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogListSchema),
        }}
      />
      <div className="container-layout py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-10 sm:mb-12 text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
          <Badge
            variant="secondary"
            className="gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40"
          >
            <ShieldCheck className="size-3.5" />
            <span>১০০% খাঁটি তথ্য ও গবেষণা</span>
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            স্বাস্থ্য ও পুষ্টি ব্লগ
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
            প্রাকৃতিক খাদ্য, রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি ও খাঁটি খাদ্য চেনার
            নির্ভরযোগ্য বৈজ্ঞানিক গাইডলাইন।
          </p>
        </div>

        {/* ─── Hero Featured Article (First Post) ─── */}
        {featuredPost && (
          <div className="mb-10 sm:mb-14">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block overflow-hidden rounded-3xl border border-border/70 bg-card hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                {/* Image Section */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[360px] lg:col-span-7 overflow-hidden bg-muted">
                  <Image
                    src={getSafeBlogCover(featuredPost.coverImage)}
                    alt={featuredPost.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                      বিশেষ আর্টিকেল
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-background/90 text-foreground backdrop-blur-md shadow-xs">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between h-full gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-emerald-600" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString(
                          "bn-BD",
                        )}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-emerald-600" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-3">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {featuredPost.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="size-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                        <User className="size-3.5" />
                      </div>
                      <span className="font-medium text-foreground">
                        {featuredPost.author}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                      <span>সম্পূর্ণ পড়ুন</span>
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ─── Other Articles Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {otherPosts.map((post) => (
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
                <div className="p-5 space-y-2.5">
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
              <div className="px-5 py-3.5 border-t border-border/50 flex items-center justify-between bg-muted/15 mt-auto">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <BookOpen className="size-3 text-emerald-600" />
                  <span>{post.author}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>পড়ুন</span>
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
