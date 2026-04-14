import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import ProductSection from '@/components/home/ProductSection';
import OfferBanner from '@/components/home/OfferBanner';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function Home() {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    // Fetch user's cart (only if authenticated)
    const { data: cart = { items: [] } } = useQuery({
        queryKey: ['cart'],
        queryFn: () => base44.entities.Cart.get(),
        enabled: !!isAuthenticated
    });

    // Fetch featured products
    const { data: featuredProducts = [], isLoading: loadingFeatured } = useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => base44.entities.Product.filter({ is_featured: true }, '-created_date', 8),
    });

    // Fetch best sellers
    const { data: bestSellers = [], isLoading: loadingBestSellers } = useQuery({
        queryKey: ['products', 'best_sellers'],
        queryFn: () => base44.entities.Product.filter({ is_best_seller: true }, '-created_date', 4),
    });

    // Fetch trending products
    const { data: trendingProducts = [], isLoading: loadingTrending } = useQuery({
        queryKey: ['products', 'trending'],
        queryFn: () => base44.entities.Product.filter({ is_trending: true }, '-created_date', 4),
    });

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: (product) =>
            base44.entities.Cart.addItem(
                product.id || product._id,
                product.name || product.title,
                product.price,
                product.images?.[0],
                1
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Added to cart');
            window.dispatchEvent(new Event('cartUpdated'));
        },
        onError: () => {
            toast.error('Failed to add to cart');
        }
    });

    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }
        addToCartMutation.mutate(product);
    };

    return (
        <div className="min-h-screen bg-white">
            <HeroBanner />

            <FeaturedCategories />

            <ProductSection
                badge="Popular"
                title="Best Sellers"
                subtitle="Our most loved products by customers worldwide"
                products={bestSellers}
                isLoading={loadingBestSellers}
                onAddToCart={handleAddToCart}
                viewAllLink="Products"
            />

            <OfferBanner />

            <ProductSection
                badge="Hot"
                title="Trending Now"
                subtitle="Discover what's trending in our collection"
                products={trendingProducts}
                isLoading={loadingTrending}
                onAddToCart={handleAddToCart}
                viewAllLink="Products"
            />

            <div className="bg-neutral-50">
                <ProductSection
                    badge="Featured"
                    title="Featured Products"
                    subtitle="Handpicked items just for you"
                    products={featuredProducts}
                    isLoading={loadingFeatured}
                    onAddToCart={handleAddToCart}
                    viewAllLink="Products"
                />
            </div>

            <Testimonials />

            <Newsletter />
        </div>
    );
}