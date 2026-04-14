const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, unique: true, required: true },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        subcategories: [
            {
                name: { type: String, required: true },
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);