import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ecommerce/ProductCard';
import ProductSort from '@/components/products/ProductSort';
import Pagination from '@/components/ecommerce/Pagination';
import Loader from '@/components/ui/Loader';
import { createPageUrl } from '@/utils';
import { Heart } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function Wishlist() {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch liked products
    const { data: allProducts = [], isLoading, refetch } = useQuery({
        queryKey: ['wishlist'],
        queryFn: () => base44.entities.Like.getAll(),
        enabled: isAuthenticated,
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

    // Sort products
    const sortedProducts = React.useMemo(() => {
        let result = [...allProducts];

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
    }, [allProducts, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = sortedProducts.slice(
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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center py-20">
                        <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                            <Heart className="h-12 w-12 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">Please login to view your wishlist</h3>
                        <p className="text-neutral-500 mt-1">Sign in to see your favorite items</p>
                        <Link
                            to={createPageUrl("Login")}
                            className="inline-block mt-6 px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                            My Wishlist
                        </h1>
                    </div>
                    <p className="text-neutral-500 mt-2">
                        {allProducts.length === 0
                            ? 'No items in your wishlist yet'
                            : `You have ${allProducts.length} item${allProducts.length !== 1 ? 's' : ''} in your wishlist`}
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader size="lg" />
                    </div>
                ) : allProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                            <Heart className="h-12 w-12 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">Your wishlist is empty</h3>
                        <p className="text-neutral-500 mt-1">Add items to your wishlist to save them for later</p>
                        <Link
                            to={createPageUrl("Products")}
                            className="inline-block mt-6 px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <ProductSort
                            totalProducts={sortedProducts.length}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />

                        <div className={`grid gap-6 mt-8 ${viewMode === 'grid'
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
    );
}
