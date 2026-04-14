const User = require("../models/User");
const Order = require("../models/Order");
const Address = require("../models/Address");

// ✅ Get all users (lightweight)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password") // 🔥 security
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update user (role / status / profile)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete user (with cleanup)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🔥 delete related data
        await Order.deleteMany({ user: id });
        await Address.deleteMany({ user: id });

        await User.findByIdAndDelete(id);

        res.json({ message: "User and related data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get full user details (🔥 MAIN FEATURE)
exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // 👉 User
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 👉 Orders
        const orders = await Order.find({ user: id })
            .sort({ createdAt: -1 });

        // 👉 Addresses
        const addresses = await Address.find({ user_id: id });

        // 👉 Stats
        const totalOrders = orders.length;
        const totalSpent = orders.reduce(
            (acc, o) => acc + (o.totalAmount || 0),
            0
        );

        res.json({
            user,
            orders,
            addresses,
            stats: {
                totalOrders,
                totalSpent
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};