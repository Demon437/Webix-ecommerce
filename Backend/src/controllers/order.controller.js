// ================= CREATE ORDER =================
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { paymentId, orderId, shippingAddress } = req.body;
        const userId = req.user.id;

        // 🔥 0. VALIDATION
        if (!paymentId || !orderId || !shippingAddress) {
            await session.abortTransaction();
            return res.status(400).json({
                error: "Missing required order details"
            });
        }

        // 🔥 1. GET CART FROM DB
        const cart = await Cart.findOne({ user: userId }).session(session);

        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ error: "Cart is empty" });
        }

        const items = [];

        for (let item of cart.items) {
            const product = await Product.findById(item.product).session(session);

            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            items.push({
                product: product._id,
                name: product.name || product.title || product.productName,
                image: product.image || product.images?.[0],
                quantity: item.quantity,
                price: product.price
            });
        }
        const subtotal = cart.totalPrice;

        // Same logic as frontend
        const shipping = subtotal >= 4000 ? 0 : 9.99;
        const tax = subtotal * 0.08;

        const totalAmount = subtotal + shipping + tax;

        // 🔥 2. PREVENT DUPLICATE ORDERS
        const existingOrder = await Order.findOne({ paymentId }).session(session);
        if (existingOrder) {
            await session.abortTransaction();
            return res.status(200).json(existingOrder);
        }

        // 🔥 3. VALIDATE & UPDATE STOCK
        for (let item of items) {
            const product = await Product.findById(item.product).session(session);

            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({
                    error: `Product not found`
                });
            }

            if (product.stock < item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({
                    error: `Insufficient stock for ${product.name}`
                });
            }

            product.stock -= item.quantity;
            await product.save({ session });
        }

        // 🔥 4. CREATE ORDER
        const order = await Order.create([{
            user: userId,
            items,
            subtotal,
            shipping,
            tax,
            totalAmount,
            paymentId,
            orderId,
            shippingAddress,
            status: "paid"
        }], { session });

        // 🔥 5. CLEAR CART
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save({ session });

        // 🔥 6. COMMIT TRANSACTION
        await session.commitTransaction();
        session.endSession();

        console.log("🧹 Cart cleared for user:", userId);

        res.status(201).json(order[0]);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("❌ CREATE ORDER ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};


// ================= GET MY ORDERS =================
exports.getMyOrders = async (req, res) => {
    try {
        // console.log("🔥 GET MY ORDERS API HIT");

        // console.log("👉 User ID:", req.user.id);

        const orders = await Order.find({ user: req.user.id })
            .populate({
                path: "items.product",
                select: "name price image images"
            })
            .sort({ createdAt: -1 });

        // console.log("📦 Orders Found:", orders.length);
        // console.log("📦 Orders Data:", JSON.stringify(orders, null, 2));

        res.json(orders);

    } catch (error) {
        console.error("❌ GET MY ORDERS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};


// ================= GET ALL ORDERS (ADMIN) =================
exports.getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find({})
            .populate("user", "name email")
            .populate({
                path: "items.product",
                select: "name price image"
            })
            .sort({ createdAt: -1 });


        res.status(200).json(orders);

    } catch (error) {
        console.error("❌ GET ALL ORDERS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ================= UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;
        const orderId = req.params.id;


        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            console.log("❌ Order not found");
            return res.status(404).json({ error: "Order not found" });
        }


        res.json(order);

    } catch (error) {
        console.error("❌ UPDATE STATUS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};