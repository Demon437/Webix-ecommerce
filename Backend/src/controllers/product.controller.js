const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category, subcategory, brand, colors, sizes, material, fit, is_featured, is_best_seller, is_trending, images } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Product title is required" });
        }
        if (!price || price <= 0) {
            return res.status(400).json({ error: "Valid price is required" });
        }
        if (stock === undefined || stock < 0) {
            return res.status(400).json({ error: "Valid stock is required" });
        }
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }

        // Validate category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ error: "Invalid category ID" });
        }

        if (!images || images.length === 0) {
            return res.status(400).json({ error: "At least 1 image is required (minimum 1, maximum 4 images)" });
        }
        if (images.length > 4) {
            return res.status(400).json({ error: "Maximum 4 images allowed" });
        }

        const newProduct = await Product.create({
            title: title.trim(),
            description: description || '',
            price: Number(price),
            stock: Number(stock),
            category,
            subcategory: subcategory || 'shirts',
            brand: brand || '',
            colors: colors || [],
            sizes: sizes || [],
            material: material || '',
            fit: fit || 'regular',
            images,
            is_featured: Boolean(is_featured),
            is_best_seller: Boolean(is_best_seller),
            is_trending: Boolean(is_trending),
            rating: 0
        });

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: error.message || "Error creating product" });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 15,
            search,
            sortBy,
            is_featured,
            is_best_seller,
            is_trending,
            category
        } = req.query;

        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Math.min(100, Number(limit)));

        let filter = {};

        if (is_featured === 'true') filter.is_featured = true;
        if (is_best_seller === 'true') filter.is_best_seller = true;
        if (is_trending === 'true') filter.is_trending = true;

        /* ================= CATEGORY FIX ================= */
        if (category) {
            console.log("🔥 Incoming Category:", category);
            filter.category = category;
        }

        /* ================= SEARCH ================= */
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } }
            ];
        }

        /* ================= SORT ================= */
        let sortOption = { createdAt: -1 };

        if (sortBy === "price_asc") sortOption = { price: 1 };
        if (sortBy === "price_desc") sortOption = { price: -1 };

        /* ================= QUERY ================= */
        console.log("🔥 FINAL FILTER:", filter);

        const products = await Product.find(filter)
            .populate("category")
            .sort(sortOption)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            products,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                pages: Math.ceil(total / limitNumber)
            }
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false });
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: error.message || "Error fetching product" });
    }
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(product);
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
};

// Toggle like/favorite for a product
exports.toggleLike = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ error: "User ID and Product ID are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if product is already liked
        const isLiked = user.likes.includes(productId);

        if (isLiked) {
            // Remove from likes
            user.likes = user.likes.filter(id => id.toString() !== productId);
        } else {
            // Add to likes
            user.likes.push(productId);
        }

        await user.save();

        res.json({
            message: isLiked ? "Removed from favorites" : "Added to favorites",
            isLiked: !isLiked,
            likes: user.likes
        });
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ error: error.message || "Error toggling like" });
    }
};

// Get all liked products for current user
exports.getLikes = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId).populate("likes");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user.likes || []);
    } catch (error) {
        console.error("Error fetching likes:", error);
        res.status(500).json({ error: error.message || "Error fetching likes" });
    }
};

// Check if a product is liked by current user
exports.isProductLiked = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({ error: "User ID and Product ID are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isLiked = user.likes.includes(productId);

        res.json({ isLiked });
    } catch (error) {
        console.error("Error checking like status:", error);
        res.status(500).json({ error: error.message || "Error checking like status" });
    }
};