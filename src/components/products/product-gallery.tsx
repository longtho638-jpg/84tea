"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProductGalleryProps {
  mainImage: string;
  images?: string[];
}

function isImageUrl(src: string): boolean {
  return src.startsWith('/') || src.startsWith('http');
}

export function ProductGallery({ mainImage, images = [] }: ProductGalleryProps) {
  const allImages = [mainImage, ...images.filter(img => img !== mainImage)];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const t = useTranslations("Products.Detail.Gallery");

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square bg-surface-container-low rounded-2xl overflow-hidden relative flex items-center justify-center border border-outline-variant">
        {selectedImage && isImageUrl(selectedImage) ? (
          <Image
            src={selectedImage}
            alt={t("altMain")}
            fill
            priority
            className="object-cover animate-in fade-in zoom-in duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="text-9xl select-none animate-in fade-in zoom-in duration-500">
            {selectedImage || '🍵'}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4" role="listbox" aria-label={t("altMain")}>
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              role="option"
              aria-selected={selectedImage === img}
              aria-label={`${t("altThumb")} ${index + 1}`}
              className={`aspect-square rounded-xl flex items-center justify-center overflow-hidden bg-surface-container-high transition-all relative ${
                selectedImage === img
                  ? "border-2 border-primary"
                  : "border border-transparent hover:border-outline-variant"
              }`}
            >
               {img && isImageUrl(img) ? (
                  <Image
                    src={img}
                    alt={`${t("altThumb")} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
               ) : (
                 <span className="text-3xl">{img}</span>
               )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
