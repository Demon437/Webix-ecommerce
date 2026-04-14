import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createPageUrl, formatPriceINR } from "@/utils";
import { useAuth } from '@/lib/AuthContext';

export default function OrderSummary({
    subtotal,
    shipping = 0,
    tax,
    total,
    showCheckoutButton = true,
    showPromoCode = true
}) {
    const [promoCode, setPromoCode] = React.useState("");
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            sessionStorage.setItem('redirectAfterLogin', createPageUrl('Checkout'));
            navigate(createPageUrl('Login'));
        } else {
            navigate(createPageUrl('Checkout'));
        }
    };

    return (
        <div className="bg-neutral-50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-neutral-900 mb-6">
                Order Summary
            </h3>

            {/* PRICE DETAILS */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">{formatPriceINR(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">
                        {shipping === 0 ? (
                            <span className="text-green-600 font-semibold">Free</span>
                        ) : (
                            formatPriceINR(shipping)
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Estimated Tax</span>
                    <span className="font-medium">{formatPriceINR(tax)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">Total</span>
                    <span className="text-2xl font-bold text-neutral-900">
                        {formatPriceINR(total)}
                    </span>
                </div>
            </div>

            {/* PROMO CODE */}
            {showPromoCode && (
                <div className="mt-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="rounded-full"
                        />
                        <Button variant="outline" className="rounded-full">
                            Apply
                        </Button>
                    </div>
                </div>
            )}

            {/* CHECKOUT BUTTON */}
            {showCheckoutButton && (
                <>
                    <Button
                        onClick={handleCheckout}
                        className="w-full mt-6 h-14 bg-neutral-900 hover:bg-neutral-800 rounded-full text-base"
                    >
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    {/* TRUST BADGES */}
                    <div className="flex items-center justify-center gap-6 mt-6 text-neutral-500">
                        <div className="flex items-center gap-2 text-xs">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Truck className="h-4 w-4" />
                            <span>Free Shipping ₹4000+</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}