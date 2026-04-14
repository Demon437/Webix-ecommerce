const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                name: String,
                image: String,
                quantity: Number,
                price: Number
            }
        ],

        subtotal: Number,
        shipping: Number,
        tax: Number,
        totalAmount: Number,
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered"],
            default: "pending"
        },
        paymentId: String,
        orderId: String,
        shippingAddress: {
            full_name: String,
            address: String,
            city: String,
            state: String,
            zip_code: String,
            country: String,
            phone: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);