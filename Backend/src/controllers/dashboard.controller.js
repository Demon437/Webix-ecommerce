const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
    try {
        // ✅ Basic Counts
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        // ✅ Total Revenue
        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: { $toDouble: "$totalAmount" }
                    }
                }
            }
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        // ✅ Weekly Revenue
        const weeklyRevenueRaw = await Order.aggregate([
            {
                $group: {
                    _id: { $week: "$createdAt" },
                    revenue: {
                        $sum: { $toDouble: "$totalAmount" }
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const weeklyRevenue = weeklyRevenueRaw.map(item => ({
            week: `Week ${item._id}`,
            revenue: item.revenue
        }));

        // ✅ Monthly Sales (🔥 NEW)
        const monthlySalesRaw = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    sales: {
                        $sum: { $toDouble: "$totalAmount" }
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlySales = monthlySalesRaw.map(item => ({
            month: monthNames[item._id - 1],
            sales: item.sales
        }));

        // ✅ Final Response
        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
            weeklyRevenue,
            monthlySales // 👈 IMPORTANT
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: error.message });
    }
};