import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createPageUrl, formatPriceINR } from "@/utils";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export default function ProductCard({ product, onAddToCart, viewMode = "grid" }) {
    const { isAuthenticated } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [isCheckingLike, setIsCheckingLike] = useState(false);

    useEffect(() => {
        if (isAuthenticated && product) {
            checkLikeStatus();
        }
    }, [product?._id, product?.id, isAuthenticated]);

    const checkLikeStatus = async () => {
        try {
            const liked = await base44.entities.Like.check(product.id || product._id);
            setIsLiked(liked);
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login to add favorites');
            return;
        }

        setIsCheckingLike(true);
        try {
            const result = await base44.entities.Like.toggle(product.id || product._id);
            setIsLiked(result.isLiked);
            toast.success(result.message);
            window.dispatchEvent(new Event('likeUpdated'));
        } catch (error) {
            console.error('Error updating favorite:', error);
            toast.error('Failed to update favorite');
        } finally {
            setIsCheckingLike(false);
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.(product);
    };

    const discount = product.original_price
        ? Math.round((1 - product.price / product.original_price) * 100)
        : 0;

    if (viewMode === "list") {
        return (
            <div className="group flex gap-6 bg-white rounded-2xl p-4 border border-neutral-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Link
                    to={createPageUrl(`ProductDetails?id=${product.id || product._id}`)}
                    className="relative w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-50"
                >
                    <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
                        alt={product.title || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {discount > 0 && (
                        <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-500">
                            -{discount}%
                        </Badge>
                    )}

                    {product.is_trending && (
                        <Badge className="absolute top-3 right-3 bg-violet-500 hover:bg-violet-500">
                            Trending
                        </Badge>
                    )}
                </Link>

                <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">
                            {product.brand || product.category?.name || 'Product'}
                        </p>

                        <Link to={createPageUrl(`ProductDetails?id=${product.id || product._id}`)}>
                            <h3 className="text-lg font-semibold text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-2">
                                {product.title || product.name}
                            </h3>
                        </Link>

                        <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">
                                    {product.rating?.toFixed(1) || "4.5"}
                                </span>
                            </div>
                            <span className="text-neutral-300">•</span>
                            <span className="text-sm text-neutral-500">
                                {product.reviews_count || 0} reviews
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-neutral-900">
                                {formatPriceINR(product.price)}
                            </span>
                            {product.original_price && (
                                <span className="text-sm text-neutral-400 line-through">
                                    {formatPriceINR(product.original_price)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={handleLike}
                                disabled={isCheckingLike}
                                variant="outline"
                                size="icon"
                                className={cn(
                                    "rounded-full transition-all",
                                    isLiked
                                        ? "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100"
                                        : "hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200"
                                )}
                            >
                                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                            </Button>

                            <Link to={createPageUrl(`ProductDetails?id=${product.id || product._id}`)}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </Link>

                            <Button
                                type="button"
                                onClick={handleAddToCart}
                                className="rounded-full bg-neutral-900 hover:bg-neutral-800"
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden bg-neutral-50">
                <Link
                    to={createPageUrl(`ProductDetails?id=${product.id || product._id}`)}
                    className="block w-full h-full"
                >
                    <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
                        alt={product.title || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                {discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-500 z-20">
                        -{discount}%
                    </Badge>
                )}

                {product.is_trending && (
                    <Badge className="absolute top-3 right-3 bg-violet-500 hover:bg-violet-500 z-20">
                        Trending
                    </Badge>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none z-10" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-3 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">
                    <Button
                        type="button"
                        onClick={handleLike}
                        disabled={isCheckingLike}
                        size="icon"
                        className={cn(
                            "h-11 w-11 rounded-full border border-white/30 backdrop-blur-md shadow-xl transition-all duration-300",
                            isLiked
                                ? "bg-rose-500 text-white hover:bg-rose-600"
                                : "bg-black/75 text-white hover:bg-black"
                        )}
                    >
                        <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                    </Button>

                    <Link to={createPageUrl(`ProductDetails?id=${product.id || product._id}`)}>
                        <Button
                            type="button"
                            size="icon"
                            className="h-11 w-11 rounded-full border border-white/30 bg-black/75 text-white hover:bg-black backdrop-blur-md shadow-xl transition-all duration-300"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Button
                        type="button"
                        onClick={handleAddToCart}
                        className="h-11 rounded-full px-5 bg-black text-white hover:bg-neutral-800 shadow-xl border border-white/10 transition-all duration-300"
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                    </Button>
                </div>
            </div>

            <div className="p-4">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">
                    {product.brand || product.category?.name || 'Product'}
                </p>

                <Link to={createPageUrl(`ProductDetails?id=${product.id || product._id}`)}>
                    <h3 className="font-semibold text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1">
                        {product.title || product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">
                            {product.rating?.toFixed(1) || "4.5"}
                        </span>
                    </div>
                    <span className="text-neutral-300">•</span>
                    <span className="text-xs text-neutral-500">
                        {product.reviews_count || 0} reviews
                    </span>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-xl font-bold text-neutral-900">
                        {formatPriceINR(product.price)}
                    </span>
                    {product.original_price && (
                        <span className="text-sm text-neutral-400 line-through">
                            {formatPriceINR(product.original_price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}