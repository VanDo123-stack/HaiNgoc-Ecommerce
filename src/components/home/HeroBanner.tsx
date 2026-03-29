"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

const slides = [
  {
    title: "Que hàn Kobelco chính hãng",
    image: "/images/banners/banner-1.jpg",
  },
  {
    title: "Máy mài công nghiệp",
    image: "/images/banners/banner-2.jpg",
  },
];

export function HeroBanner() {
  return (
    <div className="relative w-full">
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.image}>
              <div className="relative w-full overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={1920}
                  height={600}
                  className="h-auto w-full"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
