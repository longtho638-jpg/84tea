"use client";

import { useState } from "react";

interface ProductGalleryProps {
  mainImage: string;
  images?: string[];
}

export function ProductGallery({ mainImage, images = [] }: ProductGalleryProps) {
  // Combine main image with additional images, ensuring unique list
  const allImages = [mainImage, ...images.filter(img => img !== mainImage)];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square bg-surface-container-low rounded-2xl overflow-hidden relative flex items-center justify-center border border-outline-variant">
        {selectedImage && (selectedImage.startsWith('/') || selectedImage.startsWith('http')) ? (
           /* eslint-disable-next-line @next/next/no-img-element */
           <img
             src={selectedImage}
             alt="Product"
             className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
           />
        ) : (
          <div className="text-9xl select-none animate-in fade-in zoom-in duration-500">
            {selectedImage || '🍵'}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`aspect-square rounded-xl flex items-center justify-center overflow-hidden bg-surface-container-high transition-all ${
                selectedImage === img
                  ? "border-2 border-primary"
                  : "border border-transparent hover:border-outline-variant"
              }`}
            >
               {img && (img.startsWith('/') || img.startsWith('http')) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
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
