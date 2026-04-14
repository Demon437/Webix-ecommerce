import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import CategoryCard from '../ecommerce/CategoryCard';
import Loader from '@/components/ui/Loader';

export default function FeaturedCategories() {
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => base44.entities.Category.list(),
    });

    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">
                        Explore
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                        Shop by Category
                    </h2>
                    <p className="text-neutral-500 mt-3 max-w-md mx-auto">
                        Browse through our diverse range of categories and find exactly what you're looking for
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader size="lg" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {categories.slice(0, 2).map((cat, idx) => (
                            <motion.div
                                key={cat._id || cat.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <CategoryCard
                                    category={cat.name || cat.name}
                                    productCount={cat.count || 0}
                                    size="large"
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}