import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  ShoppingBag,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarkdownRenderer } from "@/components/blog";
import { getBlog } from "@/lib/db/queries";
import { baseUrl } from "@/lib/utils";
import { getSafeBlogCover } from "@/lib/blog-utils";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlog(slug);

  if (!post) return notFound();

  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | স্বাস্থ্যকর`,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = await getBlog(slug);

  if (!post) return notFound();

  const postUrl = `${baseUrl}/blog/${post.slug}`;

  const structuredSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "হোম",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ব্লগ",
            item: `${baseUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: postUrl,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${postUrl}#article`,
        headline: post.title,
        description: post.description,
        image: [post.coverImage],
        url: postUrl,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Organization",
          name: post.author,
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "SwasthyoKor",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/icon.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredSchemas),
        }}
      />
      <div className="container-layout py-8 sm:py-12 max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link
              href="/blog"
              className="gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft data-icon="inline-start" />
              ব্লগ তালিকায় ফিরে যান
            </Link>
          }
        />

        {/* Article Meta Header */}
        <header className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{post.category}</Badge>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {post.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {new Date(post.publishedAt).toLocaleDateString("bn-BD")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            {post.description}
          </p>

          <Separator className="my-2" />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>১০০% খাঁটি ও প্রাকৃতিক তথ্য</span>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-xs mb-8">
          <Image
            src={getSafeBlogCover(post.coverImage)}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
        </div>

        {/* Main Article Content */}
        <article className="mb-12">
          <MarkdownRenderer content={post.content || ""} />
        </article>

        {/* Related Product Callout with shadcn Card & Button */}
        {post.relatedProducts && post.relatedProducts.length > 0 && (
          <Card className="mb-12 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold mb-4">
                <ShoppingBag className="size-5" />
                <span>সম্পর্কিত স্বাস্থ্যকর পণ্য</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {post.relatedProducts.map(
                  (p: {
                    title: string;
                    handle: string;
                    price: string;
                    image: string;
                  }) => (
                    <div
                      key={p.handle}
                      className="flex items-center justify-between gap-4 w-full"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-sm sm:text-base">
                            {p.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            প্রাকৃতিক ও স্বাস্থ্যসম্মত খাদ্য
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                        render={
                          <Link href={`/product/${p.handle}`}>
                            অর্ডার করুন {p.price}
                          </Link>
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
