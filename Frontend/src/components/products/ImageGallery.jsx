import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageGallery({ images = [] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const defaultImages = [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
    ];

    const galleryImages = images.length > 0 ? images : defaultImages;

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedIndex}
                        src={galleryImages[selectedIndex]}
                        alt={`Product image ${selectedIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "w-full h-full object-cover cursor-zoom-in",
                            isZoomed && "scale-150 cursor-zoom-out"
                        )}
                        onClick={() => setIsZoomed(!isZoomed)}
                    />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {galleryImages.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}

                {/* Zoom Indicator */}
                <div className="absolute bottom-4 right-4">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-white/80 hover:bg-white shadow-lg"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {galleryImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                                selectedIndex === index
                                    ? "border-neutral-900"
                                    : "border-transparent hover:border-neutral-300"
                            )}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}