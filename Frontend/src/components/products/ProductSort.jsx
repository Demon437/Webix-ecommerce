import React from 'react';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductFilters from './ProductFilters';

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
];

export default function ProductSort({
    totalProducts,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange,
    filters,
    onFilterChange,
    onClearFilters
}) {
    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
                {/* Mobile Filters */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-6">
                        <ProductFilters
                            filters={filters}
                            onFilterChange={onFilterChange}
                            onClearFilters={onClearFilters}
                        />
                    </SheetContent>
                </Sheet>

                <p className="text-sm text-neutral-600 hidden sm:block">
                    <span className="font-medium text-neutral-900">{totalProducts}</span> products found
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-44 rounded-full">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="hidden sm:flex items-center border rounded-full p-1">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => onViewModeChange("grid")}
                        className="rounded-full h-8 w-8"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => onViewModeChange("list")}
                        className="rounded-full h-8 w-8"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}