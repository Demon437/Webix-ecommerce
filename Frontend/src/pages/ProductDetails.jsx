import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import {
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  Star,
  ChevronRight,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import ImageGallery from "@/components/products/ImageGallery";
import QuantitySelector from "@/components/products/QuantitySelector";
import ProductCard from "@/components/ecommerce/ProductCard";
import Loader from "@/components/ui/Loader";

import { createPageUrl, formatPriceINR } from "@/utils";
import { cn } from "@/lib/utils";

export default function ProductDetails() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isCheckingLike, setIsCheckingLike] = useState(false);

  // Fetch product
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => base44.entities.Product.getSingle(productId),
    enabled: !!productId
  });

  // Check like status when product loads
  useEffect(() => {
    if (product && isAuthenticated) {
      checkLikeStatus();
    }
  }, [product?._id, isAuthenticated]);

  const checkLikeStatus = async () => {
    try {
      const liked = await base44.entities.Like.check(product.id || product._id);
      setIsLiked(liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }

    setIsCheckingLike(true);
    try {
      const result = await base44.entities.Like.toggle(product.id || product._id);
      setIsLiked(result.isLiked);
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to update favorite");
    } finally {
      setIsCheckingLike(false);
    }
  };

  // Related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related", product?.category?._id],
    queryFn: () =>
      base44.entities.Product.filter({ category: product.category._id }, "-createdAt", 4),
    enabled: !!product?.category?._id
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: () =>
      base44.entities.Cart.addItem(
        product.id || product._id,
        product.name || product.title,
        product.price,
        product.images?.[0],
        quantity
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    },
    onError: () => {
      toast.error("Failed to add to cart");
    }
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to={createPageUrl("Products")}>Back to products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">

      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <Link to={createPageUrl("Home")}>Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={createPageUrl("Products")}>Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span>{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ImageGallery images={product.images || []} />
          </motion.div>

          {/* Product Info */}
          <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <div className="flex items-center gap-3">

              {product.brand && (
                <Badge variant="secondary">{product.brand}</Badge>
              )}

              {product.is_trending && (
                <Badge className="bg-violet-500">Trending</Badge>
              )}

              {product.is_best_seller && (
                <Badge className="bg-orange-500">Best Seller</Badge>
              )}

            </div>

            <h1 className="text-3xl font-bold">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-neutral-200 text-neutral-200"
                    }`}
                />
              ))}

              <span>{product.rating || 0}</span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold">
              {formatPriceINR(product.price)}
            </div>

            {/* Description */}
            <p className="text-neutral-600">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">
                    In Stock ({product.stock})
                  </span>
                </>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>

            <Separator />

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="font-medium mb-2">Sizes</p>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <Badge key={size}>{size}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="font-medium mb-2">Colors</p>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <Badge key={color}>{color}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={product.stock}
              />

              <Button
                onClick={handleAddToCart}
                disabled={!product.stock}
                className="flex-1 h-14 bg-neutral-900 rounded-full"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                onClick={handleToggleLike}
                disabled={isCheckingLike}
                variant={isLiked ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-14 w-14 rounded-full transition-all",
                  isLiked && "bg-rose-500 hover:bg-rose-600 border-rose-500"
                )}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              </Button>

              <Button variant="outline" size="icon" className="h-14 w-14 rounded-full">
                <Share2 />
              </Button>

            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">

              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <Truck className="mx-auto mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
              </div>

              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <RotateCcw className="mx-auto mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
              </div>

              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <Shield className="mx-auto mb-2" />
                <p className="text-sm font-medium">Warranty</p>
              </div>

            </div>

          </motion.div>

        </div>

        {/* Related products */}

        {relatedProducts?.length > 0 && (

          <section className="mt-20">

            <h2 className="text-2xl font-bold mb-8">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {relatedProducts
                .filter(p => p._id !== product._id)
                .slice(0, 4)
                .map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}

            </div>

          </section>

        )}

      </div>
    </div>
  );
}