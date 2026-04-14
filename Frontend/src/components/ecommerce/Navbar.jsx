import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const categories = [
  { name: "Men", slug: "men" },
  { name: "Women", slug: "women" },
  { name: "Kids", slug: "kids" },
];

export default function Navbar({ cartItemsCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch like count on mount and when cart updates
  useEffect(() => {
    const fetchLikeCount = async () => {
      if (isAuthenticated) {
        try {
          const { base44 } = await import("@/api/base44Client");
          const likes = await base44.entities.Like.getAll();
          setLikeCount(likes?.length || 0);
        } catch (error) {
          console.error("Error fetching like count:", error);
        }
      }
    };

    fetchLikeCount();

    // Listen for like/unlike events
    const handleLikeUpdated = () => {
      fetchLikeCount();
    };

    window.addEventListener("likeUpdated", handleLikeUpdated);
    return () => window.removeEventListener("likeUpdated", handleLikeUpdated);
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        createPageUrl(`Products?search=${encodeURIComponent(searchQuery)}`),
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate(createPageUrl("Home"));
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-xs">
          <p>Free shipping on orders over ₹4000+</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">
              Track Order
            </a>
            <a href="#" className="hover:text-neutral-300 transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <Link
                    to={createPageUrl("Home")}
                    className="text-2xl font-bold tracking-tight"
                  >
                    LUXE
                  </Link>
                </div>
                <nav className="flex-1 p-6">
                  <ul className="space-y-4">
                    {categories.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          to={{
                            pathname: createPageUrl("Products"),
                            search: `?category=${cat.slug}`,
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 text-lg font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="p-6 border-t">
                  {user ? (
                    <div className="space-y-3">
                      <p className="text-sm text-neutral-500">
                        Welcome, {user.full_name}
                      </p>
                      <Link
                        to={createPageUrl("Dashboard")}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center py-2 bg-neutral-900 text-white rounded-lg"
                      >
                        My Account
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={createPageUrl("Login")}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center py-2 bg-neutral-900 text-white rounded-lg"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            to={createPageUrl("Home")}
            className="text-xl lg:text-2xl font-bold tracking-tight text-neutral-900"
          >
            LUXE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.slug}
                to={{
                  pathname: createPageUrl("Products"),
                  search: `?category=${cat.slug}`,
                }}
                className="text-sm font-medium text-neutral-600 hover:text-black transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuContent align="end" className="w-48">
                {categories.slice(5).map((cat) => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link
                      to={{
                        pathname: createPageUrl("Products"),
                        search: `?category=${cat.slug}`,
                      }}
                    >
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  type="search"
                  placeholder="Search for products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-52 lg:w-72 pl-10 rounded-full border-neutral-200 focus:border-black focus:ring-1 focus:ring-black transition"
                />
              </div>
            </form>

            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <div
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please login to view your wishlist");
                  navigate(createPageUrl("Login"));
                } else {
                  navigate(createPageUrl("Wishlist"));
                }
              }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:bg-gray-100 rounded-full"
              >
                <Heart className="h-5 w-5" />
              </Button>
              {likeCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium bg-rose-500 text-white rounded-full">
                  {likeCount}
                </span>
              )}
            </div>

            {/* Cart */}
            <Link to={createPageUrl("Cart")}>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 rounded-full"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium bg-neutral-900 text-white rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-semibold shadow">
                      {user.full_name?.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 rounded-xl p-2"
                >
                  {/* USER INFO */}
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>

                  <DropdownMenuSeparator />

                  {/* DASHBOARD */}
                  <DropdownMenuItem asChild>
                    <Link
                      to={createPageUrl("Dashboard")}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100"
                    >
                      📦 Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to={createPageUrl("Dashboard")}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100"
                    >
                      👤 Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* LOGOUT */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 rounded-lg px-2 py-2"
                  >
                    🚪 Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to={createPageUrl("Login")}>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
