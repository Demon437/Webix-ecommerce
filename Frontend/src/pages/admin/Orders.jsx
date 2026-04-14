import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Eye,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
} from "lucide-react";
import { formatPriceINR } from "@/utils";
import { format } from "date-fns";

const AdminOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");
  console.log("🔑 TOKEN:", token);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      navigate("/login");
    } else {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      console.log("🔥 Fetching ADMIN orders...");

      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data || []);
      setFilteredOrders(res.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // refresh orders
      fetchOrders();

      // update selected order UI instantly
      setSelectedOrder((prev) => ({
        ...prev,
        status,
      }));
    } catch (err) {
      console.error("❌ Status update error:", err);
    }
  };

  useEffect(() => {
    const result = orders.filter((order) => {
      const orderId = order._id?.toLowerCase() || "";
      const name = order.shippingAddress?.full_name?.toLowerCase() || "";
      const email = order.user?.email?.toLowerCase() || "";

      const matchesSearch =
        orderId.includes(searchTerm.toLowerCase()) ||
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase());

      const matchesTab = activeTab === "all" || order.status === activeTab;

      return matchesSearch && matchesTab;
    });
    setFilteredOrders(result);
  }, [searchTerm, activeTab, orders]);

  const getStatusBadge = (status) => {
    const configs = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return (
      <Badge
        variant="outline"
        className={`${configs[status] || "bg-gray-100"} capitalize`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      {/* Header Area */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-slate-800">
              Order Management
            </h1>
          </div>
          <div className="text-sm text-slate-500">
            Total: {orders.length} Orders
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filters & Tabs */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-white border">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="completed">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10 bg-white"
              placeholder="Search ID, Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Table */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b text-slate-500 font-medium">
                  <tr>
                    <th className="p-4 text-left">Order Detail</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-10 text-center text-slate-400"
                      >
                        Loading orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-10 text-center text-slate-400"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="bg-white hover:bg-slate-50 transition-all border-b hover:scale-[1.01]"
                      >
                        {/* ORDER INFO */}
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">
                            #{order._id?.slice(-8).toUpperCase()}
                          </div>

                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(order.createdAt), "dd MMM, yyyy")}
                          </div>
                        </td>

                        {/* CUSTOMER */}
                        <td className="p-4">
                          <div className="font-medium text-slate-900">
                            {order.shippingAddress?.full_name ||
                              order.user?.name ||
                              "Guest User"}
                          </div>

                          <div className="text-xs text-slate-500 truncate max-w-[160px]">
                            {order.user?.email || "No Email"}
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="p-4">
                          <div className="text-lg font-bold text-slate-900">
                            {formatPriceINR(order.totalAmount)}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                              order.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : order.status === "shipped"
                                  ? "bg-purple-100 text-purple-700"
                                  : order.status === "delivered"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {/* VIEW */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* QUICK SHIP */}
                            {order.status === "paid" && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() =>
                                  updateStatus(order._id, "shipped")
                                }
                              >
                                Ship
                              </Button>
                            )}

                            {/* QUICK DELIVER */}
                            {order.status === "shipped" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() =>
                                  updateStatus(order._id, "delivered")
                                }
                              >
                                Deliver
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <CardHeader className="border-b bg-slate-50 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-lg">
                  Order # {selectedOrder._id?.slice(-8).toUpperCase()}
                </CardTitle>

                {/* 🔥 PASTE HERE */}
                <p className="text-xs text-slate-500">
                  Placed on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Customer & Shipping
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                      <div className="text-sm">
                        <p className="font-bold">
                          {selectedOrder.shippingAddress?.full_name ||
                            "Name not provided"}
                        </p>
                        <p className="text-slate-600">
                          {selectedOrder.shippingAddress?.address ||
                            "No address detail"}
                        </p>
                        <p className="text-slate-600">
                          {selectedOrder.shippingAddress?.city
                            ? `${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.zip_code}`
                            : "Location details missing"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {selectedOrder.shippingAddress?.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {/* Point 2: Account Email */}
                      <span className="text-slate-600">
                        {selectedOrder.user?.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-right md:text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Order Summary
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Subtotal</span>
                      <span>{formatPriceINR(selectedOrder.subtotal || 0)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Shipping</span>
                      <span>{formatPriceINR(selectedOrder.shipping || 0)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Tax</span>
                      <span>{formatPriceINR(selectedOrder.tax || 0)}</span>
                    </div>

                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total</span>
                      <span className="text-blue-600">
                        {formatPriceINR(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Payment Details
                  </h4>

                  <div className="bg-white border rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment ID</span>
                      <span className="font-mono text-xs">
                        {selectedOrder.paymentId}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Order ID</span>
                      <span className="font-mono text-xs">
                        {selectedOrder.orderId}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Status</span>
                      <span className="text-green-600 font-medium">Paid</span>
                    </div>
                  </div>
                  {/* 🔥 ADD BUTTONS HERE */}
                  <div className="pt-3 space-y-2">
                    {selectedOrder.status !== "shipped" && (
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          updateStatus(selectedOrder._id, "shipped")
                        }
                      >
                        Mark as Shipped
                      </Button>
                    )}

                    {selectedOrder.status !== "delivered" && (
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          updateStatus(selectedOrder._id, "delivered")
                        }
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Order Timeline
                  </h4>

                  <div className="relative">
                    {/* LINE */}
                    <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-200"></div>

                    {/* STEP */}
                    {[
                      {
                        label: "Order Placed",
                        active: true,
                        time: new Date(
                          selectedOrder.createdAt,
                        ).toLocaleString(),
                      },
                      {
                        label: "Payment Confirmed",
                        active: ["paid", "shipped", "delivered"].includes(
                          selectedOrder.status,
                        ),
                        time: "Payment successful",
                      },
                      {
                        label: "Shipped",
                        active: ["shipped", "delivered"].includes(
                          selectedOrder.status,
                        ),
                        time: "Processing shipment",
                      },
                      {
                        label: "Delivered",
                        active: selectedOrder.status === "delivered",
                        time: "Pending delivery",
                      },
                    ].map((step, i) => (
                      <div
                        key={i}
                        className="relative flex items-start gap-4 pb-6"
                      >
                        {/* DOT */}
                        <div
                          className={`h-4 w-4 rounded-full mt-1 z-10 ${
                            step.active ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />

                        {/* TEXT */}
                        <div>
                          <p
                            className={`text-sm font-medium ${step.active ? "text-black" : "text-gray-400"}`}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-5">
                {/* HEADER */}
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Ordered Items
                </h4>

                {/* ITEMS LIST */}
                <div className="space-y-3">
                  {console.log("🔍 SELECTED ORDER ITEMS:", selectedOrder.items)}
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all"
                    >
                      {/* LEFT SIDE */}
                      <div className="flex items-center gap-4">
                        {/* IMAGE */}
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 border">
                          <img
                            src={item.image || item.product?.image}
                            alt={item.name || item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* DETAILS */}
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {item.name || item.product?.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            Qty {item.quantity} ×{" "}
                            <span className="font-medium text-slate-700">
                              {formatPriceINR(item.price)}
                            </span>
                          </p>

                          {/* OPTIONAL: PRODUCT ID */}
                          {item.product && (
                            <p className="text-[10px] text-gray-400">
                              ID: {item.product?._id}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="text-right space-y-1">
                        <p className="text-base font-bold text-slate-900">
                          {formatPriceINR(item.price * item.quantity)}
                        </p>

                        <p className="text-[11px] text-green-600 font-medium">
                          Paid
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
