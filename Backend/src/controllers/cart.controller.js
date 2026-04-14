const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        let cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            // Create new empty cart
            cart = await Cart.create({
                user: userId,
                items: [],
                totalItems: 0,
                totalPrice: 0
            });
        }

        res.json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: error.message });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { product_id, name, price, image, quantity } = req.body;

        if (!userId || !product_id || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if item already exists
        const existingItem = cart.items.find(
            item => item.product_id === product_id || item.product?.toString() === product_id
        );

        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
            existingItem.totalPrice = existingItem.price * existingItem.quantity;
        } else {
            cart.items.push({
                product: product_id,
                product_id,
                name,
                price,
                image,
                quantity: parseInt(quantity),
                totalPrice: price * quantity
            });
        }

        await cart.save();
        res.status(201).json({ message: "Item added to cart", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { product_id, quantity } = req.body;

        if (!userId || !product_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const item = cart.items.find(
            i => i.product_id === product_id || i.product?.toString() === product_id
        );

        if (!item) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items = cart.items.filter(
                i => i.product_id !== product_id && i.product?.toString() !== product_id
            );
        } else {
            item.quantity = parseInt(quantity);
            item.totalPrice = item.price * item.quantity;
        }

        await cart.save();
        res.json({ message: "Cart updated", cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ error: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { product_id } = req.body;

        if (!userId || !product_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.product_id !== product_id && item.product?.toString() !== product_id
        );

        await cart.save();
        res.json({ message: "Item removed from cart", cart });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ error: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { items: [], totalItems: 0, totalPrice: 0 },
            { new: true }
        );

        res.json({ message: "Cart cleared", cart });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: error.message });
    }
};
