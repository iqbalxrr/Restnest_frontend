"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";

/**
 * next/image wrapper that swaps to a fallback when the upstream image
 * fails to load, so dead listing URLs never render as a broken box.
 */
export default function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  ...props
}: Omit<ImageProps, "src"> & { src: string; fallbackSrc?: string }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
