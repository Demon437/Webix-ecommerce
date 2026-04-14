import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const brands = [
    { value: "nike", label: "Nike" },
    { value: "adidas", label: "Adidas" },
    { value: "puma", label: "Puma" },
    { value: "levi", label: "Levi's" },
    { value: "tommy", label: "Tommy Hilfiger" },
    { value: "gap", label: "Gap" },
];

const ratings = [5, 4, 3, 2, 1];

export default function ProductFilters({
    filters,
    onFilterChange,
    onClearFilters,
    className,
    maxPrice // 🔥 NEW PROP
}) {
    const [categories, setCategories] = useState([]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categories');
                const data = await response.json();
                const categoryList = data.map(cat => ({
                    value: cat.name.toLowerCase(),
                    label: cat.name,
                    id: cat._id
                }));
                setCategories(categoryList);
            } catch (error) {
                console.warn('Failed to fetch categories:', error);
                setCategories([
                    { value: "men", label: "Men" },
                    { value: "kids", label: "Kids" },
                ]);
            }
        };
        fetchCategories();
    }, []);

    /* ================= HANDLERS ================= */

    const handleCategoryChange = (category, checked) => {
        const newCategories = checked
            ? [...(filters.categories || []), category]
            : (filters.categories || []).filter(c => c !== category);

        onFilterChange({ ...filters, categories: newCategories });
    };

    const handleBrandChange = (brand, checked) => {
        const newBrands = checked
            ? [...(filters.brands || []), brand]
            : (filters.brands || []).filter(b => b !== brand);

        onFilterChange({ ...filters, brands: newBrands });
    };

    const handlePriceChange = (value) => {
        onFilterChange({ ...filters, priceRange: value });
    };

    const handleRatingChange = (rating) => {
        onFilterChange({
            ...filters,
            minRating: rating === filters.minRating ? null : rating
        });
    };

    /* ================= ACTIVE FILTER CHECK ================= */

    const hasActiveFilters =
        (filters.categories?.length > 0) ||
        (filters.brands?.length > 0) ||
        filters.minRating ||
        (filters.priceRange &&
            (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice));

    return (
        <div className={className}>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-neutral-900">Filters</h3>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-neutral-500 hover:text-neutral-900"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                    </Button>
                )}
            </div>

            <Accordion type="multiple" defaultValue={["categories", "price", "rating"]} className="space-y-2">

                {/* ================= CATEGORIES ================= */}
                <AccordionItem value="categories" className="border rounded-xl px-4">
                    <AccordionTrigger className="text-sm font-medium">
                        Categories
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="space-y-3 pb-2">
                            {categories.map((category) => (
                                <div key={category.value} className="flex items-center">
                                    <Checkbox
                                        id={`cat-${category.value}`}
                                        checked={(filters.categories || []).includes(category.value)}
                                        onCheckedChange={(checked) =>
                                            handleCategoryChange(category.value, checked)
                                        }
                                    />

                                    <Label
                                        htmlFor={`cat-${category.value}`}
                                        className="ml-3 text-sm text-neutral-600 cursor-pointer"
                                    >
                                        {category.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ================= PRICE ================= */}
                <AccordionItem value="price" className="border rounded-xl px-4">
                    <AccordionTrigger className="text-sm font-medium">
                        Price Range
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="pb-4 pt-2">

                            <Slider
                                value={filters.priceRange || [0, maxPrice]}
                                onValueChange={handlePriceChange}
                                max={maxPrice} // 🔥 FIX
                                step={10}
                                className="mb-4"
                            />

                            <div className="flex justify-between text-sm text-neutral-600">
                                <span>₹{filters.priceRange?.[0] || 0}</span>
                                <span>₹{filters.priceRange?.[1] || maxPrice}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ================= RATING ================= */}
                <AccordionItem value="rating" className="border rounded-xl px-4">
                    <AccordionTrigger className="text-sm font-medium">
                        Rating
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="space-y-2 pb-2">
                            {ratings.map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating)}
                                    className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                                        filters.minRating === rating
                                            ? 'bg-amber-50 border border-amber-200'
                                            : 'hover:bg-neutral-50'
                                    }`}
                                >
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < rating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-neutral-200 text-neutral-200'
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <span className="text-sm text-neutral-600">& Up</span>
                                </button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ================= BRANDS ================= */}
                <AccordionItem value="brands" className="border rounded-xl px-4">
                    <AccordionTrigger className="text-sm font-medium">
                        Brands
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="space-y-3 pb-2">
                            {brands.map((brand) => (
                                <div key={brand.value} className="flex items-center">
                                    <Checkbox
                                        id={`brand-${brand.value}`}
                                        checked={(filters.brands || []).includes(brand.value)}
                                        onCheckedChange={(checked) =>
                                            handleBrandChange(brand.value, checked)
                                        }
                                    />

                                    <Label
                                        htmlFor={`brand-${brand.value}`}
                                        className="ml-3 text-sm text-neutral-600 cursor-pointer"
                                    >
                                        {brand.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}