import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from './api/base44Client';
import { useAuth } from './lib/AuthContext';
import Navbar from './components/ecommerce/Navbar';
import Footer from './components/ecommerce/Footer';

const pagesWithoutLayout = ['Register'];

export default function Layout({ children, currentPageName }) {
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart from backend
  const { data: cart = { items: [] }, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: () => base44.entities.Cart.get(),
    enabled: !!isAuthenticated
  });

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = cart.items || [];
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', () => {
      refetch().then(updateCartCount);
    });

    return () => {
      window.removeEventListener('cartUpdated', () => {
        refetch();
      });
    };
  }, [cart, refetch]);

  // Full screen pages without layout
  if (pagesWithoutLayout.includes(currentPageName)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar cartItemsCount={cartCount} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}