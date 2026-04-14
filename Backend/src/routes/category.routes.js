const router = require("express").Router();
const {
    getCategories,
    getSingleCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory
} = require("../controllers/category.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

// Public routes
router.get("/", getCategories);
router.get("/:id", getSingleCategory);

// Admin routes
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

// Subcategory routes
router.post("/:id/subcategories", protect, adminOnly, addSubcategory);
router.delete("/:id/subcategories/:subcategoryId", protect, adminOnly, deleteSubcategory);

module.exports = router;