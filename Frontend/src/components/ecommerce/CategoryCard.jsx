import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from "@/utils";

const categoryImages = {
    men: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    kids: "https://images.unsplash.com/photo-1503919545889-aeb22a9b53b9?w=400"
};

export default function CategoryCard({ category, productCount, size = "default" }) {
    const isLarge = size === "large";

    return (
        <Link
            to={createPageUrl(`Products?category=${category}`)}
            className={`group relative overflow-hidden rounded-2xl ${isLarge ? 'aspect-[4/5]' : 'aspect-square'}`}
        >
            <img
                src={categoryImages[category] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
                alt={category}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className={`font-semibold text-white capitalize ${isLarge ? 'text-2xl' : 'text-lg'}`}>
                    {category}
                </h3>
                <p className="text-white/70 text-sm mt-1">{productCount} products</p>

                <div className="flex items-center gap-2 mt-3 text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">Shop Now</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}