export const base44 = {
  auth: {
    register: async (email, password, name) => {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    },

    login: async (email, password) => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        localStorage.setItem("currentUser", JSON.stringify(data.user));

        return data.user;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },

    me: async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("currentUser");

      if (!token || !user) {
        return null;
      }

      return JSON.parse(user);
    },

    isAuthenticated: async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("currentUser");
      return !!(token && user);
    },

    redirectToLogin: (redirectUrl = '/login') => {
      if (redirectUrl) {
        sessionStorage.setItem('redirectAfterLogin', redirectUrl);
      }
      window.location.href = '/login';
    },

    logout: async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      return true;
    },

    updateMe: async (data) => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        const user = await response.json();
        localStorage.setItem("currentUser", JSON.stringify(user));
        return user;
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    }
  },



  

  entities: {
    Category: {
      list: async () => {
        const response = await fetch("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        return Array.isArray(data) ? data : data.categories;
      },

      filter: async (filters) => {
        const params = new URLSearchParams();

        if (filters.name) params.append("name", filters.name);

        const response = await fetch(
          `http://localhost:5000/api/categories?${params}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          }
        );

        const data = await response.json();

        return Array.isArray(data) ? data : data.categories;
      }
    },

    Product: {
      list: async (sortBy, limit = 15, page = 1) => {
        try {
          const params = new URLSearchParams();

          if (limit) params.append("limit", limit);
          if (sortBy) params.append("sortBy", sortBy);
          if (page) params.append("page", page);

          const response = await fetch(
            `http://localhost:5000/api/products?${params.toString()}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`
              }
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch products");
          }

          // 🔥 IMPORTANT: return full response (pagination included)
          return {
            products: data.products || [],
            total: data.pagination?.total || 0,
            page: data.pagination?.page || 1,
            pages: data.pagination?.pages || 1
          };

        } catch (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
      },

      filter: async (filters, sortBy, limit) => {
        const params = new URLSearchParams();

        if (filters.is_featured) params.append("is_featured", true);
        if (filters.is_best_seller) params.append("is_best_seller", true);
        if (filters.is_trending) params.append("is_trending", true);
        if (filters.category) params.append("category", filters.category);
        if (filters.id) params.append("id", filters.id);
        if (limit) params.append("limit", limit);
        if (sortBy) params.append("sortBy", sortBy);

        const response = await fetch(
          `http://localhost:5000/api/products?${params}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to filter products");
        }

        const data = await response.json();

        return Array.isArray(data) ? data : data.products;
      },

      getSingle: async (productId) => {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        return data;
      },

      remove: async (productId) => {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        return await response.json();
      }
    },

    Review: {
      filter: async () => {
        // Reviews not implemented in backend yet
        return [];
      }
    },

    Order: {
      list: async (limit) => {
        const response = await fetch("http://localhost:5000/api/orders/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        return limit ? data.slice(0, limit) : data;
      },

      filter: async (filters, sortBy, limit) => {
        const response = await fetch("http://localhost:5000/api/orders/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await response.json();

        let result = data;

        if (filters.user_id) {
          result = result.filter(order => order.user_id === filters.user_id);
        }

        return limit ? result.slice(0, limit) : result;
      }
    },

    Cart: {
      // Get user's cart
      get: async () => {
        try {
          const response = await fetch('http://localhost:5000/api/cart', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch cart');
          }

          const data = await response.json();
          return data || { items: [], totalItems: 0, totalPrice: 0 };
        } catch (error) {
          console.error('Error fetching cart:', error);
          return { items: [], totalItems: 0, totalPrice: 0 };
        }
      },

      // Add item to cart
      addItem: async (product_id, name, price, image, quantity = 1) => {
        try {
          const response = await fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({
              product_id,
              name,
              price,
              image,
              quantity
            })
          });

          if (!response.ok) {
            throw new Error('Failed to add item to cart');
          }

          const data = await response.json();
          return data.cart || data;
        } catch (error) {
          console.error('Error adding to cart:', error);
          throw error;
        }
      },

      // Update cart item quantity
      updateItem: async (product_id, quantity) => {
        try {
          const response = await fetch('http://localhost:5000/api/cart/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({
              product_id,
              quantity
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update cart');
          }

          const data = await response.json();
          return data.cart || data;
        } catch (error) {
          console.error('Error updating cart:', error);
          throw error;
        }
      },

      // Remove item from cart
      removeItem: async (product_id) => {
        try {
          const response = await fetch('http://localhost:5000/api/cart/remove', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({ product_id })
          });

          if (!response.ok) {
            throw new Error('Failed to remove item from cart');
          }

          const data = await response.json();
          return data.cart || data;
        } catch (error) {
          console.error('Error removing from cart:', error);
          throw error;
        }
      },

      // Clear entire cart
      clear: async () => {
        try {
          const response = await fetch('http://localhost:5000/api/cart/clear', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to clear cart');
          }

          const data = await response.json();
          return data.cart || data;
        } catch (error) {
          console.error('Error clearing cart:', error);
          throw error;
        }
      }
    },

    Like: {
      // Toggle like/favorite for a product
      toggle: async (productId) => {
        try {
          const response = await fetch('http://localhost:5000/api/products/like/toggle', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({ productId })
          });

          if (!response.ok) {
            throw new Error('Failed to toggle like');
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error toggling like:', error);
          throw error;
        }
      },

      // Get all liked products
      getAll: async () => {
        try {
          const response = await fetch('http://localhost:5000/api/products/like/all', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch likes');
          }

          const data = await response.json();
          return data || [];
        } catch (error) {
          console.error('Error fetching likes:', error);
          return [];
        }
      },

      // Check if product is liked
      check: async (productId) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/products/like/check/${productId}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
              }
            }
          );

          if (!response.ok) {
            throw new Error('Failed to check like status');
          }

          const data = await response.json();
          return data.isLiked || false;
        } catch (error) {
          console.error('Error checking like status:', error);
          return false;
        }
      }
    },

    Address: {
      // Get all addresses for current user
      list: async (sortBy, limit) => {
        try {
          const response = await fetch('http://localhost:5000/api/addresses', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch addresses');
          }

          const data = await response.json();
          let addresses = Array.isArray(data) ? data : data.addresses || [];

          // Apply limit if specified
          if (limit) addresses = addresses.slice(0, limit);

          return addresses;
        } catch (error) {
          console.error('Error fetching addresses:', error);
          throw error;
        }
      },

      // Create new address
      create: async (addressData) => {
        try {
          // 🔥 REMOVE user_id if coming from frontend
          const { user_id, ...cleanData } = addressData;

          const response = await fetch('http://localhost:5000/api/addresses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(cleanData) // ✅ clean data only
          });

          const data = await response.json(); // ✅ get real error

          if (!response.ok) {
            throw new Error(data.message || 'Failed to create address');
          }

          return data;

        } catch (error) {
          console.error('Error creating address:', error);
          throw error;
        }
      },

      // Get single address
      get: async (id) => {
        try {
          const response = await fetch(`http://localhost:5000/api/addresses/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }

          return await response.json();
        } catch (error) {
          console.error('Error fetching address:', error);
          throw error;
        }
      },

      // Update address
      update: async (id, addressData) => {
        try {
          const response = await fetch(`http://localhost:5000/api/addresses/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(addressData)
          });

          if (!response.ok) {
            throw new Error('Failed to update address');
          }

          return await response.json();
        } catch (error) {
          console.error('Error updating address:', error);
          throw error;
        }
      },

      // Delete address
      delete: async (id) => {
        try {
          const response = await fetch(`http://localhost:5000/api/addresses/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete address');
          }

          return await response.json();
        } catch (error) {
          console.error('Error deleting address:', error);
          throw error;
        }
      }
    }
  }
};