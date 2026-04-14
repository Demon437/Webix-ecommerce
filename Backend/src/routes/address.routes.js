const router = require("express").Router();
const {
    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress
} = require("../controllers/address.controller");
const { protect } = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(protect);

router.get("/", getAddresses);
router.post("/", createAddress);
router.get("/:id", getAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
