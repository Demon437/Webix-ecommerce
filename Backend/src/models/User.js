const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    full_name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    avatar: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);