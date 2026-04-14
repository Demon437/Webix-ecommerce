import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatPriceINR } from "@/utils";
import { createPageUrl } from "@/utils";
import QuantitySelector from '../products/QuantitySelector';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
    return (
        <div className="flex gap-4 py-6 border-b border-neutral-100">
            {/* Image */}
            <Link
                to={createPageUrl(`ProductDetails?id=${item.product_id}`)}
                className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-neutral-100"
            >
                <img
                    src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </Link>

            {/* Details */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Link
                            to={createPageUrl(`ProductDetails?id=${item.product_id}`)}
                            className="font-semibold text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-2"
                        >
                            {item.name}
                        </Link>
                        {item.variant && (
                            <p className="text-sm text-neutral-500 mt-1">{item.variant}</p>
                        )}
                    </div>
                    <p className="font-semibold text-neutral-900 whitespace-nowrap">
                        {formatPriceINR(item.price * item.quantity)}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4">
                    <QuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={(qty) => onUpdateQuantity(item.product_id, qty)}
                        size="sm"
                    />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(item.product_id)}
                        className="text-neutral-400 hover:text-red-500"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Remove</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}