const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const { protect } = require("../middlewares/auth.middleware");

/* ================= CREATE RAZORPAY ORDER ================= */
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const options = {
            amount: amount, // in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        console.log("🟢 Razorpay Order Created:", order);

        res.status(200).json(order);
    } catch (error) {
        console.error("❌ Create Order Error:", error);
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
});

/* ================= VERIFY PAYMENT (ONLY VERIFY) ================= */
router.post("/verify-payment", protect, async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        console.log("🔍 Verify Body:", req.body);

        // ✅ Validate required fields
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({
                error: "Missing payment details"
            });
        }

        // 🔐 Generate expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        // ❌ Invalid signature
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                error: "Invalid signature"
            });
        }

        // ✅ SUCCESS (NO ORDER CREATION HERE)
        res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        });

    } catch (error) {
        console.error("❌ VERIFY PAYMENT ERROR:", error);
        res.status(500).json({
            error: "Payment verification failed"
        });
    }
});

module.exports = router;