const mongoose = require("mongoose");
const Address = require("../models/Address");

// Get all addresses for logged-in user
exports.getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({
            user_id: new mongoose.Types.ObjectId(req.user.id) // ✅ FIX
        }).sort("-created_date");

        res.json(addresses);
    } catch (error) {
        console.log("🔥 Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get single address
exports.getAddress = async (req, res) => {
    try {
        console.log("👉 Params ID:", req.params.id);
        console.log("👉 Logged in User:", req.user);

        const address = await Address.findById(req.params.id);

        console.log("👉 Found Address:", address);

        if (!address) {
            console.log("❌ Address not found");
            return res.status(404).json({ message: "Address not found" });
        }

        console.log("👉 Address User ID:", address.user_id.toString());
        console.log("👉 Request User ID:", req.user.id.toString());

        if (address.user_id.toString() !== req.user.id.toString()) {
            console.log("❌ Unauthorized access");
            return res.status(403).json({ message: "Not authorized" });
        }

        console.log("✅ Address fetched successfully");

        res.json(address);
    } catch (error) {
        console.log("🔥 Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Create new address
exports.createAddress = async (req, res) => {
    console.log("REQ BODY:", req.body); // 👈 ADD THIS
    console.log("👉 USER:", req.user);


    try {
        const { full_name, address, city, state, zip_code, country, phone } = req.body;

        // Only require essential fields
        if (!full_name || !address || !city || !state) {
            return res.status(400).json({ message: "full_name, address, city, and state are required" });
        }

        const newAddress = await Address.create({
            user_id: new mongoose.Types.ObjectId(req.user.id),
            full_name,
            address,
            city,
            state,
            zip_code: zip_code || "",
            country: country || "India",
            phone: phone || "",
            is_default: false
        });

        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update address
exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) return res.status(404).json({ message: "Address not found" });

        if (address.user_id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { full_name, address: addressStr, city, state, zip_code, country, phone, is_default } = req.body;

        if (full_name) address.full_name = full_name;
        if (addressStr) address.address = addressStr;
        if (city) address.city = city;
        if (state) address.state = state;
        if (zip_code) address.zip_code = zip_code;
        if (country) address.country = country;
        if (phone) address.phone = phone;
        if (typeof is_default === 'boolean') address.is_default = is_default;

        const updated = await address.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete address
exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) return res.status(404).json({ message: "Address not found" });

        if (address.user_id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Address.deleteOne({ _id: req.params.id });
        res.json({ message: "Address deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
