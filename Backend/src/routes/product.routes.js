const router = require("express").Router();
const {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    toggleLike,
    getLikes,
    isProductLiked
} = require("../controllers/product.controller");

const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.post("/create", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// Like routes
router.post("/like/toggle", protect, toggleLike);
router.get("/like/all", protect, getLikes);
router.get("/like/check/:productId", protect, isProductLiked);

module.exports = router;