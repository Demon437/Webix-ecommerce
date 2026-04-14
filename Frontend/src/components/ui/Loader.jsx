import React from 'react';
import { cn } from "@/lib/utils";

export default function Loader({ size = "default", className }) {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        default: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4"
    };

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <div
                className={cn(
                    "animate-spin rounded-full border-neutral-200 border-t-neutral-900",
                    sizeClasses[size]
                )}
            />
        </div>
    );
}