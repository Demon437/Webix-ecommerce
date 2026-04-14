import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createPageUrl, formatPriceINR } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/cart/OrderSummary";
import Loader from "@/components/ui/Loader";

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [address, setAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardDetails, setCardDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Check authentication and redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", createPageUrl("Checkout"));
      navigate(createPageUrl("Login"));
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch cart from backend
  const { data: cart = { items: [] }, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => base44.entities.Cart.get(),
    enabled: !!isAuthenticated,
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart.items || cart.items.length === 0)) {
      navigate(createPageUrl("Cart"));
    }
  }, [cart, cartLoading, navigate]);

  // Check auth and load user addresses
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        return await base44.auth.me();
      }
      return null;
    },
  });

  const { data: savedAddresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => base44.entities.Address.list("-created_date", 10),
    enabled: !!user,
  });

  // Auto-fill default address
  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddr =
        savedAddresses.find((a) => a.is_default) || savedAddresses[0];

      setAddress({
        full_name: defaultAddr.full_name || defaultAddr.name || "",
        address: defaultAddr.address || defaultAddr.street || "",
        city: defaultAddr.city || "",
        state: defaultAddr.state || "",
        zip_code: defaultAddr.zip_code || defaultAddr.postal_code || "",
        country: defaultAddr.country || "",
        phone: defaultAddr.phone || defaultAddr.phone_number || "",
      });
    }
  }, [savedAddresses]);

  const cartItems = cart.items || [];

  const totals = useMemo(() => {
    console.log("Cart Items:", cartItems);
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    console.log(
      "Calculated Totals - Subtotal:",
      subtotal,
      "Shipping:",
      shipping,
      "Tax:",
      tax,
      "Total:",
      total,
    );
    return { subtotal, shipping, tax, total };
  }, [cartItems]);

  const validateForm = () => {
    const newErrors = {};
    if (!address.full_name) newErrors.full_name = "Full name is required";
    if (!address.address) newErrors.address = "Address is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.zip_code || address.zip_code.length !== 6) {
      newErrors.zip_code = "ZIP code must be 6 digits";
    }
    if (!address.country) newErrors.country = "Country is required";
    if (!address.phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate form before proceeding
      if (!validateForm()) {
        toast.error("Please fill in all shipping address fields");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(true);

      // Convert dollars to rupees to paise (as integer to avoid floating point errors)
      const amountInPaise = Math.round(totals.total * 100);
      console.log("Checkout Total (INR):", totals.total);
      console.log("Amount sent to Razorpay (paise):", amountInPaise);

      console.log("Order Total (USD):", totals.total);
      console.log("Order Total (Paise):", amountInPaise);
      console.log("Order Total (INR):", amountInPaise / 100);
      console.log("Sending to backend:", { amount: amountInPaise });

      const res = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountInPaise,
            items: cartItems,
            totalAmount: totals.total,
          }),
        },
      );

      const data = await res.json();
      console.log("Response from backend:", data);
      console.log("Amount in Razorpay options (paise):", data.amount);

      const options = {
        key: "rzp_test_SOIgtEyONe60Oe",
        amount: data.amount,
        currency: "INR",
        name: "My Ecommerce Store",
        description: "Order Payment",
        order_id: data.id,

        prefill: {
          name: address.full_name || "Customer Name",
          email: user?.email || "customer@email.com",
          contact: address.phone || "9999999999",
        },

        handler: async function (response) {
          console.log("Payment Success:", response);

          try {
            // ✅ STEP 1: VERIFY PAYMENT (ONLY VERIFY)
            const verifyRes = await fetch(
              "http://localhost:5000/api/payment/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              toast.error(verifyData.error || "Payment verification failed");
              return;
            }

            // ✅ STEP 2: CREATE ORDER (ONLY NECESSARY DATA)
            const orderRes = await fetch("http://localhost:5000/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                shippingAddress: address,
              }),
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
              toast.error(orderData.error || "Order creation failed");
              return;
            }

            console.log("✅ Order created:", orderData);

            // ✅ UI UPDATE
            setOrderNumber(orderData._id);
            setOrderComplete(true);

            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });

            toast.success("Payment Successful! Order created.");
          } catch (error) {
            console.error("Payment error:", error);
            toast.error("Something went wrong");
          }
        },

        theme: {
          color: "#000000",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      toast.error("Payment failed");
    }
  };

  if (cartLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader size="lg" />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-20">
        <div className="max-w-lg mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-neutral-500 mb-4">Thank you for your purchase</p>
            <p className="text-sm text-neutral-600 bg-neutral-100 rounded-lg py-2 px-4 inline-block mb-8">
              Order Number:{" "}
              <span className="font-mono font-medium">{orderNumber}</span>
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate(createPageUrl("Dashboard"))}
                className="w-full bg-neutral-900 hover:bg-neutral-800 rounded-full"
              >
                View Order
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(createPageUrl("Products"))}
                className="w-full rounded-full"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 lg:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
                {/* 🔥 Address Selector */}
                {savedAddresses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Select Address
                    </h3>
                    <button
                      onClick={() => setAddress({})}
                      className="text-sm text-blue-600 hover:underline mt-2"
                    >
                      + Add New Address
                    </button>

                    <div className="grid gap-3">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => {
                            setAddress({
                              full_name: addr.full_name || addr.name || "",
                              address: addr.address || addr.street || "",
                              city: addr.city || "",
                              state: addr.state || "",
                              zip_code: addr.zip_code || addr.postal_code || "",
                              country: addr.country || "",
                              phone: addr.phone || addr.phone_number || "",
                            });
                          }}
                          className={`p-4 border rounded-xl cursor-pointer transition ${
                            address?.address === (addr.address || addr.street)
                              ? "border-black bg-gray-50"
                              : "border-gray-200 hover:border-black"
                          }`}
                        >
                          <p className="font-medium">
                            {addr.full_name || addr.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {addr.address || addr.street}, {addr.city}
                          </p>
                          <p className="text-xs text-gray-400">
                            {addr.phone || addr.phone_number}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing Form */}
                <ShippingForm
                  address={address}
                  onChange={setAddress}
                  errors={errors}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-40 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg text-neutral-900 mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex items-center gap-3"
                      >
                        <div className="h-16 w-16 rounded-lg bg-neutral-100 overflow-hidden">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-neutral-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPriceINR(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <OrderSummary
                  subtotal={totals.subtotal}
                  shipping={totals.shipping}
                  tax={totals.tax}
                  total={totals.total}
                  showCheckoutButton={false}
                  showPromoCode={false}
                />

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 rounded-full text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Place Order • {formatPriceINR(totals.total)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-neutral-500">
                  By placing this order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
