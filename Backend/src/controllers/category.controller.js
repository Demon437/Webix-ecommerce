const Category = require("../models/Category");

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single category
exports.getSingleCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, image, subcategories } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const newCategory = await Category.create({
            name: name.trim(),
            description: description || '',
            image: image || '',
            subcategories: subcategories || []
        });

        res.status(201).json({
            message: "Category created successfully",
            category: newCategory
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Category already exists" });
        }
        res.status(500).json({ error: error.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, image, subcategories } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: name || undefined,
                description: description || undefined,
                image: image || undefined,
                subcategories: subcategories || undefined
            },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add subcategory to category
exports.addSubcategory = async (req, res) => {
    try {
        const { subcategoryName } = req.body;

        if (!subcategoryName || !subcategoryName.trim()) {
            return res.status(400).json({ error: "Subcategory name is required" });
        }

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Check if subcategory already exists
        if (category.subcategories.some(s => s.name.toLowerCase() === subcategoryName.trim().toLowerCase())) {
            return res.status(400).json({ error: "Subcategory already exists" });
        }

        category.subcategories.push({ name: subcategoryName.trim() });
        await category.save();

        res.json({
            message: "Subcategory added successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete subcategory from category
exports.deleteSubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        category.subcategories = category.subcategories.filter(
            s => s._id.toString() !== subcategoryId
        );
        await category.save();

        res.json({
            message: "Subcategory deleted successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
