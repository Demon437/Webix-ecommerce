import React from 'react';
import {
    Package,
    ChevronRight,
    Truck,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { formatPriceINR } from "@/utils";

const statusConfig = {
    pending: {
        label: "Pending",
        icon: Clock,
        color: "bg-amber-100 text-amber-800"
    },
    paid: {
        label: "Paid",
        icon: Package,
        color: "bg-blue-100 text-blue-800"
    },
    shipped: {
        label: "Shipped",
        icon: Truck,
        color: "bg-violet-100 text-violet-800"
    },
    delivered: {
        label: "Delivered",
        icon: CheckCircle,
        color: "bg-green-100 text-green-800"
    },
    cancelled: {
        label: "Cancelled",
        icon: XCircle,
        color: "bg-red-100 text-red-800"
    }
};

export default function OrderCard({ order, onViewDetails, onCancel }) {

    const status = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    const orderNumber = order._id
        ? order._id.toString().slice(-8).toUpperCase()
        : "N/A";

    const firstItem = order.items?.[0];
    const firstProduct =
        typeof firstItem?.product === "object"
            ? firstItem.product
            : null;

    return (
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 hover:shadow-lg transition">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-neutral-500">
                        Order #{orderNumber}
                    </p>

                    <p className="text-xs text-neutral-400 mt-1">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </p>
                </div>

                <Badge className={`${status.color} flex items-center gap-1`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                </Badge>
            </div>

            {/* ITEMS PREVIEW */}
            <div className="flex items-center gap-3 mb-4">

                {/* IMAGES */}
                <div className="flex -space-x-3">
                    {order.items?.slice(0, 3).map((item, idx) => {
                        const product =
                            typeof item.product === "object"
                                ? item.product
                                : null;

                        return (
                            <div
                                key={idx}
                                className="h-12 w-12 rounded-lg border-2 border-white bg-neutral-100 overflow-hidden"
                            >
                                <img
                                    src={
                                        product?.image ||
                                        product?.images?.[0] ||
                                        "https://via.placeholder.com/100"
                                    }
                                    alt={product?.name || "Product"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        );
                    })}

                    {order.items?.length > 3 && (
                        <div className="h-12 w-12 rounded-lg border-2 border-white bg-neutral-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-neutral-600">
                                +{order.items.length - 3}
                            </span>
                        </div>
                    )}
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                        {firstProduct?.name || "Product"}
                        {order.items?.length > 1 &&
                            ` +${order.items.length - 1} more`}
                    </p>

                    <p className="text-xs text-neutral-500">
                        {order.items?.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                        )}{" "}
                        items
                    </p>
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">

                {/* PRICE */}
                <div>
                    <p className="text-xs text-neutral-500">Total</p>
                    <p className="text-lg font-semibold text-neutral-900">
                        {formatPriceINR(order.totalAmount)}
                    </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails?.(order)}
                    >
                        View
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>

                    {/* Cancel button only for pending */}
                    {order.status === "pending" && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onCancel?.(order._id)}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}