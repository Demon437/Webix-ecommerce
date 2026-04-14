import React, { useState } from 'react';
import { MapPin, Pencil, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "../../api/base44Client";
export default function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
    const [loading, setLoading] = useState(false);

    // 🔥 Fetch single address using service
    const handleEditClick = async () => {
        if (!address?._id) {
            console.warn("❌ Address ID missing");
            return;
        }

        try {
            setLoading(true);
            console.log("📡 Fetching address:", address._id);

            const data = await base44.entities.Address.get(address._id);

            console.log("✅ Address fetched:", data);

            // send fresh backend data to parent (modal etc.)
            onEdit?.(data);

        } catch (err) {
            console.error("❌ Failed to fetch address:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all">

            {/* Default Badge */}
            {address?.is_default && (
                <Badge className="absolute top-3 right-3 bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Default
                </Badge>
            )}

            {/* Content */}
            <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-neutral-600" />
                </div>

                <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 mb-1">
                        {address?.label || "Address"}
                    </h4>

                    <p className="text-sm text-neutral-600">{address?.full_name}</p>
                    <p className="text-sm text-neutral-600">{address?.address}</p>
                    <p className="text-sm text-neutral-600">
                        {address?.city}, {address?.state} {address?.zip_code}
                    </p>
                    <p className="text-sm text-neutral-600">{address?.country}</p>

                    {address?.phone && (
                        <p className="text-sm text-neutral-500 mt-1">{address.phone}</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">

                {/* Edit */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditClick}
                    disabled={loading}
                    className="text-neutral-600"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                        <Pencil className="h-4 w-4 mr-1" />
                    )}
                    {loading ? "Loading..." : "Edit"}
                </Button>

                {/* Delete */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(address._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                </Button>

                {/* Set Default */}
                {!address?.is_default && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSetDefault?.(address._id)}
                        className="ml-auto text-neutral-600"
                    >
                        Set as Default
                    </Button>
                )}
            </div>
        </div>
    );
}