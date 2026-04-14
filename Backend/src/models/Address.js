const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        full_name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip_code: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        is_default: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
