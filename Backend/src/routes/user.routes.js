const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    updateUser,
    deleteUser,
    getUserDetails
} = require("../controllers/user.controller");

// GET all users
router.get("/", getAllUsers);

// UPDATE user
router.put("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);

router.get("/:id/details", getUserDetails);

module.exports = router;