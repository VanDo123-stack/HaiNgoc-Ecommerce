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

const partners = [
  { src: "/images/partners/partner-1.jpg", alt: "Đối tác 1" },
  { src: "/images/partners/partner-2.jpg", alt: "Đối tác 2" },
  { src: "/images/partners/partner-3.jpg", alt: "Đối tác 3" },
  { src: "/images/partners/partner-4.jpg", alt: "Đối tác 4" },
  { src: "/images/partners/partner-5.jpg", alt: "Đối tác 5" },
  { src: "/images/partners/partner-6.jpg", alt: "Đối tác 6" },
  { src: "/images/partners/partner-7.jpg", alt: "Đối tác 7" },
];

export function PartnerCarousel() {
  return (
    <section className="bg-muted/30 py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-wide">Đối tác</h2>
        <div className="relative">
          <Carousel
            opts={{ loop: true, align: "center" }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {partners.map((partner) => (
                <CarouselItem
                  key={partner.src}
                  className="basis-1/3 pl-4 sm:basis-1/4 lg:basis-1/5"
                >
                  <div className="flex items-center justify-center p-4">
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      width={200}
                      height={100}
                      className="h-[80px] w-auto object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
