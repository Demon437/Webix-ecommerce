import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Package,
  User,
  MapPin,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createPageUrl } from "@/utils";
import OrderCard from "@/components/dashboard/OrderCard";
import ProfileForm from "@/components/dashboard/ProfileForm";
import AddressCard from "@/components/dashboard/AddressCard";
import ShippingForm from "@/components/checkout/ShippingForm";
import Loader from "@/components/ui/Loader";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("orders");
  const [addressDialog, setAddressDialog] = useState({
    open: false,
    address: null,
  });

  const emptyAddress = {
    full_name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    phone: "",
  };

  // Check authentication
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl("Dashboard"));
        return null;
      }
      return await base44.auth.me();
    },
  });

  // Fetch orders
  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("🔥 Orders:", orders);

      const data = await res.json();
      console.log("🔥 Orders API Response:", data);
      return Array.isArray(data) ? data : data.orders || [];
    },
    enabled: !!user,
  });

  // Fetch addresses
  const { data: addresses = [], isLoading: loadingAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => base44.entities.Address.list("-created_date", 20),
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated successfully");
    },
  });

  // Address mutations
  const createAddressMutation = useMutation({
    mutationFn: async (data) => {
      console.log("API CALL DATA:", data);

      if (!base44.entities || !base44.entities.Address) {
        throw new Error("Address entity not loaded yet");
      }

      const res = await base44.entities.Address.create({
        ...data,
      });

      console.log("API RESPONSE:", res);
      return res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setAddressDialog({ open: false, address: null });
      toast.success("Address saved");
    },

    onError: (error) => {
      console.error("SAVE ERROR:", error);
      toast.error(error.message || "Failed to save address");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Address.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setAddressDialog({ open: false, address: null });
      toast.success("Address updated");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id) => base44.entities.Address.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted");
    },
  });

  const handleSaveAddress = (addressData) => {
    console.log("SAVING DATA:", addressData);

    if (addressDialog.address?._id) {
      updateAddressMutation.mutate({
        id: addressDialog.address._id,
        data: addressData,
      });
    } else {
      createAddressMutation.mutate(addressData);
    }
  };

  const handleSetDefault = async (id) => {
    console.log("SET DEFAULT ID:", id);

    for (const addr of addresses) {
      if (addr.is_default && addr._id !== id) {
        await base44.entities.Address.update(addr._id, { is_default: false });
      }
    }

    await base44.entities.Address.update(id, { is_default: true });

    queryClient.invalidateQueries({ queryKey: ["addresses"] });
    toast.success("Default address updated");
  };

  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl("Home"));
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 lg:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                👋 Hi, {user.full_name?.split(" ")[0]}
              </h1>
              <p className="text-neutral-500 mt-1">
                Here’s what’s happening with your account
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-neutral-600 w-fit"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-xl font-bold">{orders.length}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-500">Addresses</p>
              <p className="text-xl font-bold">{addresses.length}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-500">Account</p>
              <p className="text-green-600 font-semibold">Active</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-500">User</p>
              <p className="text-xl font-bold">
                {user.full_name?.split(" ")[0]}
              </p>
            </div>
          </div>

          {/* NEW DASHBOARD LAYOUT */}
          <div className="grid grid-cols-12 gap-6 mt-6">
            {/* SIDEBAR */}
            <div className="col-span-12 md:col-span-3 bg-white rounded-2xl p-5 shadow-md border border-gray-100 h-fit">
              <p className="text-xs text-gray-400 mb-3 px-2">ACCOUNT</p>
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "orders", label: "Orders", icon: Package },
                { id: "addresses", label: "Addresses", icon: MapPin },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-2 transition 
        ${
          activeTab === item.id
            ? "bg-black text-white shadow"
            : "text-gray-600 hover:bg-gray-100 hover:text-black"
        }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl mt-4 text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="col-span-12 md:col-span-9 space-y-6">
              {/* ORDERS */}
              {activeTab === "orders" && (
                <div className="mt-2">
                  {loadingOrders ? (
                    <div className="flex justify-center py-12">
                      <Loader size="lg" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-24 bg-gradient-to-b from-gray-50 to-white rounded-2xl border shadow-sm">
                      <div className="text-6xl mb-4">📦</div>

                      <h2 className="text-2xl font-semibold">No orders yet</h2>

                      <p className="text-gray-500 mt-2">
                        Looks like you haven’t started shopping yet.
                      </p>

                      <Button className="mt-6 rounded-full bg-black hover:bg-gray-800">
                        Start Shopping →
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {orders.map((order) => (
                        <OrderCard
                          key={order._id}
                          order={order}
                          onViewDetails={(order) => setSelectedOrder(order)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE */}
              {activeTab === "profile" && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* PROFILE CARD */}
                  <div className="bg-white rounded-2xl p-6 shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold shadow">
                        {user.full_name?.charAt(0)}
                      </div>

                      <h2 className="mt-3 font-semibold text-lg">
                        {user.full_name || "User"}
                      </h2>

                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Total Orders</span>
                        <span className="font-semibold">{orders.length}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Account Type</span>
                        <span className="font-semibold">Customer</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Status</span>
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* EDIT PROFILE */}
                  <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow">
                    <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

                    <ProfileForm
                      user={user}
                      onSave={(data) => updateProfileMutation.mutate(data)}
                      isSaving={updateProfileMutation.isPending}
                    />
                  </div>
                </div>
              )}

              {/* ADDRESSES */}
              {activeTab === "addresses" && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Saved Addresses</h3>

                    <Button
                      onClick={() =>
                        setAddressDialog({ open: true, address: emptyAddress })
                      }
                      className="rounded-full bg-black hover:bg-gray-800"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </div>

                  {loadingAddresses ? (
                    <div className="flex justify-center py-12">
                      <Loader size="lg" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                      <div className="text-6xl mb-4">📍</div>

                      <h2 className="text-2xl font-semibold">
                        No saved addresses
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Add an address for faster checkout
                      </p>

                      <Button
                        onClick={() =>
                          setAddressDialog({
                            open: true,
                            address: emptyAddress,
                          })
                        }
                        className="mt-6 rounded-full bg-black hover:bg-gray-800"
                      >
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <AddressCard
                          key={address._id}
                          address={address}
                          onEdit={(addr) =>
                            setAddressDialog({
                              open: true,
                              address: { ...emptyAddress, ...addr },
                            })
                          }
                          onDelete={(id) => deleteAddressMutation.mutate(id)}
                          onSetDefault={(id) => handleSetDefault(id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Address Dialog */}
      <Dialog
        open={addressDialog.open}
        onOpenChange={(open) => setAddressDialog({ open, address: null })}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {addressDialog.address ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <ShippingForm
            address={addressDialog.address}
            onChange={(addr) =>
              setAddressDialog({ ...addressDialog, address: addr })
            }
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setAddressDialog({ open: false, address: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveAddress(addressDialog.address)}
              disabled={
                createAddressMutation.isPending ||
                updateAddressMutation.isPending ||
                !base44.entities?.Address
              }
            >
              Save Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
