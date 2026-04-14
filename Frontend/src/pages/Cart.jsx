import React, { useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import Loader from '@/components/ui/Loader';

export default function Cart() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const queryClient = useQueryClient();

    // 🔒 Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate(createPageUrl('Login'));
        }
    }, [isAuthenticated, authLoading, navigate]);

    // 🛒 Fetch Cart
    const { data: cart = { items: [] }, isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: () => base44.entities.Cart.get(),
        enabled: !!isAuthenticated
    });

    const cartItems = cart.items || [];

    // 🔄 Update Quantity
    const updateItemMutation = useMutation({
        mutationFn: ({ product_id, quantity }) =>
            base44.entities.Cart.updateItem(product_id, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    // ❌ Remove Item
    const removeItemMutation = useMutation({
        mutationFn: (item_id) =>
            base44.entities.Cart.removeItem(item_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        updateItemMutation.mutate({ product_id: productId, quantity });
    };

    const handleRemove = (itemId) => {
        removeItemMutation.mutate(itemId);
    };

    // 💰 Totals
    const totals = useMemo(() => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const shipping = subtotal >= 50 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        return { subtotal, shipping, tax, total };
    }, [cartItems]);

    // ⏳ Loading
    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <Loader size="lg" />
            </div>
        );
    }

    // 🧾 Empty Cart
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-12 w-12 text-neutral-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                            Your cart is empty
                        </h1>

                        <p className="text-neutral-500 mb-8">
                            Looks like you haven't added anything yet
                        </p>

                        <Link to={createPageUrl('Products')}>
                            <Button className="bg-neutral-900 hover:bg-neutral-800 rounded-full px-8">
                                Start Shopping
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                                Shopping Cart
                            </h1>
                            <p className="text-neutral-500 mt-1">
                                {cartItems.length} items in your cart
                            </p>
                        </div>

                        <Link to={createPageUrl('Products')}>
                            <Button variant="ghost" className="text-neutral-600">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* CART ITEMS */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">

                                {cartItems.map((item, idx) => (
                                    <motion.div
                                        key={item.product_id || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <CartItem
                                            item={item}
                                            onUpdateQuantity={handleUpdateQuantity}
                                            onRemove={() => handleRemove(item._id)}
                                        />
                                    </motion.div>
                                ))}

                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-40">
                                <OrderSummary
                                    subtotal={totals.subtotal}
                                    shipping={totals.shipping}
                                    tax={totals.tax}
                                    total={totals.total}
                                />
                            </div>
                        </div>

                    </div>

                </motion.div>

            </div>
        </div>
    );
}