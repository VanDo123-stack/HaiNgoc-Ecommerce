"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { type Product } from "~/types/product";

import { ProductImageWithFallback } from "./ProductImageWithFallback";

// 1. Image gallery — thumbnail strip + lightbox for multi-image, single image fallback

export function ImageGallery({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [product.image];
  const hasGallery = images.length >= 2;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSrc = images[selectedIndex] ?? product.image;

  if (!hasGallery) {
    // Single image — no gallery chrome per D-03
    return (
      <div className="bg-muted relative aspect-square overflow-hidden rounded-lg">
        <ProductImageWithFallback
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  // Multi-image gallery: main image with lightbox trigger + thumbnail strip
  return (
    <div className="space-y-3">
      <Dialog>
        <DialogTrigger
          nativeButton={false}
          render={
            <div className="bg-muted relative aspect-square cursor-zoom-in overflow-hidden rounded-lg" />
          }
        >
          <ProductImageWithFallback
            src={selectedSrc}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </DialogTrigger>
        <DialogContent className="max-w-3xl sm:max-w-3xl" showCloseButton>
          <DialogTitle className="sr-only">Xem ảnh phóng to</DialogTitle>
          <div className="relative aspect-square w-full">
            <ProductImageWithFallback
              src={selectedSrc}
              alt={product.name}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setSelectedIndex(i)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border-2 transition-colors ${
              i === selectedIndex ? "border-primary" : "border-transparent"
            }`}
          >
            <ProductImageWithFallback
              src={src}
              alt={`${product.name} ${i + 1}`}
              fill
              className="object-contain"
              sizes="64px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
