"use client";

import Image from "next/image";
import Link from "next/link";
import { type TouchEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BannerSlide {
  id?: string;
  title?: string;
  link: string;
  image: string;
}

const HERO_SLIDES: BannerSlide[] = [
  {
    link: "/search?q=মধু",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1600&auto=format&fit=crop&q=85",
  },
  {
    link: "/search?q=তেল",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1600&auto=format&fit=crop&q=85",
  },
  {
    link: "/search/superfoods-wellness",
    image:
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=1600&auto=format&fit=crop&q=85",
  },
  {
    link: "/search?q=বাদাম",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&auto=format&fit=crop&q=85",
  },
];

export function HeroSection({ slides: rawSlides }: { slides?: BannerSlide[] }) {
  const slides = rawSlides && rawSlides.length > 0 ? rawSlides : HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered || !slides.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const prevSlide = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const promoSlides =
    slides.length >= 2 ? slides.slice(-2) : HERO_SLIDES.slice(0, 2);

  return (
    <div className="w-full py-2 sm:py-4 md:py-5">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex w-full flex-col gap-5 md:flex-row md:items-stretch">
          <section
            className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-border/50 shadow-md sm:rounded-2xl sm:shadow-lg md:aspect-[5/2] md:w-[66.2%] md:rounded-2xl"
            aria-roledescription="carousel"
            aria-label="ফিচার্ড ব্যানার স্লাইডার"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, idx) => (
              <Link
                key={slide.id || `${slide.image}-${idx}`}
                href={slide.link}
                className={cn(
                  "absolute inset-0 block transition-opacity duration-700 ease-in-out cursor-pointer",
                  idx === currentSlide
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none",
                )}
              >
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title || `ব্যানার #${idx + 1}`}
                  fill
                  priority={idx === 0}
                  sizes="(min-width: 1280px) 800px, (min-width: 768px) 66vw, 100vw"
                  className="object-cover object-center select-none"
                />
              </Link>
            ))}

            {/* Navigation Controls */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous slide"
              className="absolute top-1/2 left-2 sm:left-4 z-30 size-7 sm:size-9 -translate-y-1/2 rounded-full bg-black/35 text-white hover:bg-black/60 hover:text-white active:scale-90 md:left-6 md:size-10 md:bg-white md:text-emerald-600 md:shadow-[0_1px_2px_0_#00000029] md:hover:bg-white/90 md:hover:text-emerald-700"
            >
              <ArrowLeft2 className="size-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next slide"
              className="absolute top-1/2 right-2 sm:right-4 z-30 size-7 sm:size-9 -translate-y-1/2 rounded-full bg-black/35 text-white hover:bg-black/60 hover:text-white active:scale-90 md:right-6 md:size-10 md:bg-white md:text-emerald-600 md:shadow-[0_1px_2px_0_#00000029] md:hover:bg-white/90 md:hover:text-emerald-700"
            >
              <ArrowRight2 className="size-4" />
            </Button>

            {/* Indicator Dots */}
            <div className="absolute bottom-2.5 sm:bottom-3.5 right-4 sm:right-10 z-30 flex items-center gap-1.5 sm:gap-2 md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id || slide.image || `slide-${slide.link}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-1.5 sm:h-2 transition-all rounded-full cursor-pointer",
                    i === currentSlide
                      ? "w-6 sm:w-8 bg-emerald-500 md:w-10"
                      : "w-1.5 sm:w-2 bg-white/60 hover:bg-white/90 md:bg-[#E8F5EE]",
                  )}
                />
              ))}
            </div>
          </section>

          {/* Desktop/tablet promo banners */}
          <div className="hidden min-w-0 flex-1 flex-col gap-5 md:flex">
            {promoSlides.map((slide, idx) => (
              <Link
                key={`promo-${slide.id || `${slide.image}-${idx}`}`}
                href={slide.link}
                aria-label={slide.title || `প্রোমো ব্যানার #${idx + 1}`}
                className="group relative min-h-0 flex-1 overflow-hidden rounded-2xl"
              >
                <Image
                  src={slide.image}
                  alt={slide.title || `প্রোমো ব্যানার #${idx + 1}`}
                  fill
                  sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
