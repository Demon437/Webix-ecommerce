import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:5000/api/users";

const AdminUserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = new URLSearchParams(location.search).get("id");

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (userId) fetchDetails();
  }, [userId]);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/${userId}/details`);
      const data = await res.json();

      setUser(data.user);
      setOrders(data.orders || []);
      setAddresses(data.addresses || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black p-6 text-white shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold backdrop-blur">
              {user.name?.charAt(0)}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-300">{user.email}</p>
            </div>
          </div>

          <Button
            onClick={() => navigate(-1)}
            className="bg-white text-black hover:scale-105 transition"
          >
            ← Back
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              title: "Total Orders",
              value: stats?.totalOrders || 0,
              color: "from-blue-500 to-indigo-500"
            },
            {
              title: "Total Spent",
              value: `₹${(stats?.totalSpent || 0).toLocaleString("en-IN")}`,
              color: "from-green-500 to-emerald-500"
            },
            {
              title: "Account Status",
              value: user.isBlocked ? "Blocked" : "Active",
              color: user.isBlocked
                ? "from-red-500 to-pink-500"
                : "from-purple-500 to-indigo-500"
            }
          ].map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl text-white bg-gradient-to-r ${item.color} shadow-lg`}
            >
              <p className="text-sm opacity-80">{item.title}</p>
              <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* PROFILE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-lg">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-lg">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>

            <div>
              <p className="text-gray-500">Joined</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* ADDRESSES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Addresses</h2>

          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses found</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="p-5 rounded-2xl bg-white shadow-sm hover:shadow-lg transition border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-lg">{addr.full_name}</p>

                    {addr.is_default && (
                      <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">{addr.address}</p>

                  <p className="text-sm text-gray-600 mt-1">
                    {addr.city}, {addr.state} - {addr.zip_code}
                  </p>

                  <p className="text-sm text-gray-600">{addr.country}</p>

                  <p className="text-sm text-gray-500 mt-2">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ORDERS */}
        <div>
          <h2 className="text-xl font-bold mb-4">Order History</h2>

          {orders.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-center text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition border"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-semibold text-lg">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xl font-bold mb-3">
                    ₹{order.totalAmount}
                  </p>

                  <div className="border-t pt-3 space-y-1">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="text-gray-500">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminUserDetails;