import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

import ProductCard from '@/components/ecommerce/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import Pagination from '@/components/ecommerce/Pagination';
import Loader from '@/components/ui/Loader';
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

export default function Products() {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({
        categories: [],
        brands: [],
        priceRange: [0, 0], // temporary
        minRating: null
    });
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);

    const [searchParams] = useSearchParams();

    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    // Update filters when URL changes
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            categories: categoryParam ? [categoryParam] : []
        }));
        setCurrentPage(1);
    }, [categoryParam]);

    // Fetch all products
    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => base44.entities.Product.list('-created_date', 100),
    });

    const allProducts = data?.products || [];
    console.log("API response:", allProducts);

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

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = Array.isArray(allProducts) ? [...allProducts] : [];
        // Search filter
        if (searchParam) {
            const search = searchParam.toLowerCase();
            result = result.filter(p =>
                p.name?.toLowerCase().includes(search) ||
                p.title?.toLowerCase().includes(search) ||
                p.description?.toLowerCase().includes(search) ||
                p.brand?.toLowerCase().includes(search)
            );
        }

        // Category filter
        if (filters.categories?.length > 0) {
            result = result.filter(p => {
                const categoryName =
                    typeof p.category === "string"
                        ? p.category
                        : (p.category?.name || "");

                return filters.categories.some(cat =>
                    categoryName.toLowerCase() === cat.toLowerCase()
                );
            });
        }

        // Brand filter
        if (filters.brands?.length > 0) {
            result = result.filter(p => filters.brands.includes(p.brand?.toLowerCase()));
        }

        // Price filter
        if (filters.priceRange) {
            result = result.filter(p =>
                p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
            );
        }

        // Rating filter
        if (filters.minRating) {
            result = result.filter(p => (p.rating || 0) >= filters.minRating);
        }

        // Sort
        switch (sortBy) {
            case 'price_low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'popular':
                result.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
                break;
            default: // newest
                result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        }

        return result;
    }, [allProducts, filters, sortBy, searchParam]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }
        addToCartMutation.mutate(product);
    };

    const clearFilters = () => {
        setFilters({
            categories: [],
            brands: [],
            priceRange: [0, maxPrice],
            minRating: null
        });
        setCurrentPage(1);
    };


    const maxPrice = Math.max(
        ...allProducts.map(p => Number(p.price || 0)),
        0
    );
    useEffect(() => {
        if (allProducts.length > 0 && filters.priceRange[1] === 0 && filters.priceRange[0] === 0) {
            const max = Math.max(
                ...allProducts.map(p => Number(p.price || 0))
            );

            setFilters(prev => ({
                ...prev,
                priceRange: [0, max]
            }));
        }
    }, [allProducts]);
    return (
        <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                        {searchParam ? `Search: "${searchParam}"` :
                            categoryParam ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) :
                                'All Products'}
                    </h1>
                    <p className="text-neutral-500 mt-2">
                        Discover our curated collection of premium products
                    </p>
                </motion.div>

                <div className="flex gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-40">
                            <ProductFilters
                                filters={filters}
                                onFilterChange={(f) => { setFilters(f); setCurrentPage(1); }}
                                onClearFilters={clearFilters}
                                maxPrice={maxPrice}
                            />
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <ProductSort
                            totalProducts={filteredProducts.length}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            filters={filters}
                            onFilterChange={(f) => { setFilters(f); setCurrentPage(1); }}
                            onClearFilters={clearFilters}
                        />

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader size="lg" />
                            </div>
                        ) : paginatedProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900">No products found</h3>
                                <p className="text-neutral-500 mt-1">Try adjusting your filters or search term</p>
                            </div>
                        ) : (
                            <>
                                <div className={`grid gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                                    : 'grid-cols-1'
                                    }`}>
                                    {paginatedProducts.map((product, idx) => (
                                        <motion.div
                                            key={product.id || product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                viewMode={viewMode}
                                                onAddToCart={handleAddToCart}
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                        className="mt-12"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}