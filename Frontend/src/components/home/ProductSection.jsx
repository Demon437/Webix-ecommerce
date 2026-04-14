import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import ProductCard from '../ecommerce/ProductCard';
import Loader from "@/components/ui/Loader";

export default function ProductSection({
    title,
    subtitle,
    badge,
    products,
    isLoading,
    onAddToCart,
    showViewAll = true,
    viewAllLink = "Products",
    columns = 4
}) {
    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
                >
                    <div>
                        {badge && (
                            <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">
                                {badge}
                            </span>
                        )}
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-neutral-500 mt-3 max-w-md">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {showViewAll && (
                        <Link to={createPageUrl(viewAllLink)}>
                            <Button variant="outline" className="rounded-full">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader size="lg" />
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
                        {products?.map((product, idx) => (
                            <motion.div
                                key={product.id || product._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <ProductCard product={product} onAddToCart={onAddToCart} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}