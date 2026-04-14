const router = require("express").Router();
const { register, login, updateMe } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.put("/me", protect, updateMe);

module.exports = router;