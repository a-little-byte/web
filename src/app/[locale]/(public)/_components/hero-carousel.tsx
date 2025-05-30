"use client";

import { Button } from "@/components/ui/button";
import { HeroCarouselSelect } from "@/db/models/HeroCarousel";
import { apiClient } from "@/lib/apiClient";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/style";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const HeroCarousel = () => {
  const [items, setItems] = useState<HeroCarouselSelect[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (items.length > 1) {
        setCurrentIndex((current) => (current + 1) % items.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  const fetchItems = useCallback(async () => {
    const res = await apiClient.hero.$get();
    const data = await res.json();
    setItems(
      data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })),
    );
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const previousSlide = useCallback(() => {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  }, [items.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((current) => (current + 1) % items.length);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-transform duration-500 ease-in-out",
            index === currentIndex ? "translate-x-0" : "translate-x-full",
          )}
          style={{
            transform: `translateX(${100 * (index - currentIndex)}%)`,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image_url})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  {item.title}
                </h1>
                <p className="mt-6 text-lg text-gray-200">{item.description}</p>
                {item.button_text && item.button_link && (
                  <Button size="lg" className="mt-10" asChild>
                    <Link href={item.button_link}>{item.button_text}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            onClick={previousSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentIndex ? "bg-white" : "bg-white/50",
                )}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
