import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function QuantitySelector({
    quantity,
    onQuantityChange,
    min = 1,
    max = 99,
    size = "default",
    className
}) {
    const handleDecrement = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrement = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    const sizeClasses = {
        sm: {
            container: "h-8",
            button: "h-8 w-8",
            text: "text-sm w-10"
        },
        default: {
            container: "h-12",
            button: "h-12 w-12",
            text: "text-base w-16"
        },
        lg: {
            container: "h-14",
            button: "h-14 w-14",
            text: "text-lg w-20"
        }
    };

    const sizes = sizeClasses[size];

    return (
        <div className={cn(
            "inline-flex items-center border border-neutral-200 rounded-full",
            sizes.container,
            className
        )}>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= min}
                className={cn(
                    "rounded-full hover:bg-neutral-100",
                    sizes.button
                )}
            >
                <Minus className="h-4 w-4" />
            </Button>

            <span className={cn(
                "font-medium text-center",
                sizes.text
            )}>
                {quantity}
            </span>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleIncrement}
                disabled={quantity >= max}
                className={cn(
                    "rounded-full hover:bg-neutral-100",
                    sizes.button
                )}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}