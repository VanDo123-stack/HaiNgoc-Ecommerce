"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImageWithFallback({
  src,
  alt,
  ...props
}: React.ComponentProps<typeof Image>) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? "/images/product-placeholder.webp" : src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
}
