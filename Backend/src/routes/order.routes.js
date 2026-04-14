const router = require("express").Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/order.controller");

// Auth middlewares ko import karein
const { protect, adminOnly } = require("../middlewares/auth.middleware");

/* ================= USER ROUTES ================= */

// Naya order create karne ke liye
router.post("/", protect, createOrder);

// User apne khud ke orders dekhne ke liye
router.get("/my", protect, getMyOrders);


/* ================= ADMIN ROUTES ================= */

// Sabhi users ke orders dekhne ke liye (Admin Only)
// Pehle 'protect' check karega token, fir 'adminOnly' check karega role
router.get("/admin", protect, adminOnly, getAllOrders); 

// ================= UPDATE ORDER STATUS (ADMIN) =================
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;